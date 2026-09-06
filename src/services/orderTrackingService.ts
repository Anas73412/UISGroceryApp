import { doc, onSnapshot, type DocumentSnapshot } from 'firebase/firestore';
import type { OrderModel } from '../data/models/OrderModel';
import {
  ORDER_TRACKING_COLLECTION,
  type OrderTrackingModel,
  type OrderTrackingStep,
} from '../data/models/OrderTrackingModel';
import { getFirebaseDb, isFirebaseConfigured } from '../config/firebaseConfig';
import { orderService } from '../features/orders/service';
import { sessionStore } from '../store/sessionStore';
import { SUCCESS } from '../utils/constants';
import { isTerminalOrderStatus } from '../features/orders/orderStatus';

const DEFAULT_DRIVER = {
  driverName: 'Delivery Partner',
  driverRating: 4.9,
  driverVehicle: 'On the way to you',
};

function buildDefaultSteps(status: number): OrderTrackingStep[] {
  const now = new Date();
  const time = (offsetMin: number) => {
    const d = new Date(now.getTime() - offsetMin * 60_000);
    return d.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const placedDone = status >= 1;
  const packedDone = status >= 2;
  const outDone = status >= 2 && status < 3;
  const deliveredDone = status === 3;

  return [
    {
      key: 'placed',
      title: 'Order Placed',
      subtitle: placedDone
        ? `${time(45)} • Confirmed`
        : 'Waiting for confirmation',
      completedAt: placedDone ? time(45) : undefined,
    },
    {
      key: 'packed',
      title: 'Order Packed',
      subtitle: packedDone
        ? `${time(30)} • Quality checked & sealed`
        : 'Preparing your items',
      completedAt: packedDone ? time(30) : undefined,
    },
    {
      key: 'out_for_delivery',
      title: 'Out for Delivery',
      subtitle: outDone
        ? `${DEFAULT_DRIVER.driverName} is on the way to you`
        : 'Will start once packed',
      completedAt: outDone ? time(10) : undefined,
    },
    {
      key: 'delivered',
      title: 'Delivered',
      subtitle: deliveredDone ? `Delivered at ${time(0)}` : 'Expected soon',
      completedAt: deliveredDone ? time(0) : undefined,
    },
  ];
}

function mapStatusToLabel(status: number): string {
  if (status === 4) return 'Cancelled';
  if (status === 3) return 'Delivered';
  if (status === 2) return 'Out for Delivery';
  if (status === 1) return 'Order Packed';
  return 'Order Placed';
}

export function trackingFromOrder(order: OrderModel): OrderTrackingModel {
  const status = order.status ?? 1;
  return {
    orderKey: order.orderKey?.trim() || String(order.orderId ?? ''),
    status,
    statusLabel: mapStatusToLabel(status),
    etaMinutesMin: 12,
    etaMinutesMax: 15,
    distanceKm: 1.2,
    ...DEFAULT_DRIVER,
    steps: buildDefaultSteps(status),
    updatedAt: order.modifiedAt ?? order.createdAt,
  };
}

function mergeTracking(
  remote: Partial<OrderTrackingModel> | null,
  orderKey: string,
  fallback?: OrderModel,
): OrderTrackingModel {
  const base = fallback
    ? trackingFromOrder(fallback)
    : {
        orderKey,
        status: 1,
        statusLabel: 'Processing',
        etaMinutesMin: 12,
        etaMinutesMax: 15,
        distanceKm: 1.2,
        ...DEFAULT_DRIVER,
        steps: buildDefaultSteps(1),
      };

  if (!remote) return base;

  const status = remote.status ?? base.status;
  return {
    ...base,
    ...remote,
    orderKey,
    status,
    statusLabel: remote.statusLabel ?? mapStatusToLabel(status),
    steps: remote.steps?.length ? remote.steps : buildDefaultSteps(status),
    driverName: remote.driverName ?? base.driverName,
    driverRating: remote.driverRating ?? base.driverRating,
    driverVehicle: remote.driverVehicle ?? base.driverVehicle,
  };
}

async function fetchOrderByKey(orderKey: string): Promise<OrderModel | null> {
  const userId = sessionStore.getState().user?.uid ?? 0;
  if (!userId) return null;
  const res = await orderService.getOrderHistoryList(userId);
  if (res.status !== SUCCESS || !Array.isArray(res.data)) return null;
  return (
    res.data.find(
      o => o.orderKey?.trim() === orderKey || String(o.orderId) === orderKey,
    ) ?? null
  );
}

export type Unsubscribe = () => void;

export function subscribeOrderTracking(
  orderKey: string,
  onUpdate: (tracking: OrderTrackingModel | null) => void,
  options?: { fallbackOrder?: OrderModel },
): Unsubscribe {
  let pollTimer: ReturnType<typeof setInterval> | null = null;
  let firestoreUnsub: Unsubscribe | null = null;
  let stopped = false;

  const emit = async (partial: Partial<OrderTrackingModel> | null) => {
    if (stopped) return;
    const order = options?.fallbackOrder ?? (await fetchOrderByKey(orderKey));
    const merged = mergeTracking(partial, orderKey, order ?? undefined);
    onUpdate(merged);
    if (isTerminalOrderStatus(merged.status)) {
      onUpdate(merged);
    }
  };

  const startPolling = () => {
    const poll = async () => {
      try {
        const { orderService } = await import('../features/orders/service');
        const remote = await orderService.getOrderTracking(orderKey);
        if (remote.status === SUCCESS && remote.data) {
          await emit(remote.data);
          return;
        }
      } catch {
        /* use order history fallback */
      }
      const order = await fetchOrderByKey(orderKey);
      if (!order) {
        onUpdate(null);
        return;
      }
      await emit(trackingFromOrder(order));
    };
    void poll();
    pollTimer = setInterval(poll, 20_000);
  };

  const db = getFirebaseDb();
  if (db && isFirebaseConfigured()) {
    const ref = doc(db, ORDER_TRACKING_COLLECTION, orderKey);
    firestoreUnsub = onSnapshot(
      ref,
      (snap: DocumentSnapshot) => {
        void emit(
          snap.exists() ? (snap.data() as Partial<OrderTrackingModel>) : null,
        );
      },
      () => {
        // startPolling();
      },
    );
  } else {
    // startPolling();
  }

  return () => {
    stopped = true;
    firestoreUnsub?.();
    if (pollTimer) clearInterval(pollTimer);
  };
}

export async function setActiveOrderForTracking(
  order: OrderModel,
): Promise<void> {
  const { appPrefs } = await import('../data/repositories/AppPrefRepository');
  const key = order.orderKey?.trim() || String(order.orderId ?? '');
  if (!key) return;
  await appPrefs.set('activeOrderKey', key);
  await appPrefs.set('activeOrderId', order.orderId ?? 0);
}

export async function clearActiveOrderTracking(): Promise<void> {
  const { appPrefs } = await import('../data/repositories/AppPrefRepository');
  await appPrefs.set('activeOrderKey', null);
  await appPrefs.set('activeOrderId', 0);
}

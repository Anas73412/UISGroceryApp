import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { appPrefs } from '../../data/repositories/AppPrefRepository';
import {
  buildMinimalOrderForTracking,
  navigateToOrderTracking,
} from '../../navigation/navigateToOrderTracking';
import type { OrderModel } from '../../data/models/OrderModel';
import type { OrderTrackingModel } from '../../data/models/OrderTrackingModel';
import {
  clearActiveOrderTracking,
  setActiveOrderForTracking,
  subscribeOrderTracking,
} from '../../services/orderTrackingService';
import {
  getOrderUiStatus,
  isTerminalOrderStatus,
} from '../../features/orders/orderStatus';
import { orderService } from '../../features/orders/service';
import { sessionStore } from '../../store/sessionStore';
import { SUCCESS } from '../../utils/constants';

const HIDE_SNACK_ROUTES = new Set([
  'OrderTracking',
  'OrderDetail',
  'Order',
  'CartTab',
  'Splash',
  'Auth',
  'Login',
]);

type OrderTrackingContextValue = {
  activeOrderKey: string | null;
  tracking: OrderTrackingModel | null;
  cachedOrder: OrderModel | null;
  snackVisible: boolean;
  startTracking: (order: OrderModel) => Promise<void>;
  refreshTracking: () => Promise<void>;
  dismissSnack: () => void;
  openTrackingScreen: () => void;
};

const OrderTrackingContext = createContext<OrderTrackingContextValue | null>(
  null,
);

export function OrderTrackingProvider({
  children,
  focusedRouteName = '',
}: {
  children: React.ReactNode;
  /** Deepest focused route name; set from NavigationContainer onStateChange. */
  focusedRouteName?: string;
}) {
  const [activeOrderKey, setActiveOrderKey] = useState<string | null>(null);
  const [tracking, setTracking] = useState<OrderTrackingModel | null>(null);
  const [cachedOrder, setCachedOrder] = useState<OrderModel | null>(null);
  const [snackDismissed, setSnackDismissed] = useState(false);
  const unsubRef = useRef<ReturnType<typeof subscribeOrderTracking> | null>(
    null,
  );

  const loadCachedOrder = useCallback(async (orderKey: string) => {
    const userId = sessionStore.getState().user?.uid ?? 0;
    if (!userId) return null;
    const res = await orderService.getOrderHistoryList(userId);
    if (res.status !== SUCCESS || !Array.isArray(res.data)) return null;
    const found =
      res.data.find(
        o => o.orderKey?.trim() === orderKey || String(o.orderId) === orderKey,
      ) ?? null;
    setCachedOrder(found);
    return found;
  }, []);

  const bindSubscription = useCallback(
    (orderKey: string, fallbackOrder?: OrderModel) => {
      unsubRef.current?.();
      unsubRef.current = subscribeOrderTracking(
        orderKey,
        data => {
          if (!data) return;
          setTracking(data);
          if (isTerminalOrderStatus(data.status)) {
            void clearActiveOrderTracking();
            setActiveOrderKey(null);
            setTracking(null);
            setSnackDismissed(false);
          }
        },
        { fallbackOrder },
      );
    },
    [],
  );

  const refreshTracking = useCallback(async () => {
    let key = await appPrefs.get('activeOrderKey');
    if (!key) {
      const userId = sessionStore.getState().user?.uid ?? 0;
      if (userId) {
        const res = await orderService.getOrderHistoryList(userId);
        if (res.status === SUCCESS && Array.isArray(res.data)) {
          const pending = res.data.find(o => getOrderUiStatus(o) === 'pending');
          if (pending) {
            await setActiveOrderForTracking(pending);
            key = pending.orderKey?.trim() || String(pending.orderId ?? '');
            setCachedOrder(pending);
          }
        }
      }
    }
    setActiveOrderKey(key);
    if (!key) {
      unsubRef.current?.();
      setTracking(null);
      setCachedOrder(null);
      return;
    }
    const order = await loadCachedOrder(key);
    bindSubscription(key, order ?? undefined);
  }, [bindSubscription, loadCachedOrder]);

  useEffect(() => {
    void refreshTracking();
    return () => {
      unsubRef.current?.();
    };
  }, [refreshTracking]);

  const startTracking = useCallback(
    async (order: OrderModel) => {
      await setActiveOrderForTracking(order);
      setSnackDismissed(false);
      setCachedOrder(order);
      const key = order.orderKey?.trim() || String(order.orderId ?? '');
      setActiveOrderKey(key);
      bindSubscription(key, order);
    },
    [bindSubscription],
  );

  const dismissSnack = useCallback(() => {
    setSnackDismissed(true);
  }, []);

  const openTrackingScreen = useCallback(() => {
    void (async () => {
      setSnackDismissed(true);

      let order = cachedOrder;
      if (!order && activeOrderKey) {
        order = await loadCachedOrder(activeOrderKey);
      }
      if (!order && activeOrderKey) {
        order = buildMinimalOrderForTracking(activeOrderKey, tracking);
      }
      if (!order) {
        return;
      }

      const navigated = navigateToOrderTracking(order);
      if (!navigated) {
        console.warn('Navigation not ready; could not open Order Tracking');
      }
    })();
  }, [activeOrderKey, cachedOrder, loadCachedOrder, tracking]);

  const snackVisible = useMemo(() => {
    if (!activeOrderKey || !tracking || snackDismissed) return false;
    if (HIDE_SNACK_ROUTES.has(focusedRouteName)) return false;
    const ui = cachedOrder
      ? getOrderUiStatus(cachedOrder)
      : tracking.status === 3
      ? 'delivered'
      : tracking.status === 4
      ? 'cancelled'
      : 'pending';
    return ui === 'pending';
  }, [activeOrderKey, cachedOrder, focusedRouteName, snackDismissed, tracking]);

  const value: OrderTrackingContextValue = {
    activeOrderKey,
    tracking,
    cachedOrder,
    snackVisible,
    startTracking,
    refreshTracking,
    dismissSnack,
    openTrackingScreen,
  };

  return (
    <OrderTrackingContext.Provider value={value}>
      {children}
    </OrderTrackingContext.Provider>
  );
}

export function useOrderTracking(): OrderTrackingContextValue {
  const ctx = useContext(OrderTrackingContext);
  if (!ctx) {
    throw new Error(
      'useOrderTracking must be used within OrderTrackingProvider',
    );
  }
  return ctx;
}

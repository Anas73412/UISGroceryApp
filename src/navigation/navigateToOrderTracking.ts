import { CommonActions } from '@react-navigation/native';
import type { OrderModel } from '../data/models/OrderModel';
import type { OrderTrackingModel } from '../data/models/OrderTrackingModel';
import { sessionStore } from '../store/sessionStore';
import { navigationRef } from './navigationRef';

/** Minimal order for tracking UI when full order is not cached yet. */
export function buildMinimalOrderForTracking(
  orderKey: string,
  tracking?: OrderTrackingModel | null,
): OrderModel {
  const numericId = Number(orderKey);
  return {
    orderId: Number.isFinite(numericId) ? numericId : 0,
    orderKey,
    createdAt: tracking?.updatedAt ?? '',
    modifiedAt: tracking?.updatedAt ?? '',
    razorpayPaymentId: null,
    paymentStatus: null,
    userId: sessionStore.getState().user?.uid ?? 0,
    status: tracking?.status ?? 1,
    grandTotal: 0,
    totalItemAmount: 0,
    smartCartCharge: 0,
    deliveryCharge: 0,
    reason: null,
    deliveryAddressId: 0,
    orderItemsList: [],
    userName: null,
    userMobile: null,
  };
}

/** Navigate from root to Settings tab → Order Tracking screen. */
export function navigateToOrderTracking(order: OrderModel): boolean {
  if (!navigationRef.isReady()) {
    return false;
  }

  navigationRef.dispatch(
    CommonActions.navigate({
      name: 'Main',
      params: {
        screen: 'SettingsTab',
        params: {
          screen: 'OrderTracking',
          params: { order },
        },
      },
    }),
  );

  return true;
}

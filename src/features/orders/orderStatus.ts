import type { OrderModel } from '../../data/models/OrderModel';

export type OrderUiStatus = 'pending' | 'delivered' | 'cancelled';

/** Map API numeric status to UI; keep in sync with backend. */
export function getOrderUiStatus(order: OrderModel): OrderUiStatus {
  if (order.reason?.trim()) return 'cancelled';
  const s = order.status;
  if (s === 4) return 'cancelled';
  if (s === 3) return 'delivered';
  return 'pending';
}

export function getOrderDisplayKey(order: OrderModel): string {
  return (
    order.orderKey?.trim() ||
    String(order.orderId ?? order.razorpayPaymentId ?? '')
  );
}

export function isTerminalOrderStatus(status: number): boolean {
  return status === 3 || status === 4;
}

export function getStatusBadgeLabel(uiStatus: OrderUiStatus): string {
  switch (uiStatus) {
    case 'delivered':
      return 'DELIVERED';
    case 'cancelled':
      return 'CANCELLED';
    default:
      return 'IN TRANSIT';
  }
}

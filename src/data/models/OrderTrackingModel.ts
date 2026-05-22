export type OrderTrackingStepKey =
  | 'placed'
  | 'packed'
  | 'out_for_delivery'
  | 'delivered';

export interface OrderTrackingStep {
  key: OrderTrackingStepKey;
  title: string;
  subtitle: string;
  completedAt?: string;
}

export interface OrderTrackingModel {
  orderKey: string;
  status: number;
  statusLabel: string;
  etaMinutesMin?: number;
  etaMinutesMax?: number;
  distanceKm?: number;
  driverName?: string;
  driverRating?: number;
  driverVehicle?: string;
  driverPhone?: string;
  steps?: OrderTrackingStep[];
  updatedAt?: string;
}

export const ORDER_TRACKING_COLLECTION = 'order_tracking';

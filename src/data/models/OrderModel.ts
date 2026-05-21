import { OrderItemModel } from './OrderItemModel';

export interface OrderModel {
  orderId: number;
  createdAt: string;
  modifiedAt: string;
  orderKey: string;
  razorpayPaymentId: string | null;
  paymentStatus: string | null;
  userId: number;
  status: number;
  grandTotal: number;
  totalItemAmount: number;
  smartCartCharge: number;
  deliveryCharge: number;
  reason: string | null;
  deliveryAddressId: number;
  orderItemsList: OrderItemModel[];
  userName: string | null;
  userMobile: string | null;
}

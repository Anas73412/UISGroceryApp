export interface SaveOrderRequest {
  smartCartCharge?: number;
  orderItemsList?: OrderItem[];
  orderId?: number;
  orderKey?: string;
  grandTotal?: number;
  deliveryCharge?: number;
  userId?: number;
  totalItemAmount?: number;
  status?: number;
  deliveryAddressId?: number;
  razorpayPaymentId?: string;
  paymentStatus?: string;
}

export interface OrderItem {
  quantity?: number;
  itemTotalAmount?: number;
  productId?: number;
  orderId?: number;
  userId?: number;
  status?: number;
}

export type PaymentFailureParams = {
  title: string;
  message: string;
  errorCode?: string;
  orderId?: number;
  orderKey?: string;
  paymentId?: string;
  amount: number;
};

export type PaymentSuccessParams = {
  paymentId: string;
  orderId: number;
  orderKey?: string;
  amount: number;
};

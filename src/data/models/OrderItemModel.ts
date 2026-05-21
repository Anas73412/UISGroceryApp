export interface OrderItemModel {
  itemId?: number;
  createdAt?: string;
  modifiedAt?: string;
  userId: number;
  orderId: number;
  productId: number;
  quantity: number;
  status: number;
  itemTotalAmount: number;
  productName?: string;
  productImage?: string;
  sellingPrice?: number;
  costPrice?: number;
  price?: number;
  unit?: string;
}

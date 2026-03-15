export interface ProductModel {
  quantity?: number;
  productId?: number;
  modifiedAt?: string;
  costPrice?: number;
  discount?: number;
  gst?: number;
  productName?: string;
  createdAt?: string;
  sellingPrice?: number;
  unit?: string;
  productImage?: string;
  price?: number;
  categoryId?: number;
  categoryName?: string;
  status?: number;
  description?: string;
  features?: string;
  cartQuantity?: number;
  isAddedToCart?: boolean;
  cartId?: number;
  originalPrice?: number;
}

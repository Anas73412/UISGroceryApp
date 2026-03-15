import { CartModel } from '../../data/models/CartModel';
import { cartStore } from '../../store/cartStore';
import { sessionStore } from '../../store/sessionStore';
import { CartProductModel } from '../home/components/ProductCard';
import type { CartItem } from './model';

export const cartController = {
  async addItem(item: CartProductModel) {
    const maxCartId = await cartStore.getState().getLastCartId();
    const userId = await sessionStore.getState().user?.uid;
    const cartModel: CartModel = {
      uId: Number(item.id) ?? 0,
      cartId: maxCartId + 1,
      quantity: item.cartQuantity ?? 1,
      userId: userId ?? 0,
      productId: item.productId ?? 0,
      status: 1,
      createdAt: Date.now(),
      modifiedAt: String(Date.now()),
    };
    console.log('CartItemDetails', item);
    cartStore.getState().addItem(cartModel);
  },

  removeItem(productId: string) {
    cartStore.getState().removeItem(productId);
  },

  clearCart() {
    cartStore.getState().clearCart();
  },
};

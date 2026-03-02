import { cartStore } from '../../store/cartStore';
import type { CartItem } from './model';

export const cartController = {
  addItem(item: CartItem) {
    cartStore.getState().addItem(item);
  },

  removeItem(productId: string) {
    cartStore.getState().removeItem(productId);
  },

  clearCart() {
    cartStore.getState().clearCart();
  },
};

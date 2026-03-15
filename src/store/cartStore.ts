import { create } from 'zustand';
import type { CartItem } from '../features/cart/model';
import { sessionStore } from './sessionStore';
import { CartModel, CartResponseModel } from '../data/models/CartModel';
import CartRepository from '../data/repositories/CartRepository';

interface CartStore {
  items: CartResponseModel[];
  addItem: (
    item: Omit<CartResponseModel, 'quantity'> & { quantity?: number },
  ) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  loadFromDB: () => Promise<void>;
  getLastCartId: () => Promise<number>;
  getCartId: (productId: number) => Promise<number>;
}

export const cartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: async item => {
    try {
      const cartItem = {
        ...item,
        quantity: item.quantity ?? 1,
      };
      await CartRepository.addProductInCart(cartItem);
      await cartStore.getState().loadFromDB();
    } catch (error) {
      console.log('ErroException: ', error);
    }
  },
  removeItem: async productId => {
    const userId = sessionStore.getState().user?.uid;
    if (userId) {
      await CartRepository.deleteCartItem(userId, productId);
      await cartStore.getState().loadFromDB();
    }
  },
  clearCart: () => set({ items: [] }),
  getTotal: () => get().items.length,

  loadFromDB: async () => {
    try {
      const user = sessionStore.getState().user;
      if (!user?.uid) {
        set({ items: [] });
        return;
      }

      const carts = await CartRepository.getUserCartDetails(user?.uid);

      const cartItems: CartResponseModel[] = carts.map(cart => ({
        id: 0,
        cartId: cart.cartId,
        productId: cart.productId,
        quantity: cart.quantity,
        userId: user?.uid,
        status: 1,
        createdAt: String(Date.now()),
        modifiedAt: Date.now().toString(),
      }));
      set({ items: cartItems });
    } catch (error: any) {
      set({ items: [] });
    }
  },
  getLastCartId: async () => {
    const user = sessionStore.getState().user;
    if (!user?.uid) {
      set({ items: [] });
      return 0;
    }

    const carts = await CartRepository.getUserCartDetails(user?.uid);
    if (carts.length === 0) return 0;

    return Math.max(...(carts as CartModel[]).map(c => c.cartId));
  },
  getCartId: async productId => {
    const user = sessionStore.getState().user;
    if (!user?.uid) {
      set({ items: [] });
      return 0;
    }

    const cart = await CartRepository.getProductCartDetails(
      user?.uid,
      productId,
    );
    if (cart == null) return 0;

    return cart.cartId;
  },
}));

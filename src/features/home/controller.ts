import CartRepository from '../../data/repositories/CartRepository';
import { sessionStore } from '../../store/sessionStore';
import { FAILED, SUCCESS } from '../../utils/constants';
import { homeService } from './service';

export const homeController = {
  async fetchSliders() {
    try {
      const res = await homeService.fetchSliders();
      if (res.status === SUCCESS) {
        return res;
      }
      return {
        status: FAILED,
        data: null,
        message: res.message || 'Failed to load Sliders',
      };
    } catch (error) {
      return {
        status: FAILED,
        data: null,
        message: (error as Error).message || 'Failed to load Sliders',
      };
    }
  },

  async fetchCategories() {
    try {
      const res = await homeService.fetchCategories();
      if (res.status === SUCCESS) {
        return res;
      }
      return {
        status: FAILED,
        data: null,
        message: res.message || 'Failed to load Categories',
      };
    } catch (error) {
      return {
        status: FAILED,
        data: null,
        message: (error as Error).message || 'Failed to load Categories',
      };
    }
  },

  async fetchNewlyAddedProducts(
    categoryId: number,
    pageNumber: number,
    pageSize: number,
  ) {
    try {
      const res = await homeService.fetchNewProducts(
        categoryId,
        pageNumber,
        pageSize,
      );
      if (res.status === SUCCESS) {
        const userId = sessionStore.getState().user?.uid ?? 0;
        const cartArr = await CartRepository.getUserCartDetails(userId);
        const cartMap = new Map(
          cartArr.map(c => [
            c.productId,
            { quantity: c.quantity, cartId: c.cartId },
          ]),
        );
        if (cartArr.length > 0) {
          for (const item of res.data?.products) {
            const cartInfo = cartMap.get(item.productId);
            item.cartQuantity = cartInfo?.quantity ?? 0;
            item.cartId = cartInfo?.cartId ?? 0;
          }
        }
        return res;
      }
      return {
        status: FAILED,
        data: null,
        message: res.message || 'Failed to load Categories',
      };
    } catch (error) {
      return {
        status: FAILED,
        data: null,
        message:
          (error as Error).message || 'Failed to load newly added products',
      };
    }
  },

  async fetchUserCarts() {
    try {
      const userId = sessionStore.getState().user?.uid ?? 0;
      const res = await homeService.fetchUserCarts(userId);
      if (res.status === SUCCESS) {
        await CartRepository.saveAllCartInDB(res.data);
        return res;
      }
      return {
        status: FAILED,
        data: null,
        message: res.message || 'Failed to load User Carts',
      };
    } catch (error) {
      return {
        status: FAILED,
        data: null,
        message: (error as Error).message || 'Failed to load user carts',
      };
    }
  },
};

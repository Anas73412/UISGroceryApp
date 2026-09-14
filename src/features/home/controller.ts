import { CartResponseModel } from '../../data/models/CartModel';
import CartRepository from '../../data/repositories/CartRepository';
import { sessionStore } from '../../store/sessionStore';
import { FAILED, SUCCESS } from '../../utils/constants';
import { mergeCartQuantitiesIntoProducts } from '../../utils/cartQuantityMerge';
import { homeService } from './service';
import { extractCurrentPlanId } from '../plan/service';

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
        mergeCartQuantitiesIntoProducts(
          res?.data?.products ?? [],
          cartArr.map(c => ({
            productId: c.productId,
            quantity: c.quantity,
            cartId: c.cartId,
          })),
        );
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
      let userId = Number(sessionStore.getState().user?.uid ?? 0);
      if (!Number.isInteger(userId) || userId <= 0) {
        await sessionStore.getState().loadSession();
        userId = Number(sessionStore.getState().user?.uid ?? 0);
      }
      if (!Number.isInteger(userId) || userId <= 0) {
        return {
          status: FAILED,
          data: null,
          message: 'Unable to restore the current user session',
        };
      }
      const res = await homeService.fetchUserCarts(userId);
      if (res.status === SUCCESS) {
        const carts = (res?.data ?? []) as CartResponseModel[];
        await CartRepository.saveAllCartInDB(carts);
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
  async fetchUserCurrentPlan() {
    try {
      let userId = Number(sessionStore.getState().user?.uid ?? 0);
      if (!Number.isInteger(userId) || userId <= 0) {
        await sessionStore.getState().loadSession();
        userId = Number(sessionStore.getState().user?.uid ?? 0);
      }
      if (!Number.isInteger(userId) || userId <= 0) {
        return {
          status: FAILED,
          data: null,
          message: 'Unable to restore the current user session',
        };
      }
      const res = await homeService.getCurrentPlan(userId);
      if (res.status === SUCCESS) {
        const planId = extractCurrentPlanId(res.data);
        if (planId > 0) {
          await sessionStore.getState().updatePlanId(planId);
        }
        return res;
      }
      return {
        status: FAILED,
        data: null,
        message: res.message || 'Failed to load User Plan',
      };
    } catch (error) {
      return {
        status: FAILED,
        data: null,
        message: (error as Error).message || 'Failed to load user plan',
      };
    }
  },

  async fetchUserService() {
    try {
      let userId = Number(sessionStore.getState().user?.uid ?? 0);
      if (!Number.isInteger(userId) || userId <= 0) {
        await sessionStore.getState().loadSession();
        userId = Number(sessionStore.getState().user?.uid ?? 0);
      }
      if (!Number.isInteger(userId) || userId <= 0) {
        return {
          status: FAILED,
          data: null,
          message: 'Unable to restore the current user session',
        };
      }
      const res = await homeService.fetchActiveService(userId);
      if (res.status === SUCCESS) {
        return res;
      }
      return {
        status: FAILED,
        data: null,
        message: res.message || 'Failed to load User Service',
      };
    } catch (error) {
      return {
        status: FAILED,
        data: null,
        message: (error as Error).message || 'Failed to load User Service',
      };
    }
  },
};

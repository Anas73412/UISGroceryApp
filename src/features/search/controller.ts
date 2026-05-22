import CartRepository from '../../data/repositories/CartRepository';
import { sessionStore } from '../../store/sessionStore';
import { FAILED, SUCCESS } from '../../utils/constants';
import { mergeCartQuantitiesIntoProducts } from '../../utils/cartQuantityMerge';
import { searchService } from './service';

export const searchContoller = {
  async fetchProducts(pageNumber: number, pageSize: number) {
    try {
      const res = await searchService.fetchProduct(0, pageNumber, pageSize);

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
      }
      return res;
    } catch (error) {
      return {
        status: FAILED,
        data: null,
        message: (error as Error).message || 'Failed to load products',
      };
    }
  },
};

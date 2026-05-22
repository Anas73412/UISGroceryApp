import CartRepository from '../../data/repositories/CartRepository';
import { sessionStore } from '../../store/sessionStore';
import { FAILED, SUCCESS } from '../../utils/constants';
import { mergeCartQuantitiesIntoProducts } from '../../utils/cartQuantityMerge';
import { productService } from './service';

export const productController = {
  async fetchProducts(
    categoryId: number,
    pageNumber: number,
    pageSize: number,
  ) {
    try {
      const res = await productService.fetchProduct(
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
        console.log('ProductRes', res);
        return res;
      }
      return {
        status: FAILED,
        data: null,
        message: 'Failed to load newly added products',
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
};

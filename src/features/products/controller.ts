import { use } from 'react';
import CartRepository from '../../data/repositories/CartRepository';
import { sessionStore } from '../../store/sessionStore';
import { FAILED, SUCCESS } from '../../utils/constants';
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

        const cartMap = new Map(
          cartArr.map(c => [
            c.productId,
            { quantity: c.quantity, cartId: c.cartId },
          ]),
        );

        if (cartArr.length > 0) {
          for (const item of res?.data?.products ?? []) {
            const cartInfo = cartMap.get(item.productId ?? 0);
            item.cartQuantity = cartInfo?.quantity ?? 0;
            item.cartId = cartInfo?.cartId ?? 0;
          }
        }
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

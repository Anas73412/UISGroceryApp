import { cartStore } from '../../store/cartStore';
import { cartApiService } from './cartApiService';
import { mapErrorResponse } from '../auth/screens/login/service';
import { ApiResponseModel } from '../../services/types';
import { CartProductModel } from '../home/components/ProductCard';

export const cartController = {
  async fetchUserCart(): Promise<ApiResponseModel<CartProductModel[]>> {
    try {
      return await cartApiService.getUserCartList();
    } catch (error) {
      return mapErrorResponse<CartProductModel[]>(error);
    }
  },

  clearCart() {
    cartStore.getState().clearCart();
  },
};

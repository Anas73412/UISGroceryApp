import { apiClient } from '../../services/apiClient';
import { ApiResponseModel } from '../../services/types';
import { sessionStore } from '../../store/sessionStore';
import { API_ENDPOINTS } from '../../utils/constants';
import { mapErrorResponse, mapResponse } from '../auth/screens/login/service';

export interface AddToCartResponse {
  cartId?: number;
  message?: string;
}

export const cartApiService = {
  async addToCart(
    productId: number,
    quantity: number,
  ): Promise<ApiResponseModel<AddToCartResponse>> {
    try {
      const userId = sessionStore.getState().user?.uid;
      const res = await apiClient.post<ApiResponseModel<AddToCartResponse>>(
        API_ENDPOINTS.ADD_TO_CART,
        { productId, quantity, userId },
      );

      return mapResponse<AddToCartResponse>(res);
    } catch (error) {
      return mapErrorResponse(error);
    }
  },

  async updateCartQuantity(
    productId: number,
    quantity: number,
    cartId: number,
  ): Promise<ApiResponseModel<AddToCartResponse>> {
    try {
      const userId = sessionStore.getState().user?.uid;
      const response = await apiClient.post<
        ApiResponseModel<AddToCartResponse>
      >(API_ENDPOINTS.UPDATE_CART_QUANTITY, {
        productId,
        quantity,
        cartId,
        userId,
      });
      return mapResponse<AddToCartResponse>(response);
    } catch (error) {
      return mapErrorResponse(error);
    }
  },

  async removeCartItem(cartId: number): Promise<ApiResponseModel<string>> {
    try {
      const userId = sessionStore.getState().user?.uid;
      const response = await apiClient.post<ApiResponseModel<string>>(
        API_ENDPOINTS.REMOVE_CART_ITEM,
        { cartId, userId },
      );
      return mapResponse<string>(response);
    } catch (error) {
      return mapErrorResponse(error);
    }
  },
};

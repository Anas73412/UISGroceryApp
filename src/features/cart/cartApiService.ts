import { OrderModel } from '../../data/models/OrderModel';
import { SaveOrderRequest } from '../../data/models/SaveOrderRequest';
import { apiClient } from '../../services/apiClient';
import { ApiResponseModel } from '../../services/types';
import { sessionStore } from '../../store/sessionStore';
import { API_ENDPOINTS } from '../../utils/constants';
import { mapErrorResponse, mapResponse } from '../auth/screens/login/service';
import { CartProductModel } from '../home/components/ProductCard';

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

  async getUserCartList(): Promise<ApiResponseModel<CartProductModel[]>> {
    try {
      const userId = sessionStore.getState().user?.uid;
      const response = await apiClient.post<
        ApiResponseModel<CartProductModel[]>
      >(API_ENDPOINTS.USER_CART_LIST, { userId });
      return mapResponse<CartProductModel[]>(response);
    } catch (error) {
      return mapErrorResponse(error);
    }
  },

  async saveUserOrder(
    saveOrderRequest: SaveOrderRequest,
  ): Promise<ApiResponseModel<OrderModel | null>> {
    try {
      const res = await apiClient.post<{
        data?: OrderModel[];
        status?: string;
        message?: string;
        code?: number;
      }>(API_ENDPOINTS.SAVE_USER_ORDER, { ...saveOrderRequest });
      return mapResponse<OrderModel | null>(res);
    } catch (error) {
      return mapErrorResponse(error);
    }
  },
};

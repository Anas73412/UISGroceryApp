import { SliderModel } from '../../data/models/SliderModel';
import { SliderResponseModel } from '../../data/reponses/SliderResponseModel';
import { apiClient } from '../../services/apiClient';
import { ApiResponseModel } from '../../services/types';
import { API_ENDPOINTS } from '../../utils/constants';
import { mapErrorResponse, mapResponse } from '../auth/screens/login/service';
import { CategoryResponseModel } from '../../data/reponses/CategoryResponseModel';
import { PagingProductResponseModel } from '../../data/reponses/PagingProductResponseModel';
import { CartResponseModel } from '../../data/models/CartModel';
import { sessionStore } from '../../store/sessionStore';
import { use } from 'react';
import { PagingProductModel } from '../../data/models/PagingProductModel';

export const homeService = {
  async fetchSliders(): Promise<ApiResponseModel<SliderResponseModel>> {
    try {
      const response = await apiClient.get<SliderResponseModel>(
        API_ENDPOINTS.GET_SLIDERS,
      );

      return mapResponse<SliderResponseModel>(response);
    } catch (error: any) {
      return mapErrorResponse(error);
    }
  },

  async fetchCategories(): Promise<ApiResponseModel<CategoryResponseModel>> {
    try {
      const response = await apiClient.get<CategoryResponseModel>(
        API_ENDPOINTS.GET_CATEGORIES,
      );
      return mapResponse<CategoryResponseModel>(response);
    } catch (error) {
      return mapErrorResponse(error);
    }
  },

  async fetchNewProducts(
    categotyId: number,
    pageNumber: number,
    pageSize: number,
  ): Promise<ApiResponseModel<PagingProductModel>> {
    try {
      const response = await apiClient.post<{ data: PagingProductModel }>(
        API_ENDPOINTS.GET_PRODUCTS,
        { categotyId, pageNumber, pageSize },
      );
      return mapResponse<PagingProductModel>(response);
    } catch (error) {
      return mapErrorResponse(error);
    }
  },

  async fetchUserCarts(
    userId: number,
  ): Promise<ApiResponseModel<CartResponseModel>> {
    try {
      const response = await apiClient.post<PagingProductResponseModel>(
        API_ENDPOINTS.GET_CART_DETAILS,
        { userId: userId },
      );
      return mapResponse<CartResponseModel>(response);
    } catch (error) {
      return mapErrorResponse(error);
    }
  },
};

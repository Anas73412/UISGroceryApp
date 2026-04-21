import { PagingProductModel } from '../../data/models/PagingProductModel';
import { apiClient } from '../../services/apiClient';
import { ApiResponseModel } from '../../services/types';
import { API_ENDPOINTS } from '../../utils/constants';
import { mapErrorResponse, mapResponse } from '../auth/screens/login/service';

export const searchService = {
  async fetchProduct(
    categoryId: number,
    pageNumber: number,
    pageSize: number,
  ): Promise<ApiResponseModel<PagingProductModel>> {
    try {
      const res = await apiClient.post<{ data: PagingProductModel }>(
        API_ENDPOINTS.GET_PRODUCTS,
        { categoryId, pageNumber, pageSize },
      );
      return mapResponse<PagingProductModel>(res);
    } catch (error) {
      return mapErrorResponse(error);
    }
  },
};

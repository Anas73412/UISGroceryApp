import { CategoryResponseModel } from '../../data/reponses/CategoryResponseModel';
import { apiClient } from '../../services/apiClient';
import { ApiResponseModel } from '../../services/types';
import { API_ENDPOINTS } from '../../utils/constants';
import { mapErrorResponse, mapResponse } from '../auth/screens/login/service';

export const categoryService = {
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
};

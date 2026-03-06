import { SliderModel } from '../../data/models/SliderModel';
import { SliderResponseModel } from '../../data/reponses/SliderResponseModel';
import { apiClient } from '../../services/apiClient';
import { ApiResponseModel } from '../../services/types';
import { API_ENDPOINTS } from '../../utils/constants';
import { mapErrorResponse, mapResponse } from '../auth/screens/login/service';
import { CategoryResponseModel } from '../../data/reponses/CategoryResponseModel';

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
      console.log('cCategoryData: ', response);
      return mapResponse<CategoryResponseModel>(response);
    } catch (error) {
      return mapErrorResponse(error);
    }
  },
};

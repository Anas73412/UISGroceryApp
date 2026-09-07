import { apiClient } from '../../services/apiClient';
import { ApiResponseModel } from '../../services/types';
import { API_ENDPOINTS } from '../../utils/constants';
import { mapErrorResponse, mapResponse } from '../auth/screens/login/service';
import type { PlanModel } from '../../data/models/PlanModel';

export const planService = {
  async getAllPlans(): Promise<ApiResponseModel<PlanModel[]>> {
    try {
      const response = await apiClient.post<{ data?: PlanModel[] }>(
        API_ENDPOINTS.GET_APP_ALL_PLANS,
        {},
      );
      return mapResponse<PlanModel[]>(response);
    } catch (error) {
      return mapErrorResponse<PlanModel[]>(error);
    }
  },
};

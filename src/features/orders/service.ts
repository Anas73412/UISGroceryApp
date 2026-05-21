import { OrderModel } from '../../data/models/OrderModel';
import { apiClient } from '../../services/apiClient';
import { ApiResponseModel } from '../../services/types';
import { API_ENDPOINTS } from '../../utils/constants';
import { mapErrorResponse, mapResponse } from '../auth/screens/login/service';

export const orderService = {
  async getOrderHistoryList(
    userId: number,
  ): Promise<ApiResponseModel<OrderModel[] | []>> {
    try {
      const res = await apiClient.post<{
        data?: OrderModel[];
        status?: string;
        message?: string;
        code?: number;
      }>(API_ENDPOINTS.GET_ALL_ORDERS, { userId });
      return mapResponse<OrderModel[]>(res);
    } catch (error) {
      return mapErrorResponse(error);
    }
  },
};

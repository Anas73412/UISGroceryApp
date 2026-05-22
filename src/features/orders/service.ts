import { OrderModel } from '../../data/models/OrderModel';
import { apiClient } from '../../services/apiClient';
import { ApiResponseModel } from '../../services/types';
import { API_ENDPOINTS, ORDER_TRACKING_PATH } from '../../utils/constants';
import type { OrderTrackingModel } from '../../data/models/OrderTrackingModel';
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

  async getOrderTracking(
    orderKey: string,
  ): Promise<ApiResponseModel<OrderTrackingModel | null>> {
    try {
      const res = await apiClient.get<{
        data?: OrderTrackingModel | null;
        status?: string;
        message?: string;
      }>(`${ORDER_TRACKING_PATH}?orderKey=${encodeURIComponent(orderKey)}`);
      return mapResponse<OrderTrackingModel | null>(res);
    } catch (error) {
      return mapErrorResponse(error);
    }
  },
};

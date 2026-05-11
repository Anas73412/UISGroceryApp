import { apiClient } from '../../services/apiClient';
import { ApiResponseModel } from '../../services/types';
import { API_ENDPOINTS, SUCCESS } from '../../utils/constants';
import type { ConfigItem } from '../../data/models/ConfigModel';
import { DeliveryChargesModel } from '../../data/models/DeliveryChargesModel';

interface AppConfigApiResponse {
  status: string;
  data?: ConfigItem[];
  message: string;
  code: number;
}

export const splashService = {
  async fetchAppConfig(): Promise<ApiResponseModel<ConfigItem[]>> {
    const response = await apiClient.get<AppConfigApiResponse>(
      API_ENDPOINTS.APP_CONFIG,
    );
    return {
      code: response.code ?? 200,
      status: response.status ?? SUCCESS,
      message: response.message ?? 'App configurations retrieved successfully',
      data: response.data ?? [],
    };
  },

  async fetchDeliveryCharges(): Promise<
    ApiResponseModel<DeliveryChargesModel[]>
  > {
    const response = await apiClient.get<
      ApiResponseModel<DeliveryChargesModel[]>
    >(API_ENDPOINTS.GET_DELIVERY_CHARGE);
    return {
      code: response.code ?? 200,
      status: response.status ?? SUCCESS,
      message: response.message ?? 'Delivery charges retrieved successfully',
      data: response.data ?? [],
    };
  },
};

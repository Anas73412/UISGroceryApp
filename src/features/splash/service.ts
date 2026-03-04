import { apiClient } from '../../services/apiClient';
import { ApiResponseModel } from '../../services/types';
import { API_ENDPOINTS, SUCCESS } from '../../utils/constants';
import type { ConfigItem } from '../../data/models/ConfigModel';

interface AppConfigApiResponse {
  status: string;
  data?: ConfigItem[];
  message: string;
  code: number;
}

export const splashService = {
  async fetchAppConfig(): Promise<ApiResponseModel<ConfigItem[]>> {
    const response = await apiClient.get<AppConfigApiResponse>(API_ENDPOINTS.APP_CONFIG);
    return {
      code: response.code ?? 200,
      status: response.status ?? SUCCESS,
      message: response.message ?? 'App configurations retrieved successfully',
      data: response.data ?? [],
    };
  },
};
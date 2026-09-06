import {
  UserModel,
  UserResponseModel,
} from '../../../../data/models/UserModel';
import { apiClient } from '../../../../services/apiClient';
import { ApiResponseModel } from '../../../../services/types';
import { API_ENDPOINTS, FAILED, SUCCESS } from '../../../../utils/constants';

export interface LoginApiResponse {
  status: string;
  data?: UserResponseModel;
  message: string;
  code: number;
}

export const loginService = {
  async loginUser(
    mobile: string,
    password: string,
  ): Promise<ApiResponseModel<UserResponseModel>> {
    try {
      const response = await apiClient.post<LoginApiResponse>(
        API_ENDPOINTS.LOGIN,
        { mobile, password },
      );
      return mapResponse<UserResponseModel>(response);
    } catch (error: any) {
      return mapErrorResponse(error);
    }
  },
};

export const mapResponse = <T>(res: any): ApiResponseModel<T> => ({
  code: res?.code ?? 200,
  status: res?.status ?? SUCCESS,
  message: res?.message ?? '',
  data: res?.data ?? null,
});

import { AxiosError } from 'axios';

export const mapErrorResponse = <T>(error: unknown): ApiResponseModel<T> => {
  const axiosError = error as AxiosError<any>;
  const status = axiosError?.response?.status;
  const responseMessage = axiosError?.response?.data?.message;

  console.error('Login API request failed:', {
    status: status ?? 'no-response',
    url: axiosError?.config?.url,
    message: responseMessage ?? axiosError?.message,
  });

  return {
    code: status ?? 503,
    status: FAILED,
    message:
      responseMessage ??
      axiosError?.message ??
      'Development API is unavailable',
    data: null,
  };
};

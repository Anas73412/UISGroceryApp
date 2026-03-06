import {
  UserModel,
  UserResponseModel,
} from '../../../../data/models/UserModel';
import { apiClient } from '../../../../services/apiClient';
import { ApiResponseModel } from '../../../../services/types';
import { API_ENDPOINTS, FAILED, SUCCESS } from '../../../../utils/constants';

interface LoginApiResponse {
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
      console.log('LoginDeta', response);
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

  return {
    code: axiosError?.response?.status ?? 500,
    status: FAILED,
    message:
      axiosError?.response?.data?.message ??
      axiosError?.message ??
      'Something went wrong',
    data: null,
  };
};

import { map } from '@nozbe/watermelondb/utils/rx';
import { AddressResponseModel } from '../../data/models/AddressModel';
import { ApiResponseModel } from '../../services/types';
import { mapErrorResponse, mapResponse } from '../auth/screens/login/service';
import { apiClient } from '../../services/apiClient';
import { API_ENDPOINTS } from '../../utils/constants';

export const addressService = {
  async getAddressList(
    userId: number,
  ): Promise<ApiResponseModel<AddressResponseModel[] | []>> {
    try {
      const res = await apiClient.post<{ data: AddressResponseModel[] }>(
        API_ENDPOINTS.USER_ADDRESS_LIST,
        { userId },
      );
      return mapResponse<AddressResponseModel[]>(res);
    } catch (error) {
      return mapErrorResponse(error);
    }
  },
};

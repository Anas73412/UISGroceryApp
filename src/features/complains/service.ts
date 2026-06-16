import {
  ComplainDetailModel,
  CreateComplainPayload,
} from '../../data/models/ComplainDetailModel';
import { apiClient } from '../../services/apiClient';
import { ApiResponseModel } from '../../services/types';
import { API_ENDPOINTS } from '../../utils/constants';
import { mapErrorResponse, mapResponse } from '../auth/screens/login/service';

export const complainService = {
  async getComplainList(
    mobile: string,
  ): Promise<ApiResponseModel<ComplainDetailModel[] | []>> {
    try {
      const res = await apiClient.post<{ data: ComplainDetailModel[] }>(
        API_ENDPOINTS.GET_ALL_COMPLAINS,
        { mobile },
      );
      return mapResponse<ComplainDetailModel[]>(res);
    } catch (error) {
      return mapErrorResponse(error);
    }
  },

  async submitComplain(
    payload: CreateComplainPayload,
  ): Promise<ApiResponseModel<string | null>> {
    try {
      const res = await apiClient.post<{ data?: string; message?: string }>(
        API_ENDPOINTS.ADD_COMPLAIN,
        payload,
      );
      return mapResponse<string | null>(res);
    } catch (error) {
      return mapErrorResponse(error);
    }
  },
};

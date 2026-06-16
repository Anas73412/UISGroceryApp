import { BillDetailModel } from '../../data/models/BillDetailModel';
import { apiClient } from '../../services/apiClient';
import { ApiResponseModel } from '../../services/types';
import { API_ENDPOINTS } from '../../utils/constants';
import { mapErrorResponse, mapResponse } from '../auth/screens/login/service';

export const billService = {
  async getBillList(
    userId: number,
  ): Promise<ApiResponseModel<BillDetailModel[] | []>> {
    try {
      const res = await apiClient.post<{ data: BillDetailModel[] }>(
        API_ENDPOINTS.GET_CUSTOMER_BILLS,
        { userId },
      );

      return mapResponse<BillDetailModel[]>(res);
    } catch (error) {
      return mapErrorResponse(error);
    }
  },
};

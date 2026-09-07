import { apiClient } from '../../services/apiClient';
import type { ApiResponseModel } from '../../services/types';
import { API_ENDPOINTS } from '../../utils/constants';
import { mapErrorResponse } from '../auth/screens/login/service';

export interface ContactApiItem {
  pageId: number;
  title: string;
  description: string;
  type: string;
  status: number;
  typeId: number | null;
}

type PageApiResponse = ApiResponseModel<ContactApiItem | ContactApiItem[]>;

const normalizePageResponse = (
  response: PageApiResponse,
): ApiResponseModel<ContactApiItem> => ({
  ...response,
  data: Array.isArray(response.data) ? response.data[0] ?? null : response.data,
});

export const settingsService = {
  async fetchAboutUs(): Promise<ApiResponseModel<ContactApiItem>> {
    try {
      const response = await apiClient.get<PageApiResponse>(
        API_ENDPOINTS.ABOUT_US,
      );
      return normalizePageResponse(response);
    } catch (error) {
      return mapErrorResponse<ContactApiItem>(error);
    }
  },

  async fetchContactDetails(): Promise<ApiResponseModel<ContactApiItem>> {
    try {
      const response = await apiClient.get<PageApiResponse>(
        API_ENDPOINTS.PRIVACY_POLICY,
      );
      return normalizePageResponse(response);
    } catch (error) {
      return mapErrorResponse<ContactApiItem>(error);
    }
  },
};

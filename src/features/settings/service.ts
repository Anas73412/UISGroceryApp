import { apiClient } from '../../services/apiClient';
import type { ApiResponseModel } from '../../services/types';
import { mapErrorResponse } from '../auth/screens/login/service';

const CONTACT_DETAILS_URL =
  'https://demo.unitedinternetservice.in/api/unitedweb/privacyPolicy';

export interface ContactApiItem {
  id: number;
  title: string;
  description: string;
  type: string;
  status: number;
  typeId: number;
}

export const settingsService = {
  async fetchContactDetails(): Promise<ApiResponseModel<ContactApiItem[]>> {
    try {
      return await apiClient.get<ApiResponseModel<ContactApiItem[]>>(
        CONTACT_DETAILS_URL,
      );
    } catch (error) {
      return mapErrorResponse<ContactApiItem[]>(error);
    }
  },
};

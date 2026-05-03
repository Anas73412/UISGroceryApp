import { UserResponseModel } from '../../data/models/UserModel';
import { apiClient } from '../../services/apiClient';
import { ApiResponseModel } from '../../services/types';
import { API_ENDPOINTS, FAILED, SUCCESS } from '../../utils/constants';
import {
  LoginApiResponse,
  mapErrorResponse,
  mapResponse,
} from '../auth/screens/login/service';

interface UpdateProfilePayload {
  name?: string;
  email?: string;
  address?: string;
  billing_address?: string;
  correspondence_address?: string;
}

export interface PickImageAsset {
  uri: string;
  type?: string;
  fileName?: string;
}

export const profileService = {
  async updateProfile(
    _userId: number,
    _payload: UpdateProfilePayload,
  ): Promise<ApiResponseModel<{ success: boolean }>> {
    try {
      const res = await apiClient.post<ApiResponseModel<{ success: boolean }>>(
        API_ENDPOINTS.UPDATE_PROFILE,
        {
          id: _userId,
          ..._payload,
        },
      );
      return mapResponse<{ success: boolean }>(res);
    } catch (error) {
      return mapErrorResponse(error);
    }
  },

  async uploadProfilePic(
    userId: Number,
    image: PickImageAsset,
  ): Promise<ApiResponseModel<String>> {
    try {
      const formData = new FormData();

      formData.append('image', {
        uri: image.uri,
        type: image.type || 'image/jpeg',
        name: image.fileName,
      } as any);

      formData.append('userId', userId.toString());

      const result = await apiClient.post<ApiResponseModel<String>>(
        API_ENDPOINTS.UPLOAD_PROFILE_PICTURE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return mapResponse<String>(result);
    } catch (error) {
      return mapErrorResponse(error);
    }
  },

  async getUserDetails(
    id: Number,
  ): Promise<ApiResponseModel<UserResponseModel>> {
    try {
      const res = await apiClient.post<{ data: UserResponseModel }>(
        API_ENDPOINTS.GET_USER_PROFILE,
        { id },
      );
      return mapResponse<UserResponseModel>(res);
    } catch (error) {
      return mapErrorResponse(error);
    }
  },
};

import { ApiResponseModel } from '../../services/types';
import { FAILED, SUCCESS } from '../../utils/constants';

interface UpdateProfilePayload {
  name?: string;
  email?: string;
  address?: string;
  billing_address?: string;
  correspondence_address?: string;
}

export const profileService = {
  async updateProfile(
    _userId: number,
    _payload: UpdateProfilePayload,
  ): Promise<ApiResponseModel<{ success: boolean }>> {
    try {
      // TODO: Integrate with API when UPDATE_PROFILE endpoint is available
      return {
        status: SUCCESS,
        data: { success: true },
        message: 'Profile updated successfully',
        code: 200,
      };
    } catch (error) {
      return {
        status: FAILED,
        data: null,
        message: (error as Error).message ?? 'Failed to update profile',
        code: 500,
      };
    }
  },
};

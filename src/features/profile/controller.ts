import { sessionStore } from '../../store/sessionStore';
import { FAILED, SUCCESS } from '../../utils/constants';
import { profileService } from './service';

interface UpdateProfilePayload {
  name?: string;
  email?: string;
  address?: string;
  billing_address?: string;
  correspondence_address?: string;
}

export const profileController = {
  async updateProfile(payload: UpdateProfilePayload) {
    try {
      const userId = sessionStore.getState().user?.uid ?? 0;
      if (userId === 0) {
        return {
          status: FAILED,
          data: null,
          message: 'User not logged in',
          code: 401,
        };
      }

      const res = await profileService.updateProfile(userId, payload);
      return res;
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

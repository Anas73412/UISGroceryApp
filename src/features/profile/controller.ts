import UserRepository from '../../data/repositories/UserRepository';
import { sessionStore } from '../../store/sessionStore';
import { FAILED, SUCCESS } from '../../utils/constants';
import { mapResponse } from '../auth/screens/login/service';
import { PickImageAsset, profileService } from './service';

interface UpdateProfilePayload {
  mobile?: string;
  name?: string;
  email?: string;
  Address?: string;
  billing_address?: string;
}

export const profileController = {
  async updateProfile(payload: UpdateProfilePayload) {
    try {
      const id = sessionStore.getState().user?.uid ?? 0;

      if (id === 0) {
        return {
          status: FAILED,
          data: null,
          message: 'User not logged in',
          code: 401,
        };
      }

      const res = await profileService.updateProfile(id, payload);
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

  async uploadProfilePic(image: PickImageAsset) {
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
      return await profileService.uploadProfilePic(userId, image);
    } catch (error) {
      return {
        status: FAILED,
        data: null,
        message: (error as Error).message ?? 'Failed to upload profile picture',
        code: 500,
      };
    }
  },

  async fetchUserProfile() {
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

      const res = await profileService.getUserDetails(userId);
      if (res.status === SUCCESS && res.data) {
        await UserRepository.saveUserInDB(res.data);
      }
      return res;
    } catch (error) {
      return {
        status: FAILED,
        data: null,
        message: (error as Error).message ?? 'Failed to upload profile picture',
        code: 500,
      };
    }
  },
};

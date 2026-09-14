import { create } from 'zustand';
import type { UserModel } from '../data/models/UserModel';
import AuthRepository from '../data/repositories/AuthRepository';
import UserRepository from '../data/repositories/UserRepository';
import { appPrefs } from '../data/repositories/AppPrefRepository';
import { profileService } from '../features/profile/service';
import { SUCCESS } from '../utils/constants';

interface SessionStore {
  user: UserModel | null;
  token: string | null;
  isLoaded: boolean;
  loadSession: () => Promise<boolean>;
  setSession: (user: UserModel | null, token: string | null) => void;
  updatePlanId: (planId: number) => Promise<void>;
  clearSession: () => void;
}

function getValidUserId(user: UserModel | null): number {
  const userId = Number(user?.uid ?? 0);
  return Number.isInteger(userId) && userId > 0 ? userId : 0;
}
export const sessionStore = create<SessionStore>((set, get) => ({
  user: null,
  token: null,
  isLoaded: false,

  loadSession: async () => {
    try {
      const credentials = await AuthRepository.getCredentials();
      if (!credentials?.token) {
        set({ user: null, token: null, isLoaded: true });
        return false;
      }

      let user = await UserRepository.getCurrentUser();

      if (!user || getValidUserId(user) === 0) {
        const cachedUserId = Number(await appPrefs.get('cachedUserId'));
        if (Number.isInteger(cachedUserId) && cachedUserId > 0) {
          const res = await profileService.getUserDetails(cachedUserId);
          if (res.status === SUCCESS && res.data) {
            await UserRepository.saveUserInDB(res.data);
            user = await UserRepository.getCurrentUser();
          }
        }
      }

      if (user && getValidUserId(user) > 0) {
        set({
          user,
          token: credentials.token,
          isLoaded: true,
        });
        return true;
      }

      set({ user: null, token: null, isLoaded: true });
      return false;
    } catch (error) {
      console.error('loadSession failed:', error);
      set({ user: null, token: null, isLoaded: true });
      return false;
    }
  },

  setSession: (user, token) => {
    const userId = getValidUserId(user);
    if (userId > 0) {
      void appPrefs.set('cachedUserId', userId);
    }
    set({ user, token, isLoaded: true });
  },

  updatePlanId: async planId => {
    if (!Number.isInteger(planId) || planId <= 0 || !get().user) {
      return;
    }

    const updatedUser = await UserRepository.updatePlanId(planId);
    if (updatedUser) {
      set({ user: updatedUser });
    }
  },

  clearSession: () => set({ user: null, token: null, isLoaded: true }),
}));

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
  clearSession: () => void;
}

export const sessionStore = create<SessionStore>(set => ({
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

      if (!user) {
        const cachedUserId = await appPrefs.get('cachedUserId');
        if (cachedUserId > 0) {
          const res = await profileService.getUserDetails(cachedUserId);
          if (res.status === SUCCESS && res.data) {
            await UserRepository.saveUserInDB(res.data);
            user = await UserRepository.getCurrentUser();
          }
        }
      }

      if (user) {
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
    if (user?.uid) {
      void appPrefs.set('cachedUserId', user.uid);
    }
    set({ user, token, isLoaded: true });
  },

  clearSession: () =>
    set({ user: null, token: null, isLoaded: true }),
}));

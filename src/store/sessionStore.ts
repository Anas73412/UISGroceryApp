import { create } from 'zustand';
import type { UserModel } from '../data/models/UserModel';
import AuthRepository from '../data/repositories/AuthRepository';
import UserRepository from '../data/repositories/UserRepository';

interface SessionStore {
  user: UserModel | null;
  token: string | null;
  isLoaded: boolean;
  loadSession: () => Promise<void>;
  setSession: (user: UserModel | null, token: string | null) => void;
  clearSession: () => void;
}

export const sessionStore = create<SessionStore>((set) => ({
  user: null,
  token: null,
  isLoaded: false,

  loadSession: async () => {
    try {
      const [credentials, user] = await Promise.all([
        AuthRepository.getCredentials(),
        UserRepository.getCurrentUser(),
      ]);

      if (credentials && user) {
        set({
          user,
          token: credentials.token,
          isLoaded: true,
        });
      } else {
        set({ user: null, token: null, isLoaded: true });
      }
    } catch {
      set({ user: null, token: null, isLoaded: true });
    }
  },

  setSession: (user, token) =>
    set({ user, token, isLoaded: true }),

  clearSession: () =>
    set({ user: null, token: null }),
}));

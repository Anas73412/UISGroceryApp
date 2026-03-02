import { create } from 'zustand';
import type { User } from '../features/auth/model';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User | null, token: string | null) => void;
  logout: () => void;
}

export const authStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setAuth: (user, token) =>
    set({ user, token, isAuthenticated: !!user && !!token }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));

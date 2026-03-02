import { apiClient } from '../../services/apiClient';
import type { LoginCredentials, RegisterData, User } from './model';

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await apiClient.post<{ user: User; token: string }>('/auth/login', credentials);
    return response.data;
  },

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    const response = await apiClient.post<{ user: User; token: string }>('/auth/register', data);
    return response.data;
  },

  logout(): void {
    // Clear token, etc.
  },
};

import { authService } from './service';
import type { LoginCredentials, RegisterData } from './model';

export const authController = {
  async login(credentials: LoginCredentials) {
    return authService.login(credentials);
  },

  async register(data: RegisterData) {
    return authService.register(data);
  },

  logout() {
    authService.logout();
  },
};

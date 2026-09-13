import { FAILED, SUCCESS } from '../../../../utils/constants';
import { loginService } from './service';
import UserRepository from '../../../../data/repositories/UserRepository';
import AuthRepository from '../../../../data/repositories/AuthRepository';
import { appPrefs } from '../../../../data/repositories/AppPrefRepository';
import { sessionStore } from '../../../../store/sessionStore';

export const LoginController = {
  async loginUser(email: string, password: string) {
    try {
      const res = await loginService.loginUser(email, password);
      if (res.status === SUCCESS && res.data && res.data.token) {
        await UserRepository.saveUserInDB(res.data);
        await AuthRepository.saveToken(res.data.mobile, res.data.token);
        await appPrefs.set('cachedUserId', res.data.id ?? 0);
        const user = await UserRepository.getCurrentUser();
        sessionStore.getState().setSession(user, res.data.token);
        return res;
      } else {
        return {
          status: FAILED,
          message: res.message || 'Login failed. Please try again later',
        };
      }
    } catch (error) {
      return {
        status: FAILED,
        message: (error as Error).message || 'Failed to load app configuration',
      };
    }
  },
};

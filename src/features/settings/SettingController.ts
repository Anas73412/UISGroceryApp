import AuthRepository from '../../data/repositories/AuthRepository';
import SettingRepository from '../../data/repositories/SettingRepository';
import { sessionStore } from '../../store/sessionStore';

export const SettingController = {
  async logout(): Promise<boolean> {
    try {
      sessionStore.getState().clearSession();
      await AuthRepository.clearToken();
      return await SettingRepository.clearAllLocalData();
    } catch (error) {
      console.error('Failed to clear database:', error);
      return false;
    }
  },
};

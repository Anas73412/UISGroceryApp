import AuthRepository from '../../data/repositories/AuthRepository';
import SettingRepository from '../../data/repositories/SettingRepository';

export const SettingController = {
  async logout(): Promise<boolean> {
    try {
      await AuthRepository.clearToken();
      return await SettingRepository.clearAllLocalData();
    } catch (error) {
      console.error('Failed to clear database:', error);
      return false;
    }
  },
};

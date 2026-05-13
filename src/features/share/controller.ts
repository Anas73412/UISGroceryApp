import ConfigRepository from '../../data/repositories/ConfigRepository';
import { CONFIG_KEYS } from '../../utils/constants';

export type ShareConfig = {
  referUrl: string;
  referMessage: string;
};

export const shareController = {
  async getShareConfigFromDB(): Promise<ShareConfig> {
    try {
      const [referUrlConfig, referMessageConfig] = await Promise.all([
        ConfigRepository.getConfigByKeyFromDB(CONFIG_KEYS.REFER_URL),
        ConfigRepository.getConfigByKeyFromDB(CONFIG_KEYS.REFER_MESSAGE),
      ]);

      return {
        referUrl: referUrlConfig?.configValue?.trim() ?? '',
        referMessage: referMessageConfig?.configValue?.trim() ?? '',
      };
    } catch (error) {
      return {
        referUrl: '',
        referMessage: '',
      };
    }
  },
};

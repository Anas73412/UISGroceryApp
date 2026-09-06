import { splashService } from './service';
import { SUCCESS, FAILED } from '../../utils/constants';
import ConfigRepository from '../../data/repositories/ConfigRepository';

export const SplashController = {
  async loadAppConfig() {
    try {
      const res = await splashService.fetchAppConfig();
      if (res.status === SUCCESS && res.data && Array.isArray(res.data)) {
        await ConfigRepository.saveAllConfigs(res.data);
        return res;
      } else {
        return {
          status: FAILED,
          message: res.message || 'Failed to load app configuration',
        };
      }
    } catch (error) {
      return {
        status: FAILED,
        message: (error as Error).message || 'Failed to load app configuration',
      };
    }
  },
  async loadDeliveryCharges() {
    try {
      const res = await splashService.fetchDeliveryCharges();
      if (res.status === SUCCESS && res.data && Array.isArray(res.data)) {
        await ConfigRepository.saveAllDeliveryCharges(res.data);
        return res;
      } else {
        return {
          status: FAILED,
          message: res.message || 'Failed to load delivery charges',
        };
      }
    } catch (error) {
      return {
        status: FAILED,
        message: (error as Error).message || 'Failed to load delivery charges',
      };
    }
  },
};

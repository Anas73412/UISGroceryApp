import { splashService } from './service';
import { SUCCESS, FAILED } from '../../utils/constants';
import axios from 'axios';
import ConfigRepository from '../../data/repositories/ConfigRepository';

export const SplashController = {
  async loadAppConfig() {
    try {
      const res = await splashService.fetchAppConfig();

      if (res.status === SUCCESS && res.data && Array.isArray(res.data)) {
        console.log('App Config Response data:', JSON.stringify(res.data));
        await ConfigRepository.saveAllConfigs(res.data);
        return res;
      } else {
        return {
          status: FAILED,
          message: res.message || 'Failed to load app configuration',
        };
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Axios error details:', {
          message: error.message,
          code: error.code,
          url: error.config?.url,
        });
      } else {
        console.log('Non-axios error:', error);
      }

      return {
        status: FAILED,
        message: (error as Error).message || 'Failed to load app configuration',
      };
    }
  },
};

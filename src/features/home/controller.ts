import { FAILED, SUCCESS } from '../../utils/constants';
import { homeService } from './service';

export const homeController = {
  async fetchSliders() {
    try {
      const res = await homeService.fetchSliders();
      if (res.status === SUCCESS) {
        return res;
      }
      return {
        status: FAILED,
        data: null,
        message: res.message || 'Failed to load Sliders',
      };
    } catch (error) {
      return {
        status: FAILED,
        data: null,
        message: (error as Error).message || 'Failed to load Sliders',
      };
    }
  },

  async fetchCategories() {
    try {
      const res = await homeService.fetchCategories();
      if (res.status === SUCCESS) {
        return res;
      }
      return {
        status: FAILED,
        data: null,
        message: res.message || 'Failed to load Categories',
      };
    } catch (error) {
      return {
        status: FAILED,
        data: null,
        message: (error as Error).message || 'Failed to load Categories',
      };
    }
  },
};

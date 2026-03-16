import { FAILED, SUCCESS } from '../../utils/constants';
import { categoryService } from './service';

export const categoryController = {
  async fetchCategories() {
    try {
      const res = await categoryService.fetchCategories();
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
        message: (error as Error).message || 'Failed to load Categories',
      };
    }
  },
};

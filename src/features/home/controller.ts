import { homeService } from './service';

export const homeController = {
  async getProducts() {
    return homeService.getProducts();
  },

  async getProductById(id: string) {
    return homeService.getProductById(id);
  },
};

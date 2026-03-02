import { apiClient } from '../../services/apiClient';
import type { Product } from './model';

export const homeService = {
  async getProducts(): Promise<Product[]> {
    const response = await apiClient.get<Product[]>('/products');
    return response.data;
  },

  async getProductById(id: string): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },
};

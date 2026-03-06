import { CategoryModel } from '../models/CategoryModel';

export interface CategoryResponseModel {
  status: string;
  data?: CategoryModel[];
  message: string;
  code: number;
}

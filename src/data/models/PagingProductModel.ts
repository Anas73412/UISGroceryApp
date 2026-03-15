import { ProductModel } from './ProductModel';

export interface PagingProductModel {
  products?: ProductModel[];
  totalCount?: number;
  pageNumber?: number;
  pageSize?: number;
  totalPages?: number;
}

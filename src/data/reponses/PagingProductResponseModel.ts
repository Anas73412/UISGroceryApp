import { PagingProductModel } from '../models/PagingProductModel';

export interface PagingProductResponseModel {
  status: string;
  data?: PagingProductModel;
  message: string;
  code: number;
}

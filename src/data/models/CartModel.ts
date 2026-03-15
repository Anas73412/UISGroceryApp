import { Model } from '@nozbe/watermelondb';
import { DB_TABLES } from '../../utils/constants';
import { field } from '@nozbe/watermelondb/decorators';

export interface CartResponseModel {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  userId: number;
  status: number;
  createdAt: string;
  modifiedAt: string;
}

export class CartModel extends Model {
  static table: string = DB_TABLES.CART_TABLE;
  @field('uId') uId!: number;
  @field('cartId') cartId!: number;
  @field('productId') productId!: number;
  @field('quantity') quantity!: number;
  @field('userId') userId!: number;
  @field('status') status!: number;
  @field('createdAt') createdAt!: number;
  @field('modifiedAt') modifiedAt!: string;
}

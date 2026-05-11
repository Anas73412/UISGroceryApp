import { Model } from '@nozbe/watermelondb';
import { DB_TABLES } from '../../utils/constants';
import { field } from '@nozbe/watermelondb/decorators';

export interface DeliveryChargesModel {
  uId: number;
  amount?: number;
  distance?: string;
  rateId: number;
  deliveryTime: string;
}

export class DeliveryChargesModel extends Model {
  static table: string = DB_TABLES.DELIVERY_CHARGE_TABLE;
  @field('uId') uId!: number;
  @field('amount') amount?: number;
  @field('distance') distance?: string;
  @field('rateId') rateId!: number;
  @field('deliveryTime') deliveryTime!: string;
}

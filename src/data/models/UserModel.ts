import { Model } from '@nozbe/watermelondb';
import { DB_TABLES } from '../../utils/constants';
import { field } from '@nozbe/watermelondb/decorators';

export interface UserResponseModel {
  id: number;
  name: string;
  email: string | null;
  mobile: string;
  password: string;
  address: string | null;
  billing_address: string | null;
  adhaar_no: string | null;
  adhaar_front: string | null;
  adhaar_back: string | null;
  is_adhaar_verified: number | 0;
  profile: string | null;
  plan_id: number | 0;
  status: number | 0;
  isWiFiUser: number | 0;
  is_bill_recurring: number | 0;
  bill_start_date: string | null;
  deviceToken: string | null;
  created_at: string;
}

export class UserModel extends Model {
  static table: string = DB_TABLES.USER_TABLE;

  @field('uid') uid!: number;
  @field('mobile') mobile!: string;
  @field('name') name!: string;
  @field('profile') profile?: string;
  @field('created_at') createdAt?: string;
  @field('isWifiUser') isWifiUser!: number;
  @field('address') address?: string;
  @field('status') status?: number;
  @field('deviceToken') deviceToken?: string;
  @field('plan_id') planId?: number;
}

export const userCollection = 'users';

export interface UserDocument extends UserModel {
  hashedPassword: string;
}

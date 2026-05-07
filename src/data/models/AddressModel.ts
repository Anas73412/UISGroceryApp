import { Model } from '@nozbe/watermelondb';
import { DB_TABLES } from '../../utils/constants';
import { field } from '@nozbe/watermelondb/decorators';

export interface AddressResponseModel {
  uId: number;
  addressId: number;
  userId: number;
  houseNo: string;
  buildingName: string;
  landmark: string;
  addressType: number;
  otherAddressType: string;
  receiverName: string;
  receiverMobile: string;
  status: number;
  pincode: string;
  latitude: string;
  longtitude: string;
  mapAddress: string;
  distance: number;
}

export class AddressModel extends Model {
  static table: string = DB_TABLES.ADDRESS_TABLE;
  @field('uId') uId!: number;
  @field('addressId') addressId!: number;
  @field('userId') userId!: number;
  @field('houseNo') houseNo!: string;
  @field('buildingName') buildingName!: string;
  @field('landmark') landmark!: string;
  @field('addressType') addressType!: number;
  @field('otherAddressType') otherAddressType!: string;
  @field('receiverName') receiverName!: string;
  @field('receiverMobile') receiverMobile!: string;
  @field('status') status!: number;
  @field('pincode') pincode!: string;
  @field('latitude') latitude!: string;
  @field('longtitude') longtitude!: string;
  @field('mapAddress') mapAddress!: string;
  @field('distance') distance!: number;
}

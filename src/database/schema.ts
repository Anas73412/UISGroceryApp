import { appSchema, tableSchema } from '@nozbe/watermelondb';
import { DB_TABLES } from '../utils/constants';

export const schema = appSchema({
  version: 2,
  tables: [
    tableSchema({
      name: DB_TABLES.USER_TABLE,
      columns: [
        { name: 'name', type: 'string' },
        { name: 'uid', type: 'number' },
        { name: 'mobile', type: 'string' },
        { name: 'profile', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'isWifiUser', type: 'number' },
        { name: 'deviceToken', type: 'string', isOptional: true },
        { name: 'plan_id', type: 'number', isOptional: true },
        { name: 'address', type: 'string', isOptional: true },
        { name: 'status', type: 'number', isOptional: true },
      ],
    }),

    tableSchema({
      name: DB_TABLES.CONFIG_TABLE,
      columns: [
        { name: 'configId', type: 'number' },
        { name: 'configKey', type: 'string' },
        { name: 'configValue', type: 'string' },
        { name: 'status', type: 'number' },
        { name: 'createdAt', type: 'number' },
        { name: 'modifiedAt', type: 'number', isOptional: true },
      ],
    }),

    tableSchema({
      name: DB_TABLES.CART_TABLE,
      columns: [
        { name: 'uId', type: 'number' },
        { name: 'cartId', type: 'number' },
        { name: 'productId', type: 'number' },
        { name: 'quantity', type: 'number' },
        { name: 'userId', type: 'number' },
        { name: 'status', type: 'number' },
        { name: 'createdAt', type: 'number' },
        { name: 'modifiedAt', type: 'number', isOptional: true },
      ],
    }),

    tableSchema({
      name: DB_TABLES.ADDRESS_TABLE,
      columns: [
        { name: 'uId', type: 'number' },
        { name: 'addressId', type: 'number' },
        { name: 'userId', type: 'number' },
        { name: 'houseNo', type: 'string' },
        { name: 'buildingName', type: 'string' },
        { name: 'landmark', type: 'string' },
        { name: 'addressType', type: 'number' },
        { name: 'otherAddressType', type: 'string' },
        { name: 'receiverName', type: 'string', isOptional: true },
        { name: 'receiverMobile', type: 'string', isOptional: true },
        { name: 'status', type: 'number' },
        { name: 'pincode', type: 'string' },
        { name: 'latitude', type: 'string' },
        { name: 'longtitude', type: 'string' },
        { name: 'mapAddress', type: 'string' },
        { name: 'distance', type: 'number' },
      ],
    }),

    tableSchema({
      name: DB_TABLES.DELIVERY_CHARGE_TABLE,
      columns: [
        { name: 'uId', type: 'number' },
        { name: 'rateId', type: 'number' },
        { name: 'amount', type: 'number' },
        { name: 'distance', type: 'string' },
        { name: 'deliveryTime', type: 'string' },
      ],
    }),
  ],
});

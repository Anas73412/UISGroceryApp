import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { DATABASE_NAME } from '../utils/constants';
import { schema } from '../database/schema';
import { Database } from '@nozbe/watermelondb';
import { UserModel } from '../data/models/UserModel';
import { ConfigModel } from '../data/models/ConfigModel';
import { CartModel } from '../data/models/CartModel';
import migrations from '../database/migrations';
import { AddressModel } from '../data/models/AddressModel';
import { DeliveryChargesModel } from '../data/models/DeliveryChargesModel';

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  dbName: DATABASE_NAME,
});

export const database = new Database({
  adapter,
  modelClasses: [
    UserModel,
    ConfigModel,
    CartModel,
    AddressModel,
    DeliveryChargesModel,
  ],
});

import SQLiterAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { DATABASE_NAME } from '../utils/constants';
import { schema } from '../database/schema';
import { Database } from '@nozbe/watermelondb';
import { UserModel } from '../data/models/UserModel';
import { ConfigModel } from '../data/models/ConfigModel';

const adapter = new SQLiterAdapter({
    dbName: DATABASE_NAME,
    schema
});

export const database = new Database({
    adapter,
    modelClasses:[UserModel, ConfigModel]
});
import { appSchema, tableSchema } from '@nozbe/watermelondb';
import { DB_TABLES } from '../utils/constants';

export const schema = appSchema({
  version: 1,
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
  ],
});

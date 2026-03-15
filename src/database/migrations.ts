import { schemaMigrations, addColumns } from '@nozbe/watermelondb/Schema/migrations';
import { DB_TABLES } from '../utils/constants';

export default schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        addColumns({
          table: DB_TABLES.CART_TABLE,
          columns: [{ name: 'uId', type: 'number', isOptional: true }],
        }),
      ],
    },
  ],
});

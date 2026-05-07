import { database } from '../../database';
import { DB_TABLES } from '../../utils/constants';

class SettingRepository {
  async clearAllLocalData(): Promise<boolean> {
    try {
      await database.write(async () => {
        const tables = [
          DB_TABLES.USER_TABLE,
          DB_TABLES.CART_TABLE,
          DB_TABLES.CONFIG_TABLE,
          DB_TABLES.ADDRESS_TABLE,
        ];
        for (const tableName of tables) {
          await database.get(tableName).query().destroyAllPermanently();
        }
      });

      const userCount = await database
        .get(DB_TABLES.USER_TABLE)
        .query()
        .fetchCount();

      const configCount = await database
        .get(DB_TABLES.CONFIG_TABLE)
        .query()
        .fetchCount();

      return userCount === 0 && configCount == 0;
    } catch (error) {
      console.error('Failed to clear database:', error);
      return false;
    }
  }
}

export default new SettingRepository();

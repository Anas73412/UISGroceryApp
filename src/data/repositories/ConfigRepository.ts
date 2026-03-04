import { database } from '../../database';
import { DB_TABLES } from '../../utils/constants';
import { ConfigModel, type ConfigItem } from '../models/ConfigModel';
import { Q } from '@nozbe/watermelondb';

class ConfigRepository {
  async saveConfigInDB(config: ConfigItem) {
    return database.write(async () => {
      return await database.get(DB_TABLES.CONFIG_TABLE).create((newConfig) => {
        newConfig.configId = config.configId;
        newConfig.configKey = config.configKey;
        newConfig.configValue = config.configValue;
        newConfig.status = config.status;
        newConfig.createdAt = config.createdAt;
        newConfig.modifiedAt = config.modifiedAt;
      });
    });
  }

  async saveAllConfigs(configs: ConfigItem[]) {
    return database.write(async () => {
      const table = database.get(DB_TABLES.CONFIG_TABLE);
      const existing = await table.query().fetch();
      await Promise.all(existing.map((record) => record.destroyPermanently()));
      for (const config of configs) {
        await table.create((newConfig) => {
          newConfig.configId = config.configId;
          newConfig.configKey = config.configKey;
          newConfig.configValue = config.configValue;
          newConfig.status = config.status;
          newConfig.createdAt = config.createdAt;
          newConfig.modifiedAt = config.modifiedAt;
        });
      }
    });
  }

  async getConfigByKeyFromDB(configKey: string): Promise<ConfigModel | null> {
        const configs = await database.get(DB_TABLES.CONFIG_TABLE).query(Q.where('configKey', configKey)).fetch();
        return configs.length > 0 ? configs[0] as ConfigModel : null;
    }
}

export default new ConfigRepository();
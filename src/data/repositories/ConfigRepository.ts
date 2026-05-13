import { database } from '../../database';
import { DB_TABLES } from '../../utils/constants';
import { ConfigModel, type ConfigItem } from '../models/ConfigModel';
import { Q } from '@nozbe/watermelondb';
import { DeliveryChargesModel } from '../models/DeliveryChargesModel';

class ConfigRepository {
  async saveConfigInDB(config: ConfigItem) {
    return database.write(async () => {
      return await database.get(DB_TABLES.CONFIG_TABLE).create(record => {
        const newConfig = record as ConfigModel;
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
      await Promise.all(existing.map(record => record.destroyPermanently()));
      for (const config of configs) {
        await table.create(record => {
          const newConfig = record as ConfigModel;
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
    const configs = await database
      .get(DB_TABLES.CONFIG_TABLE)
      .query(Q.where('configKey', configKey))
      .fetch();
    return configs.length > 0 ? (configs[0] as ConfigModel) : null;
  }

  async saveAllDeliveryCharges(charges: DeliveryChargesModel[]) {
    return database.write(async () => {
      const table = database.get(DB_TABLES.DELIVERY_CHARGE_TABLE);
      const existing = await table.query().fetch();
      await Promise.all(existing.map(record => record.destroyPermanently()));
      for (const charge of charges) {
        await table.create(record => {
          const newCharge = record as DeliveryChargesModel;
          console.log('Saving delivery charge:', charge);
          newCharge.uId = charge.uId;
          newCharge.amount = charge.amount;
          newCharge.distance = charge.distance;
          newCharge.rateId = charge.rateId;
          newCharge.deliveryTime = charge.deliveryTime;
        });
      }
    });
  }

  async saveDeliveryChargeInDB(config: DeliveryChargesModel) {
    return database.write(async () => {
      return await database
        .get(DB_TABLES.DELIVERY_CHARGE_TABLE)
        .create(record => {
          const newCharge = config as DeliveryChargesModel;
          newCharge.uId = config.uId;
          newCharge.amount = config.amount;
          newCharge.distance = config.distance;
          newCharge.rateId = config.rateId;
          newCharge.deliveryTime = config.deliveryTime;
        });
    });
  }
  async getDeliveryChargesFromDB(): Promise<DeliveryChargesModel[] | []> {
    const configs = await database
      .get(DB_TABLES.DELIVERY_CHARGE_TABLE)
      .query()
      .fetch();
    return configs.length > 0 ? (configs as DeliveryChargesModel[]) : [];
  }

  async getDeliveryChargeFromDB(
    rateId: number,
  ): Promise<DeliveryChargesModel | null> {
    const configs = await database
      .get(DB_TABLES.DELIVERY_CHARGE_TABLE)
      .query(Q.where('rateId', rateId))
      .fetch();
    return configs.length > 0 ? (configs[0] as DeliveryChargesModel) : null;
  }
}

export default new ConfigRepository();

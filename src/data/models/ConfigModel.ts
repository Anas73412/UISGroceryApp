import { Model } from '@nozbe/watermelondb';
import { DB_TABLES } from '../../utils/constants';
import { field } from '@nozbe/watermelondb/decorators';

export interface ConfigItem {
  configId: number;
  configKey: string;
  configValue: string;
  status: number;
  createdAt: string;
  modifiedAt?: string;
}

export class ConfigModel extends Model {
   static table: string = DB_TABLES.CONFIG_TABLE;
  
   @field('configId') configId!:number;
   @field('configKey') configKey!:string;
   @field('configValue') configValue!:string;
   @field('status') status!:number;
   @field('createdAt') createdAt?:string;
   @field('modifiedAt') modifiedAt?:string;

};


import Keychain from 'react-native-keychain';
type PrefMap = Record<string, unknown>;

export class GenericPrefRepository<T extends PrefMap> {
  private inMemoryBucket: Partial<T> | null = null;

  constructor(private readonly service: string, private readonly defaults: T) {}

  private async readBucket(): Promise<T> {
    try {
      const cred = await Keychain.getGenericPassword({ server: this.service });
      if (cred) {
        const parsed = JSON.parse(cred.password) as Partial<T>;
        if (parsed && typeof parsed === 'object') {
          this.inMemoryBucket = { ...this.defaults, ...parsed } as T;
          return this.inMemoryBucket as T;
        }
      }

      if (this.inMemoryBucket) {
        return { ...this.defaults, ...this.inMemoryBucket } as T;
      }

      return this.defaults;
    } catch (error) {
      if (this.inMemoryBucket) {
        return { ...this.defaults, ...this.inMemoryBucket } as T;
      }
      return this.defaults;
    }
  }

  private async writeBucket(data: T): Promise<void> {
    this.inMemoryBucket = { ...this.defaults, ...data };
    await Keychain.setGenericPassword(
      this.service,
      JSON.stringify(this.inMemoryBucket),
      {
        server: this.service,
      },
    );
  }

  async set<K extends keyof T>(key: K, value: T[K]): Promise<void> {
    const bucket = await this.readBucket();
    bucket[key] = value;
    await this.writeBucket(bucket);
  }

  async get<K extends keyof T>(key: K): Promise<T[K]> {
    const bucket = await this.readBucket();
    return bucket[key];
  }

  async setMany(values: Partial<T>): Promise<void> {
    const bucket = await this.readBucket();
    await this.writeBucket({ ...bucket, ...values });
  }

  async getAll(): Promise<T> {
    return await this.readBucket();
  }

  async clear(): Promise<void> {
    this.inMemoryBucket = null;
    await Keychain.resetGenericPassword({ server: this.service });
  }
}
export const PREF_KEYS = {
  SELECTED_ADDRESS_ID: 'selectedAddressId',
  LATTITUDE: 'lattitude',
  LONGITUDE: 'longitude',
  ACTIVE_ORDER_KEY: 'activeOrderKey',
  ACTIVE_ORDER_ID: 'activeOrderId',
  CURR_ORDER_ID: 'currOrderId',
  CURR_ORDER_KEY: 'currOrderKey',
} as const;

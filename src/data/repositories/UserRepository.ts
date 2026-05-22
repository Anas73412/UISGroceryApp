import { UserModel, UserResponseModel } from '../models/UserModel';
import { database } from '../../database';
import { DB_TABLES } from '../../utils/constants';

function applyUserFields(record: UserModel, user: UserResponseModel) {
  record.name = user.name ?? '';
  record.mobile = user.mobile ?? '';
  record.uid = user.id ?? 0;
  record.profile = user.profile ?? '';
  record.createdAt = user.created_at ?? undefined;
  record.isWifiUser = user.isWiFiUser ?? 0;
  record.address = user.Address ?? '';
  record.planId = user.plan_id ?? 0;
  record.deviceToken = user.deviceToken ?? '';
  record.status = user.status ?? 0;
}

class UserRepository {
  async saveUserInDB(user: UserResponseModel) {
    const uid = user.id ?? 0;
    return database.write(async () => {
      const table = database.get(DB_TABLES.USER_TABLE);
      const existing = await table.query().fetch();
      const match = existing.find(
        record => (record as UserModel).uid === uid,
      ) as UserModel | undefined;

      if (match) {
        await match.update(record => {
          applyUserFields(record as UserModel, user);
        });
        return match;
      }

      if (existing.length > 0) {
        await Promise.all(
          existing.map(record => record.destroyPermanently()),
        );
      }

      return table.create(userModel => {
        applyUserFields(userModel as UserModel, user);
      });
    });
  }

  async getAllUsersFromDB() {
    return database.get(DB_TABLES.USER_TABLE).query().fetch();
  }

  async getCurrentUser(): Promise<UserModel | null> {
    const users = await this.getAllUsersFromDB();
    return users.length > 0 ? (users[0] as UserModel) : null;
  }

  async getUserByUidFromDB(uid: number): Promise<UserModel | null> {
    const users = await this.getAllUsersFromDB();
    const match = users.find(record => (record as UserModel).uid === uid);
    return match ? (match as UserModel) : null;
  }
}

export default new UserRepository();

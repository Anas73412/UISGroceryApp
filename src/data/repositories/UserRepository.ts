import { UserModel, UserResponseModel } from '../models/UserModel';
import { database } from '../../database';
import { DB_TABLES } from '../../utils/constants';
import { Q } from '@nozbe/watermelondb';

class UserRepository {
  async saveUserInDB(user: UserResponseModel) {
    return database.write(async () => {
      const table = database.get(DB_TABLES.USER_TABLE);
      const existing = await table.query().fetch();
      await Promise.all(existing.map(record => record.destroyPermanently()));
      return await table.create(userModel => {
        const newUser = userModel as UserModel;
        newUser.name = user.name ?? '';
        newUser.mobile = user.mobile ?? '';
        newUser.uid = user.id ?? 0;
        newUser.profile = user.profile ?? '';
        newUser.createdAt = user.created_at ?? undefined;
        newUser.isWifiUser = user.isWiFiUser ?? 0;
        newUser.address = user.address ?? '';
        newUser.planId = user.plan_id ?? 0;
        newUser.deviceToken = user.deviceToken ?? '';
        newUser.status = user.status ?? 0;
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

  async getUserByEmailFromDB(uid: number): Promise<UserModel | null> {
    const users = await database
      .get(DB_TABLES.USER_TABLE)
      .query(Q.where('uid', uid))
      .fetch();
    return users.length > 0 ? (users[0] as UserModel) : null;
  }
}

export default new UserRepository();

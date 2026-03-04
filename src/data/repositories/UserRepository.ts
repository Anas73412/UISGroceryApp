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
      return await table.create(newUser => {
        newUser.name = user.name;
        newUser.email = user.email;
        newUser.uid = user.uid;
        newUser.hashedPassword = user.hashedPassword;
        newUser.profilePictureUrl = user.profilePictureUrl;
        newUser.createdAt = user.createdAt;
      });
    });
  }

  async getAllUsersFromDB() {
    return database.get(DB_TABLES.USER_TABLE).query().fetch();
  }

  async getUserByEmailFromDB(email: string): Promise<UserModel | null> {
    const users = await database
      .get(DB_TABLES.USER_TABLE)
      .query(Q.where('email', email))
      .fetch();
    return users.length > 0 ? (users[0] as UserModel) : null;
  }
}

export default new UserRepository();

import Keychain from 'react-native-keychain';
import { SERVICE_AUTH_CREDENTIALS } from '../../utils/constants';

class AuthRepository {
  async saveToken(mobile: string, token: string) {
    await Keychain.setGenericPassword(mobile, token, {
      server: SERVICE_AUTH_CREDENTIALS,
    });
  }

  async getToken(): Promise<string | null> {
    const credentials = await Keychain.getGenericPassword({
      server: SERVICE_AUTH_CREDENTIALS,
    });
    if (credentials) {
      return credentials.password;
    } else {
      return null;
    }
  }

  async getCredentials(): Promise<{ mobile: string; token: string } | null> {
    const credentials = await Keychain.getGenericPassword({
      server: SERVICE_AUTH_CREDENTIALS,
    });
    if (credentials) {
      return { mobile: credentials.username, token: credentials.password };
    }
    return null;
  }

  async isLoggedIn(): Promise<boolean> {
    const token = await this.getToken();
    return token !== null;
  }

  async clearToken() {
    await Keychain.resetGenericPassword({ server: SERVICE_AUTH_CREDENTIALS });
  }
}

export default new AuthRepository();

import Keychain from 'react-native-keychain';
import { SERVICE_AUTH_CREDENTIALS } from '../../utils/constants';

class AuthRepository {
    async saveToken(email: string, token: string) {
        await Keychain.setGenericPassword(email, token,{server:SERVICE_AUTH_CREDENTIALS});
    }

    async getToken():Promise<string|null>{
        const credentials = await Keychain.getGenericPassword({server:SERVICE_AUTH_CREDENTIALS});
        if (credentials) {
            return credentials.password;
        } else {
            return null;
        }
    }

    async isLoggedIn():Promise<boolean>{
        const token = await this.getToken();
        return token !== null;
    }

    async clearToken(){
        await Keychain.resetGenericPassword({server:SERVICE_AUTH_CREDENTIALS});
    }
}

export default new AuthRepository();
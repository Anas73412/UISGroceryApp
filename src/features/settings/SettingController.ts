import { clearAllSessionData } from '../../services/sessionLifecycle';

export const SettingController = {
  async logout(): Promise<boolean> {
    return clearAllSessionData();
  },
};

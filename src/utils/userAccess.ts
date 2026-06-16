import type { UserModel } from '../data/models/UserModel';

type WiFiUserLike =
  | Pick<UserModel, 'isWifiUser'>
  | { isWiFiUser?: number | boolean | null }
  | null
  | undefined;

/** WiFi users (isWiFiUser === 1 or true) get Plan tab and extra settings sections. */
export function isWiFiUserEnabled(user: WiFiUserLike): boolean {
  if (!user) return false;

  const value =
    'isWifiUser' in user
      ? user.isWifiUser
      : 'isWiFiUser' in user
        ? user.isWiFiUser
        : 0;

  return value === 1 || value === true;
}

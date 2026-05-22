import AuthRepository from '../data/repositories/AuthRepository';
import { appPrefs } from '../data/repositories/AppPrefRepository';
import SettingRepository from '../data/repositories/SettingRepository';
import { cartStore } from '../store/cartStore';
import { sessionStore } from '../store/sessionStore';

/** Clears in-memory session, credentials, local DB user/cart data, and session prefs. Keeps permissionsRequested. */
export async function clearAllSessionData(): Promise<boolean> {
  sessionStore.getState().clearSession();
  cartStore.getState().clearCart();

  try {
    await AuthRepository.clearToken();
    await appPrefs.setMany({
      cachedUserId: 0,
      selectedAddressId: 0,
      lattitude: null,
      longitude: null,
      activeOrderKey: null,
      activeOrderId: 0,
    });
    return await SettingRepository.clearAllLocalData();
  } catch (error) {
    console.error('Failed to clear session data:', error);
    return false;
  }
}

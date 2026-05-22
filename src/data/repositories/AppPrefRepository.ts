import { APP_UIS_PREFS } from '../../utils/constants';
import { GenericPrefRepository } from './GenericPrefRepository';

type AppPrefs = {
  selectedAddressId: number | 0;
  lattitude: number | null;
  longitude: number | null;
  permissionsRequested: boolean;
  cachedUserId: number;
  activeOrderKey: string | null;
  activeOrderId: number;
};

export const appPrefs = new GenericPrefRepository<AppPrefs>(APP_UIS_PREFS, {
  selectedAddressId: 0,
  lattitude: null,
  longitude: null,
  permissionsRequested: false,
  cachedUserId: 0,
  activeOrderKey: null,
  activeOrderId: 0,
});

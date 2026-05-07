import { APP_UIS_PREFS } from '../../utils/constants';
import { GenericPrefRepository } from './GenericPrefRepository';

type AppPrefs = {
  selectedAddressId: number | 0;
  lattitude: number | null;
  longitude: number | null;
};

export const appPrefs = new GenericPrefRepository<AppPrefs>(APP_UIS_PREFS, {
  selectedAddressId: 0,
  lattitude: null,
  longitude: null,
});

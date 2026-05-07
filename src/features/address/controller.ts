import AddressRepository from '../../data/repositories/AddressRepository';
import { sessionStore } from '../../store/sessionStore';
import { FAILED, SUCCESS } from '../../utils/constants';
import { addressService } from './service';

export const addressController = {
  async fetchAddressList() {
    try {
      const userId = sessionStore.getState().user?.uid ?? 0;
      const res = await addressService.getAddressList(userId);
      if (res.status === SUCCESS && res.data !== null) {
        if (res.data.length > 0) {
          await AddressRepository.saveAllAddressInDB(res.data ?? []);
        }
      }
      return res;
    } catch (error) {
      return {
        status: FAILED,
        data: null,
        message: (error as Error).message || 'Failed to load address list',
      };
    }
  },
};

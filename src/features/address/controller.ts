import { AddressResponseModel } from '../../data/models/AddressModel';
import AddressRepository from '../../data/repositories/AddressRepository';
import ConfigRepository from '../../data/repositories/ConfigRepository';
import { sessionStore } from '../../store/sessionStore';
import { CONFIG_KEYS, FAILED, SUCCESS } from '../../utils/constants';
import { distanceInKm } from '../../utils/utils';
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

  async addAddressToServer(addressData: AddressResponseModel) {
    try {
      const userId = sessionStore.getState().user?.uid ?? 0;
      const res = await addressService.addCustomerAddress(
        userId,
        addressData.buildingName,
        addressData.pincode,
        addressData.addressType,
        addressData.receiverName,
        addressData.receiverMobile,
        addressData.houseNo,
        addressData.otherAddressType,
        addressData.landmark,
        addressData.status,
        addressData.latitude,
        addressData.longtitude,
        addressData.mapAddress,
        addressData.distance,
      );
      if (res.status === SUCCESS) {
        await AddressRepository.saveAddressInDB(addressData);
      }
      return res;
    } catch (error) {
      return {
        status: FAILED,
        data: null,
        message: (error as Error).message || 'Failed to add address',
      };
    }
  },

  async updateAddressOnServer(addressData: AddressResponseModel) {
    try {
      const userId = sessionStore.getState().user?.uid ?? 0;
      const res = await addressService.updateCustomerAddress(
        addressData.addressId,
        userId,
        addressData.buildingName,
        addressData.pincode,
        addressData.addressType,
        addressData.receiverName,
        addressData.receiverMobile,
        addressData.houseNo,
        addressData.otherAddressType,
        addressData.landmark,
        addressData.status,
        addressData.latitude,
        addressData.longtitude,
        addressData.mapAddress,
        addressData.distance,
      );
      if (res.status === SUCCESS) {
        await AddressRepository.updateAddressInDB(
          userId,
          addressData.addressId,
          addressData,
        );
      }
      return res;
    } catch (error) {
      return {
        status: FAILED,
        data: null,
        message: (error as Error).message || 'Failed to update address',
      };
    }
  },

  async findDistanceRangeInKM(
    currantLat: number,
    currentLng: number,
  ): Promise<number | null> {
    try {
      const configLat = await ConfigRepository.getConfigByKeyFromDB(
        CONFIG_KEYS.DEFAULT_LATITUDE,
      );
      const configLng = await ConfigRepository.getConfigByKeyFromDB(
        CONFIG_KEYS.DEFAULT_LONGITUDE,
      );

      if (configLat && configLng) {
        const lat = parseFloat(configLat.configValue);
        const lng = parseFloat(configLng.configValue);
        const chargesList = await ConfigRepository.getDeliveryChargesFromDB();

        if (chargesList.length > 0) {
          const distance = distanceInKm(lat, lng, currantLat, currentLng);

          const index = chargesList.findIndex(range => {
            const parts = range.distance
              ?.split('-')
              .map(s => s.trim())
              .map(s => Number.parseFloat(s))
              .filter(n => !Number.isNaN(n));

            if (!parts || parts.length !== 2) return false;
            const [min, max] = parts;
            return distance >= min && distance <= max;
          });
          return index === -1 ? null : index;
        }
        return null;
      }
      return null;
    } catch (error) {
      return null;
    }
  },

  async findRateIdForDistanceRange(
    distanceRangeIndex: number,
  ): Promise<number | null> {
    try {
      const chargesList = await ConfigRepository.getDeliveryChargesFromDB();
      return chargesList[distanceRangeIndex]?.rateId ?? null;
    } catch (error) {
      return null;
    }
  },

  async deleteAddressOnServer(addressId: number) {
    try {
      const userId = sessionStore.getState().user?.uid ?? 0;
      const res = await addressService.deleteCustomerAddress(addressId, userId);
      if (res.status === SUCCESS) {
        await AddressRepository.deleteAddressFromDB(userId, addressId);
      }
      return res;
    } catch (error) {
      return {
        status: FAILED,
        data: null,
        message: (error as Error).message || 'Failed to delete address',
      };
    }
  },
};

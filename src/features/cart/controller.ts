import { cartStore } from '../../store/cartStore';
import { cartApiService } from './cartApiService';
import { mapErrorResponse } from '../auth/screens/login/service';
import { ApiResponseModel } from '../../services/types';
import { CartProductModel } from '../home/components/ProductCard';
import { AddressResponseModel } from '../../data/models/AddressModel';
import AddressRepository from '../../data/repositories/AddressRepository';
import { use } from 'react';
import { sessionStore } from '../../store/sessionStore';
import ConfigRepository from '../../data/repositories/ConfigRepository';
import { CONFIG_KEYS, FAILED, SUCCESS } from '../../utils/constants';
import { addressController } from '../address/controller';
import { DeliveryChargesModel } from '../../data/models/DeliveryChargesModel';
import { splashService } from '../splash/service';
import axios from 'axios';

export const cartController = {
  async fetchUserCart(): Promise<ApiResponseModel<CartProductModel[]>> {
    try {
      return await cartApiService.getUserCartList();
    } catch (error) {
      return mapErrorResponse<CartProductModel[]>(error);
    }
  },

  clearCart() {
    cartStore.getState().clearCart();
  },

  async getAddressListFromDB(): Promise<AddressResponseModel[] | []> {
    try {
      const userId = (await sessionStore.getState()?.user?.uid) ?? 0;
      const addressList = await AddressRepository.getAllUserAddressDetails(
        userId,
      );
      return addressList;
    } catch (error) {
      return [];
    }
  },

  async getSmallCartMinCharge(): Promise<number | 0> {
    try {
      const smartCartCharge = await ConfigRepository.getConfigByKeyFromDB(
        CONFIG_KEYS.SMALL_CART_MIN_AMOUNT,
      );
      return smartCartCharge?.configValue
        ? parseFloat(smartCartCharge.configValue)
        : 0;
    } catch (error) {
      return 0;
    }
  },
  async getSmallCartAmount(): Promise<number | 0> {
    try {
      const smartCartCharge = await ConfigRepository.getConfigByKeyFromDB(
        CONFIG_KEYS.SMALL_CART_AMOUNT,
      );
      console.log('Fetched smart cart charge from DB:', smartCartCharge);
      return smartCartCharge?.configValue
        ? parseFloat(smartCartCharge.configValue)
        : 0;
    } catch (error) {
      return 0;
    }
  },

  async findDeliveryRateId(lat1: number, lon1: number): Promise<number | null> {
    try {
      const distance = await addressController.findDistanceRangeInKM(
        lat1,
        lon1,
      );
      const locRateId = await addressController.findRateIdForDistanceRange(
        distance ?? -1,
      );
      return locRateId;
    } catch (error) {
      return null;
    }
  },

  async fetchDeliveryCharge(
    rateId: number,
  ): Promise<DeliveryChargesModel | null> {
    try {
      const charge = await ConfigRepository.getDeliveryChargeFromDB(rateId);
      return charge;
    } catch (error) {
      return null;
    }
  },

  async loadAppConfig() {
    try {
      const configList = await ConfigRepository.getConfigsFromDB();
      if (configList.length <= 0) {
        const res = await splashService.fetchAppConfig();

        if (res.status === SUCCESS && res.data && Array.isArray(res.data)) {
          await ConfigRepository.saveAllConfigs(res.data);
          return res;
        } else {
          return {
            status: FAILED,
            message: res.message || 'Failed to load app configuration',
          };
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Axios error details:', {
          message: error.message,
          code: error.code,
          url: error.config?.url,
        });
      } else {
        console.log('Non-axios error:', error);
      }

      return {
        status: FAILED,
        message: (error as Error).message || 'Failed to load app configuration',
      };
    }
  },
};

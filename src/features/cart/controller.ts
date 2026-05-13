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
import { CONFIG_KEYS } from '../../utils/constants';
import { addressController } from '../address/controller';
import { DeliveryChargesModel } from '../../data/models/DeliveryChargesModel';

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
      console.log('Fetched smart cart charge from DB:', smartCartCharge);
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
};

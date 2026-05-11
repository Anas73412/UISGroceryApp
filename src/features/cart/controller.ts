import { cartStore } from '../../store/cartStore';
import { cartApiService } from './cartApiService';
import { mapErrorResponse } from '../auth/screens/login/service';
import { ApiResponseModel } from '../../services/types';
import { CartProductModel } from '../home/components/ProductCard';
import { AddressResponseModel } from '../../data/models/AddressModel';
import AddressRepository from '../../data/repositories/AddressRepository';
import { use } from 'react';
import { sessionStore } from '../../store/sessionStore';

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
};

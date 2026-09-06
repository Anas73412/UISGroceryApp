import { map } from '@nozbe/watermelondb/utils/rx';
import { AddressResponseModel } from '../../data/models/AddressModel';
import { ApiResponseModel } from '../../services/types';
import { mapErrorResponse, mapResponse } from '../auth/screens/login/service';
import { apiClient } from '../../services/apiClient';
import { API_ENDPOINTS } from '../../utils/constants';

export const addressService = {
  async getAddressList(
    userId: number,
  ): Promise<ApiResponseModel<AddressResponseModel[] | []>> {
    try {
      const res = await apiClient.post<{ data: AddressResponseModel[] }>(
        API_ENDPOINTS.USER_ADDRESS_LIST,
        { userId },
      );

      return mapResponse<AddressResponseModel[]>(res);
    } catch (error) {
      return mapErrorResponse(error);
    }
  },

  async addCustomerAddress(
    userId: number,
    buildingName: string,
    pincode: string,
    addressType: number,
    receiverName: string,
    receiverMobile: string,
    houseNo: string,
    otherAddressType: string,
    landmark: string,
    status: number,
    latitude: string,
    longtitude: string,
    mapAddress: string,
    distance: number,
  ): Promise<ApiResponseModel<string>> {
    try {
      const res = await apiClient.post<{ data: string }>(
        API_ENDPOINTS.ADD_CUSTOMER_ADDRESS,
        {
          userId,
          buildingName,
          pincode,
          addressType,
          receiverName,
          receiverMobile,
          houseNo,
          otherAddressType,
          landmark,
          status,
          latitude,
          longtitude,
          mapAddress,
          distance,
        },
      );
      return mapResponse<string>(res);
    } catch (error) {
      return mapErrorResponse(error);
    }
  },

  async updateCustomerAddress(
    addressId: number,
    userId: number,
    buildingName: string,
    pincode: string,
    addressType: number,
    receiverName: string,
    receiverMobile: string,
    houseNo: string,
    otherAddressType: string,
    landmark: string,
    status: number,
    latitude: string,
    longtitude: string,
    mapAddress: string,
    distance: number,
  ): Promise<ApiResponseModel<string>> {
    try {
      const res = await apiClient.post<{ data: string }>(
        API_ENDPOINTS.UPDATE_CUSTOMER_ADDRESS,
        {
          addressId,
          userId,
          buildingName,
          pincode,
          addressType,
          receiverName,
          receiverMobile,
          houseNo,
          otherAddressType,
          landmark,
          status,
          latitude,
          longtitude,
          mapAddress,
          distance,
        },
      );
      return mapResponse<string>(res);
    } catch (error) {
      return mapErrorResponse(error);
    }
  },
  async deleteCustomerAddress(
    addressId: number,
    userId: number,
  ): Promise<ApiResponseModel<string>> {
    try {
      const res = await apiClient.post<{ data: string }>(
        API_ENDPOINTS.DELETE_CUSTOMER_ADDRESS,
        {
          addressId,
          userId,
        },
      );
      return mapResponse<string>(res);
    } catch (error) {
      return mapErrorResponse(error);
    }
  },
};

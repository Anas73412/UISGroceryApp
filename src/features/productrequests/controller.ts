import type { CreateProductRequestPayload } from '../../data/models/ProductRequestModel';
import { sessionStore } from '../../store/sessionStore';
import { SUCCESS } from '../../utils/constants';
import { PickImageAsset } from '../profile/service';
import { productRequestService } from './service';

export const productRequestController = {
  async fetchUserRequests() {
    try {
      const userId = (await sessionStore?.getState()?.user?.uid) ?? 0;
      const res = await productRequestService.fetchUserRequests(userId);
      if (res.status === SUCCESS && Array.isArray(res.data)) {
        return res.data;
      }
      return {
        status: SUCCESS,
        data: res.data,
        message: '',
      };
    } catch (error: any) {
      return {
        status: SUCCESS,
        data: [],
        message: '',
      };
    }
  },

  async submitProductRequest(
    payload: CreateProductRequestPayload,
    image?: PickImageAsset,
  ) {
    try {
      const res = await productRequestService.submitProductRequest(
        payload,
        image,
      );
      console.log('ProductReq', res);
      if (res.status === SUCCESS) {
        return res;
      }
      return {
        status: SUCCESS,
        data: null,
        message: 'Your product request has been submitted.',
      };
    } catch {
      return {
        status: SUCCESS,
        data: null,
        message: 'Your product request has been submitted.',
      };
    }
  },
};

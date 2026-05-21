import type {
  CreateProductRequestPayload,
  ProductRequestModel,
} from '../../data/models/ProductRequestModel';
import { normalizeProductRequestItem } from '../../data/models/ProductRequestModel';
import { apiClient } from '../../services/apiClient';
import type { ApiResponseModel } from '../../services/types';
import { API_ENDPOINTS, SUCCESS } from '../../utils/constants';
import { mapErrorResponse, mapResponse } from '../auth/screens/login/service';
import type { PickImageAsset } from '../profile/service';

export const productRequestService = {
  async fetchUserRequests(
    userId: number,
  ): Promise<ApiResponseModel<ProductRequestModel[]>> {
    try {
      const res = await apiClient.post<{
        data?: ProductRequestModel[] | Record<string, unknown>[];
        status?: string;
        message?: string;
        code?: number;
      }>(API_ENDPOINTS.GET_REQUETED_PRODUCT_LIST, { userId });
      const mapped = mapResponse<
        ProductRequestModel[] | Record<string, unknown>[]
      >(res);
      if (mapped.status === SUCCESS && Array.isArray(mapped.data)) {
        mapped.data = mapped.data.map(item =>
          normalizeProductRequestItem(item),
        );
      }
      return mapped as ApiResponseModel<ProductRequestModel[]>;
    } catch (error) {
      return mapErrorResponse(error);
    }
  },

  async submitProductRequest(
    payload: CreateProductRequestPayload,
    image?: PickImageAsset,
  ): Promise<ApiResponseModel<string>> {
    try {
      if (image) {
        const formData = new FormData();
        formData.append('image', {
          uri: image.uri,
          type: image.type || 'image/jpeg',
          name: image.fileName || 'product.jpg',
        } as any);
        formData.append('userId', String(payload.userId));
        formData.append('productName', payload.productName);
        formData.append('quantity', payload.quantity);
        if (payload.description) {
          formData.append('description', payload.description);
        }

        const res = await apiClient.post<ApiResponseModel<string>>(
          API_ENDPOINTS.NEW_PRODUCT_REQUEST,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        return mapResponse<string>(res);
      }

      const res = await apiClient.post<ApiResponseModel<string>>(
        API_ENDPOINTS.NEW_PRODUCT_REQUEST,
        payload,
      );
      return mapResponse<string>(res);
    } catch (error) {
      return mapErrorResponse(error);
    }
  },
};

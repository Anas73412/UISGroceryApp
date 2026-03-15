import { measure } from 'react-native-reanimated';
import { CartResponseModel } from '../../data/models/CartModel';
import { ResponseModel } from '../../data/reponses/ResponseModel';
import { cartStore } from '../../store/cartStore';
import { sessionStore } from '../../store/sessionStore';
import { SUCCESS } from '../../utils/constants';
import { AddToCartResponse, cartApiService } from './cartApiService';
import { ApiResponseModel } from '../../services/types';

export const cartSyncService = {
  async addOrUpdate(
    product: CartResponseModel,
    quantity: number,
  ): Promise<ResponseModel> {
    const productId = product.productId ?? 0;
    if (!productId) {
      return {
        status: false,
        message: 'Product Not Found',
      };
    }

    try {
      const isNew = (product.cartId ?? 0) === 0;
      const apiRes: ApiResponseModel<AddToCartResponse> = isNew
        ? await cartApiService.addToCart(product.productId, quantity)
        : await cartApiService.updateCartQuantity(
            product.productId,
            quantity,
            product.cartId,
          );

      if (apiRes.status !== SUCCESS)
        return {
          status: false,
          message: apiRes.message,
        };

      const cartModel = await buildCartModel(
        product,
        quantity,
        apiRes?.data?.cartId ?? 0,
      );
      await cartStore.getState().addItem(cartModel);
      return {
        status: true,
        message: apiRes.message,
        cartId: apiRes?.data?.cartId ?? 0,
      };
    } catch (error: any) {
      return {
        status: false,
        message: error?.message,
      };
    }
  },
  async removeCartProduct(
    cartId: number,
    productId: number,
  ): Promise<ResponseModel> {
    try {
      if (cartId === 0) {
        return {
          status: false,
          message: 'Product is not found in cart',
        };
      }

      const apiResponse = await cartApiService.removeCartItem(cartId);
      if (apiResponse.status !== SUCCESS)
        return {
          status: false,
          message: apiResponse.message,
        };

      await cartStore.getState().removeItem(productId);

      return {
        status: true,
        message: apiResponse.message,
      };
    } catch (error: any) {
      return {
        status: false,
        message: error?.message,
      };
    }
  },
};

async function buildCartModel(
  product: CartResponseModel,
  quantity: number,
  cartId?: number,
): Promise<CartResponseModel> {
  const userId = sessionStore.getState().user?.uid ?? 0;

  return {
    id: 0,
    cartId: cartId ?? 0,
    productId: product.productId ?? 0,
    quantity,
    userId,
    status: 1,
    createdAt: String(Date.now()),
    modifiedAt: Date.now().toString(),
  };
}

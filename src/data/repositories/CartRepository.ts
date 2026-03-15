import { Q } from '@nozbe/watermelondb';
import { database } from '../../database';
import { DB_TABLES } from '../../utils/constants';
import { CartModel, CartResponseModel } from '../models/CartModel';
import { ResponseModel } from '../reponses/ResponseModel';

class CartRepository {
  /**
   * Add or update product in cart.
   * If cart item exists (userId + productId), updates quantity.
   * Otherwise inserts a new cart item.
   */
  async addProductInCart(input: CartResponseModel): Promise<ResponseModel> {
    try {
      const { userId, productId, quantity, cartId = 0, status = 1 } = input;
      const now = Date.now();
      database.write(async () => {
        const existingCart = await this.getProductCartDetails(
          userId,
          productId,
        );

        if (existingCart) {
          await existingCart.update((cart: CartModel) => {
            cart.quantity = quantity;
            cart.modifiedAt = String(now);
          });
          return {
            status: true,
            message: 'Cart quantity updated',
          };
        }

        const table = database.get(DB_TABLES.CART_TABLE);
        await table.create(record => {
          const newCart = record as CartModel;
          newCart.uId = 0;
          newCart.cartId = cartId;
          newCart.productId = productId;
          newCart.quantity = quantity;
          newCart.userId = userId;
          newCart.status = status;
          newCart.createdAt = Date.now();
          newCart.modifiedAt = String(Date.now());
        });

        return {
          status: true,
          message: 'Product Added in Cart',
        };
      });
    } catch (error: any) {
      return {
        status: false,
        message: error,
      };
    }
    return {
      status: false,
      message: 'Something went wrong try again',
    };
  }

  async saveProductCartInDB(cart: CartResponseModel) {
    return database.write(async () => {
      return await database.get(DB_TABLES.CART_TABLE).create(record => {
        const newCart = record as CartModel;
        newCart.uId = cart.id;
        newCart.cartId = cart.cartId;
        newCart.productId = cart.productId;
        newCart.quantity = cart.quantity;
        newCart.userId = cart.userId;
        newCart.status = cart.status;
        newCart.createdAt = Number(cart.createdAt);
        newCart.modifiedAt = cart.modifiedAt;
      });
    });
  }

  async saveAllCartInDB(carts: CartResponseModel[]) {
    return database.write(async () => {
      const table = database.get(DB_TABLES.CART_TABLE);
      const existing = await table.query().fetch();
      await Promise.all(existing.map(record => record.destroyPermanently()));
      for (const cart of carts) {
        await table.create(record => {
          const newCart = record as CartModel;
          newCart.uId = cart.id;
          newCart.cartId = cart.cartId;
          newCart.productId = cart.productId;
          newCart.quantity = cart.quantity;
          newCart.userId = cart.userId;
          newCart.status = cart.status;
          newCart.createdAt = Number(cart.createdAt);
          newCart.modifiedAt = cart.modifiedAt;
        });
      }
    });
  }

  async getProductCartDetails(
    userId: number,
    productId: number,
  ): Promise<CartModel | null> {
    const carts = await database
      .get(DB_TABLES.CART_TABLE)
      .query(Q.where('userId', userId), Q.where('productId', productId))
      .fetch();

    return carts.length > 0 ? (carts[0] as CartModel) : null;
  }

  async getUserCartDetails(userId: number): Promise<CartModel[] | []> {
    const carts = await database
      .get(DB_TABLES.CART_TABLE)
      .query(Q.where('userId', userId))
      .fetch();

    return carts.length > 0 ? (carts as CartModel[]) : [];
  }

  async updateCartQuantity(
    userId: number,
    productId: number,
    newQuantity: number,
  ): Promise<boolean> {
    try {
      const existingCart = await this.getProductCartDetails(userId, productId);
      if (existingCart === null) {
        return false;
      }

      await database.write(async () => {
        await existingCart.update((cart: CartModel) => {
          cart.quantity = newQuantity;
          cart.modifiedAt = String(Date.now());
        });
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteCartItem(
    userId: number,
    productId: number,
  ): Promise<ResponseModel> {
    try {
      const existingCart = await this.getProductCartDetails(userId, productId);
      if (existingCart === null) {
        return {
          status: false,
          message: 'Item is not found in cart. Please try again',
        };
      }

      await database.write(async () => {
        await existingCart.destroyPermanently();
      });

      return {
        status: true,
        message: 'Item is removed from cart',
      };
    } catch (error: any) {
      return {
        status: false,
        message: error,
      };
    }
  }
}

export default new CartRepository();

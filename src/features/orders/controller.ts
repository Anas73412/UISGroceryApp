import { use, useId } from 'react';
import { OrderItemModel } from '../../data/models/OrderItemModel';
import { sessionStore } from '../../store/sessionStore';
import { FAILED } from '../../utils/constants';
import { orderService } from './service';

export const OrderController = {
  async getAllUserOrders() {
    try {
      const userId = (await sessionStore?.getState()?.user?.uid) ?? 0;
      const res = orderService.getOrderHistoryList(userId);
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

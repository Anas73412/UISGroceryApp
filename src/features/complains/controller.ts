import type { CreateComplainPayload } from '../../data/models/ComplainDetailModel';
import { sessionStore } from '../../store/sessionStore';
import { FAILED } from '../../utils/constants';
import { complainService } from './service';

export const complainController = {
  async fetchComplainList() {
    try {
      const mobile = sessionStore.getState().user?.mobile ?? '';
      const res = await complainService.getComplainList(mobile);
      return res;
    } catch (error) {
      return {
        status: FAILED,
        data: null,
        message: (error as Error).message || 'Failed to load complain list',
      };
    }
  },

  async submitComplain(input: {
    problem: string;
    problem_type: string;
    description: string;
  }) {
    try {
      const user = await sessionStore.getState().user;
      const payload: CreateComplainPayload = {
        user_mobile: user?.mobile ?? '',
        user_name: user?.name ?? '',
        cust_id: user?.uid ?? 0,
        problem: input.problem,
        problem_type: input.problem_type,
        description: input.description,
      };
      return await complainService.submitComplain(payload);
    } catch (error) {
      return {
        status: FAILED,
        data: null,
        message: (error as Error).message || 'Failed to submit complaint',
      };
    }
  },
};

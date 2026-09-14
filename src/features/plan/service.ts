import { apiClient } from '../../services/apiClient';
import { ApiResponseModel } from '../../services/types';
import { API_ENDPOINTS } from '../../utils/constants';
import { mapErrorResponse, mapResponse } from '../auth/screens/login/service';
import type { PlanModel } from '../../data/models/PlanModel';
import { sessionStore } from '../../store/sessionStore';

export const planService = {
  async getAllPlans(): Promise<ApiResponseModel<PlanModel[]>> {
    try {
      const response = await apiClient.post<{ data?: PlanModel[] }>(
        API_ENDPOINTS.GET_APP_ALL_PLANS,
        {},
      );
      return mapResponse<PlanModel[]>(response);
    } catch (error) {
      return mapErrorResponse<PlanModel[]>(error);
    }
  },
  async getCurrentPlan(): Promise<ApiResponseModel<PlanModel[]>> {
    try {
      const id = getUserId();
      const response = await apiClient.post<{ data?: PlanModel[] }>(
        API_ENDPOINTS.GET_CURRENT_PLAN,
        { id: id },
      );
      return mapResponse<PlanModel[]>(response);
    } catch (error) {
      return mapErrorResponse<PlanModel[]>(error);
    }
  },
};

/** Extracts a plan id from getCurrentPlan payloads (array or single object). */
export function extractCurrentPlanId(
  data: PlanModel[] | PlanModel | null | undefined,
): number {
  if (!data) return 0;

  const plan = Array.isArray(data) ? data[0] : data;
  if (!plan) return 0;

  const planId = Number(
    (plan as PlanModel).id ?? (plan as { plan_id?: number }).plan_id ?? 0,
  );
  return Number.isInteger(planId) && planId > 0 ? planId : 0;
}

function getUserId(): number {
  const userId = Number(sessionStore.getState().user?.uid ?? 0);
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error('User session required');
  }
  return userId;
}

function getUserPlanId(): number {
  const planId = Number(sessionStore.getState().user?.planId ?? 0);
  if (!Number.isInteger(planId) || planId <= 0) {
    throw new Error('No Active plan found with you');
  }
  return planId;
}

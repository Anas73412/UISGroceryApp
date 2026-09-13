import { apiClient } from '../../services/apiClient';
import { sessionStore } from '../../store/sessionStore';
import { API_ENDPOINTS } from '../../utils/constants';
import type { ApiResponseModel } from '../../services/types';
import type { NewsItem, NewsListData } from './types';

type NewsApiItem = {
  id?: number;
  newsId?: number;
  title?: string;
  message?: string;
  description?: string;
  newsPic?: string;
  imageUrl?: string;
  targetAudience?: 'ALL_USERS' | 'WIFI_USERS';
  createdAt?: string | null;
  isRead?: boolean;
};

type NewsApiPayload =
  | NewsApiItem[]
  | {
      items?: NewsApiItem[];
      unreadCount?: number;
    };

function mapItem(item: NewsApiItem): NewsItem {
  return {
    id: Number(item.id ?? item.newsId ?? 0),
    title: String(item.title ?? ''),
    message: String(item.message ?? item.description ?? ''),
    newsPic: String(item.newsPic ?? item.imageUrl ?? ''),
    targetAudience:
      item.targetAudience === 'WIFI_USERS' ? 'WIFI_USERS' : 'ALL_USERS',
    createdAt: item.createdAt ?? null,
    isRead: Boolean(item.isRead),
  };
}

function unwrap<T>(response: ApiResponseModel<T>): T {
  if (!response || response.status !== 'Success' || response.data == null) {
    throw new Error(response?.message || 'Unable to load news');
  }
  return response.data;
}

function getUserId(): number {
  const userId = Number(sessionStore.getState().user?.uid ?? 0);
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error('User session required');
  }
  return userId;
}

function withUserId(path: string, userId: number): string {
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}userId=${userId}`;
}

export const newsService = {
  async list(): Promise<NewsListData> {
    const userId = getUserId();
    const response = await apiClient.get<ApiResponseModel<NewsApiPayload>>(
      withUserId(API_ENDPOINTS.NEWS, userId),
    );

    const payload = unwrap(response);
    const items = Array.isArray(payload) ? payload : payload.items ?? [];
    return {
      items: items.map(mapItem),
      unreadCount: Array.isArray(payload)
        ? 0
        : Number(payload.unreadCount ?? 0),
    };
  },

  async getById(id: number): Promise<NewsItem> {
    const userId = getUserId();
    const response = await apiClient.get<ApiResponseModel<NewsApiItem>>(
      withUserId(`${API_ENDPOINTS.NEWS_DETAILS}/${id}`, userId),
    );
    return mapItem(unwrap(response));
  },

  async unreadCount(): Promise<number> {
    const userId = getUserId();
    const response = await apiClient.get<ApiResponseModel<{ count: number }>>(
      withUserId(API_ENDPOINTS.NEWS_UNREAD_COUNT, userId),
    );
    return Number(unwrap(response).count ?? 0);
  },

  async markRead(id: number): Promise<void> {
    const userId = getUserId();
    const response = await apiClient.post<ApiResponseModel<unknown>>(
      `${API_ENDPOINTS.MARK_NEWS_READ}/${id}`,
      { userId },
    );
    unwrap(response);
  },
};

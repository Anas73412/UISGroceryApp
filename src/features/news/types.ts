export type NewsAudience = 'ALL_USERS' | 'WIFI_USERS';

export interface NewsItem {
  id: number;
  title: string;
  message: string;
  newsPic: string;
  targetAudience: NewsAudience;
  createdAt: string | null;
  isRead: boolean;
}

export interface NewsListData {
  items: NewsItem[];
  unreadCount: number;
}

import { create } from 'zustand';
import { newsService } from './service';
import type { NewsItem } from './types';

interface NewsState {
  items: NewsItem[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  load: () => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
  markRead: (id: number) => Promise<void>;
}

export const newsStore = create<NewsState>((set, get) => ({
  items: [],
  unreadCount: 0,
  loading: false,
  error: null,

  load: async () => {
    set({ loading: true, error: null });
    try {
      const result = await newsService.list();
      set({
        items: result.items,
        unreadCount: result.unreadCount,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Unable to load news',
      });
    }
  },

  refreshUnreadCount: async () => {
    try {
      const unreadCount = await newsService.unreadCount();
      set({ unreadCount });
    } catch (error) {
      console.warn('Unable to refresh news unread count', error);
    }
  },

  markRead: async (id: number) => {
    await newsService.markRead(id);
    set(state => ({
      items: state.items.map(item =>
        item.id === id ? { ...item, isRead: true } : item,
      ),
      unreadCount: Math.max(
        0,
        state.items.some(item => item.id === id && !item.isRead)
          ? state.unreadCount - 1
          : state.unreadCount,
      ),
    }));
    await get().refreshUnreadCount();
  },
}));

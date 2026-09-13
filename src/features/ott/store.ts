import { create } from 'zustand';
import { ottService } from './service';
import type { OttChannel } from './types';

interface OttState {
  items: OttChannel[];
  loading: boolean;
  error: string | null;
  load: () => Promise<void>;
}

export const ottStore = create<OttState>(set => ({
  items: [],
  loading: false,
  error: null,

  load: async () => {
    set({ loading: true, error: null });
    try {
      const items = await ottService.list();
      set({ items, loading: false });
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unable to load OTT channels',
      });
    }
  },
}));

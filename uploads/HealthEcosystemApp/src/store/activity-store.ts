import { create } from 'zustand';

import type { ActivityItem, AsyncStatus } from '@/domain';
import { services } from '@/services';

type ActivityState = {
  status: AsyncStatus;
  items: ActivityItem[];
  load: () => Promise<void>;
  add: (item: Omit<ActivityItem, 'id'>) => Promise<void>;
};

export const useActivityStore = create<ActivityState>((set, get) => ({
  status: 'idle',
  items: [],
  load: async () => {
    if (get().status === 'loading') return;
    set({ status: 'loading' });
    try {
      const items = await services.activity.list();
      set({ items, status: 'success' });
    } catch {
      set({ status: 'error' });
    }
  },
  add: async (item) => {
    const created = await services.activity.add(item);
    set((state) => ({ items: [created, ...state.items] }));
  },
}));

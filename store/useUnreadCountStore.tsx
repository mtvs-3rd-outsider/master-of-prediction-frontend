import {create} from 'zustand';

interface UnreadCountState {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
}

export const useUnreadCountStore = create<UnreadCountState>((set) => ({
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
}));

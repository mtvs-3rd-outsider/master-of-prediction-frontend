import { RSocketClientSetup } from '@/hooks/useRSocketConnection';
import {create} from 'zustand';

interface RSocketState {
    clientRef: any | null;
    messages: Record<string, any>;
    unreadCount: number;
    connect: (token: string, userId: string) => void;
    disconnect: () => void;
    setUnreadCount: (count: number) => void;
  }
  
  export const useRSocketStore = create<RSocketState>((set,get) => ({
    clientRef: null,
    messages: {},
    unreadCount: 0,
    connect: (token, userId) => {
      const clientRef = { current: null };
      RSocketClientSetup.init({
        clientRef,
        token,
        streams: [
          {
            endpoint: `api.v1.messages.threadInfos/${userId}`,
            onNext: (messageMap) => {
              set((state) => ({
                messages: { ...state.messages, ...messageMap },
              }));
            },
          },
        ],
      });
      set({ clientRef });
    },
    disconnect: () => {
      const { clientRef } = get();
      clientRef?.current?.close();
      set({ clientRef: null, messages: {}, unreadCount: 0 });
    },
    setUnreadCount: (count) => set({ unreadCount: count }),
  }));
import { RSocketClientSetup } from "@/hooks/useRSocketConnection";
import { ReactiveSocket } from "rsocket-types"; // ReactiveSocket 타입 임포트
import { create } from "zustand";

interface RSocketState {
  clientRef: { current: ReactiveSocket<Buffer, Buffer> | null };
  messages: Record<string, any>;
  unreadCount: number;
  connect: (token: string, userId: string) => void;
  disconnect: () => void;
  setUnreadCount: (count: number) => void;
}

export const useRSocketStore = create<RSocketState>((set, get) => ({
  clientRef: { current: null }, // 초기값을 null로 설정
  messages: {},
  unreadCount: 0,

  connect: async (token, userId) => {
    const clientRef: { current: ReactiveSocket<Buffer, Buffer> | null } = {
      current: null,
    };

    try {
      console.log("Initializing RSocket connection...");

      const rsocket = await RSocketClientSetup.init({
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

      clientRef.current = rsocket; // 연결된 ReactiveSocket 저장
      set({ clientRef });
      console.log("RSocket connection established");
    } catch (error) {
      console.error("Failed to establish RSocket connection:", error);
    }
  },

  disconnect: () => {
    const { clientRef } = get();
    if (clientRef?.current) {
      console.log("Closing RSocket connection...");
      clientRef.current.close();
    }
    set({ clientRef: { current: null }, messages: {}, unreadCount: 0 });
  },

  setUnreadCount: (count) => set({ unreadCount: count }),
}));

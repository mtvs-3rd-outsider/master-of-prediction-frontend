import { create } from "zustand";

interface SseStore {
  eventSource: EventSource | null;
  connect: (url: string) => EventSource;
  close: () => void;
}

export const useSseStore = create<SseStore>((set) => ({
  eventSource: null,

  // SSE 연결 생성
  connect: (url: string) => {
    const newEventSource = new EventSource(url);

    set({ eventSource: newEventSource });

    newEventSource.onerror = () => {
      console.error("SSE connection error");
      set({ eventSource: null }); // 연결 실패 시 상태 초기화
    };

    return newEventSource;
  },

  // SSE 연결 종료
  close: () => {
    set((state) => {
      state.eventSource?.close();
      return { eventSource: null };
    });
  },
}));

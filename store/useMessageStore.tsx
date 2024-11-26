import { ParticipantDTO } from "@ui/ChatList";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface RoomInfo {
  lastMessage: string;
  lastMessageTime: string;
  unreadMessageCount: number;
  roomId: string;
  roomName: string;
  userId: string;
  participants: ParticipantDTO[]; // 추가된 속성
  isGroupThread: boolean; // 추가된 속성
}

interface MessageStore {
  messageMap: Record<string, RoomInfo>;
  unreadCount: number;
  setMessageMap: (newMessageMap: Record<string, RoomInfo>) => void;
  setUnreadCount: (count: number) => void;
}

export const useMessageStore = create<MessageStore>()(
  persist(
    (set) => ({
      messageMap: {},
      unreadCount: 0,
      setMessageMap: (newMessageMap) => {
        set((state) => {
          const updatedMessageMap = { ...state.messageMap }; // 기존 상태 복사

          Object.entries(newMessageMap).forEach(([roomId, newRoomInfo]) => {
            const prevRoomInfo = state.messageMap[roomId];

            // unreadMessageCount 또는 lastMessage가 다를 경우에만 갱신
            if (
              !prevRoomInfo || // 이전 정보가 없거나
              prevRoomInfo.unreadMessageCount !==
                newRoomInfo.unreadMessageCount || // 읽지 않은 메시지 수가 다르거나
              prevRoomInfo.lastMessage !== newRoomInfo.lastMessage // 마지막 메시지가 다를 경우
            ) {
              updatedMessageMap[roomId] = newRoomInfo;
            }
          });

          return { messageMap: updatedMessageMap };
        });
      },

      setUnreadCount: (count) => set({ unreadCount: count }),
    }),
    {
      name: "message-store", // 로컬 스토리지 키 이름
      storage: createJSONStorage(() => localStorage), // 클라이언트 환경에서 localStorage 사용
    }
  )
);

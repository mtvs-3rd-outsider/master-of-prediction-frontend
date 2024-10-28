import { ParticipantDTO } from '@ui/ChatList';
import {create} from 'zustand';

export interface RoomInfo {
    lastMessage: string;
    lastMessageTime: string;
    unreadMessageCount: number;
    roomId: string;
    roomName: string;
    userId: string;
    participants: ParticipantDTO[];  // 추가된 속성
    isGroupThread: boolean;          // 추가된 속성
  }

interface MessageStore {
  messageMap: Record<string, RoomInfo>;
  unreadCount: number;
  setMessageMap: (newMessageMap: Record<string, RoomInfo>) => void;
  setUnreadCount: (count: number) => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
  messageMap: {},
  unreadCount: 0,
  setMessageMap: (newMessageMap) => {
    set((state) => {
      // 기존 messageMap과 새로 전달된 messageMap을 병합
      const updatedMessageMap = { ...state.messageMap };

      // 새로운 메시지 맵에서 변경된 항목만 업데이트
      Object.entries(newMessageMap).forEach(([roomId, newRoomInfo]) => {
        const prevRoomInfo = state.messageMap[roomId];
        if (!prevRoomInfo || prevRoomInfo.unreadMessageCount !== newRoomInfo.unreadMessageCount) {
          updatedMessageMap[roomId] = newRoomInfo;
        }
      });

      return { messageMap: updatedMessageMap };
    });
  },
  setUnreadCount: (count) => set({ unreadCount: count }),
}));

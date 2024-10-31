import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import apiClient from "@handler/fetch/axios";
import useUserStore from "@store/useUserStore";
import { useRouter } from "next/navigation";
import ChatItem from "./ChatItem";
import { RoomInfo, useMessageStore } from "@store/useMessageStore";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import { useDMListStore } from "@store/useDMListStore";
export interface ParticipantDTO {
  userId: number;
  userName: string;
  avatarUrl: string;
  displayName: string;
  unreadMessageCount: number;
}

export interface ChatThreadDTO {
  chatRoomId: number;
  createdAt: string;
  lastMessage: string;
  lastMessageTime: string;
  isGroupThread: boolean;
  participants: ParticipantDTO[];
}

const DMList: React.FC = () => {
  const router = useRouter();
  const { messageMap, setMessageMap } = useMessageStore();
  const { dmlist, setDMLIst } = useDMListStore(); // zustand store에서 가져오기
  const userInfo = useUserStore((state) => state.userInfo);
  const { ref: loadMoreRef, inView: isInView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  // DM 데이터를 가져오는 함수
  const fetchDMs = async (pageParam: number) => {
    const response = await apiClient.get(`/chat-threads/user-threads`, {
      params: {
        page: pageParam,
        size: 5,
      },
    });
    return response.data;
  };

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    data,
    error: infiniteError,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["directMessages"],
    queryFn: ({ pageParam = 1 }) => fetchDMs(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.last) return lastPage.number + 1;
      return undefined;
    },
    enabled: !!userInfo,
    staleTime: 0, // 데이터가 항상 최신인지 확인
  });
  useEffect(() => {
    if (data) {
      const updatedMessageMap = data.pages.reduce<Record<string, RoomInfo>>(
        (acc, page) => {
          page.content.forEach((dm: ChatThreadDTO) => {
            const existingData = messageMap[dm.chatRoomId.toString()];

            const roomInfo: RoomInfo = {
              roomId: String(dm.chatRoomId),
              lastMessage: existingData?.lastMessage ?? dm.lastMessage,
              lastMessageTime:
                existingData?.lastMessageTime ?? dm.lastMessageTime,
              unreadMessageCount:
                existingData?.unreadMessageCount ??
                dm.participants.reduce(
                  (total, participant) =>
                    total + participant.unreadMessageCount,
                  0
                ),
              roomName:
                existingData?.roomName ??
                (dm.isGroupThread
                  ? `Room ${dm.chatRoomId}`
                  : dm.participants[0]?.displayName ?? ""),
              userId:
                existingData?.userId ??
                String(dm.participants[0]?.userId ?? ""),
              participants: dm.participants,
              isGroupThread: dm.isGroupThread,
            };

            acc[dm.chatRoomId] = roomInfo;
          });

          return acc;
        },
        {}
      );

      // 누락된 roomId가 있다면 전체 데이터를 다시 로드
      const missingRoomIds = Object.keys(messageMap).filter(
        (roomId) => !updatedMessageMap[roomId]
      );
      if (missingRoomIds.length > 0) {
        refetch();
      } else {
        setDMLIst(updatedMessageMap);
      }
    }
  }, [data, messageMap]);

  useEffect(() => {
    if (isInView && hasNextPage) fetchNextPage();
  }, [isInView, hasNextPage, fetchNextPage]);

  const handleDeleteThread = async (roomId: number) => {
    try {
      await apiClient.delete(`/chat-threads/${roomId}`);

      // 삭제된 채팅방을 dmlist 상태에서 제거
   setDMLIst((prev: Record<string, RoomInfo>): Record<string, RoomInfo> => {
     const updatedList = { ...prev };
     delete updatedList[roomId.toString()];
     return updatedList;
   });
    } catch (error) {
      console.error("Failed to delete chat thread:", error);
    }
  };

  return (
    <div>
      {status === "pending" ? (
        <p>Loading...</p>
      ) : status === "error" ? (
        <p>Error: {infiniteError.message}</p>
      ) : (
        <ul className="[&_li:last-child]:text-slate-500 [&_li:first-child]:text-lg divide-y divide-slate-200">
          {Object.entries(dmlist).map(([roomId, roomInfo]) => (
            <li key={roomId} className="flex items-center justify-between">
              <ChatItem
                lastMessage={roomInfo.lastMessage}
                lastMessageTime={roomInfo.lastMessageTime}
                participants={roomInfo.participants}
                isGroupThread={roomInfo.isGroupThread}
                onClick={() => router.push(`/messages/${roomId}`)}
                unreadMessageCount={roomInfo.unreadMessageCount}
                onDelete={() => handleDeleteThread(Number(roomId))} // 삭제 기능 추가
              />
            </li>
          ))}
        </ul>
      )}

      <div ref={loadMoreRef} className="mt-4">
        {isFetchingNextPage
          ? "Loading more..."
          : hasNextPage
          ? "Load More"
          : ""}
      </div>
    </div>
  );
};

export default DMList;

import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "@handler/fetch/axios";
import useUserStore from "@store/useUserStore";
import { useRouter } from "next/navigation";
import ChatItem from "./ChatItem";
import { RoomInfo, useMessageStore } from "@store/useMessageStore";
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
  const { messageMap } = useMessageStore();
  const { dmlist, setDMLIst } = useDMListStore();
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
    refetchOnMount: "always",
    staleTime: 0,
  });
useEffect(() => {
  refetch(); // 페이지 이동 시 데이터를 다시 가져오기
}, [router, refetch]);
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
      ) : Object.keys(dmlist).length === 0 ? (
        <div className="flex flex-col   justify-center h-screen font-GangwonEduPowerExtraBoldA">
          <p className="text-center text-2xl">쪽지가 아직 없습니다.</p>
          <p className="text-center text-4xl ">쪽지를 보내 보세요!</p>
        </div>
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
                onDelete={() => handleDeleteThread(Number(roomId))}
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

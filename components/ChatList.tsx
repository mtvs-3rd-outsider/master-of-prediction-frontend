import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import apiClient from '@handler/fetch/axios'; // Axios 클라이언트
import useUserStore from '@store/useUserStore'; // 유저 정보 스토어
import Account from './Account';
import { useRouter } from 'next/navigation';
import ChatItem from './ChatItem';
import { RoomInfo, useMessageStore } from '@store/useMessageStore';
export interface ParticipantDTO {
  userId: number;
  userName: string;
  avatarUrl: string;
  displayName: string;
  unreadMessageCount: number;
}

export interface ChatThreadDTO {
  chatRoomId: number;
  createdAt: string; // ISO 문자열 형식 (예: "2023-10-27T10:30:00Z")
  lastMessage: string;
  lastMessageTime: string; // ISO 문자열 형식
  isGroupThread: boolean;
  participants: ParticipantDTO[];
}
const DMList: React.FC = () => {
  const router = useRouter()
  const { messageMap, setMessageMap } = useMessageStore(); // Zustand 상태 가져오기
  const [ dmlist, setDMLIst] = useState<Record<string, RoomInfo>>({}); // Zustand 상태 가져오기
  const userInfo = useUserStore((state) => state.userInfo);
  const { ref: loadMoreRef, inView: isInView } = useInView({
    threshold: 0.5, // 50%가 화면에 보일 때 트리거
    triggerOnce: false,
  });


  
  // DM 데이터를 가져오는 함수
  const fetchDMs = async (pageParam: number) => {
    const response = await apiClient.get(`/chat-threads/user-threads`, {
      params: {
        page: pageParam,
        size: 5, // 페이지당 5개의 쪽지 조회
      },
    });
    console.log(response.data)
    return response.data;
  };

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    data,
    error: infiniteError,
    status,
  } = useInfiniteQuery({
    queryKey: ['directMessages'],
    queryFn: ({ pageParam = 1 }) => fetchDMs(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // lastPage는 Spring Page 객체입니다.
      if (!lastPage.last) {
        return lastPage.number + 1; // 다음 페이지 번호를 반환
      } else {
        return undefined; // 더 이상 페이지가 없으면 undefined 반환
      }
    },
    enabled: !!userInfo,
  });
  useEffect(() => {


    if (data) {
      const updatedMessageMap = data.pages.reduce<Record<string, RoomInfo>>((acc, page) => {
        page.content.forEach((dm: ChatThreadDTO) => {
          console.log(dm.chatRoomId)
          const existingData = messageMap[dm.chatRoomId.toString()];
          console.log(existingData)

          const roomInfo: RoomInfo = {
            roomId: String(dm.chatRoomId),
            lastMessage: existingData?.lastMessage ?? dm.lastMessage,
            lastMessageTime: existingData?.lastMessageTime ??  dm.lastMessageTime, // string 타입 유지
            unreadMessageCount:
              existingData?.unreadMessageCount ?? dm.participants.reduce(
                (total, participant) => total + participant.unreadMessageCount,
                0
              ),
            roomName: existingData?.roomName ?? `Room ${dm.chatRoomId}`,
            userId: existingData?.userId ?? String(dm.participants[0]?.userId ?? ''),
            participants: dm.participants, // participants 필드 추가
            isGroupThread: dm.isGroupThread, // isGroupThread 필드 추가
          };

          acc[dm.chatRoomId] = roomInfo;
          console.log(acc)

        });
        return acc;
      }, {});
      // messageMap 상태 업데이트
      setDMLIst(()=>updatedMessageMap);
    }
  }, [data,  messageMap,setDMLIst]);
  useEffect(() => {
    if (isInView && hasNextPage) {
      fetchNextPage();
    }
  }, [isInView, hasNextPage, fetchNextPage]);
  const handleResultClick = async (
    roomId: number
  ) => {
   // Zustand messageMap 상태를 UI에 반영
  
    try {
    
  
      // roomId로 메시지 페이지로 이동
      router.push(`/messages/${roomId}`);
    } catch (error) {
      console.error('Failed to create or fetch DM thread:', error);
    }
  };


  return (
    <div>
      {status === 'pending' ? (
        <p>Loading...</p>
      ) : status === 'error' ? (
        <p>Error: {infiniteError.message}</p>
      ) : (
        <ul className="[&_li:last-child]:text-slate-500 [&_li:first-child]:text-lg divide-y divide-slate-200">
  
  {Object.entries(dmlist).map(([roomId, roomInfo]) => (
  <ChatItem
    key={roomId}
    lastMessage={roomInfo.lastMessage}
    lastMessageTime={roomInfo.lastMessageTime}
    participants={roomInfo.participants} // 추가된 부분
    isGroupThread={roomInfo.isGroupThread} // 추가된 부분
    onClick={() => router.push(`/messages/${roomId}`)}
    unreadMessageCount={roomInfo.unreadMessageCount}
  />
))}
        </ul>
      )}

      <div ref={loadMoreRef} className="mt-4">
        {isFetchingNextPage
          ? 'Loading more...'
          : hasNextPage
          ? 'Load More'
          : ''}
      </div>
    </div>
  );
};

export default DMList;

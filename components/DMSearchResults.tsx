"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@handler/fetch/axios';
import Account from './Account';
import useUserStore from '@store/useUserStore';

interface SearchResultsProps {
  status: string;
  search: any;
  infiniteErrorSearch: any;
  fetchNextPageSearch: () => void;
  hasNextPageSearch: boolean;
  isFetchingNextPageSearch: boolean;
}
interface CreateChatThreadDTO {
  isGroupThread: boolean;
  participantIds: number[];
}
interface CreateChatThreadResponse {
  chatRoomId: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  status,
  search,
  infiniteErrorSearch,
  fetchNextPageSearch,
  hasNextPageSearch,
  isFetchingNextPageSearch,
}) => {
  const userInfo = useUserStore((state) => state.userInfo);

  const router = useRouter();

  const handleResultClick = async (userId: number) => {
    try {
      // participantIds에 현재 유저와 선택한 유저 ID를 포함
      const requestData: CreateChatThreadDTO = {
        isGroupThread: false, // 1:1 채팅
        participantIds: [Number(userInfo!.id), userId], // 현재 사용자와 선택한 사용자
      };
  
      const response = await apiClient.post<CreateChatThreadResponse>('/chat-threads/create', requestData);
  
      // 응답에서 생성된 roomId 가져오기
      const roomId = response.data.chatRoomId;
  
      // roomId로 메시지 페이지로 이동
      router.push(`/messages/${roomId}`);
    } catch (error) {
      console.error('Failed to create or fetch DM thread:', error);
    }
  };

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'error') return <p>Error: {infiniteErrorSearch.message}</p>;

  return (
    <ul className="divide-y divide-slate-200">
      {search?.pages.map((page: any, pageIndex: number) => (
        <React.Fragment key={pageIndex}>
          {page.content.map((result: any) => (

        <div
        key={result.user_id}
        className='cursor-pointer'
        onClick={() => handleResultClick( result.user_id)}>
        <Account
          className="px-2 py-2"
          userName={result.user_name}
          avatarUrl={result.avatar_img}
          displayName={result.display_name}
          tier={result.tier}
        />
        </div>
          ))}
        </React.Fragment>
      ))}
      {isFetchingNextPageSearch && <p>Loading more...</p>}
      {!hasNextPageSearch && <p>No more results</p>}
    </ul>
  );
};

export default SearchResults;

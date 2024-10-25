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

  const handleResultClick = async (senderId: number, receiverId: number) => {
    // senderId와 receiverId를 오름차순으로 정렬하여 roomId 생성
    // const sortedIds = [senderId, receiverId].sort((a, b) => a - b);
    // const roomId = `${sortedIds[0]}-${sortedIds[1]}`;

    try {
      // DMThread 생성 또는 조회 API 요청
      await apiClient.post(`/dmthreads/create`, {
        senderId,
        receiverId,
      });

      // roomId로 메시지 페이지로 이동
      router.push(`/messages/${senderId}/${receiverId}`);
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
        onClick={() => handleResultClick(Number(userInfo!.id), result.user_id)}>
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

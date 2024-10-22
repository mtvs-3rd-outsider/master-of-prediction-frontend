import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import apiClient from '@handler/fetch/axios'; // Axios 클라이언트
import useUserStore from '@store/useUserStore'; // 유저 정보 스토어
import DMItem from './DMItem';
import Account from './Account';
import { useRouter } from 'next/navigation';

const DMList: React.FC = () => {
  const router = useRouter()
  const userInfo = useUserStore((state) => state.userInfo);
  const { ref: loadMoreRef, inView: isInView } = useInView({
    threshold: 0.5, // 50%가 화면에 보일 때 트리거
    triggerOnce: false,
  });
  const handleResultClick = async (senderId: number, receiverId: number) => {
    // senderId와 receiverId를 오름차순으로 정렬하여 roomId 생성
    const sortedIds = [senderId, receiverId].sort((a, b) => a - b);
    const roomId = `${sortedIds[0]}-${sortedIds[1]}`;

    try {
      // DMThread 생성 또는 조회 API 요청
      await apiClient.post(`/dmthreads/create`, {
        senderId,
        receiverId,
      });

      // roomId로 메시지 페이지로 이동
      router.push(`/messages/${roomId}`);
    } catch (error) {
      console.error('Failed to create or fetch DM thread:', error);
    }
  };

  // DM 데이터를 가져오는 함수
  const fetchDMs = async (pageParam: number) => {
    const response = await apiClient.get(`/dmthreads/sender/${userInfo?.id}`, {
      params: {
        page: pageParam,
        size: 5, // 페이지당 5개의 쪽지 조회
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
    if (isInView && hasNextPage) {
      fetchNextPage();
    }
  }, [isInView, hasNextPage, fetchNextPage]);



  return (
    <div>
      {status === 'pending' ? (
        <p>Loading...</p>
      ) : status === 'error' ? (
        <p>Error: {infiniteError.message}</p>
      ) : (
        <ul className="[&_li:last-child]:text-slate-500 [&_li:first-child]:text-lg divide-y divide-slate-200">
          {data?.pages.map((page, pageIndex) => (
            <React.Fragment key={pageIndex}>
              {page.content.map((dm: any) => (
              <div
              key={dm.receiverId}
              className='cursor-pointer'
              onClick={() => handleResultClick(Number(userInfo!.id), dm.receiverId)}
              >
              <Account
                className="px-2 py-2"
                userName={dm.receiverName}
                avatarUrl={dm.receiverImg}
                displayName={dm.receiverDisplayName}
                // tier={dm.tier}
              />
              </div>
              ))}
            </React.Fragment>
          ))}
        </ul>
      )}

      <div ref={loadMoreRef} className="mt-4">
        {isFetchingNextPage
          ? 'Loading more...'
          : hasNextPage
          ? 'Load More'
          : 'No more messages'}
      </div>
    </div>
  );
};

export default DMList;

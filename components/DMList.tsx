import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import apiClient from '@handler/fetch/axios'; // Axios 클라이언트
import useUserStore from '@store/useUserStore'; // 유저 정보 스토어
import DMItem from './DMItem';

const DMList: React.FC = () => {
  const userInfo = useUserStore((state) => state.userInfo);
  const { ref: loadMoreRef, inView: isInView } = useInView({
    threshold: 0.5, // 50%가 화면에 보일 때 트리거
    triggerOnce: false,
  });

  // DM 데이터를 가져오는 함수
  const fetchDMs = async (pageParam: number) => {
    const response = await apiClient.get(`/direct-messages`, {
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
                <DMItem
                  key={dm.messageId}
                  senderName={dm.senderName}
                  messageContent={dm.messageContent}
                  sentAt={dm.sentAt}
                />
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

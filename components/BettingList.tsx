// @components/BettingList.tsx
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import BettingProduct from './BettingProduct';
import apiClient from '@handler/fetch/axios';
import useUserStore from '@store/useUserStore';

const BettingList: React.FC = () => {
  const userInfo = useUserStore(state => state.userInfo);
  const { ref: loadMoreRef, inView: isInView } = useInView({
    threshold: 0.5, // 50% visibility trigger
    triggerOnce: false,
  });

  const fetchMyBettings = async (pageParam: number) => {
    const response = await apiClient.get(`/betting-products/user/v2`, {
      params: { 
        userId: userInfo?.id,
        page: pageParam,
        size: 5,
      },
    });
    return response.data;
  };

  const {
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    data,
    error:infiniteError,
    status

  } = useInfiniteQuery(
    {
      queryKey: ['mybettings'],
      queryFn: ({ pageParam = 1 })=> fetchMyBettings(pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
      // lastPage는 Spring Page 객체입니다.
      console.log(lastPage);
      if (!lastPage.last) {
        return lastPage.number + 1; // 다음 페이지 번호를 반환
      } else {
        return undefined; // 더 이상 페이지가 없으면 undefined 반환
      }
      },
      enabled: !!userInfo
  }
  );

  useEffect(() => {
    if (isInView && hasNextPage) {
      fetchNextPage();
    }
  }, [isInView, hasNextPage, fetchNextPage]);

  return (
    <div>
      {status === "pending" ? (
        <p>Loading...</p>
      ) : status === "error" ? (
        <p>Error: {infiniteError.message}</p>
      ) : (
        <ul className="[&_p:last-child]:text-slate-500 [&_p:first-child]:text-lg divide-y divide-slate-200">
          {data?.pages.map((page, pageIndex) => (
            <React.Fragment key={pageIndex}>
              {page.content.map((node: any) => (
                <li key={node.bettingId}>
                  <BettingProduct
                    userID={node.userID}
                    userName={node.userName}
                    displayName={node.displayName}
                    tierName={node.tierName}
                    userImg={node.userImg}
                    title={node.title}
                    imgUrls={node.imgUrls}
                    bettingId={node.bettingId}
                    blindName={node.blindName}
                  />
                </li>
              ))}
            </React.Fragment>
          ))}
        </ul>
      )}

      <div ref={loadMoreRef}>
        {isFetchingNextPage ? (
          "Loading more..."
        ) : hasNextPage ? (
          <div className="flex flex-col   justify-center h-screen font-GangwonEduPowerExtraBoldA">
            <p className="text-center text-2xl">
              베팅을 작성하지 않았습니다.
            </p>
            <p className="text-center text-4xl ">베팅을 작성해보세요!</p>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default BettingList;

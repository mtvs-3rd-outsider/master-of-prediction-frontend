import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import CategoryChannelCard from '@ui/CategoryChannelCard';
import useUserStore from '@store/useUserStore';
import apiClient from '@api/axios';



const MyCategories: React.FC = () => {
  const userInfo = useUserStore(state => state.userInfo);
  const { ref: loadMoreRef, inView: isInView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });
  const fetchMyCategories = async (pageParam: number) => {
    const flag:string = "CATEGORY";
    const response = await apiClient.get(`/subscriptions/user/${userInfo?.id}/following`, {
      params: { 
        flag , isUserChannel:true,
        page: pageParam,
        size: 5,
        }  // Send flag as a query param
    });
  
  
    return response.data;
  };
  
  const {
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage ,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    data: myCategories,
    error:infiniteError,
    status

  } = useInfiniteQuery(
    {
      queryKey: ['mycategories'],
      queryFn: ({ pageParam = 1})=> fetchMyCategories(pageParam),
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

  if (status === 'pending') return <p>Loading categories...</p>;
  if (status === 'error') return <p>Error: {infiniteError.message}</p>;

  return (
    <div>
      {myCategories?.pages.map((page: any, pageIndex: number) => (
        <React.Fragment key={pageIndex}>
          {page.content.map((category: any) => (
            <CategoryChannelCard
              key={category.channelId}
              href={`/category-channel/${category.channelId}`}
              categoryChannelName={category.channelName}
              badge={category.isUserChannel ? 'User Channel' : 'Category'}
              avatars={[category.channelImageUrl]}
            />
          ))}
        </React.Fragment>
      ))}
      <div ref={loadMoreRef}>
        {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load More' : ''}
      </div>
    </div>
  );
};

export default MyCategories;

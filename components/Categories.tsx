import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import CategoryChannelCard from '@ui/CategoryChannelCard';
import apiClient from '@api/axios';

const fetchCategories = async (pageParam: number) => {
  const response = await apiClient.get('/category-channels', {
    params: {
      page: pageParam,
      size: 5,
    },
  });
  return response.data;
};

const Categories: React.FC = () => {
  const { ref: loadMoreRef, inView: isInView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

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
      queryKey: ['categories'],
      queryFn: ({ pageParam = 1 })=> fetchCategories(pageParam),
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
      {data?.pages.map((page: any, pageIndex: number) => (
        <React.Fragment key={pageIndex}>
          {page.content.map((category: any) => (
            <CategoryChannelCard
              key={category.channelId}
              href={`/category-channel/${category.channelId}`}
              categoryChannelName={category.displayName}
              badge={'Category'}
              avatars={[category.imageUrl]}
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

export default Categories;

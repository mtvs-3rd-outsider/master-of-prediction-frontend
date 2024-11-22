import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import CategoryChannelCard from "@ui/CategoryChannelCard";
import useUserStore from "@store/useUserStore";
import apiClient from "@api/axios";

const MyCategories: React.FC = () => {
  const userInfo = useUserStore((state) => state.userInfo);
  const { ref: loadMoreRef, inView: isInView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  const fetchMyCategories = async (pageParam: number) => {
    const flag: string = "CATEGORY";
    const response = await apiClient.get(
      `/subscriptions/user/${userInfo?.id}/following`,
      {
        params: {
          flag,
          isUserChannel: true,
          page: pageParam,
          size: 5,
        },
      }
    );
    return response.data;
  };

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    data: myCategories,
    error: infiniteError,
    status,
  } = useInfiniteQuery({
    queryKey: ["mycategories"],
    queryFn: ({ pageParam = 1 }) => fetchMyCategories(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.last) {
        return lastPage.number + 1;
      } else {
        return undefined;
      }
    },
    enabled: !!userInfo,
  });

  useEffect(() => {
    if (isInView && hasNextPage) {
      fetchNextPage();
    }
  }, [isInView, hasNextPage, fetchNextPage]);

  if (status === "pending") return <p>Loading categories...</p>;
  if (status === "error") return <p>Error: {infiniteError.message}</p>;

  // 총 항목 수 계산
  const totalItems =
    myCategories?.pages.reduce(
      (total, page) => total + page.content.length,
      0
    ) || 0;

  if (totalItems === 0) {
    return (
      <div className="flex flex-col justify-center h-screen font-GangwonEduPowerExtraBoldA">
        <p className="text-center text-2xl">내 카테고리들이 없습니다.</p>
        <p className="text-center text-4xl">카테고리를 구독하세요!</p>
      </div>
    );
  }

  return (
    <div>
      {myCategories?.pages.map((page: any, pageIndex: number) => (
        <React.Fragment key={pageIndex}>
          {page.content.map((category: any) => (
            <CategoryChannelCard
              key={category.channelId}
              href={`/category-channel/${category.channelId}`}
              categoryChannelName={category.channelName}
              badge={category.isUserChannel ? "User Channel" : "Category"}
              avatars={[category.channelImageUrl]}
            />
          ))}
        </React.Fragment>
      ))}
      <div ref={loadMoreRef}>
        {isFetchingNextPage
          ? "Loading more..."
          : hasNextPage
          ? "Load More"
          : ""}
      </div>
    </div>
  );
};

export default MyCategories;

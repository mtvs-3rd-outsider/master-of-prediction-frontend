import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import NotificationProduct from "./NotificationProduct";
import apiClient from "@handler/fetch/axios";
import useUserStore from "@store/useUserStore";

const NotificationList: React.FC = () => {
  const userInfo = useUserStore((state) => state.userInfo);
  const { ref: loadMoreRef, inView: isInView } = useInView({
    threshold: 0.5, // 50% visibility trigger
    triggerOnce: false,
  });

  // 알림 데이터 가져오는 함수
  const fetchNotifications = async (pageParam: number) => {
    const response = await apiClient.get(`/notifications`, {
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
    hasNextPage,
    isFetchingNextPage,
    data,
    error: infiniteError,
    status,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam = 1 }) => fetchNotifications(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.last) {
        return lastPage.number + 1; // 다음 페이지 번호 반환
      } else {
        return undefined; // 마지막 페이지면 undefined 반환
      }
    },
    enabled: !!userInfo,
  });

  useEffect(() => {
    if (isInView && hasNextPage) {
      fetchNextPage();
    }
  }, [isInView, hasNextPage, fetchNextPage]);

  // 데이터가 없는 경우를 확인하는 변수
  const noData =
    status === "success" &&
    (!data || data.pages.every((page) => page.content.length === 0));

  return (
    <div>
      {status === "pending" ? (
        <p>Loading...</p>
      ) : status === "error" ? (
        <p>Error: {infiniteError.message}</p>
      ) : noData ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-center">알림이 아직 없습니다.</p>
        </div>
      ) : (
        <ul className="[&_p:last-child]:text-slate-500 [&_p:first-child]:text-lg divide-y divide-slate-200">
          {data?.pages.map((page, pageIndex) => (
            <React.Fragment key={pageIndex}>
              {page?.content?.length > 0
                ? page.content.map((notification: any) => (
                    <li key={notification.id}>
                      <NotificationProduct
                        id={notification.id}
                        title={notification.title}
                        content={notification.content}
                        isRead={notification.isRead}
                        createdAt={notification.createdAt}
                      />
                    </li>
                  ))
                : null}
            </React.Fragment>
          ))}
        </ul>
      )}

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

export default NotificationList;

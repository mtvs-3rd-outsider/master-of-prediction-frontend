import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import NotificationProduct from './NotificationProduct';
import apiClient from '@handler/fetch/axios';
import useUserStore from '@store/useUserStore';

const NotificationList: React.FC = () => {
  const userInfo = useUserStore(state => state.userInfo);
  const { ref: loadMoreRef, inView: isInView } = useInView({
    threshold: 0.5, // 50% visibility trigger
    triggerOnce: false,
  });

  const [notifications, setNotifications] = useState<any[]>([]);

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
    status
  } = useInfiniteQuery(
    {
      queryKey: ['notifications'],
      queryFn: ({ pageParam = 1 }) => fetchNotifications(pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        if (!lastPage.last) {
          return lastPage.number + 1; // 다음 페이지 번호 반환
        } else {
          return undefined; // 마지막 페이지면 undefined 반환
        }
      },
      enabled: !!userInfo
    }
  );

  // 알림의 isRead 상태가 변경되면 해당 알림 항목 업데이트
  const handleReadUpdate = (id: number) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  // 데이터가 변경될 때 알림 상태 업데이트
  useEffect(() => {
    if (data) {
      const allNotifications = data.pages.flatMap(page => page.content);
      setNotifications(allNotifications);
    }
  }, [data]);

  // 페이지가 로드될 때 더 많은 알림을 가져오는 로직
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
        <ul className="[&_p:last-child]:text-slate-500 [&_p:first-child]:text-lg divide-y divide-slate-200">
          {notifications.map((notification, index) => (
            <li key={notification.id}>
              <NotificationProduct
                id={notification.id}
                title={notification.title}
                content={notification.content}
                isRead={notification.isRead}
                createdAt={notification.createdAt}
                onReadUpdate={handleReadUpdate} // isRead 업데이트 콜백 전달
              />
            </li>
          ))}
        </ul>
      )}

      <div ref={loadMoreRef}>
        {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load More' : ''}
      </div>
    </div>
  );
};

export default NotificationList;

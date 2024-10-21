import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import apiClient from '@handler/fetch/axios';

type NotificationProductProps = {
  id: number;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  onReadUpdate: (id: number) => void; // isRead 상태 업데이트를 위한 콜백
};

const NotificationProduct: React.FC<NotificationProductProps> = ({ id, title, content, isRead, createdAt, onReadUpdate }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,  // 처음 화면에 보일 때만 trigger
    threshold: 0.5, // 10% 보일 때 트리거
  });

  useEffect(() => {
    if (inView && !isRead) {
      // 알림이 보이고 isRead가 false일 때만 서버에 업데이트 요청
      const markAsRead = async () => {
        try {
          await apiClient.put(`/notifications/${id}`, { isRead: true });
          onReadUpdate(id); // 상위 컴포넌트에 알림을 읽었음을 전달
        } catch (error) {
          console.error('Failed to update isRead status', error);
        }
      };
      markAsRead();
    }
  }, [inView, isRead, id, onReadUpdate]);

  return (
    <div
      ref={ref}
      className={`p-4 ${isRead ? 'bg-gray-100' : 'bg-white'} cursor-pointer`}
    >
      <h3 className="font-bold">{title}</h3>
      <p>{content}</p>
      <p className="text-sm text-gray-500">{new Date(createdAt).toLocaleString()}</p>
    </div>
  );
};

export default NotificationProduct;

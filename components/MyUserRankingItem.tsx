import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardBody, Divider } from '@nextui-org/react';
import apiClient from '@handler/fetch/axios';
import useUserStore from '@store/useUserStore'; // 유저 정보 스토어

const MyUserRankingItem: React.FC = () => {
  const userInfo = useUserStore((state) => state.userInfo); // 현재 로그인된 유저 정보

  const fetchMyRanking = async () => {
    const response = await apiClient.get(`/user-rankings/${userInfo?.id}`);
    return response.data;
  };

  const { data, status, error } = useQuery({
    queryKey: ['myUserRanking', userInfo?.id],
    queryFn: fetchMyRanking,
    enabled: !!userInfo, // userInfo가 존재할 때만 쿼리 실행
  });

  if (status === 'pending') {
    return <p>Loading your ranking...</p>;
  }

  if (status === 'error') {
    return <p style={{ color: 'red' }}>Error loading your ranking: {error?.message}</p>;
  }

  if (!userInfo) {
    return null;
  }
  return (
    <div className="flex justify-center items-center my-6">
        
      <div className="text-center">
        <p className="text-5xl font-bold">{data.rank}</p>
        <p className="text-sm text-muted-foreground">나의 현재 순위</p>
      </div>
      <div className="mx-8 text-center">
        <p className="text-5xl font-bold">{data.points}</p>
        <p className="text-sm text-muted-foreground">포인트</p>
      </div>
    </div>
  );
};

export default MyUserRankingItem;

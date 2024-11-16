import React from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@handler/fetch/axios";
import useUserStore from "@store/useUserStore"; // 유저 정보 스토어

const MyUserRankingItem: React.FC = () => {
  const userInfo = useUserStore((state) => state.userInfo); // 현재 로그인된 유저 정보

  const fetchMyRanking = async () => {
    const response = await apiClient.get(`/user-rankings/${userInfo?.id}`);
    return response.data;
  };

  const { data, status, error } = useQuery({
    queryKey: ["myUserRanking", userInfo?.id],
    queryFn: fetchMyRanking,
    enabled: !!userInfo, // userInfo가 존재할 때만 쿼리 실행
  });

  if (status === "pending" && userInfo) {
    return <p>Loading your ranking...</p>;
  }

  if (status === "error" ) {
    return (
      <p style={{ color: "red" }}>
        Error loading your ranking: {error?.message}
      </p>
    );
  }

  if (!userInfo) {
    return null;
  }

  const rank = data?.rank > 0 ? data.rank : "-"; // rank가 없으면 "-"로 표시
  const points = data?.points != undefined ? data.points : "0"; // points가 없으면 "포인트 없음"으로 표시

  return (
    <div className="flex justify-center items-center my-6">
      <div className="text-center">
        <p className="text-5xl font-bold">{rank}</p>
        <p className="text-sm text-muted-foreground">나의 현재 순위</p>
      </div>
      <div className="mx-8 text-center">
        <p className="text-5xl font-bold">{points}</p>
        <p className="text-sm text-muted-foreground">포인트</p>
      </div>
    </div>
  );
};

export default MyUserRankingItem;

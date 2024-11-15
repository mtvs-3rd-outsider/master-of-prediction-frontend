import React from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@handler/fetch/axios";
import useUserStore from "@store/useUserStore"; // 유저 정보 스토어

const MyUserRankingItem: React.FC = () => {
  const userInfo = useUserStore((state) => state.userInfo); // 현재 로그인된 유저 정보

  const fetchMyScoreRanking = async () => {
    const response = await apiClient.get(`/score-rankings/${userInfo?.id}`); // 점수 기반 랭킹 API 엔드포인트
    return response.data;
  };

  const { data, status, error } = useQuery({
    queryKey: ["myScoreRanking", userInfo?.id],
    queryFn: fetchMyScoreRanking,
    enabled: !!userInfo, // userInfo가 존재할 때만 쿼리 실행
  });

  if (status === "pending") {
    return <p>Loading your ranking...</p>;
  }

  if (status === "error") {
    return (
      <p style={{ color: "red" }}>
        Error loading your ranking: {error?.message}
      </p>
    );
  }

  if (!userInfo) {
    return null;
  }

  const rank = data?.rank >= 0 ? data.rank : "-"; // 랭킹 정보가 없을 경우 "-"로 표시
  const score = data?.score !== undefined ? data.score : "점수 없음"; // 점수 정보가 없을 경우 "점수 없음"으로 표시

  return (
    <div className="flex justify-center items-center my-6">
      <div className="text-center">
        <p className="text-5xl font-bold">{rank}</p>
        <p className="text-sm text-muted-foreground">나의 현재 순위</p>
      </div>
      <div className="mx-8 text-center">
        <p className="text-5xl font-bold">{score}</p> {/* 점수 표시 */}
        <p className="text-sm text-muted-foreground">점수</p>
      </div>
    </div>
  );
};

export default MyUserRankingItem;

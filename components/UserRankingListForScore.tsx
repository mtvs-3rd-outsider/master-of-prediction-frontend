import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "@handler/fetch/axios"; // Axios 클라이언트
import useUserStore from "@store/useUserStore"; // 유저 정보 스토어
import UserRankingItem from "./UserRankingItemForScore";

const UserRankingList: React.FC = () => {
  const userInfo = useUserStore((state) => state.userInfo);
  const { ref: loadMoreRef, inView: isInView } = useInView({
    threshold: 0.5, // 50%가 화면에 보일 때 트리거
    triggerOnce: false,
  });

  // 유저 점수 기반 순위 데이터를 가져오는 함수
  const fetchUserScoreRankings = async (pageParam: number) => {
    const response = await apiClient.get(`/score-rankings`, {
      params: {
        page: pageParam,
        size: 5, // 페이지당 5명의 유저 순위 조회
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
    queryKey: ["scoreRankings"],
    queryFn: ({ pageParam = 1 }) => fetchUserScoreRankings(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.last) {
        return lastPage.number + 1; // 다음 페이지 번호 반환
      } else {
        return undefined; // 더 이상 페이지가 없으면 undefined 반환
      }
    },
    enabled: !!userInfo,
  });

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
        <ul className="[&_li:last-child]:text-slate-500 [&_li:first-child]:text-lg divide-y divide-slate-200">
          {data?.pages.map((page, pageIndex) => (
            <React.Fragment key={pageIndex}>
              {page.content.map((ranking: any) => (
                <UserRankingItem
                  key={ranking.userId}
                  userName={ranking.userName}
                  displayName={ranking.displayName}
                  rank={ranking.rank}
                  score={ranking.score} // 점수 표시
                  lastUpdated={ranking.lastUpdated}
                />
              ))}
            </React.Fragment>
          ))}
        </ul>
      )}

      <div ref={loadMoreRef} className="mt-4">
        {isFetchingNextPage
          ? "Loading more..."
          : hasNextPage
          ? "Load More"
          : ""}
      </div>
    </div>
  );
};

export default UserRankingList;

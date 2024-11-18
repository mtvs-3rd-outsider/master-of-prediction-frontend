"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { Skeleton } from "@nextui-org/skeleton";
import BettingProduct from "./BettingProduct";
import apiClient from "@handler/fetch/axios";
import { BettingProductType } from "@/types/BettingTypes";

const BettingProducts = () => {
  const [bettings, setBettings] = useState<BettingProductType[]>([]);
  const [page, setPage] = useState(0);
  const [isLast, setIsLast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 데이터 로드 함수
  const getBettings = useCallback(async () => {
    if (isLoading || isLast) return;

    setIsLoading(true);
    try {
      const response = await apiClient.get("/betting-products", {
        params: { page, size: 10 },
      });

      const { content, last } = response.data;

      // 중복 제거 후 상태 업데이트
      setBettings((prev) => {
        const existingIds = new Set(prev.map((item) => item.bettingId));
        const filteredContent = content.filter(
          (item: BettingProductType) => !existingIds.has(item.bettingId)
        );
        return [...prev, ...filteredContent];
      });

      setIsLast(last);
    } catch (error) {
      console.error("Error fetching betting products:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, isLast]);

  // 페이지 초기 로드 및 페이지 번호 변경 시 데이터 요청
  useEffect(() => {
    getBettings();
  }, [page]);

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback(() => {
    const isBottomReached =
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100;

    if (isBottomReached && !isLoading && !isLast) {
      setPage((prev) => prev + 1);
    }
  }, [isLoading, isLast]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <>
      <Suspense fallback={<Loading />}>
        <ul className="[&_p:last-child]:text-slate-500 [&_p:first-child]:text-lg divide-y divide-slate-200">
          {Array.isArray(bettings) &&
            bettings.map((node) => (
              <li key={node.bettingId}>
                <BettingProduct
                  userID={node.userID}
                  userName={node.userName}
                  displayName={node.displayName}
                  tierName={node.tierName}
                  userImg={node.userImg}
                  title={node.title}
                  imgUrls={node.imgUrls}
                  bettingId={node.bettingId}
                  blindName={node.blindName}
                />
              </li>
            ))}
        </ul>
      </Suspense>
      {isLoading && <Loading />}
    </>
  );
};

export default BettingProducts;

const Loading = () => {
  return (
    <div className="flex justify-center items-center my-4">
      <Skeleton className="rounded-lg">
        <div className="h-24 rounded-lg bg-default-300"></div>
      </Skeleton>
    </div>
  );
};

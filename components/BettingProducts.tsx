"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { Skeleton } from "@nextui-org/skeleton";
import BettingProduct from "./BettingProduct";
import { fetchBettingProducts, fetchFeedsForBettingProducts } from "@/lib/bettingService";
import { BettingProductType } from "@/types/BettingTypes";

const BettingProducts = () => {
  const [bettingProducts, setBettingProducts] = useState<BettingProductType[]>([]);
  const [page, setPage] = useState(0);
  const [isLast, setIsLast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const mergeFeedData = (bettingItems: BettingProductType[], feeds: any[]) => {
    return bettingItems.map((item) => {
      const feedMatch = feeds.find((feedItem: any) => feedItem.id === item.bettingId * -1);
      return feedMatch ? { ...item, postStats: feedMatch } : item;
    });
  };

  const getBettingProducts = useCallback(async () => {
    if (isLoading || isLast) return;
    setIsLoading(true);

    try {
      const { content, last } = await fetchBettingProducts(page);
      const bettingIds = content.map((item: BettingProductType) => item.bettingId * -1);
      const feeds = await fetchFeedsForBettingProducts(bettingIds);

      const mergedContent = mergeFeedData(content, feeds);

      setBettingProducts((prev) => {
        const existingIds = new Set(prev.map((item) => item.bettingId));
        const newItems = mergedContent.filter(
          (item: BettingProductType) => !existingIds.has(item.bettingId)
        );
        return [...prev, ...newItems];
      });

      setIsLast(last);
    } catch (error) {
      console.error("Error fetching betting products:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, isLast]);

  useEffect(() => {
    getBettingProducts();
  }, [page]);

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
        <ul>
          {bettingProducts.map((node) => (
            <li key={node.bettingId}>
              <BettingProduct info={node} />
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

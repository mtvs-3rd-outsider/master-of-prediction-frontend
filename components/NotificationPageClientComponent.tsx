// @components/UserChannelPageClientComponent.tsx (클라이언트 컴포넌트)
"use client";

import React, { useEffect, useState } from "react";
import MyChannel from "@components/MyChannel";
import Tabs from "@components/StickyTabs";
import { MyChannelProps } from "@/app/[locale]/(home)/channel/[userId]/page";
import { useInView } from "react-intersection-observer";
import apiClient from "@handler/fetch/axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import useUserStore from "@store/useUserStore";
import BettingProduct from "./BettingProduct";
import BettingList from "./BettingList";
import ChannelFeedList from "./ChannelFeedList";
import NotificationList from "./NotificationList";
import UserRankingList from "./UserRankingList";
import MyUserRankingItem from "./MyUserRankingItem";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
} from "@nextui-org/react";
import DMList from "./DMList";
import SearchInputSection from "./SearchInputSection";
import { useDebounce } from "@uidotdev/usehooks";
import { fetchSearchResults } from "@handler/UserAPI";
import DMSearchResults from "./DMSearchResults";
import ChatList from "./ChatList";
import { useRouter } from "next/navigation";

interface UserChannelPageProps {
  tabNames: string[];
}

const NotificationPageClientComponent: React.FC<UserChannelPageProps> = ({
  tabNames,
}) => {
  const userInfo = useUserStore((state) => state.userInfo);
  const hasHydrated = useUserStore((state) => state.hasHydrated);
  const router = useRouter();

  useEffect(() => {
    // hydration이 완료된 후에만 로그인 상태 확인
    if (hasHydrated && !userInfo) {
      router.push("/login");
    }
  }, [hasHydrated, userInfo, router]);

  const [activeTab, setActiveTab] = useState(0);
  const [isHeaderVisible, setHeaderVisible] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchTerm = useDebounce(searchQuery, 500);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  const handleSearchToggle = () => {
    setHeaderVisible((prev) => !prev);
    setIsSearching((prev) => !prev);
  };

  const handleSearchInput = (input: string) => {
    setSearchQuery(input);
  };

  const {
    fetchNextPage: fetchNextPageSearch,
    hasNextPage: hasNextPageSearch,
    isFetchingNextPage: isFetchingNextPageSearch,
    data: search,
    error: infiniteErrorSearch,
    status: statusSearch,
  } = useInfiniteQuery({
    queryKey: ["searchResults", debouncedSearchTerm],
    queryFn: ({ pageParam = 1, queryKey }) =>
      fetchSearchResults(pageParam, queryKey),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      !lastPage.last ? lastPage.number + 1 : undefined,
    enabled: !!debouncedSearchTerm,
    staleTime: 5 * 60 * 1000,
  });

  if (!hasHydrated) {
    return null; // Hydration이 완료되지 않았으면 아무것도 렌더링하지 않음
  }

  return (
    <div>
      <SearchInputSection
        guide="메시지 보낼 사람을 검색해보세요"
        title="메시지"
        isHeaderVisible={isHeaderVisible}
        onSearchToggle={handleSearchToggle}
        onInput={handleSearchInput}
      />
      {isSearching && (
        <DMSearchResults
          status={statusSearch}
          search={search}
          infiniteErrorSearch={infiniteErrorSearch}
          fetchNextPageSearch={fetchNextPageSearch}
          hasNextPageSearch={hasNextPageSearch}
          isFetchingNextPageSearch={isFetchingNextPageSearch}
        />
      )}
      {!isSearching && (
        <>
          <Tabs tabNames={tabNames} onTabChange={handleTabChange} />
          <div className="tab-content">
            {activeTab === 0 && <ChatList />}
            {activeTab === 1 && <NotificationList />}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationPageClientComponent;

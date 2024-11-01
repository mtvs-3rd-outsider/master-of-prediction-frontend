"use client";
import React, { useState } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import { useInfiniteQuery } from '@tanstack/react-query';
import SearchInputSection from './SearchInputSection';
import SearchResults from './SearchResults';
import apiClient from '@handler/fetch/axios';
import { fetchSearchResults } from '@handler/UserAPI';
import HotTopicFeedList from './HotTopicFeedList';
import StickyTabsWrapper from './StickyTabs';
import BettingProducts from './BettingProducts';


const MainContent: React.FC = () => {
  const tabs = ["베팅", "게시글"];
  const [isHeaderVisible, setHeaderVisible] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchTerm = useDebounce(searchQuery, 500);
  const [activeTab, setActiveTab] = useState(0);
  const handleSearchToggle = () => {
    setHeaderVisible((prev) => !prev);
    setIsSearching((prev) => !prev);
  };

  const handleSearchInput = (input: string) => {
    setSearchQuery(input);
  };

  const {
    fetchNextPage: fetchNextPageSearch,
    fetchPreviousPage: fetchPreviousPageSearch,
    hasNextPage : hasNextPageSearch,
    hasPreviousPage:hasPreviousPageSearch,
    isFetchingNextPage: isFetchingNextPageSearch,
    isFetchingPreviousPage:isFetchingPreviousPageSearch,
    data: search,
    error:infiniteErrorSearch,
    status:statusSearch
  
  } = useInfiniteQuery(
    {
      queryKey: ['searchResults',debouncedSearchTerm],
      queryFn: ({ pageParam = 1 ,queryKey })=> fetchSearchResults(pageParam,queryKey),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
      // lastPage는 Spring Page 객체입니다.
      console.log(lastPage);
      if (!lastPage.last) {
        return lastPage.number + 1; // 다음 페이지 번호를 반환
      } else {
        return undefined; // 더 이상 페이지가 없으면 undefined 반환
      }
      },
      enabled: !!debouncedSearchTerm,
      staleTime: 5 * 60 * 1000,
    }
  );
  return (
    <main className="col-span-5 w-full border-x border-slate-200">
      <SearchInputSection
        guide="사용자 채널을 검색해보세요"
        title="Home"
        isHeaderVisible={isHeaderVisible}
        onSearchToggle={handleSearchToggle}
        onInput={handleSearchInput}
      />
      {!isSearching && (
        <>
          <StickyTabsWrapper tabNames={tabs} onTabChange={setActiveTab} />

          <div className="p-4">
            {activeTab === 0 && <BettingProducts />}
            {activeTab === 1 && <HotTopicFeedList />}
          </div>
        </>
      )}
      {isSearching && (
        <SearchResults
          status={statusSearch}
          search={search}
          infiniteErrorSearch={infiniteErrorSearch}
          fetchNextPageSearch={fetchNextPageSearch}
          hasNextPageSearch={hasNextPageSearch}
          isFetchingNextPageSearch={isFetchingNextPageSearch}
        />
      )}
    </main>
  );
};

export default MainContent;

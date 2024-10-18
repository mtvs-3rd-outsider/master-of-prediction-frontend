 "use client";
import React, { useState } from 'react';
import { useDebounce } from '@uidotdev/usehooks';

import StickyTabsWrapper from '@components/StickyTabs';
import { useInfiniteQuery } from '@tanstack/react-query';
import apiClient from '@api/axios';
import MyCategories from '@ui/MyCategories';
import Categories from '@ui/Categories';
import SearchResults from '@ui/SearchResults';
import SearchInputSection from '@ui/SearchInputSection';

const fetchSearchResults = async (pageParam: number, queryKey: string[]) => {
  const response = await apiClient.get(`/search/category/displayName`, {
    params: {
      q: queryKey[1],
      page: pageParam,
      size: 5,
    },
  });
  return response.data;
};

export default function Page() {
  const tabs = ['내 카테고리', '탐색'];
  const [activeTab, setActiveTab] = useState(0);
  const [isHeaderVisible, setHeaderVisible] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchTerm = useDebounce(searchQuery, 500);

  const {
    fetchNextPage: fetchNextPageSearch,
    hasNextPage: hasNextPageSearch,
    isFetchingNextPage: isFetchingNextPageSearch,
    data: search,
    error: infiniteErrorSearch,
    status: statusSearch,
  } = useInfiniteQuery({
    queryKey: ['searchResults', debouncedSearchTerm],
    queryFn: ({ pageParam = 1, queryKey }) => fetchSearchResults(pageParam, queryKey),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (!lastPage.last ? lastPage.number + 1 : undefined),
    enabled: !!debouncedSearchTerm,
    staleTime: 5 * 60 * 1000,
  });

  const handleSearchToggle = () => {
    setHeaderVisible((prev) => !prev);
    setIsSearching((prev) => !prev);
  };

  const handleSearchInput = (input: string) => {
    setSearchQuery(input);
  };

  return (
    <main className="col-span-5 w-full border-x border-slate-200">
      <SearchInputSection title="카테고리 채널" guide="카테고리 채널을 검색하세요" isHeaderVisible={isHeaderVisible} onSearchToggle={handleSearchToggle} onInput={handleSearchInput} />

      {!isSearching && (
        <>
          <StickyTabsWrapper tabNames={tabs} onTabChange={setActiveTab} />

          <div className="p-4">
            {activeTab === 0 && <MyCategories />}
            {activeTab === 1 && <Categories />}
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
}

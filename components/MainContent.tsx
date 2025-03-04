import React, { useState } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import { useInfiniteQuery } from '@tanstack/react-query';
import SearchInputSection from './SearchInputSection';
import SearchResults from './SearchResults';
import { fetchSearchResults } from '@handler/UserAPI';
import HotTopicFeedList from './HotTopicFeedList';
import StickyTabsWrapper from './StickyTabs';
import BettingProducts from './BettingProducts';

const MainContent: React.FC = () => {
  const [isHeaderVisible, setHeaderVisible] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchTerm = useDebounce(searchQuery, 500);
  const [activeTab, setActiveTab] = useState(0);
  const [sortBy, setSortBy] = useState<'latest' | 'follow' | 'views' | 'likes'>('latest');

  const handleSearchToggle = () => {
    setHeaderVisible((prev) => !prev);
    setIsSearching((prev) => !prev);
  };

  const handleSearchInput = (input: string) => {
    setSearchQuery(input);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value as 'latest' | 'follow' | 'views' | 'likes');
  };

  const {
    fetchNextPage: fetchNextPageSearch,
    hasNextPage: hasNextPageSearch,
    isFetchingNextPage: isFetchingNextPageSearch,
    data: search,
    error: infiniteErrorSearch,
    status: statusSearch
  } = useInfiniteQuery({
    queryKey: ['searchResults', debouncedSearchTerm],
    queryFn: ({ pageParam = 1, queryKey }) => fetchSearchResults(pageParam, queryKey),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.last) {
        return lastPage.number + 1;
      }
      return undefined;
    },
    enabled: !!debouncedSearchTerm,
  });

  return (
    <main className="col-span-5 w-full border-x border-slate-200">
      <SearchInputSection
        guide="사용자 채널을 검색해보세요"
        title="Home"
        isHeaderVisible={isHeaderVisible}
        onSearchToggle={handleSearchToggle}
        onInput={handleSearchInput}
        onSortChange={handleSortChange}
      />
      {!isSearching && (
        <>
          <StickyTabsWrapper tabNames={["베팅", "게시글"]} onTabChange={setActiveTab} />
          <div className="pt-4">
            {activeTab === 0 && <BettingProducts />}
            {activeTab === 1 && <HotTopicFeedList sortBy={sortBy} />}
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
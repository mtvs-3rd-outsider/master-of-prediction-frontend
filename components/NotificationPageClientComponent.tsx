// @components/UserChannelPageClientComponent.tsx (클라이언트 컴포넌트)
"use client";

import React, { useEffect, useState } from 'react';
import MyChannel from '@components/MyChannel';
import Tabs from '@components/StickyTabs';
import { MyChannelProps } from '@/app/[locale]/(home)/channel/[userId]/page';
import { useInView } from 'react-intersection-observer';
import apiClient from '@handler/fetch/axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import useUserStore from '@store/useUserStore';
import BettingProduct from './BettingProduct';
import BettingList from './BettingList';
import ChannelFeedList from './ChannelFeedList';
import NotificationList from './NotificationList';
import UserRankingList from './UserRankingList';
import MyUserRankingItem from './MyUserRankingItem';
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@nextui-org/react";
import DMList from './DMList';
import SearchInputSection from './SearchInputSection';
import { useDebounce } from '@uidotdev/usehooks';
import { fetchSearchResults } from '@handler/UserAPI';
import DMSearchResults from './DMSearchResults';
import ChatList from './ChatList';

interface UserChannelPageProps {
//   user: MyChannelProps; // 서버에서 전달받은 유저 데이터
  tabNames: string[];
}

const NotificationPageClientComponent: React.FC<UserChannelPageProps> = ({  tabNames }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isHeaderVisible, setHeaderVisible] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
    <div>
      <SearchInputSection guide="메시지 보낼 사람을 검색해보세요" title="메시지" isHeaderVisible={isHeaderVisible} onSearchToggle={handleSearchToggle} onInput={handleSearchInput} />
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
      {/* MyChannel 컴포넌트에 서버에서 전달받은 유저 데이터를 전달 */}
      {/* <MyChannel user = {user} /> */}

      {/* 탭 컴포넌트 */}

      {!isSearching && (
        <>
      <Tabs tabNames={tabNames} onTabChange={handleTabChange} />

      {/* 탭에 따라 표시할 콘텐츠 */}
      <div className="tab-content">
        {activeTab === 0 && <div>
          {/* <ChannelFeedList channelId={Number(user.userId)} channelType='mychannel'/> */}
          <NotificationList/>
          </div>}
        {activeTab === 1 &&  <div>
            <ChatList/>
             </div>}
      </div>
      </>
      )}
    </div>
  );
};

export default NotificationPageClientComponent;

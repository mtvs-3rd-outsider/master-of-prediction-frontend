"use client";
import React, { useState } from 'react';
import StickyTabsWrapper from '@components/StickyTabs';
import Search from '@ui/CustomSearch';
import CategoryChannelCard from '@ui/CategoryChannelCard';
import Header from '@ui/Header';
import Account from '@ui/Account';
import { useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash'; // lodash를 사용하여 debounce 적용
import apiClient from '@api/axios'
import Link from 'next/link';
// API 호출 함수
const fetchSearchResults = async ( queryKey : string ) => {
  const response = await apiClient.get(`/search/displayName?q=${queryKey}`);
  return response.data
};

export default function Page() {
  const tabs=["내 카테고리","탐색"]
  const [activeTab, setActiveTab] = useState(0); // 탭 상태 관리
  const [isHeaderVisible, setHeaderVisible] = useState(true); // 헤더 보임 여부 관리
  const [isSearching, setIsSearching] = useState(false); // 검색 상태 관리
  const [searchQuery, setSearchQuery] = useState(''); // 검색 쿼리 상태

  const handleSearchToggle = () => {
    setHeaderVisible((prev) => !prev); // 헤더 표시 상태를 반전
    setIsSearching((prev) => !prev);   // 검색 중인지 여부 설정
  };

  // 검색 입력이 변경될 때마다 호출 (debounced)
  const handleSearchInput = debounce((input: string) => {
    setSearchQuery(input);
  }, 300); // 300ms의 debounce 적용

  // React Query를 사용한 검색 API 호출
  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ['searchResults', searchQuery], // queryKey로 검색 쿼리를 관리
    queryFn: () => fetchSearchResults(searchQuery), // 검색 API 호출 함수
    enabled: !!searchQuery, // searchQuery가 존재할 때만 요청 수행
    staleTime: 5 * 60 , // 5분 동안 캐시 상태 유지
  });

  // 탭 변경 핸들러
  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  return (
    <>
      <main className="col-span-5 w-full border-x border-slate-200">
        {/* 검색 상태에 따라 헤더와 검색창 고정 */}
        <div>
          <Header title="카테고리 채널" hide={!isHeaderVisible}>
            <Search onSearchToggle={handleSearchToggle} onInput={handleSearchInput} />
          </Header>
          {!isHeaderVisible && (
            <div className="p-4 mt-2 w-full flex justify-center items-center">
              <Search onSearchToggle={handleSearchToggle} initialIsOpen={!isHeaderVisible} onInput={handleSearchInput} />
            </div>
          )}
        </div>

        {/* 검색 중이 아닐 때만 탭을 표시 */}
        {!isSearching && (
          <>
            <StickyTabsWrapper tabNames={tabs} onTabChange={handleTabChange} />

            {/* 탭에 따른 조건부 렌더링 */}
            <div className="p-4">
              {activeTab === 0 && (
                <div>
                  <CategoryChannelCard
                    href="/community/react-developers"
                    categoryChannelName="React Developers"
                    badge="Technology"
                    avatars={[
                      "https://i.pravatar.cc/150?u=react-dev",
                      "https://i.pravatar.cc/150?u=react-dev1",
                      "https://i.pravatar.cc/150?u=react-dev2",
                      "https://i.pravatar.cc/150?u=react-dev3",
                    ]}
                  />
                  <CategoryChannelCard
                    href="/community/javascript-masters"
                    categoryChannelName="JavaScript Masters"
                    badge="Programming"
                    avatars={[
                      "https://i.pravatar.cc/150?u=js-master",
                      "https://i.pravatar.cc/150?u=js-master1",
                      "https://i.pravatar.cc/150?u=js-master2",
                      "https://i.pravatar.cc/150?u=js-master3",
                    ]}
                  />
                  <CategoryChannelCard
                    href="/community/frontend-gurus"
                    categoryChannelName="Frontend Gurus"
                    badge="Design"
                    avatars={[
                      "https://i.pravatar.cc/150?u=frontend-guru",
                      "https://i.pravatar.cc/150?u=frontend-guru1",
                      "https://i.pravatar.cc/150?u=frontend-guru2",
                      "https://i.pravatar.cc/150?u=frontend-guru3",
                    ]}
                  />
                </div>
              )}

              {activeTab === 1 && (
                <div>
                  <CategoryChannelCard
                    href="/community/ux-ui-designers"
                    categoryChannelName="UX/UI Designers"
                    badge="Design"
                    avatars={[
                      "https://i.pravatar.cc/150?u=ux-ui",
                      "https://i.pravatar.cc/150?u=ux-ui1",
                      "https://i.pravatar.cc/150?u=ux-ui2",
                      "https://i.pravatar.cc/150?u=ux-ui3",
                    ]}
                  />
                  <CategoryChannelCard
                    href="/community/fullstack-developers"
                    categoryChannelName="Fullstack Developers"
                    badge="Fullstack"
                    avatars={[
                      "https://i.pravatar.cc/150?u=fullstack-dev",
                      "https://i.pravatar.cc/150?u=fullstack-dev1",
                      "https://i.pravatar.cc/150?u=fullstack-dev2",
                      "https://i.pravatar.cc/150?u=fullstack-dev3",
                    ]}
                  />
                </div>
              )}
            </div>
          </>
        )}

        {/* 검색 중일 때 검색 결과 표시 */}
        {isSearching && (
          <div className="p-4">
            {isLoading ? (
              <p>검색 중...</p>
            ) : error ? (
              <p>에러 발생: {error.message}</p>
            ) : (
              searchResults?.map((result: any) => (
                <Link key={result.userId} href={`/channel/${result.user_id}`}>
                  <Account
                    className="px-2 py-2"
                    userName={result.user_name}
                    avatarUrl={result.avatar_img}
                    displayName={result.display_name}
                    tier={result.tier}
                  />
                </Link>
              ))
            )}
          </div>
        )}
      </main>
    </>
  );
}

"use client";
import React, {useEffect, useRef, useState } from 'react';
import StickyTabsWrapper from '@components/StickyTabs';
import Search from '@ui/CustomSearch';
import CategoryChannelCard from '@ui/CategoryChannelCard';
import Header from '@ui/Header';
import Account from '@ui/Account';
import { useQuery,useInfiniteQuery  } from '@tanstack/react-query';
import { debounce } from 'lodash';
import apiClient from '@api/axios'
import Link from 'next/link';
import { useDebounce } from "@uidotdev/usehooks";
import useUserStore from '@store/useUserStore';
import { stat } from 'fs';
import { useInView } from 'react-intersection-observer';



// Fetch search results
const fetchSearchResults = async (pageParam:number ,queryKey: string[]) => {
  const response = await apiClient.get(`/search/category/displayName`,{
    params: { 
      q: queryKey[1],
      page: pageParam,
      size: 5,
      }} );
  return response.data;
};

export default function Page() {
  const tabs = ["내 카테고리", "탐색"];
  const [activeTab, setActiveTab] = useState(0);
  const [isHeaderVisible, setHeaderVisible] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchTerm = useDebounce(searchQuery, 500);
  const [flag, setFlag] = useState('CATEGORY'); // Default to "ALL"
  const userInfo = useUserStore(state=>state.userInfo);
  const { ref: loadMoreRef, inView: isInView } = useInView({
    threshold: 0.5, // 50%가 보일 때 트리거
    triggerOnce: false, // 여러 번 트리거되도록 설정
  });


    // Fetch categories b ased on the flag
const fetchMyCategories = async (pageParam: number) => {
  const flag:string = "CATEGORY";
  const response = await apiClient.get(`/subscriptions/user/${userInfo?.id}/following`, {
    params: { 
      flag , isUserChannel:true,
      page: pageParam,
      size: 5,
      }  // Send flag as a query param
  });


  return response.data;
};

const fetchCategories = async (pageParam  :number) => {
  const response = await apiClient.get('/category-channels', {
    params: {
      page: pageParam,
      size: 5,
    },
  });
  return response.data;
};
  // Toggle search bar visibility
  const handleSearchToggle = () => {
    setHeaderVisible((prev) => !prev);
    setIsSearching((prev) => !prev);
  };

  // Handle search input with debounce
  const handleSearchInput = debounce((input: string) => {
    setSearchQuery(input);
  }, 300);

  // React Query to fetch search results
  // const { data: searchResults, isLoading, error } = useQuery({
  //   queryKey: ['searchResults', debouncedSearchTerm],
  //   queryFn: () => fetchSearchResults(debouncedSearchTerm),
  //   enabled: !!debouncedSearchTerm,
  //   staleTime: 5 * 60 * 1000,
  // });
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
  // React Query to fetch categories for "My Category" tab with the flag
  // const { data: myCategories, isLoading: isLoadingCategories } = useQuery({
  //   queryKey: ['myCategories', flag],  // Add flag to the query key
  //   queryFn: () => fetchMyCategories(flag), 
  //   enabled: !!userInfo, // Fetch categories with flag
  //   staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  // });
  const {
    fetchNextPage: fetchNextPageMyCategories,
    fetchPreviousPage: fetchPreviousPageMyCategories,
    hasNextPage : hasNextPageMyCategories,
    hasPreviousPage:hasPreviousPageMyCategories,
    isFetchingNextPage: isFetchingNextPageMyCategories,
    isFetchingPreviousPage:isFetchingPreviousPageMyCategories,
    data: myCategories,
    error:infiniteErrorMyCategories,
    status:statusMyCategories

  } = useInfiniteQuery(
    {
      queryKey: ['mycategories',flag],
      queryFn: ({ pageParam = 1})=> fetchMyCategories(pageParam),
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
      enabled: !!userInfo
  }
  );


  // React Query to fetch categories for "My Category" tab with the flag
  const {
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    data,
    error:infiniteError,
    status

  } = useInfiniteQuery(
    {
      queryKey: ['categories'],
      queryFn: ({ pageParam = 1 })=> fetchCategories(pageParam),
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
  }
  );

  useEffect(() => {
    console.log("hasNextPage",hasNextPage)
    console.log("isInView",isInView)
    if (isInView && hasNextPage) {
      fetchNextPage();
    }
  }, [isInView, hasNextPage, fetchNextPage]);

  useEffect(() => {
    console.log("hasNextPage",hasNextPageMyCategories)
    console.log("isInView",isInView)
    if (isInView && hasNextPageMyCategories) {
      fetchNextPageMyCategories();
    }
  }, [isInView, hasNextPageMyCategories, fetchNextPageMyCategories]);
  useEffect(() => {
    console.log("hasNextPage",hasNextPageSearch)
    console.log("isInView",isInView)
    if (isInView && hasNextPageSearch) {
      fetchNextPageSearch();
    }
  }, [isInView, hasNextPageSearch, fetchNextPageSearch]);


  console.log(data);

  // Tab change handler
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
                  {statusMyCategories === 'pending' ? (
                    <p>Loading categories...</p>
                  ) : statusMyCategories === 'error' ?  <p>Error: {infiniteErrorMyCategories.message}</p>: 
                 (


                  myCategories?.pages.map((page, pageIndex) =>(
                    <React.Fragment key={pageIndex}>
                      {page.content.map( ((category: any) => (
                   <CategoryChannelCard
                     key={category.channelId}
                     href={`/category-channel/${category.channelId}`}
                     categoryChannelName={category.channelName}
                     badge={ category.isUserChannel ? 'User Channel' : 'Category'}
                     avatars={[category.channelImageUrl]} // Assuming you have a channel image
                   />
                 ))
                      )
                      }
                    </React.Fragment>
                  ))
                   
                  )}
                  <div ref={loadMoreRef}>
                
                {isFetchingNextPageMyCategories ? 'Loading more...' : hasNextPageMyCategories
                     ? 'Load More'
                     : ''}
              </div>
                </div>
              )}

              {activeTab === 1 && (
               <div>
               {status === 'pending' ? (
                    <p>Loading categories...</p>
                  ) : status === 'error' ?  <p>Error: {infiniteError.message}</p>: (
                  data?.pages.map((page, pageIndex) =>(
                    <React.Fragment key={pageIndex}>
                      {page.content.map( ((category: any) => (
                   <CategoryChannelCard
                     key={category.channelId}
                     href={`/category-channel/${category.channelId}`}
                     categoryChannelName={category.displayName}
                     badge={ 'Category'}
                     avatars={[category.imageUrl]} // Assuming you have a channel image
                   />
                 ))
                      )
                      }
                    </React.Fragment>
                  ))
                 
               )}
   
               <div ref={loadMoreRef}>
                
        {isFetchingNextPage ? 'Loading more...' : hasNextPage
             ? 'Load More'
             : ''}
      </div>
             </div>
              )}
            </div>
          </>
        )}

        {/* 검색 중일 때 검색 결과 표시 */}
        {isSearching && (
          <div className="p-4">

{statusSearch === 'pending' ? (
                    <p>Loading categories...</p>
                  ) : statusSearch === 'error' ?  <p>Error: {infiniteErrorSearch.message}</p>: 
                 (


                  search?.pages.map((page, pageIndex) =>(
                    <React.Fragment key={pageIndex}>
                      {page.content.map( ((category: any) => (
                   <CategoryChannelCard
                     key={category.category_channel_id}
                     href={`/category-channel/${category.category_channel_id}`}
                     categoryChannelName={category.display_name}
                     badge={ 'Category'}
                     avatars={[category.image_url]} // Assuming you have a channel image
                   />
                 ))
                      )
                      }
                    </React.Fragment>
                  ))
                   
                  )}
                   <div ref={loadMoreRef}>
                
                {isFetchingNextPageSearch ? 'Loading more...' : hasNextPageSearch
                     ? 'Load More'
                     : ''}
              </div>
            
          </div>
        )}
      </main>
    </>
  );
}

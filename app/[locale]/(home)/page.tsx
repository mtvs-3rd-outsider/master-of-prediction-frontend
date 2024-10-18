"use client";
import React, { useEffect, useRef, useState } from 'react';
import Header from '@ui/Header';
import Account from '@ui/Account';
// import Feed from '@ui/Feed';
import Search from '@ui/CustomSearch';
import Panel from '@ui/Panel';
import PanelItem from '@ui/PanelItem';
import PanelItemTrends from '@ui/PanelItemTrends';
import Footer from '@ui/Footer';
import { useRouter } from 'next/navigation';
import useUserStore from '@store/useUserStore';
import apiClient from '@handler/fetch/axios';
import AdBanner from '@ui/AdBanner';
import { useDebounce } from "@uidotdev/usehooks";
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import { useInfiniteQuery } from '@tanstack/react-query';
// Helper function to get accessToken from cookie
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}
const fetchSearchResults = async (pageParam:number ,queryKey: string[]) => {
  const response = await apiClient.get(`/search/user/displayName`,{
    params: { 
      q: queryKey[1],
      page: pageParam,
      size: 5,
      }} );
  return response.data;
};

const HomePage: React.FC = () => {
  const [isHeaderVisible, setHeaderVisible] = useState(true); // 헤더 보임 여부 관리
  const [isSearching, setIsSearching] = useState(false); // 검색 상태 관리
  const [searchQuery, setSearchQuery] = useState(''); // 검색 쿼리 상태
  const debouncedSearchTerm = useDebounce(searchQuery, 500);
  const { ref: loadMoreRef, inView: isInView } = useInView({
    threshold: 0.5, // 50%가 보일 때 트리거
    triggerOnce: false, // 여러 번 트리거되도록 설정
  });
  const router = useRouter();
  const setUserInfo = useUserStore((state) => state.setUserInfo);
  const adRef = useRef<HTMLDivElement | null>(null);
  const adLoadedRef = useRef(false); // 광고가 이미 로드되었는지 확인하는 플래그

  const handleSearchToggle = () => {
    setHeaderVisible((prev) => !prev); // 헤더 표시 상태 반전
    setIsSearching((prev) => !prev);   // 검색 중인지 여부 설정
  };
  
  // 검색 입력 핸들러 (debounce 적용)
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
  useEffect(() => {
    console.log("hasNextPage",hasNextPageSearch)
    console.log("isInView",isInView)
    if (isInView && hasNextPageSearch) {
      fetchNextPageSearch();
    }
  }, [isInView, hasNextPageSearch, fetchNextPageSearch]);

  useEffect(() => {
    const fetchUserInfo = async () => {
        // 쿠키에서 accessToken을 가져옴
        const accessToken = getCookie("accessToken");
        if (accessToken) {
          // 사용자 정보 요청
          const userInfoResponse = await apiClient.get("/auth/users", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
  
          // Zustand 스토어에 userInfo를 저장
          setUserInfo({ ...userInfoResponse.data, token: accessToken });
  
        }


      
    };

    fetchUserInfo();
  }, [router, setUserInfo]);
  
  return (
    <>
      <main className="col-span-5 w-full border-x border-slate-200">
      <div>
        <Header title="Home" hide={!isHeaderVisible}>
            <Search  onSearchToggle={handleSearchToggle} onInput={handleSearchInput} />
          </Header>
          {!isHeaderVisible && (
            <div className="p-4 mt-2 w-full flex justify-center items-center">
              <Search placeholder="사용자 채널을 검색하세요" onSearchToggle={handleSearchToggle} initialIsOpen={!isHeaderVisible} onInput={handleSearchInput} />
            </div>
          )}
             </div>
        {/* <Feed /> */}

             {!isSearching && (
<></>
             )
             }
              {/* 검색 중일 때 검색 결과 표시 */}
        {isSearching && (
          <div className="p-4">
        
            
{statusSearch === 'pending' ? (
                    <p>Loading ...</p>
                  ) : statusSearch === 'error' ?  <p>Error: {infiniteErrorSearch.message}</p>: 
                 (


                  search?.pages.map((page, pageIndex) =>(
                    <React.Fragment key={pageIndex}>
                      {page.content.map( ((result: any) => (
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
      <aside className="col-span-3 hidden xl:flex flex-col w-[350px]">
  <div className="sticky top-0 bottom-0 p-4  ">
    {/* <h2 className="text-xl font-bold mb-4">플랫폼 가이드: 예측의 달인</h2> */}
    
    <div className="mb-6">
      <h3 className="text-lg font-semibold"> 환영합니다!</h3>
      <p className="text-sm text-gray-600">
        예측 플랫폼에 오신 것을 환영합니다. 이곳에서 예측 실력을 발휘하고, 다른 사용자와 경쟁을 통해 실력을 쌓을 수 있습니다.
      </p>
    </div>

    <div className="mb-6">
      <h3 className="text-lg font-semibold">1. 예측 시작하기</h3>
      <p className="text-sm text-gray-600">
        <strong>1단계:</strong> 예측 이벤트에 참여하고, 승률을 예측해보세요.<br />
        <strong>2단계:</strong> 예측 결과에 따라 보상을 획득하세요.
      </p>
    </div>

    <div className="mb-6">
      <h3 className="text-lg font-semibold">2. 보상 시스템</h3>
      <p className="text-sm text-gray-600">
        예측 성공 시 포인트와 보상을 받습니다. 상위 순위에 오를수록 더 많은 보상을 획득할 수 있습니다.
      </p>
    </div>

    <div className="mb-6">
      <h3 className="text-lg font-semibold">3. 순위와 통계</h3>
      <p className="text-sm text-gray-600">
        리더보드에서 순위와 예측 성공률을 확인하고, 개인 통계 페이지에서 누적 보상 및 참여 횟수를 볼 수 있습니다.
      </p>
    </div>

    <div className="mb-6">
      <h3 className="text-lg font-semibold">4. 커뮤니티 기능</h3>
      <p className="text-sm text-gray-600">
        다른 사용자와 예측 정보를 공유하거나 토론에 참여하며, 더 나은 배팅 전략을 세워보세요.
      </p>
    </div>

    <div>
      <h3 className="text-lg font-semibold">5. 안전한 배팅</h3>
      <p className="text-sm text-gray-600">
        모든 예측은 공정하게 처리되며, 사용자의 데이터를 안전하게 보호합니다. 책임감 있게 예측하세요.
      </p>
    </div>
  </div>
  <AdBanner
        dataAdFormat="auto"
        dataFullWidthResponsive={true}
        dataAdSlot="2358632947348636"
        />
        <Footer />
</aside>


    </>
  );
};

export default HomePage;

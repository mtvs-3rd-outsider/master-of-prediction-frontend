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

interface UserChannelPageProps {
  user: MyChannelProps; // 서버에서 전달받은 유저 데이터
  tabNames: string[];
}

const UserChannelPageClientComponent: React.FC<UserChannelPageProps> = ({ user, tabNames }) => {
  const [activeTab, setActiveTab] = useState(0);
  const userInfo = useUserStore(state=>state.userInfo);
  const { ref: loadMoreRef, inView: isInView } = useInView({
    threshold: 0.5, // 50%가 보일 때 트리거
    triggerOnce: false, // 여러 번 트리거되도록 설정
  });
  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };
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
      queryFn: ({ pageParam = 1 })=> fetchMyBettings(pageParam),
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
  useEffect(() => {
    console.log("hasNextPage",hasNextPage)
    console.log("isInView",isInView)
    if (isInView && hasNextPage) {
      fetchNextPage();
    }
  }, [isInView, hasNextPage, fetchNextPage]);

    // Fetch categories b ased on the flag
    const fetchMyBettings = async (pageParam: number) => {
      const response = await apiClient.get(`/betting-products/user/v2`, {
        params: { 
          userId : userInfo?.id,
          page: pageParam,
          size: 5,
          }  // Send flag as a query param
      });
    
    
      return response.data;
    };
  return (
    <div>
      {/* MyChannel 컴포넌트에 서버에서 전달받은 유저 데이터를 전달 */}
      <MyChannel user = {user} />

      {/* 탭 컴포넌트 */}
      <Tabs tabNames={tabNames} onTabChange={handleTabChange} />

      {/* 탭에 따라 표시할 콘텐츠 */}
      <div className="tab-content">
        {activeTab === 0 && <div>Post content...</div>}
        {activeTab === 1 && <div>Replies content...</div>}
        {activeTab === 2 &&  <div>
               {status === 'pending' ? (
                    <p>Loading categories...</p>
                  ) : status === 'error' ?  <p>Error: {infiniteError.message}</p>: 
                  (
                  <ul className="[&_p:last-child]:text-slate-500 [&_p:first-child]:text-lg divide-y divide-slate-200">
                    {


                  data?.pages.map((page, pageIndex) =>(
                    <React.Fragment key={pageIndex}>
                      {page.content.map( ((node: any) => (
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
                 ))
                      )
                      }
                    </React.Fragment>
                  ))
                }

               </ul>
                 
               )
               }
   
               <div ref={loadMoreRef}>
                
        {isFetchingNextPage ? 'Loading more...' : hasNextPage
             ? 'Load More'
             : ''}
      </div>
             </div>}
      </div>
    </div>
  );
};

export default UserChannelPageClientComponent;

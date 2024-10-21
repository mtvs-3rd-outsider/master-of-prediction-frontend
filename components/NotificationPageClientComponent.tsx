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

interface UserChannelPageProps {
//   user: MyChannelProps; // 서버에서 전달받은 유저 데이터
  tabNames: string[];
}

const NotificationPageClientComponent: React.FC<UserChannelPageProps> = ({  tabNames }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };
  

    
  return (
    <div>
      {/* MyChannel 컴포넌트에 서버에서 전달받은 유저 데이터를 전달 */}
      {/* <MyChannel user = {user} /> */}

      {/* 탭 컴포넌트 */}
      <Tabs tabNames={tabNames} onTabChange={handleTabChange} />

      {/* 탭에 따라 표시할 콘텐츠 */}
      <div className="tab-content">
        {activeTab === 0 && <div>
          {/* <ChannelFeedList channelId={Number(user.userId)} channelType='mychannel'/> */}
          </div>}
        {activeTab === 1 &&  <div>
             <BettingList/>
             </div>}
      </div>
    </div>
  );
};

export default NotificationPageClientComponent;

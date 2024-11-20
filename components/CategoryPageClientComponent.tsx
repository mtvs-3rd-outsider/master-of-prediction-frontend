"use client";

import React, { useState } from 'react';
import CategoryChannel from '@components/CategoryCannel'; // CategoryChannel 컴포넌트 임포트
import Tabs from '@components/StickyTabs'; // Tabs 컴포넌트 임포트
import ChannelFeedList from './ChannelFeedList';
import BettingList from './BettingList';
interface CategoryPageProps {
  category: any; // 서버에서 전달받은 카테고리 데이터
  tabNames: string[];
}

const CategoryPageClientComponent: React.FC<CategoryPageProps> = ({ category, tabNames }) => {
  const [activeTab, setActiveTab] = useState(0); // 현재 활성화된 탭의 인덱스 상태

  const handleTabChange = (index: number) => {
    console.log(`Active tab: ${index}`);
    setActiveTab(index); // 선택된 탭의 인덱스를 업데이트
  };

  return (
    <div>
      {/* CategoryChannel 컴포넌트에 서버에서 전달받은 카테고리 데이터를 전달 */}
      {category && <CategoryChannel channel={category} />}

      {/* Tabs 컴포넌트: 탭 선택에 따라 콘텐츠 변경 */}
      <Tabs tabNames={tabNames} onTabChange={handleTabChange} />

      {/* 선택된 탭에 따라 표시할 콘텐츠 */}
      <div className="mt-4">
      <div className="tab-content">
        {activeTab === 0 && <div>
          <ChannelFeedList channelId={category.channelId} channelType='CATEGORYCHANNEL'/>
          </div>}
        {activeTab === 1 &&  <div>
             <BettingList/>
             </div>}
      </div>
      </div>
    </div>
  );
};

export default CategoryPageClientComponent;

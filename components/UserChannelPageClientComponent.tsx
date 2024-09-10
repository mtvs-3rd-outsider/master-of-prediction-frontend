// @components/UserChannelPageClientComponent.tsx (클라이언트 컴포넌트)
"use client";

import React, { useState } from 'react';
import MyChannel from '@components/MyChannel';
import Tabs from '@components/StickyTabs';

interface UserChannelPageProps {
  user: any; // 서버에서 전달받은 유저 데이터
  tabNames: string[];
}

const UserChannelPageClientComponent: React.FC<UserChannelPageProps> = ({ user, tabNames }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index: number) => {
    console.log(`Active tab: ${index}`);
    setActiveTab(index);
  };

  return (
    <div>
      {/* MyChannel 컴포넌트에 서버에서 전달받은 유저 데이터를 전달 */}
      <MyChannel user={user} />

      {/* 탭 컴포넌트 */}
      <Tabs tabNames={tabNames} onTabChange={handleTabChange} />

      {/* 탭에 따라 표시할 콘텐츠를 추가로 렌더링할 수 있음 */}
      {activeTab === 0 && <div>Post content...</div>}
      {activeTab === 1 && <div>Replies content...</div>}
      {activeTab === 2 && <div>Bettings content...</div>}
    </div>
  );
};

export default UserChannelPageClientComponent;

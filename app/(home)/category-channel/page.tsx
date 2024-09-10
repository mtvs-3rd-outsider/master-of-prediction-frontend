"use client";
import React, { useState } from 'react';
import StickyTabsWrapper from '@components/StickyTabs';
import Search from '@ui/CustomSearch';
import CategoryChannelCard from '@ui/CategoryChannelCard';
import Header from '@ui/Header';

export default function Page() {
  const [activeTab, setActiveTab] = useState(0); // 탭 상태 관리
  const tabs = ['내 커뮤니티', '탐색'];

  // 탭 변경 핸들러
  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  return (
    <>
      <main className="col-span-5 w-full border-x border-slate-200">
            {/* Search 컴포넌트를 맨 위로 고정하고 z-index를 높게 설정 */}
  <Header title='카테고리 채널'><Search /></Header>
    

        {/* <Header title="카테고리 채널" /> */}
 

        {/* 탭 UI 컴포넌트 */}
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

      </main>
    </>
  );
}

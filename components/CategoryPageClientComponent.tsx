// @components/CategoryPageClientComponent.tsx (클라이언트 컴포넌트)
"use client";

import React, { useState } from 'react';
import CategoryChannel from '@components/CategoryCannel'; // CategoryChannel 컴포넌트 임포트
import Tabs from '@components/StickyTabs'; // Tabs 컴포넌트 임포트

interface CategoryPageProps {
  category: any; // 서버에서 전달받은 카테고리 데이터
  tabNames: string[];
}

const CategoryPageClientComponent: React.FC<CategoryPageProps> = ({ category, tabNames }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index: number) => {
    console.log(`Active tab: ${index}`);
    setActiveTab(index);
  };

  return (
    <div>
      {/* CategoryChannel 컴포넌트에 서버에서 전달받은 카테고리 데이터를 전달 */}
      <CategoryChannel channel={category} />

      {/* 탭 컴포넌트 */}
      <Tabs tabNames={tabNames} onTabChange={handleTabChange} />

      {/* 탭에 따라 표시할 콘텐츠 */}
      {activeTab === 0 && <div>포스트 콘텐츠...</div>}
      {activeTab === 1 && <div>댓글 콘텐츠...</div>}
      {activeTab === 2 && <div>활동 내역 콘텐츠...</div>}
    </div>
  );
};

export default CategoryPageClientComponent;

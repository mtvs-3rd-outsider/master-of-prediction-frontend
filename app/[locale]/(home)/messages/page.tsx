// app/page.tsx (서버 컴포넌트)
import React from 'react';
import fetchWithBaseURL from '@api/fetch'; 
import useUserStore from '@store/useUserStore';
import NotificationPageClientComponent from '@ui/NotificationPageClientComponent';

// 데이터 페칭 함수: userId를 사용하여 API 요청

// 구조분해를 사용한 MyChannelProps 타입
export type MyChannelProps = {
  userId?: string;
  display_name: string;
  user_img: string;
  banner_img: string;
  user_name: string;
  bio: string;
  location: string;
  website: string;
  birthdate: string;
  joined_date: string;   // 변경됨
  user_gender: string;
  user_point: number;
  transactions: number;
  profit_rate: string;   // 변경됨
  position_value: string; // 변경됨
  trade_count: number;   // 변경됨
  following_count: number; // 변경됨
  follower_count: number;  // 변경됨
  tier_name:string;
  tier_level:number;
};

export  default async function Page( ) {
  // 서버에서 데이터 페칭
  // const updatedData = {
  //   ...userData,
  //   userId: params.userId, // userId를 추가
  // };

  // 탭 데이터
  const tabs = ['쪽지', '알림'];

  return (
    <>
      <main className="col-span-5 w-full border-x border-slate-200 mb-16 xl:mb-0">
        {/* 클라이언트 컴포넌트로 데이터를 전달 */}
        <NotificationPageClientComponent  tabNames={tabs} />
      </main>
    </>
  );
}

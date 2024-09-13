// app/page.tsx (서버 컴포넌트)
import React from 'react';
import UserChannelPageClientComponent from '@components/UserChannelPageClientComponent';
import fetchWithBaseURL from '@api/fetch'; 

// 데이터 페칭 함수: userId를 사용하여 API 요청
async function fetchUserData(userId: string):Promise<MyChannelProps> {
  return fetchWithBaseURL(`/my-channel/${userId}`);
}
export type MyChannelProps = {
  user?: {
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
    points: number;
    transactions: number;
    profit_rate: string;   // 변경됨
    position_value: string; // 변경됨
    trade_count: number;   // 변경됨
    following_count: number; // 변경됨
    follower_count: number;  // 변경됨
  };
};
export default async function Page({ params }: { params: { userId: string } }) {
  // 서버에서 데이터 페칭
  const userData = await fetchUserData(params.userId);
  const updatedData = {
    ...userData,
    userId: params.userId, // userId를 추가
  };

  // 탭 데이터
  const tabs = ['Posts', 'Replies', 'Bettings'];

  return (
    <>
      <main className="col-span-5 w-full border-x border-slate-200">
        {/* 클라이언트 컴포넌트로 데이터를 전달 */}
        <UserChannelPageClientComponent   user={updatedData} tabNames={tabs} />
      </main>
    </>
  );
}

// app/page.tsx (서버 컴포넌트)
import React from "react";
import { redirect } from "next/navigation"; // Next.js 리디렉션 유틸
import UserChannelPageClientComponent from "@components/UserChannelPageClientComponent";
import fetchWithBaseURL from "@api/fetch";
import useUserStore from "@store/useUserStore"; // Zustand 스토어 사용

// 데이터 페칭 함수: userId를 사용하여 API 요청
async function fetchUserData(userId: string): Promise<MyChannelProps> {
  try {
    return await fetchWithBaseURL(`/my-channel/${userId}`);
  } catch (error) {
    console.error("Error fetching user data:", error);
    // Zustand의 clearUserInfo 메서드 호출
    const clearUserInfo = useUserStore.getState().clearUserInfo;
    clearUserInfo(); // 상태 초기화
    redirect("/login"); // 로그인 페이지로 리디렉션
    throw error; // 오류를 다시 던져서 이후 동작 방지
  }
}

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
  joined_date: string; // 변경됨
  user_gender: string;
  user_point: number;
  transactions: number;
  profit_rate: string; // 변경됨
  position_value: string; // 변경됨
  trade_count: number; // 변경됨
  following_count: number; // 변경됨
  follower_count: number; // 변경됨
  tier_name: string;
  tier_level: number;
};

export default async function Page({ params }: { params: { userId: string } }) {
  // 서버에서 데이터 페칭
  const userData = await fetchUserData(params.userId);
  const updatedData = {
    ...userData,
    userId: params.userId, // userId를 추가
  };

  return (
    <>
      <main className="col-span-5 w-full border-x border-slate-200">
        {/* 클라이언트 컴포넌트로 데이터를 전달 */}
        <UserChannelPageClientComponent user={updatedData} />
      </main>
    </>
  );
}

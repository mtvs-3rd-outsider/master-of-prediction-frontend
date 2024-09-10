// app/page.tsx (서버 컴포넌트)
import React from 'react';
import UserChannelPageClientComponent from '@components/UserChannelPageClientComponent';
import fetchWithBaseURL from '@api/fetch'; 

// 데이터 페칭 함수: userId를 사용하여 API 요청
async function fetchUserData(userId: string) {
  return fetchWithBaseURL(`/my-channel/${userId}`);
}

export default async function Page({ params }: { params: { userId: string } }) {
  // 서버에서 데이터 페칭
  const userData = await fetchUserData(params.userId);

  // 탭 데이터
  const tabs = ['Posts', 'Replies', 'Bettings'];

  return (
    <>
      <main className="col-span-5 w-full border-x border-slate-200">
        {/* 클라이언트 컴포넌트로 데이터를 전달 */}
        <UserChannelPageClientComponent user={userData} tabNames={tabs} />
      </main>
    </>
  );
}

// app/page.tsx (서버 컴포넌트)
import React from 'react';
import CategoryPageClientComponent from '@components/CategoryPageClientComponent';
import fetchWithBaseURL from '@api/fetch'; 

// 데이터 페칭 함수: categoryId를 사용하여 API 요청
async function fetchCategoryData(categoryId: string) {
  return fetchWithBaseURL(`/categories/${categoryId}`);
}
const dummyChannelData = {
  name: "Tech Talk Channel",
  banner_img: "https://via.placeholder.com/600x200", // 샘플 배너 이미지 URL
  bio: "Welcome to the Tech Talk Channel.\nHere we discuss the latest trends in technology.",
  location: "San Francisco, CA",
  website: "https://techtalk.com",
  created_at: "2023-01-01",
  category: "Technology",
  follower_count: 1500,
  following_count: 100,
};
export default async function Page({ params }: { params: { categoryId: string } }) {
  // 서버에서 데이터 페칭
  const categoryData =  null;
  // await fetchCategoryData(params.categoryId);

  // 탭 데이터
  const tabs = ['Posts', 'Replies', 'Activity'];

  return (
    <>
      <main className="col-span-5 w-full border-x border-slate-200">
        {/* 클라이언트 컴포넌트로 데이터를 전달 */}
        <CategoryPageClientComponent category={dummyChannelData} tabNames={tabs} />
      </main>
    </>
  );
}

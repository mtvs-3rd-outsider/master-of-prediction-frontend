// app/page.tsx (서버 컴포넌트)
import React from 'react';
import CategoryPageClientComponent from '@components/CategoryPageClientComponent';
import fetchWithBaseURL from '@api/fetch'; 

// 데이터 페칭 함수: categoryId를 사용하여 API 요청
async function fetchCategoryData(categoryId: string) {
  return fetchWithBaseURL(`/category-channels/${categoryId}`);
}

export default async function Page({ params }: { params: { categoryId: string } }) {
  // 서버에서 데이터 패칭
  const categoryData = await fetchCategoryData(params.categoryId);

  // 탭 데이터
  const tabs = ['Posts', 'Replies', 'Activity'];

  return (
    <>
      <main className="col-span-5 w-full border-x border-slate-200">
        {/* 클라이언트 컴포넌트로 데이터를 전달 */}
        <CategoryPageClientComponent category={categoryData} tabNames={tabs} />
      </main>
    </>
  );
}
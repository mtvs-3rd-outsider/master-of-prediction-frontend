// app/page.tsx (서버 컴포넌트)
import React from 'react';
import MyChannel from '@components/MyChannel';
import Tabs from '@components/StickyTabs';
import Search from '@ui/Search';
import Panel from '@ui/Panel';
import PanelItem from '@ui/PanelItem';
import PanelItemTrends from '@ui/PanelItemTrends';
import Footer from '@ui/Footer';
import fetchWithBaseURL from '@api/fetch'; 

// 데이터 페칭 함수: userId를 사용하여 API 요청
async function fetchUserData(userId: string) {
  return fetchWithBaseURL(`/my-channel/${userId}`);
}

export default async function HomePage({ params }: { params: { userId: string } }) {
  // 서버에서 데이터 페칭
  const userData = await fetchUserData(params.userId);

  const tabs = ['Posts', 'Replies', 'Bettings'];
  const trends = [
    { title: "Next JS", category: "Development", stat: "57.5K" },
    { title: "Figma", category: "Design", stat: "107.5K" },
    { title: "Webflow", category: "Design", stat: "127.5K" },
    { title: "Tailwind CSS", category: "Development", stat: "87.5K" },
    { title: "Vercel", category: "Development", stat: "27.5K" },
  ];

  const followSuggestions = [
    {
      src: "https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8Mjd8NzkwMjQ2NTJ8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60",
      name: "Charles Deluvio",
      username: "charlesdeluvio",
      initials: "CD",
    },
    {
      src: "https://images.unsplash.com/photo-1613951085587-cfe5d0a6cffc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MTZ8NzkwMjQ2NTJ8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60",
      name: "Tolga Ulkan",
      username: "tolgaulkan",
      initials: "TU",
    },
    {
      src: "https://images.unsplash.com/photo-1614777735430-7b46df56b404?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXw3OTAyNDY1Mnx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
      name: "Rob Potter",
      username: "robpotter",
      initials: "RB",
    },
  ];

  return (
    <>
      <main className="col-span-5 w-full border-x border-slate-200">
        {/* 서버에서 페칭한 데이터를 MyChannel 컴포넌트에 전달 */}
        <MyChannel user={userData} />
        <Tabs tabNames={tabs} />
      </main>
    </>
  );
}
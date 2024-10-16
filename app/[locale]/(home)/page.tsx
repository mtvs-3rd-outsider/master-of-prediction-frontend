"use client";
import React, { useEffect } from 'react';
import Header from '@ui/Header';
import Feed from '@ui/Feed';
import Search from '@ui/Search';
import Panel from '@ui/Panel';
import PanelItem from '@ui/PanelItem';
import PanelItemTrends from '@ui/PanelItemTrends';
import Footer from '@ui/Footer';
import { useRouter } from 'next/navigation';
import useUserStore from '@store/useUserStore';
import apiClient from '@handler/fetch/axios';
// Helper function to get accessToken from cookie
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

const HomePage: React.FC = () => {
  const router = useRouter();
  const setUserInfo = useUserStore((state) => state.setUserInfo);

  useEffect(() => {
    const fetchUserInfo = async () => {
        // 쿠키에서 accessToken을 가져옴
        const accessToken = getCookie("accessToken");
        if (!accessToken) {
          throw new Error("로그인 토큰을 찾을 수 없습니다.");
        }

        // 사용자 정보 요청
        const userInfoResponse = await apiClient.get("/auth/users", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        // Zustand 스토어에 userInfo를 저장
        setUserInfo({ ...userInfoResponse.data, token: accessToken });

    };

    fetchUserInfo();
  }, [router, setUserInfo]);

  return (
    <>
      <main className="col-span-5 w-full border-x border-slate-200">
        <Header title="Home" />
        <Feed />
      </main>
      <aside className="col-span-3 hidden xl:flex flex-col w-[350px]">
        <div className="sticky top-0">
          <Search />
          <Panel title="What's happening" href="/">
            <PanelItemTrends
              title="Next JS"
              category="Development"
              stat="57.5K"
            />
            <PanelItemTrends title="Figma" category="Design" stat="107.5K" />
            <PanelItemTrends
              title="Webflow"
              category="Design"
              stat="127.5K"
            />
            <PanelItemTrends
              title="Tailwind CSS"
              category="Development"
              stat="87.5K"
            />
            <PanelItemTrends
              title="Vercel"
              category="Development"
              stat="27.5K"
            />
          </Panel>
          <Panel title="Who to follow" href="/">
            <PanelItem
              src="https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8Mjd8NzkwMjQ2NTJ8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60"
              name="Charles Deluvio"
              username="charlesdeluvio"
              initials="CD"
            />
            <PanelItem
              src="https://images.unsplash.com/photo-1613951085587-cfe5d0a6cffc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MTZ8NzkwMjQ2NTJ8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60"
              name="Tolga Ulkan"
              username="tolgaulkan"
              initials="TU"
            />
            <PanelItem
              src="https://images.unsplash.com/photo-1614777735430-7b46df56b404?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXw3OTAyNDY1Mnx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
              name="Rob Potter"
              username="robpotter"
              initials="RB"
            />
          </Panel>
		<Footer />
        </div>
      </aside>

    </>
  );
};

export default HomePage;

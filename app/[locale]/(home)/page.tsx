"use client";
import React, { useEffect, useRef } from 'react';
import Header from '@ui/Header';
// import Feed from '@ui/Feed';
import Search from '@ui/Search';
import Panel from '@ui/Panel';
import PanelItem from '@ui/PanelItem';
import PanelItemTrends from '@ui/PanelItemTrends';
import Footer from '@ui/Footer';
import { useRouter } from 'next/navigation';
import useUserStore from '@store/useUserStore';
import apiClient from '@handler/fetch/axios';
import AdBanner from '@ui/AdBanner';
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
  const adRef = useRef<HTMLDivElement | null>(null);
  const adLoadedRef = useRef(false); // 광고가 이미 로드되었는지 확인하는 플래그
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
        {/* <Feed /> */}
      </main>
      <aside   className="col-span-3 hidden xl:flex flex-col w-[350px]">
        <div className="sticky top-0 bottom-0 bg-black ">
        <AdBanner
        dataAdFormat="auto"
        dataFullWidthResponsive={true}
        dataAdSlot="2358632947348636"
        />
        <AdBanner
        dataAdFormat="auto"
        dataFullWidthResponsive={true}
        dataAdSlot="2358632947348636"
        />
        <AdBanner
        dataAdFormat="auto"
        dataFullWidthResponsive={true}
        dataAdSlot="2358632947348636"
        />
        <AdBanner
        dataAdFormat="auto"
        dataFullWidthResponsive={true}
        dataAdSlot="2358632947348636"
        />
        </div>
      </aside>

    </>
  );
};

export default HomePage;

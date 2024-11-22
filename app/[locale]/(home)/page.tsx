"use client";
import React, { useEffect } from "react";

import Footer from "@ui/Footer";
import AdBanner from "@ui/AdBanner";
import UserInfo from "@ui/UserInfo";
import MainContent from "@ui/MainContent";
import GuideSection from "@ui/GuideSection";
import { getCookie } from "@util/Auth";
import apiClient from "@handler/fetch/axios";
import useUserStore from "@store/useUserStore";
import { useRouter } from "next/navigation"; // Next.js 리디렉션 유틸

const HomePage: React.FC = () => {
  const setUserInfo = useUserStore((state) => state.setUserInfo);
  const clearUserInfo = useUserStore((state) => state.clearUserInfo);
  const router = useRouter(); // Next.js router 사용

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const accessToken = getCookie("accessToken");
        if (accessToken) {
          const userInfoResponse = await apiClient.get("/auth/users", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          setUserInfo({ ...userInfoResponse.data, token: accessToken });
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        clearUserInfo(); // 상태 초기화
        router.push("/login"); // 로그인 페이지로 리디렉션
      }
    };

    fetchUserInfo();
  }, [setUserInfo, clearUserInfo, router]);

  return (
    <>
      <MainContent />
      <aside className="col-span-3 hidden xl:flex flex-col w-[350px]">
        <GuideSection />
      </aside>
    </>
  );
};

export default HomePage;

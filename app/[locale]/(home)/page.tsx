import React, { useEffect } from 'react';

import Footer from '@ui/Footer';
import AdBanner from '@ui/AdBanner';
import UserInfo from '@ui/UserInfo';
import MainContent from '@ui/MainContent';
import GuideSection from '@ui/GuideSection';
import { getCookie } from '@util/Auth';
import apiClient from '@handler/fetch/axios';
import useUserStore from '@store/useUserStore';
import { useRouter } from 'next/navigation';

const HomePage: React.FC = () => {
  const router = useRouter();
  const setUserInfo = useUserStore((state) => state.setUserInfo);

  useEffect(() => {
    const fetchUserInfo = async () => {
        const accessToken = getCookie("accessToken");
        if (accessToken) {

        const userInfoResponse = await apiClient.get("/auth/users", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setUserInfo({ ...userInfoResponse.data, token: accessToken });
      }

    };

    fetchUserInfo();
  }, [router, setUserInfo]);

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

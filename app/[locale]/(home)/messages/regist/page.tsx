"use client"
import React, { useEffect } from 'react';

import Footer from '@ui/Footer';
import AdBanner from '@ui/AdBanner';
import UserInfo from '@ui/UserInfo';
import MainContent from '@ui/MainContent';
import GuideSection from '@ui/GuideSection';
import { getCookie } from '@util/Auth';
import apiClient from '@handler/fetch/axios';
import useUserStore from '@store/useUserStore';
import MessageRegist from '@ui/MessageRegist';

const HomePage: React.FC = () => {

  return (
    <>
      <MessageRegist />
      <aside className="col-span-3 hidden xl:flex flex-col w-[350px]">
        <GuideSection />
      </aside>
    </>
  );
};

export default HomePage;

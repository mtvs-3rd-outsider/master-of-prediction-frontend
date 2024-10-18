import React from 'react';

import Footer from '@ui/Footer';
import AdBanner from '@ui/AdBanner';
import UserInfo from '@ui/UserInfo';
import MainContent from '@ui/MainContent';
import GuideSection from '@ui/GuideSection';

const HomePage: React.FC = () => {
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

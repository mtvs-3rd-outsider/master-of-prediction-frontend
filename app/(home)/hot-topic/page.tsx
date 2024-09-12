"use client";
import React from 'react';
import Header from '@ui/Header';
import HotTopicFeedList from '@components/HotTopicFeedList';

const HotTopicPage: React.FC = () => {
  return (
    <main className="col-span-5 w-full border-x border-slate-200">
      <Header title="Hot Topic" />
      <HotTopicFeedList />
    </main>
  );
};

export default HotTopicPage;
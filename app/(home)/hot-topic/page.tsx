"use client";
import React from 'react';
import Header from '@ui/Header';
import Feed from '@ui/Feed';
import Search from '@ui/Search';
import Panel from '@ui/Panel';
import PanelItem from '@ui/PanelItem';
import PanelItemTrends from '@ui/PanelItemTrends';
import Footer from '@ui/Footer';

const HotTopic: React.FC = () => {
  return (
    <>
      <main className="col-span-5 w-full border-x border-slate-200">
        <Header title="Hot Topic" />
        <Feed />
      </main>
    </>
  );
};

export default HotTopic;

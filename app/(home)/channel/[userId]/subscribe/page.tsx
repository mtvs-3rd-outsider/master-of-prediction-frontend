
"use client";
import React from 'react';
import Tabs2 from '@components/StickyTabs';
import Search from '@ui/Search';
import Panel from '@ui/Panel';
import PanelItem from '@ui/PanelItem';
import PanelItemTrends from '@ui/PanelItemTrends';
import Footer from '@ui/Footer';
import MyChannel from '@components/MyChannel';
import BackButton from '@components/BackButton';
import SubscribePanel from '@components/SubscribePanel';
import Tabs from '@components/Tabs';
import { getParentPath } from '@util/path';
import { usePathname } from "next/navigation"
const HomePage: React.FC = () => {
  const tabs = [ 'Followers', 'Followings'];
  const pathName = usePathname();
  return (
    <>
      <main className="relative col-span-5 w-full border-x border-slate-200">
      <div className=" top-0 left-0 p-4  flex justify-start w-full">
      <BackButton href={getParentPath(pathName)} />
        </div>
        <Tabs tabNames={tabs}/>
      <SubscribePanel title="" href="/">
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
          </SubscribePanel>
      </main>


    </>
  );
};

export default HomePage;

"use client";
import React from 'react';
import { Tabs, Tab } from '@nextui-org/tabs';

const CustomTabs = () => {
  return (
    <>
      <Tabs 
      fullWidth={true} 
        aria-label="Options" 
        color="primary" 
        variant="underlined"
        classNames={{
          tabList: "gap-6 w-full   relative rounded-none p-0 border-b border-divider ",
          cursor: "w-full bg-[#1E2729]",
          tab: " h-12",
          tabContent: "group-data-[selected=true]:text-[#171E1F]"
        }}
      >
        <Tab
          key="photos"
          title={
            <div className="flex items-center space-x-2">
              <span>Photos</span>
            </div>
          }
        />
        <Tab
          key="music"
          title={
            <div className="flex items-center space-x-2">
              <span>Music</span>
            </div>
          }
        />
        <Tab
          key="videos"
          title={
            <div className="flex items-center space-x-2">
              <span>Videos</span>
            </div>
          }
        />
      </Tabs>
    </>
  );
};

export default CustomTabs;

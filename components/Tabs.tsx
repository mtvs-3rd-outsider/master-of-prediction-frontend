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
          cursor: "w-2/3 h-1 rounded-full bg-[#1E2729] ",
          tab: " h-12",
          tabContent: "group-data-[selected=true]:text-[#171E1F]"
        }}
      >
        <Tab
          key="posts"
          title={
            <div className="flex items-center space-x-2">
              <span>Posts</span>
            </div>
          }
        />
        <Tab
          key="replies"
          title={
            <div className="flex items-center space-x-2">
              <span>Replies</span>
            </div>
          }
        />
        <Tab
          key="bettings"
          title={
            <div className="flex items-center space-x-2">
              <span>Bettings</span>
            </div>
          }
        />
      </Tabs>
    </>
  );
};

export default CustomTabs;

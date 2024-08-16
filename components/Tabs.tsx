"use client";
import React from 'react';
import { Tabs, Tab } from '@nextui-org/tabs';

interface TabsProps {
  tabNames: string[];
}

const CustomTabs: React.FC<TabsProps> = ({ tabNames }) => {
  return (
    <>
      <Tabs 
        fullWidth={true} 
        aria-label="Options" 
        color="primary" 
        variant="underlined"
        classNames={{
          tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-2/3 h-1 rounded-full ",
          tab: "h-12",
          tabContent: "group-data-[selected=true]:text-[#171E1F]"
        }}
      >
        {tabNames.map((name, index) => (
          <Tab
            key={index}
            title={
              <div className="flex items-center space-x-2">
                <span>{name}</span>
              </div>
            }
          />
        ))}
      </Tabs>
    </>
  );
};

export default CustomTabs;

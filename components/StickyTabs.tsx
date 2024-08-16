"use client";
import React from 'react';
import CustomTabs from '@components/Tabs'; // Adjust the path to CustomTabs according to your actual project structure.
interface TabsProps {
  tabNames: string[];
}

const StickyTabsWrapper :React.FC<TabsProps> = ({tabNames}) => {
  // Define the header height. Adjust the value according to your actual header height.
  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{ 
          position: 'sticky', 
          top: `0px`, 
          zIndex: 10, 
          backgroundColor: 'white' 
        }}
      >
        <CustomTabs tabNames={tabNames} />
      </div>
      <div style={{ height: '200vh', padding: '20px' }}>
        Scroll to see the sticky effect. Add more content here to see the effect of the sticky tabs.
      </div>
    </div>
  );
};

export default StickyTabsWrapper;

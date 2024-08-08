"use client";
import React, { useEffect, useState } from 'react';
import UserBanner from '@components/user/UserBanner';
import BackButton from '@components/BackButton';

const StickyHeader: React.FC = () => {

 
  return (
    <div className="relative top-0 z-10">
      <div className="fixed top-0  z-10">
        <BackButton />
      </div>
      
    </div>
  );
};

export default StickyHeader;

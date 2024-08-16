"use client";
import React, { useEffect } from 'react';
import { useViewStore } from '@store/useViewStore';

const ViewHandler: React.FC = () => {
  const setIsMobileView = useViewStore((state) => state.setIsMobileView);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 640);
    };

    handleResize(); // 초기 실행
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setIsMobileView]);

  return null;
};

export default ViewHandler;

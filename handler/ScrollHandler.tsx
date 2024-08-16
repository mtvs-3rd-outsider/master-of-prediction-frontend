"use client";
import React, { useEffect } from 'react';
import { useScrollStore } from '@store/useScrollStore';

const ScrollHandler: React.FC = () => {
  const setScrollY = useScrollStore((state) => state.setScrollY);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [setScrollY]);

  return null;
};

export default ScrollHandler;

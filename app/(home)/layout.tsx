"use client";
import '@styles/styles.css';
import { Component, ReactNode } from 'react';
import Nav from '@ui/Nav';
import type { Metadata, Viewport } from "next";
import Head from 'next/head';
import { NextUIProvider } from "@nextui-org/system";
import FloatingActionButton from "@components/FloatingActionButton";
import { usePathname } from 'next/navigation'; 
type LayoutProps = {
  children: ReactNode;
};



export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({ children }: LayoutProps): ReactNode {
  const pathname = usePathname(); // 현재 URL 경로를 추적

  const getFabUrl = () => {
    if (pathname.startsWith('/category-channel')) {
      return '/category-channel/regist'; // 대시보드에서 추가 버튼을 눌렀을 때 이동할 경로
    } else if (pathname.startsWith('/profile')) {
      return '/profile/edit'; // 프로필 페이지에서 이동할 경로
    } else if (pathname.startsWith('/hot-topic')){
      return '/hot-topic/create-feed'; // 핫토픽 feed 등록 경로
    }else {
      return '/default-action'; // 기본 경로
    }
  };
  return (
   
        <NextUIProvider >
          <div className="min-h-screen flex max-w-7xl mx-auto xl:grid xl:grid-cols-10 gap-5">
            {/* Nav 컴포넌트가 로드되기 전에 공간을 확보하여 레이아웃 이동 방지 */}
              <Nav />
              {children}
              <FloatingActionButton href={getFabUrl()} />
          </div>
        </NextUIProvider>
  );
}

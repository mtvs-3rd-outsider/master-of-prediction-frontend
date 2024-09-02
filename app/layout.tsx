// app/layout.tsx
"use client";
import { useEffect } from 'react';
import useUserStore from '@store/useUserStore';
import TanstackQueryProvider from './TanstackQueryProvider';
import React, { Suspense } from 'react';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const rehydrate = useUserStore((state) => state.rehydrate);

  useEffect(() => {
    // 앱이 처음 로드될 때 로컬 스토리지에서 상태를 복원
    rehydrate();
  }, [rehydrate]);
if (process.env.NODE_ENV !== 'development') {
  console.log = function () {}; // 개발 모드가 아닐 때는 console.log 비활성화
}


  return (
    <TanstackQueryProvider>
        {children}
    </TanstackQueryProvider>
  );
}

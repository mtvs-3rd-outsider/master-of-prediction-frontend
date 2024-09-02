// app/layout.tsx
"use client";

import { useEffect } from 'react';
import useUserStore from '@store/useUserStore';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const rehydrate = useUserStore((state) => state.rehydrate);

  useEffect(() => {
    rehydrate(); // 클라이언트에서만 실행되는 상태 복원 로직
  }, [rehydrate]);

  if (process.env.NODE_ENV !== 'development') {
    console.log = function () {}; // 개발 모드가 아닐 때 console.log 비활성화
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

"use client";
import '@styles/styles.css';
import { ReactNode } from 'react';
import Nav from '@ui/Nav';
import { usePathname } from 'next/navigation'; 
import { NextUIProvider } from "@nextui-org/system";
import FloatingActionButton from "@components/FloatingActionButton";
import useUserStore from '@store/useUserStore';
import TanstackQueryProvider from '@ui/TanstackQueryProvider';

type LayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: LayoutProps): ReactNode {
  const pathname = usePathname(); // 현재 URL 경로를 추적
  const { userInfo } = useUserStore((state) => ({
    userInfo: state.userInfo,
  }));

  // Floating Action Button의 경로를 반환하는 함수
  const getFabUrl = () => {
    if (pathname.includes('/category-channel')) {
      return '/category-channel/regist'; // 카테고리 채널 경로
    } else if (pathname.includes('/channel')) {
      return '/channel/regist'; // 프로필 페이지 경로
    }
     else if (pathname.includes('/hot-topic')) {
      return '/hot-topic/create-feed'; // 핫토픽 feed 등록 경로
    } else {
      return null; // 기본 경로 또는 URL에 따라 렌더링하지 않음
    }
  };

  const fabUrl = getFabUrl();

  return (
    <NextUIProvider>
      <div className="min-h-screen flex max-w-7xl mx-auto xl:grid xl:grid-cols-10 gap-5">
        {/* Nav 컴포넌트 */}
        <Nav />
        <TanstackQueryProvider>
          {children}
        </TanstackQueryProvider>

        {/* FloatingActionButton: 로그인 상태에서만 렌더링, 특정 경로에만 표시 */}
        {pathname.includes('/category-channel') && !userInfo ? null : (
          fabUrl && <FloatingActionButton href={fabUrl} />
        )}
      </div>
    </NextUIProvider>
  );
}

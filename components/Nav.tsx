"use client";
import { useEffect, useState, ReactNode } from "react";
import NavItem from "@ui/NavItem";
import AccountNavItem from "@ui/AccountNavItem";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  CircleStackIcon as CircleStackIconOutline,
  FireIcon as FireIconOutline,
  BellIcon as BellIconOutline,
  EnvelopeIcon as EnvelopeIconOutline,
  RectangleStackIcon as RectangleStackIconOutline,
  UserIcon as UserIconOutline,
  MagnifyingGlassIcon as MagnifyingGlassIconOutline, // 검색 아이콘 추가
} from "@heroicons/react/24/outline";
import {
  CircleStackIcon as CircleStackIconSolid,
  FireIcon as FireIconSolid,
  BellIcon as BellIconSolid,
  EnvelopeIcon as EnvelopeIconSolid,
  RectangleStackIcon as RectangleStackIconSolid,
  UserIcon as UserIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid, // 검색 아이콘 추가
} from "@heroicons/react/24/solid";
import { Button } from "@nextui-org/button";
import useUserStore from "@store/useUserStore";
import { useTranslations } from 'next-intl';
interface NavLinkItem {
  href: string;
  text: string;
  icon: ReactNode;
  activeIcon: ReactNode;
}

const Nav: React.FC = () => {
  const t = useTranslations();
  const { hasHydrated, userInfo } = useUserStore((state) => ({
    hasHydrated: state.hasHydrated,
    userInfo: state.userInfo,
  }));
  const [isReady, setIsReady] = useState(false);
  const pathname = usePathname();

  const items: NavLinkItem[] = [
    {
      href: "/betting",
      text: t('배팅'), // 'bettings'를 '배팅'으로 변경
      icon: <CircleStackIconOutline className="w-6 h-6" />,
      activeIcon: <CircleStackIconSolid className="w-6 h-6" />,
    },
    {
      href: "/hot-topic",
      text: t('핫토픽'), // 'hotTopic'을 '핫토픽'으로 변경
      icon: <FireIconOutline className="w-6 h-6" />,
      activeIcon: <FireIconSolid className="w-6 h-6" />,
    },
    {
      href: "/notifications",
      text: t('알림'), // 'notifications'를 '알림'으로 변경
      icon: <BellIconOutline className="w-6 h-6" />,
      activeIcon: <BellIconSolid className="w-6 h-6" />,
    },
    {
      href: "/messages",
      text: t('메시지'), // 'messages'를 '메시지'로 변경
      icon: <EnvelopeIconOutline className="w-6 h-6" />,
      activeIcon: <EnvelopeIconSolid className="w-6 h-6" />,
    },
    {
      href: "/category-channel",
      text: t('카테고리 채널'), // 'categoryChannel'을 '카테고리 채널'로 변경
      icon: <RectangleStackIconOutline className="w-6 h-6" />,
      activeIcon: <RectangleStackIconSolid className="w-6 h-6" />,
    },
    {
      href: "/search",
      text: t('검색'), // 'search'를 '검색'으로 변경
      icon: <MagnifyingGlassIconOutline className="w-6 h-6" />,
      activeIcon: <MagnifyingGlassIconSolid className="w-6 h-6" />,
    },
    ...(userInfo?.id
      ? [
          {
            href: `/channel/${userInfo?.id}`,
            text: t('내 채널'), // 'myChannel'을 '내 채널'로 변경
            icon: <UserIconOutline className="w-6 h-6" />,
            activeIcon: <UserIconSolid className="w-6 h-6" />,
          },
        ]
      : []),
  ];
  
  const router = useRouter();
  const handleClick = () => {
    router.push("/login");
  };

  useEffect(() => {
    if (hasHydrated) {
      setIsReady(true); // Zustand가 hydration이 완료되면 렌더링 시작
    }
  }, [hasHydrated, userInfo]);

  return (
    <>
      <header className="hidden sm:flex w-24 xl:col-span-2">
        <div className="flex flex-1 xl:w-60 flex-col fixed h-full">
          <div className="flex flex-col flex-1">
            <NavItem href="/" width="inline" size="default">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </NavItem>
            {items.map(({ href, text, icon, activeIcon }, i) => (
              <div
                key={`header-${i}`}
                className="rounded-lg focus:outline-none overflow-hidden"
              >
                <NavItem href={href} width="inline" size="default">
                  {pathname === href ? activeIcon : icon}
                  <div className="hidden xl:inline-flex flex-none text-lg font-medium">
                    {text}
                  </div>
                </NavItem>
              </div>
            ))}
          </div>
          <div>
            {isReady ? (
              !userInfo ? (
                <Button
                  radius="full"
                  variant="solid"
                  color="primary"
                  className="font-bold w-full p-3 mb-4"
                  onClick={handleClick}
                >
                  로그인
                </Button>
              ) : (
                <AccountNavItem />
              )
            ) : (
              <div className="h-10 w-full mb-4"></div> // 로딩 중일 때 자리 차지용
            )}
          </div>
        </div>
      </header>

      <footer className="sm:hidden z-10 fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around">
        {items.map(({ href, icon, activeIcon }, i) => (
          <NavItem
            key={`footer-${i}`}
            href={href}
            width="inline"
            size="default"
          >
            {pathname === href ? activeIcon : icon}
          </NavItem>
        ))}
      </footer>
    </>
  );
};

export default Nav;

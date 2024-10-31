"use client";
import { useEffect, useState, ReactNode, useRef } from "react";
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
  TrophyIcon as StarIconOutline,
  UserIcon as UserIconOutline,
  MagnifyingGlassIcon as MagnifyingGlassIconOutline,
} from "@heroicons/react/24/outline";
import {
  CircleStackIcon as CircleStackIconSolid,
  FireIcon as FireIconSolid,
  BellIcon as BellIconSolid,
  EnvelopeIcon as EnvelopeIconSolid,
  RectangleStackIcon as RectangleStackIconSolid,
  TrophyIcon as StarIconSolid,
  UserIcon as UserIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
} from "@heroicons/react/24/solid";
import { Button } from "@nextui-org/button";
import useUserStore from "@store/useUserStore";
import { useTranslations } from 'next-intl';
import { RSocketClientSetup } from "@/hooks/useRSocketConnection";
import { RoomInfo, useMessageStore } from "@store/useMessageStore";

interface NavLinkItem {
  href: string;
  text: string;
  icon: ReactNode;
  activeIcon: ReactNode;
}

const Nav: React.FC = () => {
  
  const t = useTranslations();
 
  const [isReady, setIsReady] = useState(false);
  const pathname = usePathname();
  const clientRef = useRef<any>(null);
  const { hasHydrated, userInfo ,token,userId} = useUserStore((state) => ({
    hasHydrated: state.hasHydrated,
    userInfo: state.userInfo,
    token: state.userInfo?.token,
    userId: state.userInfo?.id
  }));
  const { unreadCount, setUnreadCount,setMessageMap } = useMessageStore(); // `unreadCount` 가져오기

  useEffect(() => {
    if (userInfo) {
      RSocketClientSetup.init({
        clientRef,
        token,
        streams: [
          {
            endpoint: `api.v1.messages.threadInfos/${userId}`,
            onNext: (newMessageMap: Record<string, RoomInfo>) => {
              // messageMap을 부분 업데이트
              setMessageMap(newMessageMap);
  
              // 총 읽지 않은 메시지 수 계산
              const totalUnreadCount = Object.values(newMessageMap).reduce(
                (acc, roomInfo) => acc + roomInfo.unreadMessageCount,
                0
              );
  
              // Zustand에 총 읽지 않은 메시지 수 업데이트
              setUnreadCount(totalUnreadCount);
            },
          },
        ],
      });
  
      console.log("Total Unread Count Updated in Zustand:", unreadCount);
    }
  }, [userInfo, userId, clientRef, token, setMessageMap, setUnreadCount]);
  const items: NavLinkItem[] = [
    {
      href: "/betting",
      text: t('배팅'),
      icon: <CircleStackIconOutline className="w-6 h-6" />,
      activeIcon: <CircleStackIconSolid className="w-6 h-6" />,
    },
    {
      href: "/hot-topic",
      text: t('핫토픽'),
      icon: <FireIconOutline className="w-6 h-6" />,
      activeIcon: <FireIconSolid className="w-6 h-6" />,
    },

    {
      href: "/category-channel",
      text: t('카테고리 채널'),
      icon: <RectangleStackIconOutline className="w-6 h-6" />,
      activeIcon: <RectangleStackIconSolid className="w-6 h-6" />,
    },
    {
      href: "/ranking",
      text: t('랭킹'),
      icon: <StarIconOutline className="w-6 h-6" />,
      activeIcon: <StarIconSolid className="w-6 h-6" />,
    },
   
    ...(userInfo?.id
      ? [
          {
            href: `/channel/${userInfo?.id}`,
            text: t('내 채널'),
            icon: <UserIconOutline className="w-6 h-6" />,
            activeIcon: <UserIconSolid className="w-6 h-6" />,
          },
          {
            href: "/messages",
            text: t('메시지'),
            icon: (
              <div className="relative">
                <EnvelopeIconOutline className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
            ),
            activeIcon: (
              <div className="relative">
                <EnvelopeIconSolid className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
            ),
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
      setIsReady(true);
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
              <div className="h-10 w-full mb-4"></div>
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
        {!userInfo && (
          <NavItem href="/login" width="inline" size="default">
            <UserIconOutline className="w-6 h-6" />
          </NavItem>
        )}
      </footer>
    </>
  );
};

export default Nav;

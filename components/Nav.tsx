"use client";
import { useEffect, useState, ReactNode, useRef } from "react";
import NavItem from "@ui/NavItem";
import AccountNavItem from "@ui/AccountNavItem";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  HomeIcon as HomeIconOutline,
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
  HomeIcon as HomeIconSolid,
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
interface NavProps {
  mobileOnly?: boolean;
}

const Nav: React.FC<NavProps> = ({ mobileOnly = false }) => {
  const t = useTranslations();

  const [isReady, setIsReady] = useState(false);
  const pathname = usePathname();
  const clientRef = useRef<any>(null);
  const { hasHydrated, userInfo, token, userId } = useUserStore((state) => ({
    hasHydrated: state.hasHydrated,
    userInfo: state.userInfo,
    token: state.userInfo?.token,
    userId: state.userInfo?.id,
  }));
  const { unreadCount, setUnreadCount, setMessageMap } = useMessageStore(); // `unreadCount` 가져오기
  const removeLocale = (path: string) => {
    const parts = path.split("/");
    if (parts[1] && parts[1].length === 2) {
      // Locale이 경로에 있는 경우 (예: /ko/home)
      return `/${parts.slice(2).join("/")}`;
    }
    return path; // Locale이 없는 경우 그대로 반환
  };

  const currentPath = removeLocale(pathname);
useEffect(() => {
  if (!userInfo) {
    console.warn("UserInfo is not available. Skipping RSocket setup.");
    return;
  }

  const setupRSocket = async () => {
    try {
      console.log("Initializing RSocket connection...");

      // `init2`로 RSocket 클라이언트 초기화
      const rsocket = await RSocketClientSetup.init({
        token,
        streams: [
          {
            endpoint: `api.v1.messages.threadInfos/${userId}`,
            onNext: (newMessageMap: Record<string, RoomInfo>) => {
              console.log("Received newMessageMap:", newMessageMap);

              const totalUnreadCount = Object.values(newMessageMap).reduce(
                (acc, roomInfo) => acc + roomInfo.unreadMessageCount,
                0
              );

              console.log("Calculated Total Unread Count:", totalUnreadCount);

              setMessageMap(newMessageMap);
              setUnreadCount(totalUnreadCount);
            },
          },
        ],
      });

      clientRef.current = rsocket; // RSocket 객체 저장
      console.log("RSocket connection established");
    } catch (error) {
      console.error("Failed to establish RSocket connection:", error);
    }
  };

  // RSocket 연결 설정
  if (clientRef.current == null) {
    setupRSocket();
  }

  // Cleanup: RSocket 연결 종료
  return () => {
    console.log("Unmounting component. Closing RSocket connection...");
    if (clientRef.current) {
      clientRef.current.close();
      clientRef.current = null; // 상태 초기화
    }
  };
}, [userInfo, userId, token, setMessageMap, setUnreadCount]);
  const items: NavLinkItem[] = [
    {
      href: "/",
      text: t("홈"), // 홈 버튼 추가
      icon: <HomeIconOutline className="w-6 h-6" />,
      activeIcon: <HomeIconSolid className="w-6 h-6" />,
    },
    {
      href: "/betting",
      text: t("배팅"),
      icon: <CircleStackIconOutline className="w-6 h-6" />,
      activeIcon: <CircleStackIconSolid className="w-6 h-6" />,
    },
    {
      href: "/hot-topic",
      text: t("핫토픽"),
      icon: <FireIconOutline className="w-6 h-6" />,
      activeIcon: <FireIconSolid className="w-6 h-6" />,
    },
    {
      href: "/category-channel",
      text: t("카테고리 채널"),
      icon: <RectangleStackIconOutline className="w-6 h-6" />,
      activeIcon: <RectangleStackIconSolid className="w-6 h-6" />,
    },
    {
      href: "/ranking",
      text: t("랭킹"),
      icon: <StarIconOutline className="w-6 h-6" />,
      activeIcon: <StarIconSolid className="w-6 h-6" />,
    },
    ...(userInfo?.id
      ? [
          {
            href: `/channel/${userInfo?.id}`,
            text: t("내 채널"),
            icon: <UserIconOutline className="w-6 h-6" />,
            activeIcon: <UserIconSolid className="w-6 h-6" />,
          },
          {
            href: "/messages",
            text: t("메시지"),
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
  if (mobileOnly) {
    return (
      <nav className="sm:hidden flex justify-around bg-white border-t border-gray-200">
        {items.map(({ href, icon, activeIcon }, i) => (
          <NavItem
            key={`mobile-nav-${i}`}
            href={href}
            width="inline"
            size="default"
          >
            {currentPath === href ? activeIcon : icon}
          </NavItem>
        ))}
        {!userInfo && (
          <NavItem href="/login" width="inline" size="default">
            <UserIconOutline className="w-6 h-6" />
          </NavItem>
        )}
      </nav>
    );
  }

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
                  {currentPath === href ? activeIcon : icon}
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
    </>
  );
};

export default Nav;

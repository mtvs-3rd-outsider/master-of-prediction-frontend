"use client";
import "@styles/styles.css";
import { ReactNode } from "react";
import Nav from "@ui/Nav";
import { usePathname, useSearchParams } from "next/navigation";
import { NextUIProvider } from "@nextui-org/system";
import FloatingActionButton from "@components/FloatingActionButton";
import useUserStore from "@store/useUserStore";
import TanstackQueryProvider from "@ui/TanstackQueryProvider";

type LayoutProps = {
  children: ReactNode;
};

interface FabConfig {
  url: string;
  label?: string;
  channelInfo?: {
    id?: string;
    type?: string;
  } | null;
}

const FAB_LABELS: Record<string, string> = {
  "/category-channel": "카테고리",
  "/channel": "피드",
  "/category-channel/regist": "채널",
  "/hot-topic/create-feed": "토픽",
  "/betting/add": "베팅 추가",
};

export default function RootLayout({ children }: LayoutProps): ReactNode {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userInfo } = useUserStore((state) => ({
    userInfo: state.userInfo,
  }));

  const getFabConfig = (): FabConfig | null => {
    if (pathname.endsWith("/category-channel")) {
      return {
        url: "/category-channel/regist",
        label: FAB_LABELS["/category-channel"],
        channelInfo: null,
      };
    } else if (pathname.includes("/channel")) {
      const channelId = searchParams?.get("channelId");
      return {
        url: "/hot-topic/create-feed",
        label: FAB_LABELS["/channel"],
        channelInfo: channelId
          ? {
              id: channelId,
              type: "MYCHANNEL",
            }
          : undefined,
      };
    } else if (pathname.includes("/category-channel")) {
      const channelId = searchParams?.get("channelId");
      return {
        url: "/hot-topic/create-feed",
        label: FAB_LABELS["/hot-topic/create-feed"],
        channelInfo: channelId
          ? {
              id: channelId,
              type: "CATEGORYCHANNEL",
            }
          : undefined,
      };
    } else if (pathname.endsWith("/betting")) {
      return {
        url: "/betting/add",
        label: FAB_LABELS["/betting/add"],
        channelInfo: null,
      };
    }
    return null;
  };

  const fabConfig = getFabConfig();

  return (
    <NextUIProvider>
      <div className="min-h-screen flex max-w-7xl mx-auto xl:grid xl:grid-cols-10 gap-5  pb-[70px] lg:pb-0">
        {/* Header Section */}
        <Nav />

        {/* Main Content */}
        <TanstackQueryProvider>{children}</TanstackQueryProvider>

        {/* Floating Action Button */}
        {pathname.endsWith("/category-channel") && !userInfo
          ? null
          : fabConfig && (
              <FloatingActionButton
                href={fabConfig.url}
                label={fabConfig.label}
              />
            )}

        {/* Footer for Mobile */}
        <footer className="sm:hidden z-10 fixed bottom-0 w-full bg-white border-t border-gray-200">
          <Nav mobileOnly />
        </footer>
      </div>
    </NextUIProvider>
  );
}

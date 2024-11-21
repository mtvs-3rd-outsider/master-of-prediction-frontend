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
  label?: string; // 추가: 경로에 따른 버튼 텍스트
  channelInfo?: {
    id?: string;
    type?: string;
  } | null;
}

// 경로에 따른 용어 맵
const FAB_LABELS: Record<string, string> = {
  "/category-channel": "카테고리",
  "/channel": "피드",
  "/category-channel/regist": "채널",
  "/hot-topic/create-feed": "토픽",
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
    }
    return null;
  };

  const fabConfig = getFabConfig();

  return (
    <NextUIProvider>
      <div className="min-h-screen flex max-w-7xl mx-auto xl:grid xl:grid-cols-10 gap-5">
        <Nav />
        <TanstackQueryProvider>{children}</TanstackQueryProvider>

        {/* 
          1. pathname이 정확히 /category-channel으로 끝나고 비회원인 경우 버튼 숨김
          2. pathname이 /category-channel을 포함하지만 정확히 그걸로 끝나지 않는 경우 회원/비회원 모두에게 버튼 표시
          3. 그 외의 경로에서는 fabConfig가 있을 때 버튼 표시
        */}
        {pathname.endsWith("/category-channel") && !userInfo
          ? null
          : fabConfig && (
              <FloatingActionButton
                href={fabConfig.url}
                label={fabConfig.label} // 경로에 따른 텍스트 추가
              />
            )}
      </div>
    </NextUIProvider>
  );
}

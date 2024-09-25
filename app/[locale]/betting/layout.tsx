"use client";

import "@styles/styles.css";
import { ReactNode } from "react";
import Nav from "@ui/Nav";
import type { Metadata, Viewport } from "next";
import Head from "next/head";
import { NextUIProvider } from "@nextui-org/system";
import useUserStore from "@store/useUserStore";
import FloatingActionButton from "@ui/FloatingActionButton";
import { Button } from "@nextui-org/button";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type LayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: LayoutProps): ReactNode {
  const { userInfo } = useUserStore((state) => ({
    userInfo: state.userInfo,
  }));

  console.log("userInfo: ", userInfo);

  return (
    <html lang="en">
      <body>
        <NextUIProvider>
          <div className="min-h-screen flex max-w-7xl mx-auto xl:grid xl:grid-cols-10 gap-5">
            {/* Nav 컴포넌트가 로드되기 전에 공간을 확보하여 레이아웃 이동 방지 */}
            <Nav />
            {children}
            {!userInfo ? null : (
              <div className="fixed bottom-20 right-4 md:bottom-4">
                <Link href={"/betting/add"}>
                  <Button
                    isIconOnly
                    color="primary"
                    aria-label="Add"
                    className="rounded-full p-3 shadow-lg"
                  >
                    <PlusIcon className="h-8 w-8" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </NextUIProvider>
      </body>
    </html>
  );
}

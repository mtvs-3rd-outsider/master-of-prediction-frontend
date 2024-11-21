"use client";

import React from "react";
import { Button } from "@nextui-org/react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useRouter, usePathname } from "next/navigation";

interface FloatingActionButtonProps {
  href: string;
  label?: string; // 추가: 버튼에 표시할 선택적 텍스트
}

export default function FloatingActionButton({
  href,
  label,
}: FloatingActionButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    let channelType;
    let channelId = pathname.split("/").pop();

    // URL 패턴에 따라 channelType 결정
    if (pathname.includes("/channel/")) {
      channelType = "MYCHANNEL";
    } else if (pathname.includes("/category-channel/")) {
      channelType = "CATEGORYCHANNEL";
    }

    // 유효한 channelId가 있는 경우에만 쿼리 파라미터 추가
    if (channelId && !isNaN(Number(channelId))) {
      router.push(`${href}?channelId=${channelId}&channelType=${channelType}`);
    } else {
      router.push(href);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 md:bottom-4 flex items-center space-x-2">
      <Button
        isIconOnly={!label} // 텍스트가 있으면 아이콘만 버튼이 아님
        color="primary"
        aria-label={label || "Add"}
        className="rounded-full p-3 shadow-lg flex items-center"
        onPress={handleClick}
      >
        <PlusIcon className="h-5 w-5" />
        {label}
      </Button>
    </div>
  );
}

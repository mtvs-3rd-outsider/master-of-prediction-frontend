"use client";

import React from "react";
import { Button } from "@nextui-org/react";
import { PlusIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

interface FloatingActionButtonProps {
  href: string; // URL을 받아서 버튼이 이동할 경로로 사용
}

export default function FloatingActionButton({ href }: FloatingActionButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(href); // 버튼을 누르면 해당 경로로 이동
  };

  return (
    <div className="fixed bottom-20 right-4 md:bottom-4">
      <Button
        isIconOnly
        color="primary"
        aria-label="Add"
        className="rounded-full p-3 shadow-lg"
        onPress={handleClick} // 버튼 클릭 시 URL 이동
      >
        <PlusIcon className="h-8 w-8" />
      </Button>
    </div>
  );
}

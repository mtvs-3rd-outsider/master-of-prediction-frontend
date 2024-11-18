"use client";
import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import useUserStore from "@store/useUserStore"; // Zustand 스토어 가져오기
import { useRouter } from "next/navigation";

export default function DropdownNext() {
  const clearUserInfo = useUserStore((state) => state.clearUserInfo); // Zustand에서 clearUserInfo 함수 가져오기
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login"); // 페이지 이동을 먼저 실행
    setTimeout(() => {
      clearUserInfo(); // 페이지 이동 후 상태 초기화
      console.log("User logged out successfully.");
    }, 0); // 짧은 지연을 두어 라우터 이동이 실행된 후 clearUserInfo 호출
  };

  const handleSettings = () => {
    router.push("/settings"); // 설정 페이지로 이동
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="light">
          <EllipsisHorizontalIcon className="w-6 h-6" />{" "}
          {/* Heroicons 아이콘 사용 */}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions">
        <DropdownItem key="settings" onClick={handleSettings}>
          설정
        </DropdownItem>
        <DropdownItem
          key="logout"
          className="text-danger"
          onClick={handleLogout}
        >
          로그아웃
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

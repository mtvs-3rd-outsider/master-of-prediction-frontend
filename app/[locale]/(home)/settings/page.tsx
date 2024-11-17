"use client";
import React from "react";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import BackButton from "@components/BackButton";

export default function SettingsPage() {
  const router = useRouter();

  const handlePasswordReset = () => {
    router.push("/change-password"); // 비밀번호 재설정 페이지로 이동
  };

  const handleAccountDeletion = () => {
    router.push("/delete-account"); // 비밀번호 재설정 페이지로 이동
  };

  return (
    <main className="relative col-span-5 w-full border-x border-slate-200 font-GangwonEduPowerExtraBoldA">
      <div className="top-0 left-0 p-4 flex justify-start w-full">
        <BackButton />
      </div>
      <section className="flex flex-col items-center mt-12 p-6">
        <h1 className="text-2xl font-semibold text-center mb-6">설정</h1>
        <div className="w-full max-w-md bg-white p-6 rounded-md shadow-md space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-lg">비밀번호 재설정</span>
            <Button variant="light" onClick={handlePasswordReset}>
              재설정
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg">회원 탈퇴</span>
            <Button color="danger" onClick={handleAccountDeletion}>
              탈퇴
            </Button>
          </div>
          {/* 추가적인 설정 옵션은 여기에 추가 가능 */}
        </div>
      </section>
      <p className="text-sm text-gray-500 mt-12 text-center">
        &copy; 2024 예측의 달인 - All Rights Reserved.
      </p>
    </main>
  );
}

// pages/reset-password.tsx
"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";
import apiClient from "@handler/fetch/axios";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") as string;

  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await apiClient.post("/auth/reset-password", {
        token,
        newPassword,
      });
      toast.success("비밀번호가 성공적으로 재설정되었습니다.");
      router.push("/login");
    } catch (error) {
      setError("비밀번호 재설정에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <main className="w-full border-x border-slate-200">
      <Toaster />
      <section className="flex flex-col md:flex-row h-screen items-center w-full">
        <div className="bg-blue-600 hidden lg:block lg:w-1/2 xl:w-2/3 h-full relative">
          <img
            src="/images/login-bg.webp"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="bg-white w-full md:w-1/2 xl:w-1/3 h-full flex items-center justify-center px-6 lg:px-16 xl:px-12">
          <div className="w-full max-w-md">
            <Link href="/">
              <Button variant="light" size="lg" className="p-2 font-bold">
                예측의 달인
              </Button>
            </Link>
            <h1 className="text-2xl font-semibold text-center my-6">
              새 비밀번호 설정
            </h1>
            <form onSubmit={handleResetPassword}>
              <Input
                isRequired
                label="새 비밀번호"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="mt-4"
              />
              <Input
                isRequired
                label="비밀번호 확인"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-4"
              />
              {error && <p className="text-red-500 mt-2">{error}</p>}
              <Button
                type="submit"
                className="w-full mt-6 bg-blue-500 hover:bg-blue-400 focus:bg-blue-400 text-white"
              >
                비밀번호 재설정
              </Button>
            </form>
            <p className="text-sm text-gray-500 mt-12">
              &copy; 2024 예측의 달인 - All Rights Reserved.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

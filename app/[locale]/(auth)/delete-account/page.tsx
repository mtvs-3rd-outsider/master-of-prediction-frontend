// pages/delete-account.tsx
"use client";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import apiClient from "@handler/fetch/axios";
import useUserStore from "@store/useUserStore";

export default function DeleteAccountPage() {
  const router = useRouter();
  const clearUserInfo = useUserStore((state) => state.clearUserInfo); // Zustand의 clearUserInfo 가져오기

  const handleDeleteAccount = async () => {
    if (confirm("정말로 계정을 삭제하시겠습니까?")) {
      try {
        // Soft delete: 서버에 PUT 요청을 보내 isWithdrawal을 true로 설정
         await apiClient.delete("/auth/delete-account");

        // 사용자 정보 초기화
        clearUserInfo();

        alert("Account deactivated successfully");
        router.push("/signin"); // 계정 비활성화 후 로그인 페이지로 이동
      } catch {
        alert("Failed to deactivate account. Please try again.");
      }
    }
  };

  return (
    <main className="w-full border-x border-slate-200">
      <section className="flex flex-col h-screen items-center justify-center">
        <h1 className="text-2xl font-semibold text-center mb-4">회원 탈퇴</h1>
        <p className="text-center mb-4">
          계정을 삭제하면 모든 데이터가 영구히 비활성화됩니다.
        </p>
        <Button color="danger" onClick={handleDeleteAccount}>
          회원탈퇴
        </Button>
      </section>
    </main>
  );
}

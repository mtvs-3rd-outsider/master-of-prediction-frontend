// components/ErrorBoundary.tsx
"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ErrorBoundaryProps {
  error: Error;
  reset: () => void;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ error, reset }) => {
  const router = useRouter();

  useEffect(() => {
    // 오류 로깅
    console.error("ErrorBoundary caught an error:", error);

    // 디스코드에 오류 메시지 전송
    const sendDiscordNotification = async () => {
      const webhookUrl = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL; // 환경 변수에서 웹훅 URL 가져오기

      if (webhookUrl) {
        try {
          await fetch(webhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: `⚠️ 오류가 발생했습니다:\n\`\`\`${error.message}\`\`\`\n위치: ${window.location.href}`,
            }),
          });
        } catch (notificationError) {
          console.error(
            "Failed to send error notification to Discord:",
            notificationError
          );
        }
      }
    };

    sendDiscordNotification();

    // 로그인 페이지로 리디렉션
    router.push("/");
  }, [error, router]);

  return null; // 리디렉션 중이므로 아무것도 렌더링하지 않음
};

export default ErrorBoundary;

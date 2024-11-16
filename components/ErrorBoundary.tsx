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
    // 오류를 로깅할 수 있습니다.
    console.error("ErrorBoundary caught an error:", error);

    // 로그인 페이지로 리디렉션
    router.push("/login");
  }, [error, router]);

  return null; // 리디렉션 중이므로 아무것도 렌더링하지 않음
};

export default ErrorBoundary;

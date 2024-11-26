"use client";

import { useEffect, useRef, useState } from "react";
import { RSocketClientSetup } from "@/hooks/useRSocketConnection";
import { useTranslationStore } from "@store/useTranslationStore";
import useUserStore from "@store/useUserStore";
import FCM from "@ui/FCM";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";

export default function ClientWrapper({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const token = useUserStore((state) => state.userInfo?.token);

  const clientRef = useRef<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const initializeRSocket = async () => {
      if (!clientRef.current) {
        console.log("Initializing RSocket connection...");
        const client = await RSocketClientSetup.init({
          token,
        });

        clientRef.current = client; // RSocket 클라이언트 저장

        // 초기 연결 이벤트 전송
        RSocketClientSetup.sendEvent(client, "api.v1.status.connect", {
          pagePath: pathname,
        });
      }
    };

    initializeRSocket();

    return () => {
      if (clientRef.current) {
        console.log("Closing RSocket connection...");
        clientRef.current.close();
        clientRef.current = null; // 클라이언트 초기화
      }
    };
  }, [token, pathname]);

  useEffect(() => {
    // 비동기로 번역 메시지 가져오기
    const loadMessages = async () => {
      const messages = await import(`messages/${locale}.json`);

      const setMessages = useTranslationStore.getState().setMessages;
      const setLang = useTranslationStore.getState().setLang; // Zustand에서 언어 설정 함수 가져오기
      setMessages(messages.default); // Zustand 스토어에 번역 메시지 저장
      setLang(locale); // 현재 로케일을 Zustand 스토어에 저장
    };

    loadMessages(); // 메시지 로드 함수 호출
  }, [locale]); // 로케일 변경 시 번역 메시지를 다시 로드

  return (
    <>
      <FCM />
      <Toaster />
      {children}
    </>
  );
}

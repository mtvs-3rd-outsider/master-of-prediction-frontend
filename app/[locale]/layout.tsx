"use client";
import { RSocketClientSetup } from "@/hooks/useRSocketConnection";
import { useTranslationStore } from "@store/useTranslationStore";
import useUserStore from "@store/useUserStore";
import FCM from "@ui/FCM";
import { createMetadata } from "@util/metadataUtils";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import { RSocketClient } from "rsocket-core";
export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { userInfo, token, hasHydrated } = useUserStore((state) => ({
    userInfo: state.userInfo,
    token: state.userInfo?.token,
    hasHydrated: state.hasHydrated,
  }));
   const [rsocket, setRSocket] = useState<any>(null);
  const clientRef = useRef<any>(null);
  const sourceRef = useRef<any>(null);
 const pathname = usePathname();
  useEffect(() => {
    // RSocket 초기화
    const initializeRSocket = async () => {
      const client = await RSocketClientSetup.init2({
        token,
      });

      clientRef.current = client; // rsocket 인스턴스를 상태에 저장

      RSocketClientSetup.sendEvent(client,"api.v1.status.connect", {
        pagePath: pathname,
      });
    };

    initializeRSocket();

    return () => {
      // 컴포넌트 언마운트 시 연결 해제
      if (clientRef.current) {
        clientRef.current.close();
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

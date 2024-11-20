"use client"
import { RSocketClientSetup } from '@/hooks/useRSocketConnection';
import { useTranslationStore } from '@store/useTranslationStore';
import useUserStore from '@store/useUserStore';
import FCM from '@ui/FCM';
import { useEffect, useRef } from 'react';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children, params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
  }) {
  
    const { userInfo, token, hasHydrated } = useUserStore((state) => ({
    userInfo: state.userInfo,
    token: state.userInfo?.token,
    hasHydrated: state.hasHydrated,
  }));
  const clientRef = useRef<any>(null);
  useEffect(() => {
    if (userInfo) {
      // `status.connect` 엔드포인트만 등록, userInfo가 있을 때만 token을 포함
      const selectedStreams = [
        {
          endpoint: `api.v1.status.connect`,
          onNext: (data: any) => {
            console.log("Status connect data received:", data);
          },
        },
      ];

      RSocketClientSetup.init({
        clientRef,
        token: token, // userInfo가 있을 때만 token 전달
        channels: [],
        streams: selectedStreams,
      });
    } else (!userInfo) {
      // userInfo가 없을 때 token 없이 초기화
      RSocketClientSetup.init({
        clientRef,
        channels: [],
        streams: [
          {
            endpoint: `api.v1.status.connect`,
            onNext: (data) => {
              console.log("Status connect data received:", data);
            },
          },
        ],
      });
    }
    return () => clientRef.current?.close();
  }, [token, userInfo]);

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

"use client"
import { useTranslationStore } from '@store/useTranslationStore';
import FCM from '@ui/FCM';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children, params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  
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

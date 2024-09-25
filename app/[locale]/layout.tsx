"use client"
import { useTranslationStore } from '@store/useTranslationStore';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

export default   function RootLayout({
    children,  locale
  }: {
    children: React.ReactNode;
    locale: string; // locale을 상위 컴포넌트에서 props로 전달받음
  }) {
    
    useEffect(() => {
        // 비동기로 번역 메시지 가져오기
        const loadMessages = async () => {
          const messages = await import(`messages/${locale}.json`);
          const setMessages = useTranslationStore.getState().setMessages;
          setMessages(messages.default); // Zustand 스토어에 번역 메시지 저장
        };
    
        loadMessages(); // 메시지 로드 함수 호출
      }, [locale]); // 로케일 변경 시 번역 메시지를 다시 로드
    
    return (
      <>
  <Toaster/>
            {children}
      </>
    );
  }
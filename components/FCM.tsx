// components/FCM.tsx
"use client";
import { useEffect, useCallback, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage, getToken } from 'firebase/messaging';
import useUserStore from '@store/useUserStore'; // useUserStore 불러오기
import apiClient from '@handler/fetch/axios';

export default function FCM() {
  const userInfo = useUserStore((state) => state.userInfo); // UserInfo 가져오기
  const currentToken = useRef<string | null>(null); // useRef를 사용하여 currentToken 관리

  const checkAndRegisterToken = useCallback(async (token: string) => {
    try {
      // 서버에서 기존 FCM 토큰을 가져옴
      const response = await apiClient(`/fcm`);
      const { fcmTokens } = await response.data();

      // 서버에 저장된 토큰과 currentToken 비교
      if (!fcmTokens.includes(token)) {
        // 토큰이 존재하지 않으면 서버에 등록
        await apiClient('/fcm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          data: JSON.stringify({ token }),
        });
        console.log('FCM token registered to the server.');
      } else {
        console.log('Token already exists in the server.');
      }
    } catch (error) {
      console.error('Error retrieving or registering FCM token: ', error);
    }
  }, [userInfo]); // userInfo를 의존성으로 추가

  const onMessageFCM = useCallback(async () => {
    if (!userInfo) {
      console.log('User is not logged in');
      return;
    }

    // 브라우저에 알림 권한을 요청합니다.
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;

    // Firebase 앱 구성
    const firebaseApp = initializeApp({
      apiKey: "AIzaSyBRxGXjdHMYSssRJn2Y8BmPBMcT59akgt8",
      authDomain: "master-of-prediction-384d0.firebaseapp.com",
      projectId: "master-of-prediction-384d0",
      storageBucket: "master-of-prediction-384d0.appspot.com",
      messagingSenderId: "989843402526",
      appId: "1:989843402526:web:1da513d205c118dacb630f",
      measurementId: "G-3CZK9Z9LVB",
    });

    const messaging = getMessaging(firebaseApp);

    // FCM 토큰 가져오기
    getToken(messaging, { vapidKey: "BHzDuDNOeit-xrwflV5FULJ_AbFc17dnJVTVrmeX6FJUYD6DJnIMXTHK3dQtvwgwlCn1YxcwW-AoU7XgvMe_0YU" })
      .then((token) => {
        if (token) {
          currentToken.current = token; // useRef로 관리하는 currentToken에 값 저장
          console.log(currentToken.current); // 토큰 출력
          checkAndRegisterToken(currentToken.current); // 토큰 서버에 등록
        } else {
          console.log('No registration token available. Request permission to generate one.');
        }
      })
      .catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
      });

    // 메시지 수신 시 처리
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
    });
  }, [userInfo, checkAndRegisterToken]); // checkAndRegisterToken을 의존성 배열에 추가

  const unregisterTokenFromServer = useCallback(async (token: string) => {
    try {
      await apiClient(`/fcm`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({ token }),
      });
      console.log('FCM token removed from server.');
    } catch (error) {
      console.error('Error removing FCM token from server: ', error);
    }
  }, [userInfo]); // userInfo를 의존성으로 추가

  useEffect(() => {
    if (userInfo) {
      onMessageFCM();
    }

    // Cleanup 함수: 컴포넌트 언마운트 시 실행
    return () => {
      if (currentToken.current) {
        unregisterTokenFromServer(currentToken.current); // currentToken을 서버에서 제거
      }
    };
  }, [userInfo, onMessageFCM, unregisterTokenFromServer]); // onMessageFCM과 unregisterTokenFromServer 추가

  return null; // UI를 렌더링하지 않기 때문에 null을 반환
}

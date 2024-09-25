"use client";
import axios from 'axios';
import useUserStore from '@store/useUserStore'; // Zustand 스토어 가져오기
import { toast } from 'react-hot-toast'; // react-hot-toast 가져오기
import { useTranslations } from 'next-intl'; // next-intl에서 가져오기
import { useTranslationStore } from '@store/useTranslationStore';


// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,  // API origin으로 설정
  withCredentials: true,  // 인증 정보가 필요할 경우
  headers: {
    'Content-Type': 'application/json',  // 기본은 JSON
  },
});

export default apiClient;

// 요청 인터셉터 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().userInfo?.token; // Zustand에서 토큰 가져오기
    console.log(token);
    console.log(config.baseURL);
    console.log(config.url);
    console.log(config.method);

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      delete config.headers['Authorization'];
    }
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const messages = useTranslationStore.getState().messages; // Zustand에서 번역 메시지 가져오기

    // 상태 코드에 따라 번역된 에러 메시지를 표시
    const status = error.response?.status;
    if (status === 401) {
      toast.error(messages['인증되지_않은_접근_로그인']);
    } else if (status === 403) {
      toast.error(messages['권한_없음']);
    } else if (status === 500) {
      toast.error(messages['서버_내부_오류']);
    } else {
      toast.error(messages['문제가_발생했습니다']);
    }
    
    return Promise.reject(error);
  }
);
// 특정 요청을 보낼 때 headers 설정을 동적으로 변경하는 예시
export const sendMultipartForm = async (url: string, formData: FormData, method: 'post' | 'put') => {
  return apiClient({
    method: method,
    url: url,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

"use client";
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

// UserInfo 인터페이스 정의
export interface UserInfo {
  id?: number;
  email?: string;
  displayName?: string;
  userName?: string;
  age?: number;
  gender?: string;
  authority?: string;
  location?: string;
  token?: string;
  birthday?: string;
  avatarUrl?: string | File;
  tier?: string;
}

// UserStore 인터페이스 정의
interface UserStore {
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo) => void;
  clearUserInfo: () => void;
}

// File을 Base64로 인코딩하는 함수
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Base64 문자열을 다시 File 객체로 변환하는 함수
const base64ToFile = (base64: string, fileName: string, fileType: string): File => {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], fileName, { type: fileType || mime });
};

// Zustand 스토어 생성
const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set, get) => ({
        userInfo: null,

        // 유저 정보를 설정하고 상태를 업데이트
        setUserInfo: async (info: UserInfo) => {
          let serializedInfo = { ...info };

          // File 객체일 경우 Base64로 인코딩하여 저장
          if (info.avatarUrl instanceof File) {
            const base64String = await fileToBase64(info.avatarUrl);
            serializedInfo.avatarUrl = JSON.stringify({
              base64: base64String,
              name: info.avatarUrl.name,
              type: info.avatarUrl.type,
            });
          }

          set({ userInfo: serializedInfo });
        },

        // 유저 정보를 초기화하고 상태를 업데이트
        clearUserInfo: () => {
          set({ userInfo: null });
        },
      }),
      {
        name: 'user-storage', // 로컬 스토리지에 저장될 이름
        partialize: (state) => ({
          userInfo: state.userInfo,
        }),
        onRehydrateStorage: () => {
          return (state, error) => {
            if (error) {
              console.error('an error happened during hydration', error);
            } else {
              const userInfo = state?.userInfo;
              if (userInfo && typeof userInfo.avatarUrl === 'string') {
                // 하이드레이션 시 Base64 문자열을 다시 File로 변환
                try {
                  const avatarData = JSON.parse(userInfo.avatarUrl);
                  if (avatarData?.base64 && avatarData?.name && avatarData?.type) {
                    const restoredFile = base64ToFile(avatarData.base64, avatarData.name, avatarData.type);
                    set({ userInfo: { ...userInfo, avatarUrl: restoredFile } });
                  }
                } catch (e) {
                  console.error('Failed to parse avatarUrl:', e);
                }
              }
            }
          };
        },
      }
    ),
    { name: 'UserStore' } // Devtools에 표시될 스토어 이름
  )
);

export default useUserStore;

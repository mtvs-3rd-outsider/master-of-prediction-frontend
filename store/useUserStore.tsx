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
  avatarUrl?: string;
  tier?: string;
}

// UserStore 인터페이스 정의
interface UserStore {
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo) => void;
  clearUserInfo: () => void;
}

// Zustand 스토어 생성
const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set) => ({
        userInfo: null,

        // 유저 정보를 설정하고 상태를 업데이트
        setUserInfo: (info: UserInfo) => {
          set({ userInfo: info });
        },

        // 유저 정보를 초기화하고 상태를 업데이트
        clearUserInfo: () => {
          set({ userInfo: null });
        },
      }),
      {
        name: 'user-storage', // 로컬 스토리지에 저장될 이름
        partialize: (state) => ({ userInfo: state.userInfo }), // 저장할 상태 선택
        onRehydrateStorage: (state) => {
          console.log(state)
          console.log('hydration starts')
          return (state, error) => {
            if (error) {
              console.log('an error happened during hydration', error)
            } else {
              console.log(state);
              console.log('hydration finished')
            }
          }
        },
      }
    ),
    { name: 'UserStore' } // Devtools에 표시될 스토어 이름
  )
);

export default useUserStore;

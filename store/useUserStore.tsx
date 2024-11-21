"use client";
import toast from "react-hot-toast";
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

// UserInfo 인터페이스 정의
export interface UserInfo {
  id?: string;
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
  hasHydrated: boolean; // Hydration 완료 여부 상태
  setHasHydrated: (state: boolean) => void; // Hydration 상태 업데이트 함수
  updateUserInfo: (partialInfo: Partial<UserInfo>) => void
}

// Zustand 스토어 생성
const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set, get) => ({
        userInfo: null,
        hasHydrated: false, // 초기값 false
        setUserInfo: (info) => {
          if (!info.token) {
            toast.error(
              "User information cannot be set without a valid token."
            );
            return; // Exit early if there's no token
          }
          set({ userInfo: info });
        },
        updateUserInfo: (partialInfo: Partial<UserInfo>) => {
          const currentUserInfo = get().userInfo || {}; // 현재 userInfo 가져오기 (null 체크)
          const filteredInfo = Object.fromEntries(
            Object.entries(partialInfo).filter(
              ([_, value]) => value !== undefined && value !== null
            )
          ); // undefined 또는 null 값 제외
          set({ userInfo: { ...currentUserInfo, ...filteredInfo } });
        },
        clearUserInfo: () => {
          console.log("clearUserInfo called");
          set({ userInfo: null });
          localStorage.removeItem("user-storage");

          // accessToken 쿠키 제거
          document.cookie = document.cookie =
            "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=master-of-prediction.shop;";
        },
        setHasHydrated: (state: boolean) => {
          set({ hasHydrated: state });
        },
      }),
      {
        name: "user-storage",
        partialize: (state) => ({ userInfo: state.userInfo }),
        onRehydrateStorage: () => (state) => {
          console.log("rehydrate success");
          state?.setHasHydrated(true); // Hydration이 완료되면 상태를 true로 설정
        },
      }
    ),
    { name: "UserStore" }
  )
);

export default useUserStore;

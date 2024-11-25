"use client";
import apiClient from "@handler/fetch/axios";
import FCM from "@ui/FCM";
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
  updateUserInfo: (partialInfo: Partial<UserInfo>) => void;
  currentToken: string | null; // FCM 토큰 상태 추가
  setCurrentToken: (token: string | null) => void; // FCM 토큰 업데이트 함수 추가
}

// Zustand 스토어 생성
const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set, get) => ({
        userInfo: null,
        hasHydrated: false, // 초기값 false
        currentToken: null, // 초기값 null
        setCurrentToken: (token) => {
          set({ currentToken: token });
        },
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
          const currentToken = get().currentToken;
          if (currentToken) {
            apiClient(`/fcm`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              data: JSON.stringify({ token: currentToken }),
            })
              .then(() => console.log("FCM token removed from server."))
              .catch((error) =>
                console.error("Error removing FCM token from server: ", error)
              );
          }
          set({ userInfo: null, currentToken: null }); // currentToken 초기화
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

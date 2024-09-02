import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// UserInfo 인터페이스 정의
interface UserInfo {
  id: number;
  email: string;
  userName: string;
  age?: number; 
  gender?: string;
  authority?: string;
  location?: string;
  token?: string;
  birthday?: string;
  avatarUrl?: string;
}

// UserStore 인터페이스 정의
interface UserStore {
  userInfo: UserInfo | null;
  isLogin: boolean;
  setUserInfo: (info: UserInfo) => void;
  clearUserInfo: () => void;
  rehydrate: () => void; // 로컬 스토리지에서 상태를 가져오는 메서드
}

// Zustand 스토어 생성
const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      userInfo: null,
      isLogin: false,

      // 유저 정보를 설정하고 상태를 업데이트
      setUserInfo: (info) => {
        set({ userInfo: info, isLogin: !!info.token });
      },

      // 유저 정보를 초기화하고 상태를 업데이트
      clearUserInfo: () => {
        set({ userInfo: null, isLogin: false });
        localStorage.removeItem('user-storage'); // 로컬 스토리지에서 user-storage 키를 삭제
      },

      // 로컬 스토리지에서 상태를 가져와 상태를 초기화
// 로컬 스토리지에서 상태를 가져와 상태를 초기화
rehydrate: () => {
  const storedState = localStorage.getItem('user-storage');
  
  // 로컬 스토리지에서 가져온 데이터 로그 출력
  console.log('Stored state in localStorage:', storedState);

  if (storedState) {
    const parsedState = JSON.parse(storedState);

    // 파싱된 상태 로그 출력
    console.log('Parsed state:', parsedState);

    if (parsedState.userInfo) {
      set({
        userInfo: parsedState.userInfo,
        isLogin: !!parsedState.userInfo.token
      });

      // 상태가 설정된 후 로그 출력
      console.log('User info set:', parsedState.userInfo);
      console.log('Is logged in:', !!parsedState.userInfo.token);
    }
  } else {
    console.log('No stored state found in localStorage.');
  }
},
    }),
    {
      name: 'user-storage', // 로컬 스토리지에 저장될 이름
      partialize: (state) => ({ userInfo: state.userInfo, isLogin: state.isLogin }), // 저장할 상태 선택
    }
  )
);

export default useUserStore;

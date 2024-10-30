// src/store/useDMListStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RoomInfo } from "@store/useMessageStore";

interface DMListState {
  dmlist: Record<string, RoomInfo>;
  setDMLIst: (
    updateFn:
      | Record<string, RoomInfo>
      | ((prevDMList: Record<string, RoomInfo>) => Record<string, RoomInfo>)
  ) => void;
}

export const useDMListStore = create<DMListState>()(
  persist(
    (set) => ({
      dmlist: {},
      setDMLIst: (updateFn) =>
        set((state) => ({
          dmlist:
            typeof updateFn === "function" ? updateFn(state.dmlist) : updateFn,
        })),
    }),
    {
      name: "dm-list-storage", // 로컬 스토리지 키 이름
      getStorage: () => localStorage, // 기본 저장소 설정
    }
  )
);

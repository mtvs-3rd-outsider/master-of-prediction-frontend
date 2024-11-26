import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
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
      storage: createJSONStorage(() => localStorage), // 클라이언트 환경에서 JSON 스토리지로 사용
    }
  )
);

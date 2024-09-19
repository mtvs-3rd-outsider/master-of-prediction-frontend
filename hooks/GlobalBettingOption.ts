import { create } from "zustand";

interface BettingOptionChoiseState {
  optionId: number;
  setOptionId: (id: number) => void;
}

export const BettingOptionChoiseStore = create<BettingOptionChoiseState>()(
  (set) => ({
    optionId: 0,
    setOptionId: (id: number) => set({ optionId: id }),
  })
);

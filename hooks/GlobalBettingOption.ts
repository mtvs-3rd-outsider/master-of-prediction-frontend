import { BettingOptions } from "@/types/BettingTypes";
import { create } from "zustand";

interface BettingOptionChoiceState {
  optionId: number;
  setOptionId: (id: number) => void;
}

export const BettingOptionChoiceStore = create<BettingOptionChoiceState>()(
  (set) => ({
    optionId: 1,
    setOptionId: (id: number) => set({ optionId: id }),
  })
);

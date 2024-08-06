// stores/useViewStore.ts
"use client";
import {create} from 'zustand';

interface ViewState {
  isMobileView: boolean;
  setIsMobileView: (isMobileView: boolean) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  isMobileView: false,
  setIsMobileView: (isMobileView: boolean) => set({ isMobileView }),
}));

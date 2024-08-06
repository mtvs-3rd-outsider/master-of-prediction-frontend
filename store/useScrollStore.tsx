// useScrollStore.ts
"use client";
import {create} from 'zustand';

interface ScrollState {
  scrollY: number;
  setScrollY: (scrollY: number) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  scrollY: 0,
  setScrollY: (scrollY: number) => set({ scrollY }),
}));

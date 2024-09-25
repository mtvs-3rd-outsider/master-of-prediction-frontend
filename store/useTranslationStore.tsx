import {create} from 'zustand';

interface TranslationState {
  messages: Record<string, string>;
  setMessages: (messages: Record<string, string>) => void;
}

export const useTranslationStore = create<TranslationState>((set) => ({
  messages: {},
  setMessages: (messages) => set({ messages }),
}));
 
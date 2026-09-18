import { create } from "zustand";

interface ChatState {
  activeChatId: string | null;
  setActiveChatId: (chatId: string) => void;
  clearActiveChatId: () => void;
}

export const useChatStore = create<ChatState>()((set) => ({
  activeChatId: null,
  setActiveChatId: (chatId: string) => {
    set({ activeChatId: chatId });
  },
  clearActiveChatId: () => {
    set({ activeChatId: null });
  },
}));

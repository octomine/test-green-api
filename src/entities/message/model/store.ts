import { create } from "zustand";
import type { Message } from "./types";

interface MessageState {
  messagesByChatId: Record<string, Message[]>;
  addMessage: (message: Message) => void;
  clearMessages: (chatId: string) => void;
  clearAllMessages: () => void;
}

export const useMessageStore = create<MessageState>()((set) => ({
  messagesByChatId: {},
  
  addMessage: (message: Message) => {
    set((state) => {
      const chatMessages = state.messagesByChatId[message.chatId] || [];
      
      // Дедупликация: если сообщение с таким id уже есть, не добавляем
      if (chatMessages.some((msg) => msg.id === message.id)) {
        return state;
      }
      
      // Создаем новый массив с добавленным сообщением
      const updatedChatMessages = [...chatMessages, message];
      
      return {
        messagesByChatId: {
          ...state.messagesByChatId,
          [message.chatId]: updatedChatMessages,
        },
      };
    });
  },
  
  clearMessages: (chatId: string) => {
    set((state) => ({
      messagesByChatId: {
        ...state.messagesByChatId,
        [chatId]: [],
      },
    }));
  },
  
  clearAllMessages: () => {
    set({ messagesByChatId: {} });
  },
}));
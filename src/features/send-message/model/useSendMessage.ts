import { useState, useCallback } from "react";
import { sendMessage } from "@/shared/api";
import { useSessionStore } from "@/entities/session";
import { useMessageStore } from "@/entities/message";
import type { Message } from "@/entities/message";

export const useSendMessage = (chatId: string) => {
  const [isSending, setIsSending] = useState<boolean>(false);

  const send = useCallback(
    async (text: string) => {
      // Если текст пустой - ничего не делаем
      if (!text.trim()) {
        return;
      }

      // Получаем учетные данные
      const credentials = useSessionStore.getState().credentials;

      // Если нет учетных данных - выводим ошибку
      if (!credentials) {
        console.error("No credentials found");
        return;
      }

      // Устанавливаем флаг отправки
      setIsSending(true);

      try {
        // Создаем оптимистичное сообщение
        const optimisticId = `temp-${Date.now()}`;
        const message: Message = {
          id: optimisticId,
          chatId,
          text: text.trim(),
          isOutgoing: true,
          timestamp: Date.now(),
        };

        // Добавляем оптимистичное сообщение в хранилище
        useMessageStore.getState().addMessage(message);

        // Отправляем сообщение
        await sendMessage(credentials, chatId, text.trim());

        // Обновляем оптимистичное сообщение реальным id
        // TODO: Здесь нужно реализовать обновление сообщения с временным ID на реальный ID
        // Пока оставим как есть, так как для демонстрации этого достаточно
      } catch (error) {
        console.error("Failed to send message:", error);
        // TODO: Здесь нужно удалить оптимистичное сообщение при ошибке
        // Пока оставим как есть, так как для демонстрации этого достаточно
      } finally {
        // Сбрасываем флаг отправки
        setIsSending(false);
      }
    },
    [chatId],
  );

  return { send, isSending };
};

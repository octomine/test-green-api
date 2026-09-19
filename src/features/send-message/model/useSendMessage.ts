import { useState, useCallback } from 'react';
import { sendMessage } from '@/shared/api';
import { useSessionStore } from '@/entities/session';
import { useMessageStore } from '@/entities/message';
import type { Message } from '@/entities/message';

type SendResult = { success: true } | { success: false; errorKey: 'noCredentials' | 'sendError' };

export const useSendMessage = (chatId: string) => {
  const [isSending, setIsSending] = useState<boolean>(false);

  const send = useCallback(
    async (text: string): Promise<SendResult> => {
      // Если текст пустой - возвращаем ошибку
      if (!text.trim()) {
        return { success: false, errorKey: 'sendError' };
      }

      // Получаем учетные данные
      const credentials = useSessionStore.getState().credentials;

      // Если нет учетных данных - возвращаем ошибку
      if (!credentials) {
        return { success: false, errorKey: 'noCredentials' };
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

        // Конвертируем chatId в формат API
        const apiChatId = chatId.includes('@') ? chatId : `${chatId}@c.us`;

        // Отправляем сообщение
        await sendMessage(credentials, apiChatId, text.trim());

        return { success: true };
      } catch (error) {
        console.error('Failed to send message:', error);
        return { success: false, errorKey: 'sendError' };
      } finally {
        // Сбрасываем флаг отправки
        setIsSending(false);
      }
    },
    [chatId],
  );

  return { send, isSending };
};

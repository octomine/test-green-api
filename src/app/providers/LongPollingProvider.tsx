import { useEffect, type ReactNode } from 'react';
import longPolling from '@/shared/lib/longPolling';
import { useSessionStore } from '@/entities/session';
import { useChatStore } from '@/entities/chat';
import { useMessageStore, type Message } from '@/entities/message';
import type { NotificationBody } from '@/shared/api';

interface LongPollingProviderProps {
  children: ReactNode;
}

const handleNotification = (notification: { receiptId: number; body: NotificationBody }) => {
  const { body } = notification;

  // Пропустить всё, кроме incomingMessageReceived
  if (body.typeWebhook !== 'incomingMessageReceived') return;

  // Пропустить всё, кроме текстовых сообщений
  if (body.messageData?.typeMessage !== 'textMessage') return;

  // Извлечь текст сообщения
  const text = body.messageData.textMessageData?.textMessage;
  if (!text) return;

  // Только личные чаты
  if (body.senderData?.chatType !== 'user') return;

  // Только от собеседника активного чата
  const senderPhone = body.senderData?.senderPhoneNumber;
  if (senderPhone === undefined || senderPhone === null) return;

  const normalizedSender = String(senderPhone).replace(/\D/g, '');
  const activeChatId = useChatStore.getState().activeChatId;
  if (activeChatId === null) return;
  if (normalizedSender !== activeChatId) return;

  // Создать объект сообщения
  const message: Message = {
    id: body.idMessage ?? `incoming-${notification.receiptId}`,
    chatId: activeChatId,
    text,
    isOutgoing: false,
    timestamp: Date.now(),
  };

  // Добавить сообщение в store
  useMessageStore.getState().addMessage(message);
};

export const LongPollingProvider = ({ children }: LongPollingProviderProps) => {
  const credentials = useSessionStore((s) => s.credentials);

  useEffect(() => {
    if (!credentials) return;

    longPolling.start(credentials, {
      onNotification: handleNotification,
      onError: (error) => console.error('[longPolling]', error),
    });

    return () => {
      longPolling.stop();
    };
  }, [credentials]);

  return children;
};

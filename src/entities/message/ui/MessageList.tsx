import { useEffect, useRef } from 'react';
import { useTranslation } from '@/shared/i18n';
import type { Message } from '../model/types';
import { MessageBubble } from './MessageBubble';

export interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  const { t } = useTranslation();

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div className="bg-bg-chat flex flex-1 flex-col gap-2 overflow-y-auto p-4">
      {messages.length === 0 ? (
        <p className="text-text-muted m-auto text-center text-sm">{t('chat.emptyMessages')}</p>
      ) : (
        messages.map((message) => <MessageBubble key={message.id} message={message} />)
      )}
      <div ref={bottomRef} />
    </div>
  );
};

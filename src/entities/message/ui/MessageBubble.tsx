import type { Message } from '../model/types';
import { cn } from '@/shared/lib';

export interface MessageBubbleProps {
  message: Message;
}

const formatTime = (ts: number): string =>
  new Date(ts).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  return (
    <div className={cn('flex flex-col', message.isOutgoing ? 'items-end' : 'items-start')}>
      <div
        className={cn(
          'max-w-xs sm:max-w-sm md:max-w-md',
          'rounded-bubble px-4 py-2 text-sm break-words whitespace-pre-wrap',
          message.isOutgoing
            ? 'bg-bubble-outgoing text-bubble-outgoing-text'
            : 'bg-bubble-incoming text-bubble-incoming-text',
        )}
      >
        {message.text}
      </div>
      <span className="text-text-muted mt-1 px-1 text-xs">{formatTime(message.timestamp)}</span>
    </div>
  );
};

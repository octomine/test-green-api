import type { Message } from '../model/types';
import { cn } from '@/shared/lib';

export interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  return (
    <div className={cn('flex', message.isOutgoing ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-xs sm:max-w-sm md:max-w-md',
          'px-4 py-2 rounded-bubble text-sm break-words whitespace-pre-wrap',
          message.isOutgoing 
            ? 'bg-bubble-outgoing text-bubble-outgoing-text' 
            : 'bg-bubble-incoming text-text border border-border'
        )}
      >
        {message.text}
      </div>
    </div>
  );
};
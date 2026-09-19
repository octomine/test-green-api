import { useState, useRef, type SubmitEvent, type KeyboardEvent } from 'react';
import { useTranslation } from '@/shared/i18n';
import { Textarea, Button } from '@/shared/ui';
import { useSendMessage } from '../model/useSendMessage';

export interface MessageInputProps {
  chatId: string;
}

export const MessageInput = ({ chatId }: MessageInputProps) => {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const { send, isSending } = useSendMessage(chatId);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Если текст пустой - ничего не делаем
    if (!text.trim()) {
      return;
    }

    // Отправляем сообщение
    await send(text);
    
    // Очищаем поле ввода
    setText('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  return (
    <form 
      ref={formRef}
      onSubmit={handleSubmit} 
      className="flex items-end gap-2 p-3 border-t border-border bg-surface"
    >
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t('chat.inputPlaceholder')}
        autoResize
        rows={1}
        className="flex-1"
        disabled={isSending}
        onKeyDown={handleKeyDown}
      />
      <Button 
        type="submit" 
        disabled={isSending || !text.trim()}
      >
        {t('chat.send')}
      </Button>
    </form>
  );
};
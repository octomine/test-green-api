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
  const [error, setError] = useState<string | undefined>(undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const { send, isSending } = useSendMessage(chatId);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Если текст пустой - ничего не делаем
    if (!text.trim()) {
      return;
    }

    setError(undefined);
    const result = await send(text);

    if (result.success) {
      setText('');
    } else {
      setError(t(`chat.${result.errorKey}`));
    }
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
      className="border-border bg-surface flex items-end gap-2 border-t p-3"
    >
      <Textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          if (error) setError(undefined);
        }}
        placeholder={t('chat.inputPlaceholder')}
        autoResize
        rows={1}
        className="flex-1"
        disabled={isSending}
        onKeyDown={handleKeyDown}
        error={error}
      />
      <Button type="submit" disabled={isSending || !text.trim()}>
        {t('chat.send')}
      </Button>
    </form>
  );
};

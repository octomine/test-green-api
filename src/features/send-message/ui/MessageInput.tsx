import { useState, useRef, type SubmitEvent, type KeyboardEvent } from 'react';
import { useTranslation } from '@/shared/i18n';
import { Textarea, Button } from '@/shared/ui';
import { useSendMessage } from '../model/useSendMessage';
import { Send } from 'lucide-react';

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
    <form ref={formRef} onSubmit={handleSubmit} className="shrink-0 px-4 pb-4">
      <div className="relative mx-auto max-w-3xl">
        <Textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) setError(undefined);
          }}
          placeholder={t('chat.inputPlaceholder')}
          autoResize
          rows={1}
          className="bg-surface border-border focus:ring-primary min-h-14 w-full resize-none overflow-hidden rounded-full border py-2 pr-14 pl-4 leading-6 focus:ring-2"
          disabled={isSending}
          onKeyDown={handleKeyDown}
          error={error}
        />
        <Button
          type="submit"
          size="icon"
          disabled={isSending || !text.trim()}
          aria-label={t('chat.send')}
          className="absolute right-2 bottom-2"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};

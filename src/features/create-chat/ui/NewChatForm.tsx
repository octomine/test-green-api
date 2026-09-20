import { useState, type SubmitEvent } from 'react';
import { useTranslation } from '@/shared/i18n';
import { useChatStore } from '@/entities/chat';
import { Input, Button } from '@/shared/ui';

export const NewChatForm = () => {
  const { t } = useTranslation();

  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Очистка номера от пробелов, дефисов и скобок
    const cleaned = phone.replace(/[\s\-()]/g, '');

    // Проверка на пустоту
    if (!cleaned) {
      setError(t('createChat.phoneRequired'));
      return;
    }

    // Проверка символов (только цифры, возможно с + в начале)
    const digitsOnly = cleaned.startsWith('+') ? cleaned.slice(1) : cleaned;
    if (!/^\d+$/.test(digitsOnly)) {
      setError(t('createChat.phoneInvalidChars'));
      return;
    }

    // Проверка длины
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      setError(t('createChat.phoneInvalidLength'));
      return;
    }

    // Нормализация
    const normalized = digitsOnly;
    useChatStore.getState().setActiveChatId(normalized);

    // Очищаем ошибки если форма успешна
    setError(undefined);
  };

  return (
    <div className="bg-bg flex min-h-screen items-center justify-center">
      <div className="bg-surface rounded-input flex w-full max-w-sm flex-col gap-4 p-6">
        <h1 className="text-text text-xl font-medium">{t('createChat.title')}</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label={t('createChat.phoneLabel')}
            type="tel"
            placeholder={t('createChat.phonePlaceholder')}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={error}
            autoFocus
          />
          <Button type="submit" className="w-full">
            {t('createChat.submit')}
          </Button>
        </form>
      </div>
    </div>
  );
};

import { useState, type SubmitEvent } from 'react';
import { Input, Button } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';

import { useSessionStore } from '@/entities/session';

export const LoginForm = () => {
  const { t } = useTranslation();

  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');
  const [errors, setErrors] = useState<{
    idInstance?: string;
    apiTokenInstance?: string;
  }>({});

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Простейшая валидация
    const newErrors: typeof errors = {};
    if (!idInstance.trim()) {
      newErrors.idInstance = t('auth.idInstanceRequired');
    }
    if (!apiTokenInstance.trim()) {
      newErrors.apiTokenInstance = t('auth.apiTokenRequired');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Очищаем ошибки если они были
    setErrors({});

    // Сохраняем учетные данные
    useSessionStore.getState().setCredentials({
      idInstance,
      apiTokenInstance,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="w-full max-w-sm bg-surface rounded-card p-6 flex flex-col gap-4">
        <h1 className="text-xl font-medium text-text">{t('auth.title')}</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label={t('auth.idInstanceLabel')}
            type="text"
            value={idInstance}
            onChange={(e) => setIdInstance(e.target.value)}
            error={errors.idInstance}
            autoFocus
          />
          <Input
            label={t('auth.apiTokenLabel')}
            type="password"
            value={apiTokenInstance}
            onChange={(e) => setApiTokenInstance(e.target.value)}
            error={errors.apiTokenInstance}
          />
          <Button type="submit" className="w-full">
            {t('auth.submit')}
          </Button>
        </form>
      </div>
    </div>
  );
};
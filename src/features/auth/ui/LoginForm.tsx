import { useState, type SubmitEvent } from 'react';
import { Input, Button } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';

import { useSessionStore } from '@/entities/session';
import { getStateInstance } from '@/shared/api';

export const LoginForm = () => {
  const { t } = useTranslation();

  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');
  const [errors, setErrors] = useState<{
    idInstance?: string;
    apiTokenInstance?: string;
  }>({});
  const [isChecking, setIsChecking] = useState(false);
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
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
    setFormError(undefined);
    setIsChecking(true);

    try {
      // Проверяем учетные данные
      await getStateInstance({ idInstance, apiTokenInstance });

      // Если проверка прошла успешно, сохраняем учетные данные
      useSessionStore.getState().setCredentials({
        idInstance,
        apiTokenInstance,
      });
    } catch {
      // Устанавливаем ошибку формы
      setFormError(t('auth.invalidCredentials'));
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="bg-bg flex min-h-screen items-center justify-center">
      <div className="bg-surface rounded-card flex w-full max-w-sm flex-col gap-4 p-6">
        <h1 className="text-text text-xl font-medium">{t('auth.title')}</h1>
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
          {formError && <p className="text-error text-sm">{formError}</p>}
          <Button type="submit" className="w-full" disabled={isChecking}>
            {isChecking ? t('auth.checking') : t('auth.submit')}
          </Button>
        </form>
      </div>
    </div>
  );
};

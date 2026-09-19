import { useSessionStore } from '@/entities/session';
import { useChatStore } from '@/entities/chat';
import { useMessageStore } from '@/entities/message';
import { LoginForm } from '@/features/auth';
import { Button } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';

export const ChatPage = () => {
  const { t } = useTranslation();
  const credentials = useSessionStore((s) => s.credentials);

  if (credentials === null) {
    return <LoginForm />;
  }

  const handleLogout = () => {
    useSessionStore.getState().clearCredentials();
    useChatStore.getState().clearActiveChatId();
    useMessageStore.getState().clearAllMessages();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="w-full max-w-sm bg-surface rounded-input p-6 flex flex-col gap-4 items-center">
        <h1 className="text-xl font-medium text-text">{t('chat.stubTitle')}</h1>
        <p className="text-text-muted text-sm">{t('chat.instanceLabel', { id: credentials.idInstance })}</p>
        <Button 
          variant="secondary" 
          className="w-full"
          onClick={handleLogout}
        >
          {t('chat.logout')}
        </Button>
      </div>
    </div>
  );
};
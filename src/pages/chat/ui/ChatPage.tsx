import { useSessionStore } from '@/entities/session';
import { useChatStore } from '@/entities/chat';
import { useMessageStore } from '@/entities/message';
import { LoginForm } from '@/features/auth';
import { NewChatForm } from '@/features/create-chat';
import { Button } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';

export const ChatPage = () => {
  const { t } = useTranslation();

  const credentials = useSessionStore((s) => s.credentials);
  const activeChatId = useChatStore((s) => s.activeChatId);

  if (credentials === null) {
    return <LoginForm />;
  }

  if (activeChatId === null) {
    return <NewChatForm />;
  }

  const handleLogout = () => {
    useSessionStore.getState().clearCredentials();
    useChatStore.getState().clearActiveChatId();
    useMessageStore.getState().clearAllMessages();
  };

  const handleNewChat = () => {
    useChatStore.getState().clearActiveChatId();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="w-full max-w-sm bg-surface rounded-input p-6 flex flex-col gap-4 items-center">
        <h1 className="text-xl font-medium text-text">{t('chat.stubTitle')}</h1>
        <p className="text-text-muted text-sm">{t('chat.instanceLabel', { id: credentials.idInstance })}</p>
        <p className="text-text text-sm">{t('chat.activeChatLabel', { id: activeChatId })}</p>
        <div className="flex gap-2 w-full">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={handleNewChat}
          >
            {t('chat.newChat')}
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={handleLogout}
          >
            {t('chat.logout')}
          </Button>
        </div>
      </div>
    </div>
  );
};
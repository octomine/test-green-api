import { useSessionStore } from '@/entities/session';
import { useChatStore } from '@/entities/chat';
import { useMessageStore, MessageList, type Message } from '@/entities/message';
import { LoginForm } from '@/features/auth';
import { NewChatForm } from '@/features/create-chat';
import { MessageInput } from '@/features/send-message';
import { Button } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';

const EMPTY_MESSAGES: Message[] = [];

export const ChatPage = () => {
  const { t } = useTranslation();

  const credentials = useSessionStore((s) => s.credentials);
  const activeChatId = useChatStore((s) => s.activeChatId);
  const messages = useMessageStore((s) => s.messagesByChatId[activeChatId ?? ''] ?? EMPTY_MESSAGES);

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
    <div className="bg-bg-chat flex h-screen flex-col">
      <header className="bg-surface border-border flex items-center justify-between gap-2 border-b px-4 py-3">
        <span className="text-text truncate font-medium">
          {t('chat.activeChatLabel', { id: activeChatId })}
        </span>
        <div className="flex shrink-0 gap-2">
          <Button variant="ghost" size="sm" onClick={handleNewChat}>
            {t('chat.newChat')}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            {t('chat.logout')}
          </Button>
        </div>
      </header>
      <MessageList messages={messages} />
      <MessageInput chatId={activeChatId} />
    </div>
  );
};

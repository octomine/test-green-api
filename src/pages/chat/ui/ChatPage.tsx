import { useSessionStore } from '@/entities/session';
import { useChatStore } from '@/entities/chat';
import { useMessageStore, MessageList, type Message } from '@/entities/message';
import { LoginForm } from '@/features/auth';
import { NewChatForm } from '@/features/create-chat';
import { MessageInput } from '@/features/send-message';
import { Button } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';
import { User, Plus, LogOut } from 'lucide-react';

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
      <header className="bg-surface border-border shrink-0 border-b shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
            <User className="text-primary h-5 w-5" />
          </div>
          <span className="text-text flex-1 truncate font-medium">
            {t('chat.activeChatLabel', { id: activeChatId })}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNewChat}
            aria-label={t('chat.newChat')}
          >
            <Plus className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout} aria-label={t('chat.logout')}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>
      <MessageList messages={messages} />
      <MessageInput chatId={activeChatId} />
    </div>
  );
};

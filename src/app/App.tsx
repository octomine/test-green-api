import { ChatPage } from '@/pages/chat';
import { LongPollingProvider } from './providers/LongPollingProvider';

export const App = () => {
  return (
    <LongPollingProvider>
      <ChatPage />
    </LongPollingProvider>
  );
};

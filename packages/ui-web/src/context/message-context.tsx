import { createContext, useContext, type ReactNode } from 'react';
import type { Message } from '../types/types';

interface MessageContextValue {
  currentUserId: string;
  onOpenThread: (thread: any, parentMessage: Message) => void;
  onProfileClick: (userId: string) => void;
  onToggleReaction: (messageId: string, emoji: string) => void;
  onToggleSaved: (messageId: string) => void;
  onToggleHidden: (messageId: string) => void;
}

const MessageContext = createContext<MessageContextValue | undefined>(undefined);

export function MessageProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: MessageContextValue;
}) {
  return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>;
}

export function useMessageContext() {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessageContext must be used within MessageProvider');
  }
  return context;
}

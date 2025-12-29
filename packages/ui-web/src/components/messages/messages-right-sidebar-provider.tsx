'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type {
  ChannelVM,
  MessagesRightPanelIntent,
  MessagesRightPanelIntentKey,
  MessagesRightSidebarState,
  MessageVM,
  TextMessageVM,
  ThreadVM,
} from '@iconicedu/shared-types';

type ThreadData = {
  thread: ThreadVM;
  messages: MessageVM[];
};

interface MessagesRightSidebarContextValue {
  channel: ChannelVM;
  currentUserId: string;
  savedCount: number;
  messages: MessageVM[];
  createTextMessage: (content: string) => TextMessageVM | null;
  state: MessagesRightSidebarState;
  open: (intent: MessagesRightPanelIntent) => void;
  close: () => void;
  toggle: (intent: MessagesRightPanelIntent) => void;
  isActive: (
    key: MessagesRightPanelIntentKey,
    intent?: MessagesRightPanelIntent,
  ) => boolean;
  setCurrentUserId: (userId: string) => void;
  setSavedCount: (count: number) => void;
  setMessages: (messages: MessageVM[]) => void;
  setCreateTextMessage: (factory: (content: string) => TextMessageVM | null) => void;
  appendThreadMessage: (threadId: string, message: MessageVM) => void;
  setThreadData: (thread: ThreadVM, messages: MessageVM[]) => void;
  getThreadData: (threadId: string) => ThreadData | undefined;
  setScrollToMessage: (handler: (messageId: string) => void) => void;
  scrollToMessage?: (messageId: string) => void;
}

const MessagesRightSidebarContext =
  createContext<MessagesRightSidebarContextValue | null>(null);

const isSameIntent = (
  a: MessagesRightPanelIntent | null,
  b: MessagesRightPanelIntent,
) => {
  if (!a) return false;
  if (a.key !== b.key) return false;
  if (a.key === 'profile' && b.key === 'profile') {
    return a.userId === b.userId;
  }
  if (a.key === 'thread' && b.key === 'thread') {
    return a.threadId === b.threadId;
  }
  return true;
};

export function MessagesRightSidebarProvider({
  channel,
  children,
}: {
  channel: ChannelVM;
  children: React.ReactNode;
}) {
  const [state, setState] = useState<MessagesRightSidebarState>({
    isOpen: false,
    intent: null,
  });
  const [currentUserId, setCurrentUserId] = useState('');
  const [savedCount, setSavedCount] = useState(0);
  const [messages, setMessages] = useState<MessageVM[]>([]);
  const [createTextMessage, setCreateTextMessage] = useState<
    (content: string) => TextMessageVM | null
  >(() => null);
  const [threadData, setThreadDataState] = useState<Record<string, ThreadData>>(
    {},
  );
  const [scrollToMessage, setScrollToMessage] = useState<
    ((messageId: string) => void) | undefined
  >(undefined);

  const open = useCallback((intent: MessagesRightPanelIntent) => {
    setState({ isOpen: true, intent });
  }, []);

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false, intent: null }));
  }, []);

  const toggle = useCallback(
    (intent: MessagesRightPanelIntent) => {
      setState((prev) => {
        if (prev.isOpen && isSameIntent(prev.intent, intent)) {
          return { ...prev, isOpen: false, intent: null };
        }
        return { ...prev, isOpen: true, intent };
      });
    },
    [],
  );

  const isActive = useCallback(
    (key: MessagesRightPanelIntentKey, intent?: MessagesRightPanelIntent) => {
      if (!state.isOpen || !state.intent) return false;
      if (state.intent.key !== key) return false;
      if (intent) {
        return isSameIntent(state.intent, intent);
      }
      return true;
    },
    [state.intent, state.isOpen],
  );

  const setThreadData = useCallback((thread: ThreadVM, messages: MessageVM[]) => {
    setThreadDataState((prev) => ({ ...prev, [thread.id]: { thread, messages } }));
  }, []);

  const appendThreadMessage = useCallback((threadId: string, message: MessageVM) => {
    setThreadDataState((prev) => {
      const existing = prev[threadId];
      if (!existing) return prev;
      return {
        ...prev,
        [threadId]: { ...existing, messages: [...existing.messages, message] },
      };
    });
  }, []);

  const getThreadData = useCallback(
    (threadId: string) => threadData[threadId],
    [threadData],
  );

  const value = useMemo(
    () => ({
      channel,
      currentUserId,
      savedCount,
      messages,
      createTextMessage,
      state,
      open,
      close,
      toggle,
      isActive,
      setCurrentUserId,
      setSavedCount,
      setMessages,
      setCreateTextMessage,
      appendThreadMessage,
      setThreadData,
      getThreadData,
      setScrollToMessage,
      scrollToMessage,
    }),
    [
      channel,
      currentUserId,
      savedCount,
      messages,
      createTextMessage,
      state,
      open,
      close,
      toggle,
      isActive,
      setCurrentUserId,
      setSavedCount,
      setMessages,
      setCreateTextMessage,
      appendThreadMessage,
      setThreadData,
      getThreadData,
      setScrollToMessage,
      scrollToMessage,
    ],
  );

  return (
    <MessagesRightSidebarContext.Provider value={value}>
      {children}
    </MessagesRightSidebarContext.Provider>
  );
}

export function useMessagesRightSidebar() {
  const context = useContext(MessagesRightSidebarContext);
  if (!context) {
    throw new Error(
      'useMessagesRightSidebar must be used within MessagesRightSidebarProvider',
    );
  }
  return context;
}

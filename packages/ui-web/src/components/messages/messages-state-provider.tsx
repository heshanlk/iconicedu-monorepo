'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type {
  ChannelVM,
  ConnectionVM,
  MessagesRightPanelIntent,
  MessagesRightPanelIntentKey,
  MessagesRightSidebarState,
  MessageVM,
  TextMessageVM,
  ThreadVM,
} from '@iconicedu/shared-types';

type ThreadData = {
  thread: ThreadVM;
  replies: ConnectionVM<MessageVM>;
  parentMessage?: MessageVM;
};

interface MessagesStateContextValue {
  channel: ChannelVM;
  currentUserId: string;
  savedCount: number;
  messages: MessageVM[];
  createTextMessage: (content: string) => TextMessageVM | null;
  threadHandlers: ThreadActionHandlers;
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
  setThreadHandlers: (handlers: ThreadActionHandlers) => void;
  appendThreadMessage: (threadId: string, message: MessageVM) => void;
  setThreadData: (
    thread: ThreadVM,
    data: { replies: ConnectionVM<MessageVM>; parentMessage?: MessageVM },
  ) => void;
  getThreadData: (threadId: string) => ThreadData | undefined;
  setScrollToMessage: (handler: (messageId: string) => void) => void;
  scrollToMessage?: (messageId: string) => void;
}

type ThreadActionHandlers = {
  onAddMessage?: (message: MessageVM) => void;
  onUpdateMessage?: (messageId: string, updates: Partial<MessageVM>) => void;
  onDeleteMessage?: (messageId: string) => void;
  onToggleReaction?: (messageId: string, emoji: string) => void;
  onToggleSaved?: (messageId: string) => void;
  onToggleHidden?: (messageId: string) => void;
};

const MessagesStateContext = createContext<MessagesStateContextValue | null>(null);

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

export function MessagesStateProvider({
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
  >(() => () => null);
  const [threadHandlers, setThreadHandlers] = useState<ThreadActionHandlers>({});
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

  const setThreadData = useCallback(
    (thread: ThreadVM, data: { replies: ConnectionVM<MessageVM>; parentMessage?: MessageVM }) => {
      setThreadDataState((prev) => ({ ...prev, [thread.id]: { thread, ...data } }));
    },
    [],
  );

  const appendThreadMessage = useCallback((threadId: string, message: MessageVM) => {
    setThreadDataState((prev) => {
      const existing = prev[threadId];
      if (!existing) return prev;
      return {
        ...prev,
        [threadId]: {
          ...existing,
          replies: {
            ...existing.replies,
            items: [...existing.replies.items, message],
            total:
              typeof existing.replies.total === 'number'
                ? existing.replies.total + 1
                : existing.replies.total,
          },
        },
      };
    });
  }, []);

  const getThreadData = useCallback(
    (threadId: string) => threadData[threadId],
    [threadData],
  );

  const setCreateTextMessageFactory = useCallback(
    (factory: (content: string) => TextMessageVM | null) => {
      setCreateTextMessage(() => factory);
    },
    [],
  );

  const setThreadHandlersFactory = useCallback((handlers: ThreadActionHandlers) => {
    setThreadHandlers(handlers);
  }, []);

  const value = useMemo(
    () => ({
      channel,
      currentUserId,
      savedCount,
      messages,
      createTextMessage,
      threadHandlers,
      state,
      open,
      close,
      toggle,
      isActive,
      setCurrentUserId,
      setSavedCount,
      setMessages,
      setCreateTextMessage: setCreateTextMessageFactory,
      setThreadHandlers: setThreadHandlersFactory,
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
      threadHandlers,
      state,
      open,
      close,
      toggle,
      isActive,
      setCurrentUserId,
      setSavedCount,
      setMessages,
      setCreateTextMessageFactory,
      setThreadHandlersFactory,
      appendThreadMessage,
      setThreadData,
      getThreadData,
      setScrollToMessage,
      scrollToMessage,
    ],
  );

  return (
    <MessagesStateContext.Provider value={value}>
      {children}
    </MessagesStateContext.Provider>
  );
}

export function useMessagesState() {
  const context = useContext(MessagesStateContext);
  if (!context) {
    throw new Error(
      'useMessagesState must be used within MessagesStateProvider',
    );
  }
  return context;
}

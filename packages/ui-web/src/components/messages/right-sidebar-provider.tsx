'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type {
  ChannelVM,
  MessageVM,
  RightPanelIntent,
  RightPanelIntentKey,
  RightSidebarState,
} from '@iconicedu/shared-types';

type ThreadData = {
  threadId: string;
  messages: MessageVM[];
};

interface RightSidebarContextValue {
  channel: ChannelVM;
  currentUserId: string;
  savedCount: number;
  state: RightSidebarState;
  open: (intent: RightPanelIntent) => void;
  close: () => void;
  toggle: (intent: RightPanelIntent) => void;
  isActive: (key: RightPanelIntentKey, intent?: RightPanelIntent) => boolean;
  setCurrentUserId: (userId: string) => void;
  setSavedCount: (count: number) => void;
  setThreadData: (threadId: string, messages: MessageVM[]) => void;
  getThreadData: (threadId: string) => ThreadData | undefined;
}

const RightSidebarContext = createContext<RightSidebarContextValue | null>(null);

const isSameIntent = (a: RightPanelIntent | null, b: RightPanelIntent) => {
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

export function RightSidebarProvider({
  channel,
  children,
}: {
  channel: ChannelVM;
  children: React.ReactNode;
}) {
  const [state, setState] = useState<RightSidebarState>({
    isOpen: false,
    intent: null,
  });
  const [currentUserId, setCurrentUserId] = useState('');
  const [savedCount, setSavedCount] = useState(0);
  const [threadData, setThreadDataState] = useState<Record<string, ThreadData>>(
    {},
  );

  const open = useCallback((intent: RightPanelIntent) => {
    setState({ isOpen: true, intent });
  }, []);

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false, intent: null }));
  }, []);

  const toggle = useCallback(
    (intent: RightPanelIntent) => {
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
    (key: RightPanelIntentKey, intent?: RightPanelIntent) => {
      if (!state.isOpen || !state.intent) return false;
      if (state.intent.key !== key) return false;
      if (intent) {
        return isSameIntent(state.intent, intent);
      }
      return true;
    },
    [state.intent, state.isOpen],
  );

  const setThreadData = useCallback((threadId: string, messages: MessageVM[]) => {
    setThreadDataState((prev) => ({ ...prev, [threadId]: { threadId, messages } }));
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
      state,
      open,
      close,
      toggle,
      isActive,
      setCurrentUserId,
      setSavedCount,
      setThreadData,
      getThreadData,
    }),
    [
      channel,
      currentUserId,
      savedCount,
      state,
      open,
      close,
      toggle,
      isActive,
      setCurrentUserId,
      setSavedCount,
      setThreadData,
      getThreadData,
    ],
  );

  return (
    <RightSidebarContext.Provider value={value}>
      {children}
    </RightSidebarContext.Provider>
  );
}

export function useRightSidebar() {
  const context = useContext(RightSidebarContext);
  if (!context) {
    throw new Error('useRightSidebar must be used within RightSidebarProvider');
  }
  return context;
}

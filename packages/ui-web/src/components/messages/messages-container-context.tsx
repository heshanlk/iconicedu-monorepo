'use client';

import { createContext, useContext } from 'react';
import type { ChannelVM } from '@iconicedu/shared-types';
import type { SidebarContent } from '../../hooks/use-messages-sidebar';

interface MessagesContainerContextValue {
  channel: ChannelVM;
  currentUserId: string;
  savedCount: number;
  sidebarContent: SidebarContent;
  profileUserId: string | null;
  openInfo: () => void;
  openProfile: (userId: string) => void;
  openSavedMessages: () => void;
}

const MessagesContainerContext = createContext<MessagesContainerContextValue | null>(
  null,
);

export function MessagesContainerProvider({
  value,
  children,
}: {
  value: MessagesContainerContextValue;
  children: React.ReactNode;
}) {
  return (
    <MessagesContainerContext.Provider value={value}>
      {children}
    </MessagesContainerContext.Provider>
  );
}

export function useMessagesContainer() {
  const context = useContext(MessagesContainerContext);
  if (!context) {
    throw new Error('useMessagesContainer must be used within MessagesContainerProvider');
  }
  return context;
}

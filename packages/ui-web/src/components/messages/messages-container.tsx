'use client';

import { useCallback, useMemo, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { MessageList, type MessageListRef } from './message-list';
import { ThreadPanel } from './thread-panel';
import { ThreadSheet } from './thread-sheet';
import { ProfilePanel } from './profile-panel';
import { ProfileSheet } from './profile-sheet';
import { SavedMessagesPanel } from './saved-messages-panel';
import { MessagesSidebar } from './messages-sidebar';
import { MessageInput } from './message-input';
import { MessageHeader } from './messages-header';
import { useIsMobile } from '../../hooks/use-mobile';
import { useMessages } from '../../hooks/use-messages';
import { useDMSidebar, type SidebarContent } from '../../hooks/use-messages-sidebar';
import { useThread } from '../../hooks/use-thread';
import type {
  ThreadVM,
  TextMessageVM,
  MessageVM,
  UserProfileVM,
} from '@iconicedu/shared-types';

export interface MessagesContainerProps {
  messages: MessageVM[];
  initialThreadMessages: Record<string, MessageVM[]>;
  educator: UserProfileVM;
  guardian: UserProfileVM;
  lastReadMessageId?: string;
  renderHeader?: (props: MessagesHeaderRenderProps) => ReactNode;
  infoPanel?: ReactNode;
  infoPanelMeta?: { title: string; subtitle?: string };
  defaultSidebarContent?: SidebarContent;
}

export interface MessagesHeaderRenderProps {
  educator: UserProfileVM;
  guardian: UserProfileVM;
  savedCount: number;
  onProfileClick: (userId: string) => void;
  onSavedMessagesClick: () => void;
  onOpenInfo: () => void;
  isInfoActive: boolean;
}

export function MessagesContainer({
  messages: initialMessages,
  initialThreadMessages,
  educator,
  guardian,
  lastReadMessageId,
  renderHeader,
  infoPanel,
  infoPanelMeta,
  defaultSidebarContent,
}: MessagesContainerProps) {
  const isMobile = useIsMobile();
  const messageListRef = useRef<MessageListRef>(null);
  const {
    openThread: openThreadSidebar,
    openProfile,
    openSavedMessages,
    openInfo,
    closeSidebar,
    profileUserId,
    sidebarContent,
  } = useDMSidebar();
  const { messages, addMessage, toggleReaction, toggleSaved, toggleHidden } =
    useMessages(initialMessages);
  const {
    activeThread,
    threadMessages,
    openThread,
    addThreadMessage,
    toggleThreadReaction,
    toggleThreadSaved,
    toggleThreadHidden,
  } = useThread();

  const handleOpenThread = useCallback(
    (thread: ThreadVM, parentMessage: MessageVM) => {
      if (sidebarContent === 'thread' && activeThread?.id === thread.id) {
        closeSidebar();
        return;
      }
      openThread(
        { ...thread, parentMessage },
        initialThreadMessages[thread.id] || [parentMessage],
      );
      openThreadSidebar();
    },
    [
      sidebarContent,
      activeThread,
      closeSidebar,
      openThread,
      openThreadSidebar,
      initialThreadMessages,
    ],
  );

  const handleSendMessage = useCallback(
    (content: string) => {
      const newMessage: TextMessageVM = {
        id: `msg-${Date.now()}`,
        type: 'text',
        content,
        sender: guardian,
        timestamp: new Date().toISOString(),
        reactions: [],
        visibility: { type: 'all' },
        isSaved: false,
        isRead: true,
      };
      addMessage(newMessage);
    },
    [addMessage, guardian],
  );

  const handleSendThreadReply = useCallback(
    (content: string) => {
      const newReply: TextMessageVM = {
        id: `reply-${Date.now()}`,
        type: 'text',
        content,
        sender: guardian,
        timestamp: new Date().toISOString(),
        reactions: [],
        visibility: { type: 'all' },
        isSaved: false,
        isRead: true,
      };
      addThreadMessage(newReply);
    },
    [addThreadMessage, guardian],
  );

  const handleProfileClick = useCallback(
    (userId: string) => {
      if (sidebarContent === 'profile' && profileUserId === userId) {
        closeSidebar();
        return;
      }
      openProfile(userId);
    },
    [sidebarContent, profileUserId, closeSidebar, openProfile],
  );

  const handleSavedMessagesClick = useCallback(() => {
    if (sidebarContent === 'saved-messages') {
      closeSidebar();
      return;
    }
    openSavedMessages();
  }, [sidebarContent, closeSidebar, openSavedMessages]);

  const handleOpenInfo = useCallback(() => {
    if (!infoPanel) return;
    if (sidebarContent === 'space-info') {
      closeSidebar();
      return;
    }
    openInfo();
  }, [infoPanel, sidebarContent, closeSidebar, openInfo]);

  useEffect(() => {
    if (defaultSidebarContent === 'space-info' && infoPanel) {
      openInfo();
    }
  }, [defaultSidebarContent, infoPanel, openInfo]);

  const handleCloseSidebar = useCallback(() => {
    closeSidebar();
  }, [closeSidebar]);

  const handleToggleReaction = useCallback(
    (messageId: string, emoji: string) => {
      toggleReaction(messageId, emoji, guardian.id);
    },
    [toggleReaction, guardian.id],
  );

  const handleToggleThreadReaction = useCallback(
    (messageId: string, emoji: string) => {
      toggleThreadReaction(messageId, emoji, guardian.id);
    },
    [toggleThreadReaction, guardian.id],
  );

  const handleToggleSaved = useCallback(
    (messageId: string) => {
      toggleSaved(messageId);
    },
    [toggleSaved],
  );

  const handleToggleThreadSaved = useCallback(
    (messageId: string) => {
      toggleThreadSaved(messageId);
    },
    [toggleThreadSaved],
  );

  const handleToggleHidden = useCallback(
    (messageId: string) => {
      toggleHidden(messageId);
    },
    [toggleHidden],
  );

  const handleToggleThreadHidden = useCallback(
    (messageId: string) => {
      toggleThreadHidden(messageId);
    },
    [toggleThreadHidden],
  );

  const handleSavedMessageClick = useCallback(
    (messageId: string) => {
      closeSidebar();
      globalThis.setTimeout(() => {
        messageListRef.current?.scrollToMessage(messageId);
      }, 300);
    },
    [closeSidebar],
  );

  const profileUser = useMemo(() => {
    if (profileUserId === educator.id) return educator;
    if (profileUserId === guardian.id) return guardian;
    return educator;
  }, [profileUserId, educator, guardian]);

  const sidebarMeta = useMemo(() => {
    if (sidebarContent === 'thread' && activeThread) {
      return {
        title: 'Thread',
        subtitle: `${activeThread.messageCount} ${activeThread.messageCount === 1 ? 'reply' : 'replies'}`,
      };
    }
    if (sidebarContent === 'profile') {
      return { title: 'Profile', subtitle: undefined };
    }
    if (sidebarContent === 'saved-messages') {
      const savedCount = messages.filter((m) => m.isSaved).length;
      return {
        title: 'Saved Messages',
        subtitle: `${savedCount} ${savedCount === 1 ? 'message' : 'messages'}`,
      };
    }
    if (sidebarContent === 'space-info') {
      return infoPanelMeta ?? { title: 'Details', subtitle: undefined };
    }
    return { title: '', subtitle: undefined };
  }, [sidebarContent, activeThread, messages, infoPanelMeta]);

  const savedCount = useMemo(() => messages.filter((m) => m.isSaved).length, [messages]);

  const headerNode = renderHeader ? (
    renderHeader({
      educator,
      guardian,
      savedCount,
      onProfileClick: handleProfileClick,
      onSavedMessagesClick: handleSavedMessagesClick,
      onOpenInfo: handleOpenInfo,
      isInfoActive: sidebarContent === 'space-info',
    })
  ) : (
    <MessageHeader
      user={educator}
      onProfileClick={() => handleProfileClick(educator.id)}
      onSavedMessagesClick={handleSavedMessagesClick}
    />
  );

  const messageListProps = useMemo(
    () => ({
      messages,
      onOpenThread: handleOpenThread,
      onProfileClick: handleProfileClick,
      onToggleReaction: handleToggleReaction,
      onToggleSaved: handleToggleSaved,
      onToggleHidden: handleToggleHidden,
      currentUserId: guardian.id,
      lastReadMessageId,
    }),
    [
      messages,
      handleOpenThread,
      handleProfileClick,
      handleToggleReaction,
      handleToggleSaved,
      handleToggleHidden,
      guardian.id,
      lastReadMessageId,
    ],
  );

  const threadPanelProps = useMemo(
    () => ({
      thread: activeThread!,
      messages: threadMessages,
      onSendReply: handleSendThreadReply,
      onProfileClick: handleProfileClick,
      onToggleReaction: handleToggleThreadReaction,
      onToggleSaved: handleToggleThreadSaved,
      onToggleHidden: handleToggleThreadHidden,
      currentUserId: guardian.id,
      lastReadMessageId,
    }),
    [
      activeThread,
      threadMessages,
      handleSendThreadReply,
      handleProfileClick,
      handleToggleThreadReaction,
      handleToggleThreadSaved,
      handleToggleThreadHidden,
      guardian.id,
      lastReadMessageId,
    ],
  );

  const savedMessagesPanelProps = useMemo(
    () => ({
      messages,
      onMessageClick: handleSavedMessageClick,
    }),
    [messages, handleSavedMessageClick],
  );

  return (
    <div className="flex h-full min-h-0">
      <div className="flex flex-1 flex-col">
        {headerNode}
        <div className="flex flex-1 overflow-hidden">
          <div className="flex flex-1 min-h-0 flex-col">
            <MessageList ref={messageListRef} {...messageListProps} />
            <MessageInput
              onSend={handleSendMessage}
              placeholder={`Message ${educator.displayName}`}
            />
          </div>
          <MessagesSidebar
            open={Boolean(sidebarContent)}
            title={sidebarMeta.title}
            subtitle={sidebarMeta.subtitle}
            onClose={handleCloseSidebar}
            className={sidebarContent === 'thread' ? 'h-[85vh]' : undefined}
          >
            {sidebarContent === 'thread' && activeThread && (
              <>
                {isMobile ? (
                  <ThreadSheet {...threadPanelProps} />
                ) : (
                  <ThreadPanel {...threadPanelProps} />
                )}
              </>
            )}
            {sidebarContent === 'profile' &&
              (isMobile ? (
                <ProfileSheet user={profileUser} />
              ) : (
                <ProfilePanel user={profileUser} />
              ))}
            {sidebarContent === 'saved-messages' && (
              <SavedMessagesPanel {...savedMessagesPanelProps} />
            )}
            {sidebarContent === 'space-info' && infoPanel}
          </MessagesSidebar>
        </div>
      </div>
    </div>
  );
}

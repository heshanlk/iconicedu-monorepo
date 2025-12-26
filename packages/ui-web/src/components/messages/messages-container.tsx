'use client';

import { useCallback, useMemo, useRef } from 'react';
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
import { useDMSidebar } from '../../hooks/use-messages-sidebar';
import { useThread } from '../../hooks/use-thread';
import type { Thread, TextMessage, Message, User } from '@iconicedu/shared-types';

export interface MessagesContainerProps {
  messages: Message[];
  initialThreadMessages: Record<string, Message[]>;
  teacher: User;
  parent: User;
  lastReadMessageId?: string;
}

export function MessagesContainer({
  messages: initialMessages,
  initialThreadMessages,
  teacher,
  parent,
  lastReadMessageId,
}: MessagesContainerProps) {
  const isMobile = useIsMobile();
  const messageListRef = useRef<MessageListRef>(null);
  const {
    openThread: openThreadSidebar,
    openProfile,
    openSavedMessages,
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
    (thread: Thread, parentMessage: Message) => {
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
      const newMessage: TextMessage = {
        id: `msg-${Date.now()}`,
        type: 'text',
        content,
        sender: parent,
        timestamp: new Date(),
        reactions: [],
        visibility: { type: 'all' },
        isSaved: false,
        isRead: true,
      };
      addMessage(newMessage);
    },
    [addMessage, parent],
  );

  const handleSendThreadReply = useCallback(
    (content: string) => {
      const newReply: TextMessage = {
        id: `reply-${Date.now()}`,
        type: 'text',
        content,
        sender: parent,
        timestamp: new Date(),
        reactions: [],
        visibility: { type: 'all' },
        isSaved: false,
        isRead: true,
      };
      addThreadMessage(newReply);
    },
    [addThreadMessage, parent],
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

  const handleCloseSidebar = useCallback(() => {
    closeSidebar();
  }, [closeSidebar]);

  const handleToggleReaction = useCallback(
    (messageId: string, emoji: string) => {
      toggleReaction(messageId, emoji, parent.id);
    },
    [toggleReaction, parent.id],
  );

  const handleToggleThreadReaction = useCallback(
    (messageId: string, emoji: string) => {
      toggleThreadReaction(messageId, emoji, parent.id);
    },
    [toggleThreadReaction, parent.id],
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
    if (profileUserId === teacher.id) return teacher;
    if (profileUserId === parent.id) return parent;
    return teacher;
  }, [profileUserId, teacher, parent]);

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
    return { title: '', subtitle: undefined };
  }, [sidebarContent, activeThread, messages]);

  const messageListProps = useMemo(
    () => ({
      messages,
      onOpenThread: handleOpenThread,
      onProfileClick: handleProfileClick,
      onToggleReaction: handleToggleReaction,
      onToggleSaved: handleToggleSaved,
      onToggleHidden: handleToggleHidden,
      currentUserId: parent.id,
      lastReadMessageId,
    }),
    [
      messages,
      handleOpenThread,
      handleProfileClick,
      handleToggleReaction,
      handleToggleSaved,
      handleToggleHidden,
      parent.id,
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
      currentUserId: parent.id,
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
      parent.id,
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
        <MessageHeader
          user={teacher}
          onProfileClick={() => handleProfileClick(teacher.id)}
          onSavedMessagesClick={handleSavedMessagesClick}
        />
        <div className="flex flex-1 overflow-hidden">
          <div className="flex flex-1 min-h-0 flex-col">
            <MessageList ref={messageListRef} {...messageListProps} />
            <MessageInput
              onSend={handleSendMessage}
              placeholder={`Message ${teacher.name}`}
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
          </MessagesSidebar>
        </div>
      </div>
    </div>
  );
}

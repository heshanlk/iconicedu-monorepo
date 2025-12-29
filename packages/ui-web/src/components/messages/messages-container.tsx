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
import { MessagesContainerHeader } from './messages-container-header';
import { MessagesContainerProvider } from './messages-container-context';
import { useIsMobile } from '../../hooks/use-mobile';
import { useMessages } from '../../hooks/use-messages';
import { useDMSidebar, type SidebarContent } from '../../hooks/use-messages-sidebar';
import { useThread } from '../../hooks/use-thread';
import type {
  ChannelVM,
  GuardianProfileVM,
  EducatorProfileVM,
  ThreadVM,
  TextMessageVM,
  MessageVM,
  UserProfileVM,
} from '@iconicedu/shared-types';

export interface MessagesContainerProps {
  channel: ChannelVM;
  initialThreadMessages: Record<string, MessageVM[]>;
  lastReadMessageId?: string;
  infoPanel?: ReactNode;
  infoPanelMeta?: { title: string; subtitle?: string };
  defaultSidebarContent?: SidebarContent;
}

const isGuardianProfile = (profile: UserProfileVM): profile is GuardianProfileVM =>
  'children' in profile;

const isEducatorProfile = (profile: UserProfileVM): profile is EducatorProfileVM =>
  'subjects' in profile || 'gradesSupported' in profile || 'experienceYears' in profile;

export function MessagesContainer({
  channel,
  initialThreadMessages,
  lastReadMessageId,
  infoPanel,
  infoPanelMeta,
  defaultSidebarContent,
}: MessagesContainerProps) {
  const isMobile = useIsMobile();
  const participants = channel.participants ?? [];
  const fallbackParticipant = participants[0];
  const guardian = participants.find(isGuardianProfile) ?? fallbackParticipant;
  const educator =
    participants.find(isEducatorProfile) ??
    participants.find((participant) => participant.id !== guardian?.id) ??
    fallbackParticipant;
  const senderProfile = guardian ?? educator ?? fallbackParticipant;
  const currentUserId = guardian?.id ?? participants[0]?.id ?? '';
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
  const channelMessages = channel.messages?.items ?? [];
  const { messages, addMessage, toggleReaction, toggleSaved, toggleHidden } =
    useMessages(channelMessages);
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
      if (!senderProfile) return;
      const newMessage: TextMessageVM = {
        id: `msg-${Date.now()}`,
        type: 'text',
        content,
        sender: senderProfile,
        timestamp: new Date().toISOString(),
        reactions: [],
        visibility: { type: 'all' },
        isSaved: false,
        isRead: true,
      };
      addMessage(newMessage);
    },
    [addMessage, senderProfile],
  );

  const handleSendThreadReply = useCallback(
    (content: string) => {
      if (!senderProfile) return;
      const newReply: TextMessageVM = {
        id: `reply-${Date.now()}`,
        type: 'text',
        content,
        sender: senderProfile,
        timestamp: new Date().toISOString(),
        reactions: [],
        visibility: { type: 'all' },
        isSaved: false,
        isRead: true,
      };
      addThreadMessage(newReply);
    },
    [addThreadMessage, senderProfile],
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
      if (!currentUserId) return;
      toggleReaction(messageId, emoji, currentUserId);
    },
    [toggleReaction, currentUserId],
  );

  const handleToggleThreadReaction = useCallback(
    (messageId: string, emoji: string) => {
      if (!currentUserId) return;
      toggleThreadReaction(messageId, emoji, currentUserId);
    },
    [toggleThreadReaction, currentUserId],
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
    if (!profileUserId) return educator ?? guardian ?? participants[0];
    return (
      participants.find((participant) => participant.id === profileUserId) ??
      educator ??
      guardian ??
      participants[0]
    );
  }, [profileUserId, educator, guardian, participants]);

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

  const headerNode = <MessagesContainerHeader channel={channel} />;

  const contextValue = useMemo(
    () => ({
      channel,
      currentUserId,
      savedCount,
      sidebarContent,
      profileUserId,
      openInfo: handleOpenInfo,
      openProfile: handleProfileClick,
      openSavedMessages: handleSavedMessagesClick,
    }),
    [
      channel,
      currentUserId,
      savedCount,
      sidebarContent,
      profileUserId,
      handleOpenInfo,
      handleProfileClick,
      handleSavedMessagesClick,
    ],
  );

  const messageListProps = useMemo(
    () => ({
      messages,
      onOpenThread: handleOpenThread,
      onProfileClick: handleProfileClick,
      onToggleReaction: handleToggleReaction,
      onToggleSaved: handleToggleSaved,
      onToggleHidden: handleToggleHidden,
      currentUserId,
      lastReadMessageId,
    }),
    [
      messages,
      handleOpenThread,
      handleProfileClick,
      handleToggleReaction,
      handleToggleSaved,
      handleToggleHidden,
      currentUserId,
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
      currentUserId,
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
      currentUserId,
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
      <MessagesContainerProvider value={contextValue}>
        <div className="flex flex-1 flex-col">
          {headerNode}
          <div className="flex flex-1 overflow-hidden">
            <div className="flex flex-1 min-h-0 flex-col">
              <MessageList ref={messageListRef} {...messageListProps} />
              <MessageInput
                onSend={handleSendMessage}
                placeholder={`Message ${educator?.displayName ?? channel.topic}`}
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
                  <ProfileSheet
                    user={profileUser}
                    onSavedMessagesClick={handleSavedMessagesClick}
                  />
                ) : (
                  <ProfilePanel
                    user={profileUser}
                    onSavedMessagesClick={handleSavedMessagesClick}
                  />
                ))}
              {sidebarContent === 'saved-messages' && (
                <SavedMessagesPanel {...savedMessagesPanelProps} />
              )}
              {sidebarContent === 'space-info' && infoPanel}
            </MessagesSidebar>
          </div>
        </div>
      </MessagesContainerProvider>
    </div>
  );
}

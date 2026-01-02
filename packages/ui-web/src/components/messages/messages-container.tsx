'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { MessageList, type MessageListRef } from './message-list';
import { MessageInput } from './message-input';
import { useMessages } from '../../hooks/use-messages';
import { useMessagesState } from './context/messages-state-provider';
import type {
  ChannelVM,
  EducatorProfileVM,
  GuardianProfileVM,
  MessageVM,
  TextMessageVM,
  ThreadVM,
  UserProfileVM,
} from '@iconicedu/shared-types';

export interface MessagesContainerProps {
  channel: ChannelVM;
}

const isGuardianProfile = (profile: UserProfileVM): profile is GuardianProfileVM =>
  profile.kind === 'guardian';

const isEducatorProfile = (profile: UserProfileVM): profile is EducatorProfileVM =>
  profile.kind === 'educator';

export function MessagesContainer({ channel }: MessagesContainerProps) {
  const messageListRef = useRef<MessageListRef>(null);
  const {
    toggle,
    setSavedCount,
    setHomeworkCount,
    setSessionSummaryCount,
    setThreadData,
    setCurrentUserId,
    setMessages,
    setCreateTextMessage,
    setThreadHandlers,
    setScrollToMessage,
    messageFilter,
    toggleMessageFilter,
  } = useMessagesState();
  const channelMessages = channel.collections.messages?.items ?? [];
  const {
    messages,
    addMessage,
    updateMessage,
    deleteMessage,
    toggleReaction,
    toggleSaved,
    toggleHidden,
  } = useMessages(channelMessages);

  const participants = channel.collections.participants ?? [];
  const fallbackParticipant = participants[0];
  const guardian = participants.find(isGuardianProfile) ?? fallbackParticipant;
  const educator =
    participants.find(isEducatorProfile) ??
    participants.find((participant) => participant.ids.id !== guardian?.ids.id) ??
    fallbackParticipant;
  const senderProfile = guardian ?? educator ?? fallbackParticipant;
  const currentUserId = guardian?.ids.id ?? participants[0]?.ids.id ?? '';

  const handleOpenThread = useCallback(
    (thread: ThreadVM, parentMessage: MessageVM) => {
      const threadMessages = messages
        .filter((message) => message.social.thread?.id === thread.id)
        .sort(
          (a, b) =>
            new Date(a.core.createdAt).getTime() - new Date(b.core.createdAt).getTime(),
        );
      const resolvedThreadMessages = threadMessages.length
        ? threadMessages
        : [parentMessage];
      const replyItems = resolvedThreadMessages.filter(
        (message) => message.ids.id !== parentMessage.ids.id,
      );
      setThreadData(thread, {
        replies: {
          items: replyItems,
          total:
            typeof thread.stats?.messageCount === 'number'
              ? Math.max(0, thread.stats.messageCount - 1)
              : undefined,
        },
        parentMessage,
      });
      toggle({ key: 'thread', threadId: thread.id });
    },
    [messages, setThreadData, toggle],
  );

  const handleSendMessage = useCallback(
    (content: string) => {
      if (!senderProfile) return;
      if (messageFilter) {
        toggleMessageFilter(messageFilter);
      }
      const newMessage: TextMessageVM = {
        ids: { id: `msg-${Date.now()}` },
        core: {
          type: 'text',
          sender: senderProfile,
          createdAt: new Date().toISOString(),
          visibility: { type: 'all' },
        },
        social: {
          reactions: [],
        },
        state: {
          isSaved: false,
        },
        content: { text: content },
      };
      addMessage(newMessage);
    },
    [addMessage, senderProfile, messageFilter, toggleMessageFilter],
  );

  const handleProfileClick = useCallback(
    (userId: string) => {
      toggle({ key: 'profile', userId });
    },
    [toggle],
  );

  const handleToggleReaction = useCallback(
    (messageId: string, emoji: string) => {
      if (!currentUserId) return;
      toggleReaction(messageId, emoji, currentUserId);
    },
    [toggleReaction, currentUserId],
  );

  const handleToggleSaved = useCallback(
    (messageId: string) => {
      toggleSaved(messageId);
    },
    [toggleSaved],
  );

  const handleToggleHidden = useCallback(
    (messageId: string) => {
      toggleHidden(messageId);
    },
    [toggleHidden],
  );

  const visibleMessages = useMemo(
    () =>
      messages.filter(
        (message) =>
          !message.social.thread?.parent?.messageId ||
          message.social.thread.parent.messageId === message.ids.id,
      ),
    [messages],
  );

  const savedCount = useMemo(
    () => messages.filter((m) => m.state?.isSaved).length,
    [messages],
  );
  const homeworkCount = useMemo(
    () =>
      visibleMessages.filter(
        (message) =>
          message.core.type === 'lesson-assignment' ||
          message.core.type === 'homework-submission',
      ).length,
    [visibleMessages],
  );
  const sessionSummaryCount = useMemo(
    () =>
      visibleMessages.filter((message) => message.core.type === 'session-summary')
        .length,
    [visibleMessages],
  );

  const filteredMessages = useMemo(() => {
    if (!messageFilter) return visibleMessages;
    if (messageFilter === 'homework') {
      return visibleMessages.filter(
        (message) =>
          message.core.type === 'lesson-assignment' ||
          message.core.type === 'homework-submission',
      );
    }
    if (messageFilter === 'session-summary') {
      return visibleMessages.filter(
        (message) => message.core.type === 'session-summary',
      );
    }
    return visibleMessages;
  }, [messageFilter, visibleMessages]);

  useEffect(() => {
    setSavedCount(savedCount);
  }, [savedCount, setSavedCount]);

  useEffect(() => {
    setHomeworkCount(homeworkCount);
    setSessionSummaryCount(sessionSummaryCount);
  }, [homeworkCount, sessionSummaryCount, setHomeworkCount, setSessionSummaryCount]);

  useEffect(() => {
    if (currentUserId) {
      setCurrentUserId(currentUserId);
    }
  }, [currentUserId, setCurrentUserId]);

  useEffect(() => {
    setMessages(messages);
  }, [messages, setMessages]);

  useEffect(() => {
    if (!senderProfile) return;
    setCreateTextMessage(
      (content: string): TextMessageVM => ({
        ids: { id: `reply-${Date.now()}` },
        core: {
          type: 'text',
          sender: senderProfile,
          createdAt: new Date().toISOString(),
          visibility: { type: 'all' },
        },
        social: {
          reactions: [],
        },
        state: {
          isSaved: false,
        },
        content: { text: content },
      }),
    );
  }, [senderProfile, setCreateTextMessage]);

  useEffect(() => {
    setThreadHandlers({
      onAddMessage: addMessage,
      onUpdateMessage: updateMessage,
      onDeleteMessage: deleteMessage,
      onToggleReaction: handleToggleReaction,
      onToggleSaved: handleToggleSaved,
      onToggleHidden: handleToggleHidden,
    });
  }, [
    addMessage,
    updateMessage,
    deleteMessage,
    handleToggleReaction,
    handleToggleSaved,
    handleToggleHidden,
    setThreadHandlers,
  ]);

  useEffect(() => {
    setScrollToMessage(() => (messageId: string) => {
      messageListRef.current?.scrollToMessage(messageId);
    });
  }, [setScrollToMessage]);

  const messageListProps = useMemo(
    () => ({
      messages: filteredMessages,
      onOpenThread: handleOpenThread,
      onProfileClick: handleProfileClick,
      onToggleReaction: handleToggleReaction,
      onToggleSaved: handleToggleSaved,
      onToggleHidden: handleToggleHidden,
      currentUserId,
      lastReadMessageId: channel.collections.readState?.lastReadMessageId,
    }),
    [
      filteredMessages,
      handleOpenThread,
      handleProfileClick,
      handleToggleReaction,
      handleToggleSaved,
      handleToggleHidden,
      currentUserId,
      channel.collections.readState?.lastReadMessageId,
    ],
  );

  return (
    <div className="flex h-full min-h-0 flex-1 min-w-0 flex-col">
      <MessageList ref={messageListRef} {...messageListProps} />
      <MessageInput
        onSend={handleSendMessage}
        placeholder={`Message ${educator?.profile.displayName ?? channel.basics.topic}`}
      />
    </div>
  );
}

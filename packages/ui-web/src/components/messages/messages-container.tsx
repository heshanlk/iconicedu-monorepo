'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { MessageList, type MessageListRef } from './message-list';
import { MessageInput } from './message-input';
import { useMessages } from '../../hooks/use-messages';
import { useMessagesState } from './messages-state-provider';
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
  lastReadMessageId?: string;
}

const isGuardianProfile = (profile: UserProfileVM): profile is GuardianProfileVM =>
  'children' in profile;

const isEducatorProfile = (profile: UserProfileVM): profile is EducatorProfileVM =>
  'subjects' in profile || 'gradesSupported' in profile || 'experienceYears' in profile;

export function MessagesContainer({
  channel,
  lastReadMessageId,
}: MessagesContainerProps) {
  const messageListRef = useRef<MessageListRef>(null);
  const {
    toggle,
    setSavedCount,
    setThreadData,
    setCurrentUserId,
    setMessages,
    setCreateTextMessage,
    setThreadHandlers,
    appendThreadMessage,
    setScrollToMessage,
  } = useMessagesState();
  const channelMessages = channel.messages?.items ?? [];
  const { messages, addMessage, toggleReaction, toggleSaved, toggleHidden } =
    useMessages(channelMessages);

  const participants = channel.participants ?? [];
  const fallbackParticipant = participants[0];
  const guardian = participants.find(isGuardianProfile) ?? fallbackParticipant;
  const educator =
    participants.find(isEducatorProfile) ??
    participants.find((participant) => participant.id !== guardian?.id) ??
    fallbackParticipant;
  const senderProfile = guardian ?? educator ?? fallbackParticipant;
  const currentUserId = guardian?.id ?? participants[0]?.id ?? '';

  const handleOpenThread = useCallback(
    (thread: ThreadVM, parentMessage: MessageVM) => {
      const threadMessages = messages
        .filter((message) => message.thread?.id === thread.id)
        .sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        );
      const resolvedThreadMessages = threadMessages.length
        ? threadMessages
        : [parentMessage];
      setThreadData(thread, resolvedThreadMessages);
      toggle({ key: 'thread', threadId: thread.id });
    },
    [messages, setThreadData, toggle],
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

  const savedCount = useMemo(() => messages.filter((m) => m.isSaved).length, [messages]);

  const visibleMessages = useMemo(
    () =>
      messages.filter(
        (message) =>
          !message.thread?.parentMessage ||
          message.thread.parentMessage.id === message.id,
      ),
    [messages],
  );

  useEffect(() => {
    setSavedCount(savedCount);
  }, [savedCount, setSavedCount]);

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
        id: `reply-${Date.now()}`,
        type: 'text',
        content,
        sender: senderProfile,
        timestamp: new Date().toISOString(),
        reactions: [],
        visibility: { type: 'all' },
        isSaved: false,
        isRead: true,
      }),
    );
  }, [senderProfile, setCreateTextMessage]);

  useEffect(() => {
    setThreadHandlers({
      onToggleReaction: handleToggleReaction,
      onToggleSaved: handleToggleSaved,
      onToggleHidden: handleToggleHidden,
    });
  }, [handleToggleReaction, handleToggleSaved, handleToggleHidden, setThreadHandlers]);

  useEffect(() => {
    setScrollToMessage(() => (messageId: string) => {
      messageListRef.current?.scrollToMessage(messageId);
    });
  }, [setScrollToMessage]);

  const messageListProps = useMemo(
    () => ({
      messages: visibleMessages,
      onOpenThread: handleOpenThread,
      onProfileClick: handleProfileClick,
      onToggleReaction: handleToggleReaction,
      onToggleSaved: handleToggleSaved,
      onToggleHidden: handleToggleHidden,
      currentUserId,
      lastReadMessageId,
    }),
    [
      visibleMessages,
      handleOpenThread,
      handleProfileClick,
      handleToggleReaction,
      handleToggleSaved,
      handleToggleHidden,
      currentUserId,
      lastReadMessageId,
    ],
  );

  return (
    <div className="flex h-full min-h-0 flex-1 min-w-0 flex-col">
      <MessageList ref={messageListRef} {...messageListProps} />
      <MessageInput
        onSend={handleSendMessage}
        placeholder={`Message ${educator?.displayName ?? channel.topic}`}
      />
    </div>
  );
}

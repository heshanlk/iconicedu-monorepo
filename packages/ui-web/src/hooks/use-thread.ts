'use client';

import { useState, useCallback } from 'react';
import type { Message, Thread } from '@iconicedu/shared-types';

export function useThread() {
  const [activeThread, setActiveThread] = useState<Thread | null>(null);
  const [threadMessages, setThreadMessages] = useState<Message[]>([]);

  const openThread = useCallback((thread: Thread, messages: Message[]) => {
    setActiveThread(thread);
    setThreadMessages(messages);
  }, []);

  const closeThread = useCallback(() => {
    setActiveThread(null);
    setThreadMessages([]);
  }, []);

  const addThreadMessage = useCallback((message: Message) => {
    setThreadMessages((prev) => [...prev, message]);
  }, []);

  const toggleThreadReaction = useCallback(
    (messageId: string, emoji: string, userId: string) => {
      setThreadMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== messageId) return msg;

          const reactions = [...msg.reactions];
          const existingReactionIndex = reactions.findIndex((r) => r.emoji === emoji);

          if (existingReactionIndex >= 0) {
            const reaction = reactions[existingReactionIndex];
            const userIndex = reaction.users.indexOf(userId);

            if (userIndex >= 0) {
              const updatedUsers = reaction.users.filter((id) => id !== userId);
              if (updatedUsers.length === 0) {
                reactions.splice(existingReactionIndex, 1);
              } else {
                reactions[existingReactionIndex] = {
                  ...reaction,
                  users: updatedUsers,
                  count: updatedUsers.length,
                };
              }
            } else {
              reactions[existingReactionIndex] = {
                ...reaction,
                users: [...reaction.users, userId],
                count: reaction.count + 1,
              };
            }
          } else {
            reactions.push({
              emoji,
              count: 1,
              users: [userId],
            });
          }

          return { ...msg, reactions };
        }),
      );
    },
    [],
  );

  const toggleThreadSaved = useCallback((messageId: string) => {
    setThreadMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, isSaved: !msg.isSaved } : msg)),
    );
  }, []);

  const toggleThreadHidden = useCallback((messageId: string) => {
    setThreadMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isHidden: !msg.isHidden } : msg,
      ),
    );
  }, []);

  return {
    activeThread,
    threadMessages,
    openThread,
    closeThread,
    addThreadMessage,
    toggleThreadReaction,
    toggleThreadSaved,
    toggleThreadHidden,
  };
}

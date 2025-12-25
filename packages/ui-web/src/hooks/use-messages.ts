import { useState, useCallback } from 'react';
import type { Message } from '@iconicedu/shared-types';

export function useMessages(initialMessages: Message[]) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const updateMessage = useCallback((id: string, updates: Partial<Message>) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? ({ ...msg, ...updates } as Message) : msg)),
    );
  }, []);

  const deleteMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  }, []);

  const toggleReaction = useCallback(
    (messageId: string, emoji: string, userId: string) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== messageId) return msg;

          const reactions = [...msg.reactions];
          const existingReactionIndex = reactions.findIndex((r) => r.emoji === emoji);

          if (existingReactionIndex >= 0) {
            const reaction = reactions[existingReactionIndex];
            const userIndex = reaction.users.indexOf(userId);

            if (userIndex >= 0) {
              // Remove user's reaction
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
              // Add user's reaction
              reactions[existingReactionIndex] = {
                ...reaction,
                users: [...reaction.users, userId],
                count: reaction.count + 1,
              };
            }
          } else {
            // Create new reaction
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

  const toggleSaved = useCallback((messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, isSaved: !msg.isSaved } : msg)),
    );
  }, []);

  const toggleHidden = useCallback((messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isHidden: !msg.isHidden } : msg,
      ),
    );
  }, []);

  return {
    messages,
    addMessage,
    updateMessage,
    deleteMessage,
    toggleReaction,
    toggleSaved,
    toggleHidden,
  };
}

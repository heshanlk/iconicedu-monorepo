import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { MessagesContainer } from './messages-container';
import type { ChannelVM, UserProfileVM } from '@iconicedu/shared-types';

const setCurrentUserId = vi.fn();
const setCreateTextMessage = vi.fn();
const setSendTextMessage = vi.fn();

vi.mock('../../hooks/use-messages', () => ({
  useMessages: () => ({
    messages: [],
    addMessage: vi.fn(),
    updateMessage: vi.fn(),
    deleteMessage: vi.fn(),
    toggleReaction: vi.fn(),
    toggleSaved: vi.fn(),
    toggleHidden: vi.fn(),
  }),
}));

vi.mock('./context/messages-state-provider', () => ({
  useMessagesState: () => ({
    toggle: vi.fn(),
    setSavedCount: vi.fn(),
    setHomeworkCount: vi.fn(),
    setSessionSummaryCount: vi.fn(),
    setThreadData: vi.fn(),
    setCurrentUserId,
    setMessages: vi.fn(),
    setCreateTextMessage,
    setSendTextMessage,
    setThreadHandlers: vi.fn(),
    setScrollToMessage: vi.fn(),
    messageFilter: null,
    toggleMessageFilter: vi.fn(),
  }),
}));

vi.mock('./message-list', () => ({
  MessageList: () => null,
}));

vi.mock('./message-input', () => ({
  MessageInput: () => null,
}));

const makeParticipant = (id: string, kind: UserProfileVM['kind']): UserProfileVM =>
  ({
    ids: { id, orgId: 'org-1', accountId: `account-${id}` },
    kind,
    profile: {
      displayName: `User ${id}`,
      avatar: { url: null, source: 'seed' },
    },
    prefs: {},
    meta: {},
    ui: { themeKey: null },
    joinedDate: new Date().toISOString(),
  } as unknown as UserProfileVM);

const channel: ChannelVM = {
  ids: { id: 'channel-1', orgId: 'org-1' },
  basics: {
    kind: 'channel',
    topic: 'General',
    iconKey: null,
    description: null,
    visibility: 'private',
    purpose: 'general',
  },
  lifecycle: {
    status: 'active',
    createdBy: 'profile-1',
    createdAt: new Date().toISOString(),
  },
  postingPolicy: {
    kind: 'members-only',
    allowThreads: true,
    allowReactions: true,
  },
  collections: {
    participants: [makeParticipant('profile-1', 'guardian'), makeParticipant('profile-2', 'educator')],
    messages: { items: [], total: 0 },
    media: { items: [], total: 0 },
    files: { items: [], total: 0 },
  },
};

describe('MessagesContainer', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('uses the provided currentUserId', async () => {
    render(<MessagesContainer channel={channel} currentUserId="profile-2" />);

    await waitFor(() => {
      expect(setCurrentUserId).toHaveBeenCalledWith('profile-2');
    });

    const createFactory = setCreateTextMessage.mock.calls[0]?.[0];
    const message = createFactory?.('hello');
    expect(message.core.sender.ids.id).toBe('profile-2');
  });
});

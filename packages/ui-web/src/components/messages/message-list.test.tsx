import React from 'react';
import { render, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { MessageList } from './message-list';
import type { MessageVM, ThreadVM } from '@iconicedu/shared-types';

vi.mock('./message-item', () => ({
  MessageItem: () => null,
}));

vi.mock('./empty-state', () => ({
  EmptyMessagesState: () => null,
}));


const baseMessage: MessageVM = {
  ids: { id: 'message-1', orgId: 'org-1' },
  core: {
    type: 'text',
    sender: {
      ids: { id: 'profile-1', orgId: 'org-1', accountId: 'account-1' },
      kind: 'guardian',
      profile: {
        displayName: 'User 1',
        avatar: { url: null, source: 'seed' },
      },
      prefs: {},
      meta: {},
      ui: { themeKey: null },
      joinedDate: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
    visibility: { type: 'all' },
  },
  social: { reactions: [] },
  content: { text: 'Hello' },
};

describe('MessageList', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('renders the typing indicator when provided', () => {
    const { getByText } = render(
      <MessageList
        messages={[baseMessage]}
        onOpenThread={vi.fn() as unknown as (thread: ThreadVM, message: MessageVM) => void}
        onProfileClick={vi.fn()}
        typingIndicator={<div>Typing indicator</div>}
      />,
    );

    expect(getByText('Typing indicator')).toBeInTheDocument();
  });

  it('scrolls to bottom when typing indicator appears', () => {
    const { rerender } = render(
      <MessageList
        messages={[baseMessage]}
        onOpenThread={vi.fn() as unknown as (thread: ThreadVM, message: MessageVM) => void}
        onProfileClick={vi.fn()}
      />,
    );

    act(() => {
      rerender(
        <MessageList
          messages={[baseMessage]}
          onOpenThread={vi.fn() as unknown as (thread: ThreadVM, message: MessageVM) => void}
          onProfileClick={vi.fn()}
          typingIndicator={<div>Typing indicator</div>}
        />,
      );
    });

    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });
});

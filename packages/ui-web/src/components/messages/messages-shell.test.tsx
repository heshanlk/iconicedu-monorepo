import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { MessagesShell } from './messages-shell';

const messagesContainerMock = vi.fn();

vi.mock('./messages-container', () => ({
  MessagesContainer: (props: unknown) => messagesContainerMock(props),
}));

vi.mock('./messages-container-header', () => ({
  MessagesContainerHeader: () => null,
}));

vi.mock('./messages-container-header-actions', () => ({
  MessagesContainerHeaderActions: () => null,
}));

vi.mock('./messages-right-sidebar-region', () => ({
  MessagesRightSidebarRegion: () => null,
}));

vi.mock('../../ui/resizable', () => ({
  ResizableHandle: () => null,
  ResizablePanel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ResizablePanelGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('./context/messages-state-provider', () => ({
  MessagesStateProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useMessagesState: () => ({ state: { isOpen: false, intent: null }, open: vi.fn() }),
}));

describe('MessagesShell', () => {
  it('forwards currentUserId to MessagesContainer', () => {
    render(
      <MessagesShell
        channel={{ ids: { id: 'channel-1', orgId: 'org-1' } } as any}
        currentUserId="profile-1"
      />,
    );

    expect(messagesContainerMock).toHaveBeenCalledWith(
      expect.objectContaining({ currentUserId: 'profile-1' }),
    );
  });
});

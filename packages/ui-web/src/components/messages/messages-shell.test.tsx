import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { MessagesShell } from '@iconicedu/ui-web/components/messages/messages-shell';

const messagesContainerMock = vi.fn();

vi.mock('@iconicedu/ui-web/components/messages/messages-container', () => ({
  MessagesContainer: (props: unknown) => messagesContainerMock(props),
}));

vi.mock('@iconicedu/ui-web/components/messages/messages-container-header', () => ({
  MessagesContainerHeader: () => null,
}));

vi.mock('@iconicedu/ui-web/components/messages/messages-container-header-actions', () => ({
  MessagesContainerHeaderActions: () => null,
}));

vi.mock('@iconicedu/ui-web/components/messages/messages-right-sidebar-region', () => ({
  MessagesRightSidebarRegion: () => null,
}));

vi.mock('@iconicedu/ui-web/ui/resizable', () => ({
  ResizableHandle: () => null,
  ResizablePanel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ResizablePanelGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@iconicedu/ui-web/components/messages/context/messages-state-provider', () => ({
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

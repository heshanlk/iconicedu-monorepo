import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { LearningSpaceShell } from '@iconicedu/web/app/(app)/d/spaces/[channelId]/learning-space-shell';

const messagesShellMock = vi.fn(() => null);

vi.mock('@iconicedu/ui-web', () => ({
  MessagesShell: (props: unknown) => messagesShellMock(props),
  LearningSpaceInfoPanel: () => null,
}));

describe('LearningSpaceShell', () => {
  it('forwards currentUserId to MessagesShell', () => {
    render(
      <LearningSpaceShell
        channel={{ ids: { id: 'channel-1', orgId: 'org-1' } } as any}
        learningSpace={null}
        currentUserId="profile-1"
      />,
    );

    expect(messagesShellMock).toHaveBeenCalledWith(
      expect.objectContaining({ currentUserId: 'profile-1' }),
    );
  });
});

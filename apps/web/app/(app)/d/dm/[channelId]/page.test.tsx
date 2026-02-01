import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import Page from '@iconicedu/web/app/(app)/d/dm/[channelId]/page';

const messagesShellMock = vi.fn(() => null);

vi.mock('@iconicedu/ui-web', () => ({
  MessagesShell: (props: unknown) => messagesShellMock(props),
  DashboardHeader: () => null,
}));

vi.mock('@iconicedu/web/lib/supabase/server', () => ({
  createSupabaseServerClient: vi.fn(() => ({})),
}));

vi.mock('@iconicedu/web/lib/auth/requireAuthedUser', () => ({
  requireAuthedUser: vi.fn(async () => ({ id: 'auth-user', email: 'test@example.com' })),
}));

vi.mock('@iconicedu/web/lib/accounts/getOrCreateAccount', () => ({
  getOrCreateAccount: vi.fn(async () => ({ account: { id: 'account-1', org_id: 'org-1' } })),
}));

vi.mock('@iconicedu/web/lib/profile/queries/profiles.query', () => ({
  getProfileByAccountId: vi.fn(async () => ({ data: { id: 'profile-1' } })),
}));

vi.mock('@iconicedu/web/lib/channels/builders/channel.builder', () => ({
  buildChannelById: vi.fn(async () => ({ ids: { id: 'channel-1', orgId: 'org-1' } })),
  buildChannelByDmKey: vi.fn(async () => null),
}));

describe('d/dm/[channelId] page', () => {
  it('passes currentUserId to MessagesShell', async () => {
    await Page({ params: Promise.resolve({ channelId: 'channel-1' }) });
    expect(messagesShellMock).toHaveBeenCalledWith(
      expect.objectContaining({ currentUserId: 'profile-1' }),
    );
  });
});

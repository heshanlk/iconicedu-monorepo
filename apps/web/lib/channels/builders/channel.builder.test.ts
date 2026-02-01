import { describe, expect, it, vi } from 'vitest';

import { buildDirectMessageChannelsWithMessages } from '@iconicedu/web/lib/channels/builders/channel.builder';

const getChannelsByOrg = vi.fn();
const getChannelParticipantsByChannelIds = vi.fn();
const getChannelCapabilitiesByChannelIds = vi.fn();
const getChannelReadStatesByAccountId = vi.fn();
const getProfilesByIds = vi.fn();

vi.mock('@iconicedu/web/lib/channels/queries/channels.query', () => ({
  getChannelsByOrg: (...args: unknown[]) => getChannelsByOrg(...args),
  getChannelParticipantsByChannelIds: (...args: unknown[]) =>
    getChannelParticipantsByChannelIds(...args),
  getChannelCapabilitiesByChannelIds: (...args: unknown[]) =>
    getChannelCapabilitiesByChannelIds(...args),
  getChannelReadStatesByAccountId: (...args: unknown[]) =>
    getChannelReadStatesByAccountId(...args),
}));

vi.mock('@iconicedu/web/lib/messages/builders/channel-messages.builder', () => ({
  buildChannelMessages: vi.fn(async () => ({ items: [], total: 0 })),
  buildChannelMedia: vi.fn(async () => ({ items: [], total: 0 })),
  buildChannelFiles: vi.fn(async () => ({ items: [], total: 0 })),
}));

vi.mock('@iconicedu/web/lib/profile/builders/user-profile.builder', () => ({
  buildUserProfileFromRow: vi.fn(async (row: any) => ({
    ids: { id: row.id, orgId: row.org_id, accountId: row.account_id },
    profile: { displayName: row.display_name ?? row.id, avatar: { url: null, source: 'seed' } },
    prefs: {},
    meta: {},
    kind: row.kind ?? 'guardian',
  })),
}));

vi.mock('@iconicedu/web/lib/profile/queries/profiles.query', () => ({
  getProfilesByIds: (...args: unknown[]) => getProfilesByIds(...args),
}));

describe('buildDirectMessageChannelsWithMessages', () => {
  it('filters dm channels by account membership when accountId is provided', async () => {
    getChannelsByOrg.mockResolvedValueOnce({
      data: [
        { id: 'dm-1', org_id: 'org-1', kind: 'dm', topic: 'DM', purpose: 'general' },
        { id: 'dm-2', org_id: 'org-1', kind: 'dm', topic: 'DM', purpose: 'general' },
      ],
    });
    getChannelParticipantsByChannelIds.mockResolvedValueOnce({
      data: [
        { channel_id: 'dm-1', profile_id: 'profile-1' },
        { channel_id: 'dm-2', profile_id: 'profile-2' },
      ],
    });
    getChannelCapabilitiesByChannelIds.mockResolvedValueOnce({ data: [] });
    getChannelReadStatesByAccountId.mockResolvedValueOnce({ data: [] });
    getProfilesByIds.mockResolvedValueOnce({
      data: [
        { id: 'profile-1', org_id: 'org-1', account_id: 'account-1', display_name: 'User 1' },
        { id: 'profile-2', org_id: 'org-1', account_id: 'account-2', display_name: 'User 2' },
      ],
    });

    const results = await buildDirectMessageChannelsWithMessages({} as any, 'org-1', {
      accountId: 'account-1',
    });

    expect(results).toHaveLength(1);
    expect(results[0].ids.id).toBe('dm-1');
  });
});

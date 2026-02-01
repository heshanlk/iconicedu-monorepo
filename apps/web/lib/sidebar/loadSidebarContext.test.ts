import { describe, expect, it, vi } from 'vitest';

import { loadSidebarContext } from '@iconicedu/web/lib/sidebar/loadSidebarContext';

const buildSidebarUser = vi.fn();

vi.mock('@iconicedu/web/lib/sidebar/user/buildSidebarUser', () => ({
  buildSidebarUser: (...args: unknown[]) => buildSidebarUser(...args),
}));

vi.mock('@iconicedu/web/lib/onboarding/determineOnboardingStep', () => ({
  determineOnboardingStep: () => null,
}));

vi.mock('@iconicedu/web/lib/onboarding/queries/status.query', () => ({
  getUserOnboardingStatusByProfileId: vi.fn(async () => ({ data: null })),
  upsertUserOnboardingStatus: vi.fn(async () => ({ data: null, error: null })),
}));

vi.mock('@iconicedu/web/lib/onboarding/mappers', () => ({
  mapUserOnboardingStatusRowToVM: (row: unknown) => row,
}));

vi.mock('@iconicedu/web/lib/accounts/queries/accounts.query', () => ({
  getAccountById: vi.fn(async () => ({ data: { id: 'account-1', org_id: 'org-1' } })),
}));

vi.mock('@iconicedu/web/lib/family/queries/invite.query', () => ({
  acceptFamilyInvite: vi.fn(),
}));

const makeChannel = (id: string, participantIds: string[]) =>
  ({
    ids: { id, orgId: 'org-1' },
    collections: {
      participants: participantIds.map((participantId) => ({
        ids: { id: participantId, orgId: 'org-1', accountId: `account-${participantId}` },
        profile: { displayName: `User ${participantId}`, avatar: { url: null, source: 'seed' } },
      })),
    },
  }) as any;

describe('loadSidebarContext', () => {
  it('filters direct messages for guardians to only include their channels', async () => {
    buildSidebarUser.mockResolvedValueOnce({
      accountVM: { ids: { id: 'account-1', orgId: 'org-1' } },
      profileVM: {
        ids: { id: 'profile-1', orgId: 'org-1', accountId: 'account-1' },
        kind: 'guardian',
      },
    });

    const supabase = {
      from: () => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              is: () => ({ data: [], error: null }),
            }),
          }),
        }),
      }),
    } as any;

    const baseSidebarData = {
      navigation: { navMain: [], navSecondary: [] },
      collections: {
        learningSpaces: [],
        directMessages: [
          makeChannel('dm-1', ['profile-1', 'profile-2']),
          makeChannel('dm-2', ['profile-3']),
        ],
      },
    };

    const result = await loadSidebarContext(supabase, {
      authUser: { id: 'auth-1' },
      account: { id: 'account-1', org_id: 'org-1' },
      baseSidebarData,
    });

    expect(result.sidebarData.collections.directMessages).toHaveLength(1);
    expect(result.sidebarData.collections.directMessages[0].ids.id).toBe('dm-1');
  });
});

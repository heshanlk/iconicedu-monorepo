import { describe, expect, it, vi } from 'vitest';

import { sendTextMessageAction } from '@iconicedu/web/app/actions/messages';

const mapMessageRowToVM = vi.fn();
const buildUserProfileById = vi.fn();

vi.mock('@iconicedu/web/lib/supabase/server', () => ({
  createSupabaseServerClient: vi.fn(),
}));

vi.mock('@iconicedu/web/lib/auth/requireAuthedUser', () => ({
  requireAuthedUser: vi.fn(async () => ({ id: 'auth-user' })),
}));

vi.mock('@iconicedu/web/lib/accounts/queries/accounts.query', () => ({
  getAccountByAuthUserId: vi.fn(async () => ({ data: { id: 'account-1', org_id: 'org-1' } })),
}));

vi.mock('@iconicedu/web/lib/profile/queries/profiles.query', () => ({
  getProfileByAccountId: vi.fn(async () => ({ data: { id: 'profile-1' } })),
}));

vi.mock('@iconicedu/web/lib/profile/builders/user-profile.builder', () => ({
  buildUserProfileById: (...args: unknown[]) => buildUserProfileById(...args),
}));

vi.mock('@iconicedu/web/lib/messages/mappers/message.mapper', () => ({
  mapMessageRowToVM: (...args: unknown[]) => mapMessageRowToVM(...args),
}));

describe('sendTextMessageAction', () => {
  it('creates a text message and returns the mapped VM', async () => {
    const supabase = {
      auth: { getUser: vi.fn(async () => ({ data: { user: { id: 'auth-user' } } })) },
      from: vi.fn(),
    };
    const { createSupabaseServerClient } = await import(
      '@iconicedu/web/lib/supabase/server'
    );
    (createSupabaseServerClient as unknown as { mockReturnValue: (value: any) => void }).mockReturnValue(
      supabase,
    );
    const insertMessage = vi.fn();
    const insertMessageText = vi.fn();
    const messageRow = {
      id: 'message-1',
      org_id: 'org-1',
      channel_id: 'channel-1',
      sender_profile_id: 'profile-1',
      type: 'text',
      created_at: new Date().toISOString(),
    };

    supabase.from.mockImplementation((table: string) => {
      if (table === 'messages') {
        insertMessage.mockReturnValue({
          select: () => ({
            single: async () => ({ data: messageRow, error: null }),
          }),
        });
        return { insert: insertMessage };
      }
      if (table === 'message_text') {
        insertMessageText.mockResolvedValue({ error: null });
        return { insert: insertMessageText };
      }
      return { insert: vi.fn() };
    });

    buildUserProfileById.mockResolvedValueOnce({ ids: { id: 'profile-1', orgId: 'org-1' } });
    mapMessageRowToVM.mockReturnValueOnce({ ids: { id: 'message-1', orgId: 'org-1' } });

    const result = await sendTextMessageAction({
      orgId: 'org-1',
      channelId: 'channel-1',
      senderProfileId: 'profile-1',
      content: 'Hello world',
    });

    expect(insertMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        org_id: 'org-1',
        channel_id: 'channel-1',
        sender_profile_id: 'profile-1',
        type: 'text',
      }),
    );
    expect(insertMessageText).toHaveBeenCalledWith(
      expect.objectContaining({
        message_id: 'message-1',
        org_id: 'org-1',
        payload: { text: 'Hello world' },
      }),
    );
    expect(result).toEqual({ ids: { id: 'message-1', orgId: 'org-1' } });
  });
});

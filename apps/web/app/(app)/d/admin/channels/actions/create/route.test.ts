import { describe, expect, it, vi } from 'vitest';

import type { ChannelCreatePayload } from '@iconicedu/shared-types';
import { POST } from '@iconicedu/web/app/(app)/d/admin/channels/actions/create/route';

const createAdminChannel = vi.fn();

vi.mock('@iconicedu/web/lib/admin/channel-create', () => ({
  createAdminChannel: (input: unknown) => createAdminChannel(input),
}));

describe('POST /d/admin/channels/actions/create', () => {
  it('returns 400 when topic is missing', async () => {
    const response = await POST(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({}),
      }),
    );

    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload).toEqual({ success: false, message: 'topic is required' });
  });

  it('creates a channel when topic is provided', async () => {
    createAdminChannel.mockResolvedValueOnce('channel-1');

    const payload: ChannelCreatePayload = {
      basics: {
        kind: 'channel',
        topic: '  Updates  ',
        iconKey: null,
        description: 'hello',
        visibility: 'private',
        purpose: 'general',
      },
      postingPolicy: {
        kind: 'members-only',
        allowThreads: true,
        allowReactions: true,
      },
      lifecycle: { status: 'active' },
      participants: [{ profileId: 'profile-1', roleInChannel: null }],
      capabilities: [],
    };

    const response = await POST(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    );

    expect(createAdminChannel).toHaveBeenCalledWith(payload);

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload).toEqual({ success: true, channelId: 'channel-1' });
  });
});

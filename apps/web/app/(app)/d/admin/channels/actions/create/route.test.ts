import { describe, expect, it, vi } from 'vitest';

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

    const response = await POST(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({
          topic: '  Updates  ',
          description: 'hello',
          purpose: 'general',
        }),
      }),
    );

    expect(createAdminChannel).toHaveBeenCalledWith({
      topic: 'Updates',
      description: 'hello',
      purpose: 'general',
      kind: null,
    });

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload).toEqual({ success: true, channelId: 'channel-1' });
  });
});

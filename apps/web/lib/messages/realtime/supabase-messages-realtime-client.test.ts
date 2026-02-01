import { describe, expect, it, vi, beforeEach } from 'vitest';

import { createSupabaseMessagesRealtimeClient } from './supabase-messages-realtime-client';

const channelOn = vi.fn();
const channelSend = vi.fn().mockResolvedValue(undefined);
const channelSubscribe = vi.fn();
const channelUnsubscribe = vi.fn();

const channel = {
  on: channelOn,
  send: channelSend,
  subscribe: channelSubscribe,
  unsubscribe: channelUnsubscribe,
};

const supabase = {
  channel: vi.fn(() => channel),
};

vi.mock('@iconicedu/web/lib/supabase/client', () => ({
  createSupabaseBrowserClient: () => supabase,
}));

describe('createSupabaseMessagesRealtimeClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('emits typing events from broadcasts', () => {
    const client = createSupabaseMessagesRealtimeClient();
    const onEvent = vi.fn();

    client.subscribe({ orgId: 'org-1', channelId: 'channel-1', onEvent });

    const typingHandler = channelOn.mock.calls.find(
      (call) => call[0] === 'broadcast' && call[1]?.event === 'typing',
    )?.[2] as ((payload: any) => void) | undefined;

    expect(typingHandler).toBeTypeOf('function');

    typingHandler?.({ payload: { profileId: 'profile-1', isTyping: true } });

    expect(onEvent).toHaveBeenCalledWith({
      type: 'typing-start',
      profileId: 'profile-1',
    });
  });

  it('sends typing broadcasts on demand', async () => {
    const client = createSupabaseMessagesRealtimeClient();

    client.subscribe({
      orgId: 'org-1',
      channelId: 'channel-1',
      onEvent: vi.fn(),
    });

    await client.sendTyping?.({
      orgId: 'org-1',
      channelId: 'channel-1',
      profileId: 'profile-2',
      isTyping: false,
    });

    expect(channelSend).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'broadcast',
        event: 'typing',
        payload: { profileId: 'profile-2', isTyping: false },
      }),
    );
  });
});

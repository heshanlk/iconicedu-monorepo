'use client';

import type { MessagesRealtimeClient, MessageVM } from '@iconicedu/shared-types';
import { createSupabaseBrowserClient } from '@iconicedu/web/lib/supabase/client';

const MESSAGE_PAYLOAD_TABLES = [
  'message_text',
  'message_image',
  'message_file',
  'message_design_file_update',
  'message_payment_reminder',
  'message_event_reminder',
  'message_feedback_request',
  'message_lesson_assignment',
  'message_progress_update',
  'message_session_booking',
  'message_session_complete',
  'message_session_summary',
  'message_homework_submission',
  'message_link_preview',
  'message_audio_recording',
  'message_reactions',
  'message_reaction_counts',
] as const;

type MessagePayloadTable = (typeof MESSAGE_PAYLOAD_TABLES)[number];

export function createSupabaseMessagesRealtimeClient(): MessagesRealtimeClient {
  const supabase = createSupabaseBrowserClient();

  return {
    subscribe: ({ orgId, channelId, onEvent }) => {
      const channel = supabase.channel(`messages:${channelId}`);
      const pending = new Map<string, Promise<void>>();

      const fetchMessage = async (messageId: string, type: 'added' | 'updated') => {
        if (!messageId) return;
        if (pending.has(messageId)) {
          await pending.get(messageId);
          return;
        }
        const task = (async () => {
          const response = await fetch(`/d/messages/actions/detail?messageId=${messageId}`);
          if (!response.ok) return;
          const payload = (await response.json()) as {
            success?: boolean;
            message?: MessageVM;
          };
          if (!payload?.success || !payload.message) return;
          onEvent({
            type: type === 'added' ? 'message-added' : 'message-updated',
            message: payload.message,
          });
        })();
        pending.set(messageId, task);
        await task;
        pending.delete(messageId);
      };

      channel.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${channelId}`,
        },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            const messageId = (payload.old as { id?: string } | null)?.id;
            if (messageId) {
              onEvent({ type: 'message-deleted', messageId });
            }
            return;
          }
          const messageId = (payload.new as { id?: string } | null)?.id;
          void fetchMessage(messageId ?? '', payload.eventType === 'INSERT' ? 'added' : 'updated');
        },
      );

      MESSAGE_PAYLOAD_TABLES.forEach((tableName) => {
        channel.on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: tableName,
            filter: `org_id=eq.${orgId}`,
          },
          (payload) => {
            const messageId =
              (payload.new as { message_id?: string } | null)?.message_id ??
              (payload.old as { message_id?: string } | null)?.message_id;
            if (messageId) {
              void fetchMessage(messageId, 'updated');
            }
          },
        );
      });

      channel.subscribe();

      return {
        unsubscribe: () => {
          void channel.unsubscribe();
        },
      };
    },
  };
}

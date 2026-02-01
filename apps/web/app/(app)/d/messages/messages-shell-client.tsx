'use client';

import { useMemo, type ComponentType } from 'react';
import type {
  ChannelVM,
  MessageSendTextInput,
  MessageVM,
  MessagesRightPanelIntent,
  MessagesRightPanelRegistry,
  UserProfileVM,
} from '@iconicedu/shared-types';
import { MessagesShell } from '@iconicedu/ui-web';

import { createSupabaseMessagesRealtimeClient } from '@iconicedu/web/lib/messages/realtime/supabase-messages-realtime-client';

type MessagesShellClientProps = {
  channel: ChannelVM;
  currentUserId?: string;
  currentUserProfile?: UserProfileVM | null;
  panelRegistry?: Partial<
    MessagesRightPanelRegistry<ComponentType<{ intent: MessagesRightPanelIntent }>>
  >;
  sendTextMessage: (input: MessageSendTextInput) => Promise<MessageVM>;
};

export function MessagesShellClient({
  channel,
  currentUserId,
  currentUserProfile,
  panelRegistry,
  sendTextMessage,
}: MessagesShellClientProps) {
  const realtimeClient = useMemo(() => createSupabaseMessagesRealtimeClient(), []);
  const messageWriteClient = useMemo(
    () => ({ sendTextMessage }),
    [sendTextMessage],
  );

  return (
    <MessagesShell
      channel={channel}
      currentUserId={currentUserId}
      currentUserProfile={currentUserProfile}
      panelRegistry={panelRegistry}
      realtimeClient={realtimeClient}
      messageWriteClient={messageWriteClient}
    />
  );
}

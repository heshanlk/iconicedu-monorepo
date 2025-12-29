'use client';

import { memo } from 'react';
import { BookOpen, Sparkles, User, Users } from 'lucide-react';
import type { MessagesRightPanelIntent } from '@iconicedu/shared-types';
import { Badge } from '../../../ui/badge';
import { Separator } from '../../../ui/separator';
import { AvatarWithStatus } from '../../shared/avatar-with-status';
import { useMessagesState } from '../messages-state-provider';
import { ProfileActions } from '../profile-actions';

interface ChannelInfoPanelProps {
  intent: MessagesRightPanelIntent;
}

const CHANNEL_ICON_MAP = {
  sparkles: Sparkles,
  book: BookOpen,
  user: User,
  users: Users,
} as const;

const ChannelInfoPanelContent = memo(function ChannelInfoPanelContent() {
  const { channel, toggle } = useMessagesState();
  const topicIconKey = channel.topicIconKey ?? 'sparkles';
  const TopicIcon = CHANNEL_ICON_MAP[topicIconKey as keyof typeof CHANNEL_ICON_MAP] ?? Sparkles;
  const nextSessionItem = channel.headerItems.find((item) => item.key === 'next-session');

  return (
    <div className="flex-1">
      <div className="flex flex-col items-center gap-3 p-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <TopicIcon className="h-8 w-8" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-foreground">{channel.topic}</h2>
          {channel.description ? (
            <p className="mt-1 text-sm text-muted-foreground">{channel.description}</p>
          ) : null}
        </div>
        {channel.purpose ? (
          <Badge variant="secondary" className="text-xs">
            {channel.purpose.replace('-', ' ')}
          </Badge>
        ) : null}
      </div>

      <Separator />

      <div className="space-y-4 p-4">
        <h3 className="text-sm font-semibold text-foreground">Quick actions</h3>
        <ProfileActions onSavedMessagesClick={() => toggle({ key: 'saved' })} />
      </div>

      <Separator />

      <div className="space-y-4 p-4">
        <h3 className="text-sm font-semibold text-foreground">Details</h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          {nextSessionItem?.label ? (
            <div>
              <div className="text-xs text-muted-foreground">Next session</div>
              <div className="text-sm text-foreground">{nextSessionItem.label}</div>
            </div>
          ) : null}
        </div>
      </div>

      <Separator />

      <div className="space-y-4 p-4">
        <h3 className="text-sm font-semibold text-foreground">Members</h3>
        <div className="space-y-3">
          {channel.participants.map((member) => (
            <div key={member.id} className="flex items-center gap-3">
              <AvatarWithStatus
                name={member.displayName}
                avatar={member.avatar.url ?? ''}
                sizeClassName="h-9 w-9"
                initialsLength={1}
              />
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-foreground">
                  {member.displayName}
                </div>
                {member.status ? (
                  <div className="truncate text-xs text-muted-foreground">
                    {member.status}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export function ChannelInfoPanel(_: ChannelInfoPanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto">
      <ChannelInfoPanelContent />
    </div>
  );
}

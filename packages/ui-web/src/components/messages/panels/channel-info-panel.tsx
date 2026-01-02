'use client';

import { memo } from 'react';
import {
  BookOpen,
  ChefHat,
  Earth,
  Languages,
  LifeBuoy,
  Sparkles,
  SquarePi,
  User,
  Users,
} from 'lucide-react';
import type { MessagesRightPanelIntent } from '@iconicedu/shared-types';
import { Badge } from '../../../ui/badge';
import { Separator } from '../../../ui/separator';
import { AvatarWithStatus } from '../../shared/avatar-with-status';
import { ThemedIconBadge } from '../../shared/themed-icon';
import { MediaFilesPanel } from '../shared/media-files-panel';
import { useMessagesState } from '../context/messages-state-provider';

interface ChannelInfoPanelProps {
  intent: MessagesRightPanelIntent;
}

const CHANNEL_ICON_MAP = {
  sparkles: Sparkles,
  book: BookOpen,
  user: User,
  users: Users,
  languages: Languages,
  'square-pi': SquarePi,
  'chef-hat': ChefHat,
  earth: Earth,
  'life-buoy': LifeBuoy,
  support: LifeBuoy,
} as const;

const ChannelInfoPanelContent = memo(function ChannelInfoPanelContent() {
  const { channel } = useMessagesState();
  const infoPanel = channel.ui?.infoPanel;
  const showMembers = infoPanel?.showMembers ?? true;
  const iconKey = channel.basics.iconKey ?? 'sparkles';
  const TopicIcon =
    CHANNEL_ICON_MAP[iconKey as keyof typeof CHANNEL_ICON_MAP] ?? Sparkles;
  const nextSessionItem = (channel.ui?.headerQuickMetaActions ?? []).find(
    (item) => item.key === 'next-session',
  );

  return (
    <div className="flex-1 min-w-0">
      <div className="flex flex-col items-center gap-3 p-6 min-w-0">
        <ThemedIconBadge
          icon={TopicIcon}
          themeKey={channel.ui?.themeKey ?? null}
          size="lg"
        />
        <div className="text-center min-w-0">
          <h2 className="text-lg font-semibold text-foreground break-words">
            {channel.basics.topic}
          </h2>
          {channel.basics.description ? (
            <p className="mt-1 text-sm text-muted-foreground break-words">
              {channel.basics.description}
            </p>
          ) : null}
        </div>
        {channel.basics.purpose ? (
          <Badge variant="secondary" className="text-xs">
            {channel.basics.purpose.replace('-', ' ')}
          </Badge>
        ) : null}
      </div>

      <div className="space-y-4 p-4 min-w-0">
        <h3 className="text-sm font-semibold text-foreground">Details</h3>
        <div className="space-y-3 text-sm text-muted-foreground min-w-0">
          {nextSessionItem?.label ? (
            <div>
              <div className="text-xs text-muted-foreground">Next session</div>
              <div className="text-sm text-foreground break-words">
                {nextSessionItem.label}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <Separator />

      <div className="space-y-4 p-4 min-w-0">
        <MediaFilesPanel
          media={channel.collections.media.items}
          files={channel.collections.files.items}
        />
      </div>

      {showMembers ? (
        <>
          <Separator />

          <div className="space-y-4 p-4 min-w-0">
            <h3 className="text-sm font-semibold text-foreground">Members</h3>
            <div className="space-y-3 min-w-0">
              {channel.collections.participants.map((member) => (
                <div key={member.ids.id} className="flex items-center gap-3">
                  <AvatarWithStatus
                    name={member.profile.displayName}
                    avatar={member.profile.avatar}
                    presence={member.presence}
                    themeKey={member.ui?.themeKey}
                    sizeClassName="h-9 w-9"
                    initialsLength={1}
                  />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-foreground">
                      {member.profile.displayName}
                    </div>
                    {(member.presence?.state?.emoji || member.presence?.state?.text) && (
                      <div className="truncate text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          {member.presence?.state?.emoji ? (
                            <span>{member.presence.state.emoji}</span>
                          ) : null}
                          {member.presence?.state?.text ? (
                            <span className="truncate">{member.presence.state.text}</span>
                          ) : null}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
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

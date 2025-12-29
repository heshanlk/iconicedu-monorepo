'use client';

import { memo, useMemo } from 'react';
import type { ReactNode } from 'react';
import {
  Info,
  Sparkles,
  User,
  Users,
  BookOpen,
  Bookmark,
  Clock,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '../../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/tooltip';
import { cn } from '../../lib/utils';
import { AvatarWithStatus } from '../shared/avatar-with-status';
import type { ChannelVM, UserProfileVM } from '@iconicedu/shared-types';
import { useMessagesContainer } from './messages-container-context';

interface HeaderSubtitleItem {
  icon?: LucideIcon;
  label: string;
  onClick?: () => void;
  tooltip?: string;
}

interface MessagesContainerHeaderProps {
  channel: ChannelVM;
}

const HeaderSubtitleItem = memo(function HeaderSubtitleItem({
  icon: Icon,
  label,
  onClick,
  className,
  tooltip,
}: {
  icon?: LucideIcon;
  label: string;
  onClick?: () => void;
  className?: string;
  tooltip?: string;
}) {
  const content = (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-xs text-muted-foreground',
        onClick && 'cursor-pointer',
        className,
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
      <span className="truncate">{label}</span>
    </span>
  );

  if (!onClick || !tooltip) return content;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
});

const HeaderTitle = memo(function HeaderTitle({
  title,
  leading,
}: {
  title: string;
  leading: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      {leading}
      <span className="truncate text-sm font-semibold text-foreground">{title}</span>
    </div>
  );
});

const HeaderSubtitleRow = memo(function HeaderSubtitleRow({
  items,
}: {
  items: HeaderSubtitleItem[];
}) {
  return (
    <TooltipProvider>
      <div className="mt-1.5 flex flex-wrap items-center gap-3">
        {items.map((item, index) => (
          <div key={`${item.label}-${index}`} className="flex items-center gap-3">
            {index > 0 && <span className="h-4 w-px bg-border" aria-hidden="true" />}
            <HeaderSubtitleItem
              icon={item.icon}
              label={item.label}
              onClick={item.onClick}
              tooltip={item.tooltip}
              className="text-muted-foreground"
            />
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
});

const HeaderInfoButton = memo(function HeaderInfoButton({
  isActive,
  onOpenInfo,
}: {
  isActive: boolean;
  onOpenInfo: () => void;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 text-muted-foreground"
      onClick={onOpenInfo}
    >
      <span
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-full bg-muted',
          isActive && 'bg-primary/10 text-primary',
        )}
      >
        <Info className={cn('h-3.5 w-3.5')} strokeWidth={3} />
      </span>
    </Button>
  );
});

const CHANNEL_ICON_MAP: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  book: BookOpen,
  user: User,
  users: Users,
};

const HEADER_ICON_MAP: Record<string, LucideIcon> = {
  saved: Bookmark,
  'next-session': Clock,
  'last-seen': Clock,
  info: Info,
};

const getOtherParticipant = (participants: UserProfileVM[], currentUserId: string) =>
  participants.find((participant) => participant.id !== currentUserId) ?? participants[0];

export const MessagesContainerHeader = memo(function MessagesContainerHeader({
  channel,
}: MessagesContainerHeaderProps) {
  const {
    currentUserId,
    savedCount,
    sidebarContent,
    profileUserId,
    openInfo,
    openProfile,
    openSavedMessages,
  } = useMessagesContainer();

  const otherParticipant = useMemo(
    () => (channel.kind === 'dm' ? getOtherParticipant(channel.participants, currentUserId) : null),
    [channel.kind, channel.participants, currentUserId],
  );

  const title = channel.kind === 'dm' ? otherParticipant?.displayName ?? channel.topic : channel.topic;
  const leading = useMemo(() => {
    if (channel.kind === 'dm') {
      if (!otherParticipant) return null;
      return (
        <AvatarWithStatus
          name={otherParticipant.displayName}
          avatar={otherParticipant.avatar.url ?? ''}
          isOnline={
            otherParticipant.presence?.liveStatus !== undefined
              ? otherParticipant.presence.liveStatus !== 'none'
              : undefined
          }
          sizeClassName="h-7 w-7"
          initialsLength={1}
        />
      );
    }
    const Icon =
      (channel.topicIconKey && CHANNEL_ICON_MAP[channel.topicIconKey]) ?? Sparkles;
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
      </span>
    );
  }, [channel.kind, channel.topicIconKey, otherParticipant]);

  const subtitleItems: HeaderSubtitleItem[] = useMemo(
    () =>
      channel.headerItems.map((item) => {
        const icon = HEADER_ICON_MAP[item.key];
        const label = item.key === 'saved' ? `${savedCount}` : item.label;
        return {
          icon,
          label,
          tooltip: item.tooltip ?? undefined,
          onClick: item.key === 'saved' ? openSavedMessages : undefined,
        };
      }),
    [channel.headerItems, savedCount, openSavedMessages],
  );

  const isInfoActive =
    channel.kind === 'dm'
      ? sidebarContent === 'profile' && profileUserId === otherParticipant?.id
      : sidebarContent === 'space-info';

  const handleOpenInfo = () => {
    if (channel.kind === 'dm') {
      if (otherParticipant) {
        openProfile(otherParticipant.id);
      }
      return;
    }
    openInfo();
  };

  return (
    <header className="flex min-h-16 items-center justify-between gap-3 border-b border-border px-4 py-3">
      <div className="flex min-w-0 flex-col">
        <HeaderTitle title={title} leading={leading} />
        {subtitleItems.length ? <HeaderSubtitleRow items={subtitleItems} /> : null}
      </div>

      <div className="flex items-center gap-3 sm:justify-end">
        <HeaderInfoButton isActive={isInfoActive} onOpenInfo={handleOpenInfo} />
      </div>
    </header>
  );
});

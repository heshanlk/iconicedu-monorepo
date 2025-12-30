'use client';

import { memo, useMemo } from 'react';
import type { ReactNode } from 'react';
import {
  Sparkles,
  User,
  Users,
  BookOpen,
  Bookmark,
  Clock,
  ClipboardCheck,
  FileText,
  type LucideIcon,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/tooltip';
import { cn } from '../../lib/utils';
import { AvatarWithStatus } from '../shared/avatar-with-status';
import type { ChannelVM, UserProfileVM } from '@iconicedu/shared-types';
import { useMessagesState } from './context/messages-state-provider';

interface HeaderSubtitleItem {
  icon?: LucideIcon;
  label: string;
  onClick?: () => void;
  tooltip?: string;
  isActive?: boolean;
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
  isActive,
}: {
  icon?: LucideIcon;
  label: string;
  onClick?: () => void;
  className?: string;
  tooltip?: string;
  isActive?: boolean;
}) {
  const content = (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-xs text-muted-foreground',
        onClick && 'cursor-pointer',
        isActive && 'text-primary font-medium',
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
  onClick,
  ariaLabel,
}: {
  title: string;
  leading: ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {leading}
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          className="truncate text-sm font-semibold text-foreground hover:underline"
          aria-label={ariaLabel ?? title}
        >
          {title}
        </button>
      ) : (
        <span className="truncate text-sm font-semibold text-foreground">{title}</span>
      )}
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
  homework: ClipboardCheck,
  'session-summary': FileText,
};

const getOtherParticipant = (participants: UserProfileVM[], currentUserId: string) =>
  participants.find((participant) => participant.id !== currentUserId) ?? participants[0];

export const MessagesContainerHeader = memo(function MessagesContainerHeader({
  channel,
}: MessagesContainerHeaderProps) {
  const {
    savedCount,
    homeworkCount,
    sessionSummaryCount,
    currentUserId,
    toggle,
    messageFilter,
    toggleMessageFilter,
  } = useMessagesState();

  const otherParticipant = useMemo(
    () =>
      channel.kind === 'dm'
        ? getOtherParticipant(channel.participants, currentUserId)
        : null,
    [channel.kind, channel.participants, currentUserId],
  );

  const title =
    channel.kind === 'dm'
      ? (otherParticipant?.displayName ?? channel.topic)
      : channel.topic;
  const leading = useMemo(() => {
    if (channel.kind === 'dm') {
      if (!otherParticipant) return null;
      return (
        <button
          type="button"
          onClick={() => toggle({ key: 'profile', userId: otherParticipant.id })}
          className="rounded-full"
          aria-label={`View ${otherParticipant.displayName} profile`}
        >
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
        </button>
      );
    }
    const Icon = CHANNEL_ICON_MAP[channel.topicIconKey ?? ''] ?? Sparkles;
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
      </span>
    );
  }, [channel.kind, channel.topicIconKey, otherParticipant, toggle]);

  const subtitleItems: HeaderSubtitleItem[] = useMemo(
    () =>
      channel.headerItems.map((item) => ({
        icon: HEADER_ICON_MAP[item.key],
        label:
          item.key === 'saved'
            ? `${savedCount}`
            : item.key === 'homework'
              ? 'HW'
              : item.key === 'session-summary'
                ? 'SS'
                : item.label,
        tooltip: item.tooltip ?? undefined,
        onClick:
          item.key === 'saved'
            ? () => toggle({ key: 'saved' })
            : item.key === 'homework'
              ? () => toggleMessageFilter('homework')
              : item.key === 'session-summary'
                ? () => toggleMessageFilter('session-summary')
                : undefined,
        isActive:
          item.key === 'homework'
            ? messageFilter === 'homework'
            : item.key === 'session-summary'
              ? messageFilter === 'session-summary'
              : undefined,
      })),
    [
      channel.headerItems,
      savedCount,
      homeworkCount,
      sessionSummaryCount,
      toggle,
      toggleMessageFilter,
      messageFilter,
    ],
  );

  return (
    <div className="flex min-w-0 flex-col">
      <HeaderTitle
        title={title}
        leading={leading}
        onClick={
          channel.kind === 'dm' && otherParticipant
            ? () => toggle({ key: 'profile', userId: otherParticipant.id })
            : undefined
        }
        ariaLabel={
          channel.kind === 'dm' && otherParticipant
            ? `View ${otherParticipant.displayName} profile`
            : undefined
        }
      />
      {subtitleItems.length ? <HeaderSubtitleRow items={subtitleItems} /> : null}
    </div>
  );
});

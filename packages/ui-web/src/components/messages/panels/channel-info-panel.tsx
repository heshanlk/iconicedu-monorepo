'use client';

import { memo } from 'react';
import {
  BookOpen,
  Sparkles,
  User,
  Users,
  Video,
  ClipboardCheck,
  FileText,
  Bookmark,
  MoreHorizontal,
  LogOut,
  Flag,
} from 'lucide-react';
import type { MessagesRightPanelIntent } from '@iconicedu/shared-types';
import { Badge } from '../../../ui/badge';
import { Separator } from '../../../ui/separator';
import { Button } from '../../../ui/button';
import { AvatarWithStatus } from '../../shared/avatar-with-status';
import { MediaFilesPanel } from '../shared/media-files-panel';
import { useMessagesState } from '../context/messages-state-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../ui/dropdown-menu';

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
  const { channel, toggle, messageFilter, toggleMessageFilter, messages } =
    useMessagesState();
  const topicIconKey = channel.topicIconKey ?? 'sparkles';
  const TopicIcon =
    CHANNEL_ICON_MAP[topicIconKey as keyof typeof CHANNEL_ICON_MAP] ?? Sparkles;
  const nextSessionItem = channel.headerItems.find((item) => item.key === 'next-session');

  return (
    <div className="flex-1 min-w-0">
      <div className="flex flex-col items-center gap-3 p-6 min-w-0">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <TopicIcon className="h-8 w-8" />
        </div>
        <div className="text-center min-w-0">
          <h2 className="text-lg font-semibold text-foreground break-words">
            {channel.topic}
          </h2>
          {channel.description ? (
            <p className="mt-1 text-sm text-muted-foreground break-words">
              {channel.description}
            </p>
          ) : null}
        </div>
        {channel.purpose ? (
          <Badge variant="secondary" className="text-xs">
            {channel.purpose.replace('-', ' ')}
          </Badge>
        ) : null}
      </div>

      <Separator />

      <div className="space-y-4 p-4 min-w-0">
        <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
        <div className="flex flex-nowrap items-start gap-4 overflow-x-auto pb-1">
          <Button
            variant="ghost"
            className="group h-auto w-16 shrink-0 flex-col items-center gap-2 px-1 py-2 text-[11px] font-medium text-foreground hover:bg-transparent"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-primary/15 group-hover:text-primary">
              <Video className="h-4 w-4" />
            </span>
            <span className="w-full truncate text-center">Join</span>
          </Button>
          <Button
            variant="ghost"
            className="group h-auto w-16 shrink-0 flex-col items-center gap-2 px-1 py-2 text-[11px] font-medium text-muted-foreground hover:bg-transparent"
            onClick={() => toggleMessageFilter('homework')}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-primary/15 group-hover:text-primary">
              <ClipboardCheck
                className={messageFilter === 'homework' ? 'text-primary' : undefined}
              />
            </span>
            <span
              className={messageFilter === 'homework' ? 'text-foreground' : undefined}
            >
              <span className="w-full truncate text-center">Homework</span>
            </span>
          </Button>
          <Button
            variant="ghost"
            className="group h-auto w-16 shrink-0 flex-col items-center gap-2 px-1 py-2 text-[11px] font-medium text-muted-foreground hover:bg-transparent"
            onClick={() => toggleMessageFilter('session-summary')}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-primary/15 group-hover:text-primary">
              <FileText
                className={
                  messageFilter === 'session-summary' ? 'text-primary' : undefined
                }
              />
            </span>
            <span
              className={
                messageFilter === 'session-summary' ? 'text-foreground' : undefined
              }
            >
              <span className="w-full truncate text-center">Summary</span>
            </span>
          </Button>
          <Button
            variant="ghost"
            className="group h-auto w-16 shrink-0 flex-col items-center gap-2 px-1 py-2 text-[11px] font-medium text-muted-foreground hover:bg-transparent"
            onClick={() => toggle({ key: 'saved' })}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-primary/15 group-hover:text-primary">
              <Bookmark className="h-4 w-4" />
            </span>
            <span className="w-full truncate text-center">Saved</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="group h-auto w-16 shrink-0 flex-col items-center gap-2 px-1 py-2 text-[11px] font-medium text-muted-foreground hover:bg-transparent"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-primary/15 group-hover:text-primary">
                  <MoreHorizontal className="h-4 w-4" />
                </span>
                <span className="w-full truncate text-center">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem>
                <LogOut className="h-4 w-4 text-muted-foreground" />
                <span>Leave</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Flag className="h-4 w-4 text-muted-foreground" />
                <span>Report</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Separator />

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
        <MediaFilesPanel messages={messages} />
      </div>

      <Separator />

      <div className="space-y-4 p-4 min-w-0">
        <h3 className="text-sm font-semibold text-foreground">Members</h3>
        <div className="space-y-3 min-w-0">
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

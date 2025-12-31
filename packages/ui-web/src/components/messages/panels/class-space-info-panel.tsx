'use client';

import { memo } from 'react';
import {
  ClipboardCheck,
  FileText,
  Folder,
  GraduationCap,
  Link2,
  LogOut,
  MoreHorizontal,
  Sparkles,
  Languages,
  SquarePi,
  ChefHat,
  Earth,
  Calendar,
  Clock,
  MapPin,
  Video,
  Bookmark,
  Flag,
} from 'lucide-react';
import type { MessagesRightPanelIntent } from '@iconicedu/shared-types';
import { Badge } from '../../../ui/badge';
import { Button } from '../../../ui/button';
import { ButtonGroup } from '../../../ui/button-group';
import { Separator } from '../../../ui/separator';
import { AvatarWithStatus } from '../../shared/avatar-with-status';
import { MediaFilesPanel } from '../shared/media-files-panel';
import { useMessagesState } from '../context/messages-state-provider';
import { formatEventTime } from '../../../lib/class-schedule-utils';
import { ChannelInfoPanel } from './channel-info-panel';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../ui/dropdown-menu';

interface ClassSpaceInfoPanelProps {
  intent: MessagesRightPanelIntent;
}

const CLASS_SPACE_ICON_MAP = {
  languages: Languages,
  'square-pi': SquarePi,
  'chef-hat': ChefHat,
  earth: Earth,
  sparkles: Sparkles,
} as const;

const ActionButton = memo(function ActionButton({
  icon: Icon,
  label,
  href,
  isInactive,
}: {
  icon: typeof Link2;
  label: string;
  href?: string | null;
  isInactive?: boolean;
}) {
  const content = (
    <>
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-primary/15 group-hover:text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <span className="w-full truncate text-center">{label}</span>
    </>
  );

  if (href && !isInactive) {
    return (
      <Button
        asChild
        variant="ghost"
        className="group h-auto w-20 shrink-0 flex-col items-center gap-2 px-1 py-2 text-[11px] font-medium text-muted-foreground hover:bg-transparent"
      >
        <a href={href}>{content}</a>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      className="group h-auto w-20 shrink-0 flex-col items-center gap-2 px-1 py-2 text-[11px] font-medium text-muted-foreground hover:bg-transparent"
      disabled={isInactive}
    >
      {content}
    </Button>
  );
});

const CLASS_SPACE_LINK_ICONS: Record<string, typeof Link2> = {
  video: Video,
  'graduation-cap': GraduationCap,
  folder: Folder,
};

const ClassSpaceInfoPanelContent = memo(function ClassSpaceInfoPanelContent() {
  const { channel, classSpace, toggle, messageFilter, toggleMessageFilter } =
    useMessagesState();

  const iconKey = classSpace.iconKey ?? channel.topicIconKey ?? 'sparkles';
  const Icon =
    CLASS_SPACE_ICON_MAP[iconKey as keyof typeof CLASS_SPACE_ICON_MAP] ?? Sparkles;
  const schedule = classSpace.scheduleSeries;
  const quickLinks = classSpace.links ?? [];

  return (
    <div className="flex-1 min-w-0">
      <div className="flex flex-col items-center gap-3 p-6 min-w-0 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <Icon className="h-8 w-8" />
        </div>
        <div className="text-center min-w-0">
          <h2 className="text-lg font-semibold text-foreground break-words">
            {classSpace.title}
          </h2>
          {classSpace.description ? (
            <p className="mt-1 text-sm text-muted-foreground break-words">
              {classSpace.description}
            </p>
          ) : null}
        </div>
        {classSpace.kind ? (
          <Badge variant="secondary" className="text-xs">
            {classSpace.kind.replace(/_/g, ' ')}
          </Badge>
        ) : null}
      </div>

      <Separator />

      <div className="space-y-4 p-4 min-w-0">
        <h3 className="text-sm font-semibold text-foreground text-center">
          Quick Actions
        </h3>
        <ButtonGroup className="mx-auto flex-wrap justify-center">
          {quickLinks
            .filter((link) => !link.hidden)
            .map((link) => {
              const icon = link.iconKey
                ? (CLASS_SPACE_LINK_ICONS[link.iconKey] ?? Link2)
                : Link2;
              return (
                <ActionButton
                  key={link.label}
                  icon={icon}
                  label={link.label}
                  href={link.url}
                  isInactive={link.status === 'inactive'}
                />
              );
            })}
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
        </ButtonGroup>
      </div>

      <Separator />

      <div className="space-y-4 p-4 min-w-0">
        <h3 className="text-sm font-semibold text-foreground">Next Session</h3>
        {schedule ? (
          <div className="space-y-2 text-sm text-muted-foreground min-w-0">
            <div className="flex items-start gap-2">
              <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="min-w-0">
                <div className="text-sm text-foreground break-words">
                  {schedule.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(schedule.startAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">
                {formatEventTime(schedule.startAt)} - {formatEventTime(schedule.endAt)}
              </span>
            </div>
            {schedule.location ? (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground break-words">
                  {schedule.location}
                </span>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No upcoming session.</div>
        )}
      </div>

      <Separator />

      <div className="space-y-4 p-4 min-w-0">
        <MediaFilesPanel media={channel.media.items} files={channel.files.items} />
      </div>

      <Separator />

      <div className="space-y-4 p-4 min-w-0">
        <h3 className="text-sm font-semibold text-foreground">Members</h3>
        <div className="space-y-3 min-w-0">
          {classSpace.participants.map((member) => (
            <div key={member.id} className="flex items-center gap-3">
              <AvatarWithStatus
                name={member.displayName}
                avatar={member.avatar.url ?? ''}
                sizeClassName="h-9 w-9"
                initialsLength={1}
                showStatus={false}
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
          {classSpace.participants.length === 0 ? (
            <div className="text-sm text-muted-foreground">No members added yet.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
});

export function ClassSpaceInfoPanel({ intent }: ClassSpaceInfoPanelProps) {
  const { classSpace } = useMessagesState();

  if (!classSpace) {
    return <ChannelInfoPanel intent={intent} />;
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto">
      <ClassSpaceInfoPanelContent />
    </div>
  );
}

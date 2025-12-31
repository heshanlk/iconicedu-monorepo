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
  Video,
  Bookmark,
  Flag,
  MessageCircle,
} from 'lucide-react';
import type { LearningSpaceVM, MessagesRightPanelIntent } from '@iconicedu/shared-types';
import { Badge } from '../../../ui/badge';
import { Button } from '../../../ui/button';
import { ButtonGroup } from '../../../ui/button-group';
import { Separator } from '../../../ui/separator';
import { AvatarWithStatus } from '../../shared/avatar-with-status';
import { MediaFilesPanel } from '../shared/media-files-panel';
import { useMessagesState } from '../context/messages-state-provider';
import { formatEventTime } from '../../../lib/class-schedule-utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../ui/dropdown-menu';

interface LearningSpaceInfoPanelProps {
  intent: MessagesRightPanelIntent;
  learningSpace?: LearningSpaceVM | null;
}

const LEARNING_SPACE_ICON_MAP = {
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

const LEARNING_SPACE_LINK_ICONS: Record<string, typeof Link2> = {
  video: Video,
  'graduation-cap': GraduationCap,
  folder: Folder,
};

const LearningSpaceInfoPanelContent = memo(function LearningSpaceInfoPanelContent({
  learningSpace,
}: {
  learningSpace: LearningSpaceVM;
}) {
  const { channel, toggle, messageFilter, toggleMessageFilter, currentUserId } =
    useMessagesState();

  const iconKey = learningSpace.iconKey ?? channel.topicIconKey ?? 'sparkles';
  const Icon =
    LEARNING_SPACE_ICON_MAP[iconKey as keyof typeof LEARNING_SPACE_ICON_MAP] ?? Sparkles;
  const schedule = learningSpace.scheduleSeries;
  const quickLinks = learningSpace.links ?? [];

  return (
    <div className="flex-1 min-w-0">
      <div className="flex flex-col items-center gap-3 p-6 min-w-0 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <Icon className="h-8 w-8" />
        </div>
        <div className="text-center min-w-0">
          <h2 className="text-lg font-semibold text-foreground break-words">
            {learningSpace.title}
          </h2>
          {learningSpace.description ? (
            <p className="mt-1 text-sm text-muted-foreground break-words">
              {learningSpace.description}
            </p>
          ) : null}
        </div>
        {learningSpace.kind ? (
          <Badge variant="secondary" className="text-xs">
            {learningSpace.kind.replace(/_/g, ' ')}
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
                ? (LEARNING_SPACE_LINK_ICONS[link.iconKey] ?? Link2)
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
        <h3 className="text-sm font-semibold text-foreground text-center">Next Up</h3>
        {schedule ? (
          (() => {
            const scheduleDate = new Date(schedule.startAt);
            const getDateLabel = (date: Date) =>
              date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
            const getWeekday = (date: Date) =>
              date.toLocaleDateString('en-US', { weekday: 'short' });
            const getMonth = (date: Date) =>
              date.toLocaleDateString('en-US', { month: 'short' });
            const dateParam = [
              scheduleDate.getFullYear(),
              String(scheduleDate.getMonth() + 1).padStart(2, '0'),
              String(scheduleDate.getDate()).padStart(2, '0'),
            ].join('-');
            const calendarUrl = `/dashboard/class-schedule?view=day&date=${dateParam}`;

            const shiftDate = (date: Date, offset: number) => {
              const next = new Date(date);
              const frequency = schedule.recurrence?.rule.frequency ?? 'daily';
              if (frequency === 'weekly') {
                next.setDate(next.getDate() + offset * 7);
              } else if (frequency === 'monthly') {
                next.setMonth(next.getMonth() + offset);
              } else if (frequency === 'yearly') {
                next.setFullYear(next.getFullYear() + offset);
              } else {
                next.setDate(next.getDate() + offset);
              }
              return next;
            };

            const dates = [
              shiftDate(scheduleDate, -1),
              scheduleDate,
              shiftDate(scheduleDate, 1),
            ];

            return (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <a
                    href={calendarUrl}
                    className="relative flex h-[86px] w-full max-w-[300px] items-center justify-center"
                    aria-label={`Open schedule for ${getDateLabel(scheduleDate)}`}
                  >
                    <div className="absolute left-2 top-1/2 z-0 w-[92px] -translate-y-1/2 rounded-2xl border bg-muted/20 px-2.5 py-1.5 text-center text-muted-foreground shadow-sm">
                      <div className="text-[10px] font-semibold uppercase">Previous</div>
                      <div className="text-base font-semibold">{dates[0].getDate()}</div>
                      <div className="text-[10px] uppercase">{getMonth(dates[0])}</div>
                    </div>
                    <div className="absolute right-2 top-1/2 z-0 w-[92px] -translate-y-1/2 rounded-2xl border bg-muted/20 px-2.5 py-1.5 text-center text-muted-foreground shadow-sm">
                      <div className="text-[10px] font-semibold uppercase">Next</div>
                      <div className="text-base font-semibold">{dates[2].getDate()}</div>
                      <div className="text-[10px] uppercase">{getMonth(dates[2])}</div>
                    </div>
                    <div className="relative z-10 w-[150px] rounded-2xl border bg-background px-3 py-2 text-center shadow-md">
                      <div className="text-[10px] font-semibold uppercase text-muted-foreground">
                        {getWeekday(dates[1])}
                      </div>
                      <div className="text-lg font-semibold text-foreground">
                        {dates[1].getDate()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getMonth(dates[1])}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {formatEventTime(schedule.startAt)} -{' '}
                        {formatEventTime(schedule.endAt)}
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            );
          })()
        ) : (
          <div className="text-sm text-muted-foreground text-center">
            No upcoming session.
          </div>
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
          {learningSpace.participants.map((member) => {
            const dmKey =
              currentUserId && member.id !== currentUserId
                ? `dm:${[currentUserId, member.id].sort().join('-')}`
                : null;

            return (
              <div key={member.id} className="flex items-center gap-3">
                <AvatarWithStatus
                  name={member.displayName}
                  avatar={member.avatar}
                  sizeClassName="h-9 w-9"
                  initialsLength={1}
                  showStatus={false}
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-foreground">
                    {member.displayName}
                  </div>
                  {member.status ? (
                    <div className="truncate text-xs text-muted-foreground">
                      {member.status}
                    </div>
                  ) : null}
                </div>
                {dmKey ? (
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:bg-primary/15 hover:text-primary"
                    aria-label={`Message ${member.displayName}`}
                  >
                    <a href={`/dashboard/dm/${dmKey}`}>
                      <MessageCircle className="h-4 w-4" />
                    </a>
                  </Button>
                ) : null}
              </div>
            );
          })}
          {learningSpace.participants.length === 0 ? (
            <div className="text-sm text-muted-foreground">No members added yet.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
});

export function LearningSpaceInfoPanel({
  intent,
  learningSpace,
}: LearningSpaceInfoPanelProps) {
  if (!learningSpace) {
    return null;
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto">
      <LearningSpaceInfoPanelContent learningSpace={learningSpace} />
    </div>
  );
}

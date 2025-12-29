'use client';

import { memo } from 'react';
import {
  Search,
  UserPlus,
  Phone,
  MoreHorizontal,
  ChevronDown,
  Video,
} from 'lucide-react';
import { Button } from '../../ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import { Separator } from '../../ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { cn } from '../../lib/utils';
import { ScrollArea } from '../../ui/scroll-area';
import { useIsMobile } from '../../hooks/use-mobile';

interface LearningSpaceMember {
  id: string;
  name: string;
  role?: string;
  avatarUrl?: string | null;
}

interface LearningSpaceInfoPanelProps {
  title: string;
  topic?: string | null;
  description?: string | null;
  members: LearningSpaceMember[];
  schedule?: string | null;
  nextSession?: string | null;
  joinUrl?: string;
}

const QuickAction = memo(function QuickAction({
  icon: Icon,
  label,
  active,
  href,
}: {
  icon: typeof UserPlus;
  label: string;
  active?: boolean;
  href?: string;
}) {
  const content = (
    <span className="flex flex-col items-center gap-2">
      <span
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground',
          active && 'bg-primary/10 text-primary',
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span>{label}</span>
    </span>
  );

  if (!href) {
    return (
      <Button
        variant="ghost"
        className={cn(
          'h-auto flex-col gap-2 px-1 py-2 text-xs font-medium text-muted-foreground',
          active && 'text-primary',
        )}
      >
        {content}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      className={cn(
        'h-auto flex-col gap-2 px-1 py-2 text-xs font-medium text-muted-foreground',
        active && 'text-primary',
      )}
      asChild
    >
      <a href={href} target="_blank" rel="noreferrer">
        {content}
      </a>
    </Button>
  );
});

export const LearningSpaceInfoPanel = memo(function LearningSpaceInfoPanel({
  title,
  topic,
  description,
  members,
  schedule,
  nextSession,
  joinUrl,
}: LearningSpaceInfoPanelProps) {
  const isMobile = useIsMobile();
  const hasSchedule = Boolean(schedule) || Boolean(nextSession);
  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  const content = (
    <div className="flex flex-col gap-4 p-4">
      <Card size="sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
            Details
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-sm font-semibold text-foreground">{title}</div>
          {hasSchedule ? (
            <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground">
              {schedule ? <span>{schedule}</span> : null}
              {nextSession ? <span>{nextSession}</span> : null}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <QuickAction icon={Video} label="Join" active href={joinUrl} />
            <QuickAction icon={UserPlus} label="Add" />
            <QuickAction icon={Search} label="Find" />
            <QuickAction icon={Phone} label="Call" />
            <QuickAction icon={MoreHorizontal} label="More" />
          </div>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
              About
            </CardTitle>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div>
              <div className="text-xs text-muted-foreground">Topic</div>
              <div className="text-sm text-foreground">
                {topic ?? 'Learning space updates and planning.'}
              </div>
            </div>
            <Separator />
            <div>
              <div className="text-xs text-muted-foreground">Description</div>
              <div className="text-sm text-foreground">
                {description ??
                  'Use this space to share updates, resources, and upcoming session notes.'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
              Members
            </CardTitle>
            <div className="text-xs text-muted-foreground">
              {members.length} total
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col gap-3">
            {members.map((member) => (
              <div key={member.id} className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={member.avatarUrl ?? ''} alt={member.name} />
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {member.name}
                  </div>
                  {member.role ? (
                    <div className="text-xs text-muted-foreground truncate">
                      {member.role}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="pt-3">
          <Button
            variant="ghost"
            size="sm"
            className={cn('w-full text-xs text-muted-foreground')}
          >
            View all members
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  return isMobile ? (
    <ScrollArea className="max-h-[70vh]">
      {content}
    </ScrollArea>
  ) : (
    content
  );
});

'use client';

import { memo } from 'react';
import {
  Search,
  UserPlus,
  Phone,
  MoreHorizontal,
  ChevronDown,
} from 'lucide-react';
import { Button } from '../../ui/button';
import { AvatarWithStatus } from '../shared/avatar-with-status';
import { cn } from '../../lib/utils';

interface LearningSpaceMember {
  id: string;
  name: string;
  role?: string;
  avatarUrl?: string | null;
}

interface LearningSpaceInfoPanelProps {
  title: string;
  topic?: string;
  description?: string;
  members: LearningSpaceMember[];
  schedule: string;
  nextSession: string;
}

const QuickAction = memo(function QuickAction({
  icon: Icon,
  label,
}: {
  icon: typeof UserPlus;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
});

export const LearningSpaceInfoPanel = memo(function LearningSpaceInfoPanel({
  title,
  topic,
  description,
  members,
  schedule,
  nextSession,
}: LearningSpaceInfoPanelProps) {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <div className="text-xs uppercase tracking-wide text-muted-foreground">
          Details
        </div>
        <div className="mt-1 text-sm font-semibold text-foreground">{title}</div>
        <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground">
          <span>{schedule}</span>
          <span>{nextSession}</span>
        </div>
      </div>

      <div>
        <div className="mb-3 text-xs font-semibold text-muted-foreground uppercase">
          Quick Actions
        </div>
        <div className="flex items-center justify-between gap-3">
          <QuickAction icon={UserPlus} label="Add" />
          <QuickAction icon={Search} label="Find" />
          <QuickAction icon={Phone} label="Call" />
          <QuickAction icon={MoreHorizontal} label="More" />
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="text-xs font-semibold text-muted-foreground uppercase">
            About
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="space-y-3">
          <div>
            <div className="text-xs text-muted-foreground">Topic</div>
            <div className="text-sm text-foreground">
              {topic ?? 'Learning space updates and planning.'}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Description</div>
            <div className="text-sm text-foreground">
              {description ??
                'Use this space to share updates, resources, and upcoming session notes.'}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="text-xs font-semibold text-muted-foreground uppercase">
            Members
          </div>
          <div className="text-xs text-muted-foreground">
            {members.length} total
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {members.map((member) => (
            <div key={member.id} className="flex items-center gap-3">
              <AvatarWithStatus
                name={member.name}
                avatar={member.avatarUrl ?? ''}
                showStatus={false}
                sizeClassName="h-9 w-9"
                initialsLength={1}
              />
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
        <Button
          variant="ghost"
          size="sm"
          className={cn('mt-3 w-full text-xs text-muted-foreground')}
        >
          View all members
        </Button>
      </div>
    </div>
  );
});

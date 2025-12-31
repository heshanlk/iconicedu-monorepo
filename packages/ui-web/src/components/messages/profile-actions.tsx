'use client';

import { memo } from 'react';
import { Phone, MessageCircle, Calendar, Share2, Flag } from 'lucide-react';
import { Button } from '../../ui/button';
import { cn } from '../../lib/utils';

interface ProfileActionsProps {
  onCallClick?: () => void;
  onDmClick?: () => void;
  onScheduleClick?: () => void;
  onShareClick?: () => void;
  onReportClick?: () => void;
}

const ActionButton = memo(function ActionButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Phone;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Button
      variant="ghost"
      className={cn(
        'group h-auto w-16 shrink-0 basis-16 flex-col items-center gap-2 px-1 py-2 text-[11px] font-medium text-muted-foreground hover:bg-transparent',
        onClick && 'text-foreground',
      )}
      onClick={onClick}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-primary/15 group-hover:text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <span className="w-full truncate text-center">{label}</span>
    </Button>
  );
});

export const ProfileActions = memo(function ProfileActions({
  onCallClick,
  onDmClick,
  onScheduleClick,
  onShareClick,
  onReportClick,
}: ProfileActionsProps) {
  return (
    <div className="flex flex-nowrap items-start gap-4 overflow-x-auto pb-1">
      <ActionButton icon={Phone} label="Call" onClick={onCallClick} />
      <ActionButton icon={MessageCircle} label="DM" onClick={onDmClick} />
      <ActionButton icon={Calendar} label="Schedule" onClick={onScheduleClick} />
      <ActionButton icon={Share2} label="Share" onClick={onShareClick} />
      <ActionButton icon={Flag} label="Report" onClick={onReportClick} />
    </div>
  );
});

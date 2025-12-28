'use client';

import type React from 'react';

export type NotificationType =
  | 'homework'
  | 'message'
  | 'class'
  | 'reminder'
  | 'recording'
  | 'notes'
  | 'ai-summary'
  | 'payment'
  | 'survey'
  | 'complete-class';

export interface Activity {
  id: string;
  type: NotificationType;
  actor: string;
  action: string;
  target?: string;
  timestamp: string;
  isRead: boolean;
  avatar?: string;
  initials: string;
  icon?: React.ComponentType<{ className?: string }>;
  iconBg?: string;
  childName?: string;
  participants?: Array<{ avatar?: string; initials: string }>;
  expandedContent?: string;
  actionButton?: {
    label: string;
    variant: 'default' | 'outline' | 'secondary';
    onClick: () => void;
  };
  subActivities?: Activity[];
  guardianId?: string;
  category: string;
  date: string;
}

export type InboxIconKey =
  | 'Bell'
  | 'CheckCircle2'
  | 'ClipboardCheck'
  | 'CreditCard'
  | 'FileText'
  | 'GraduationCap'
  | 'MessageSquare'
  | 'Paperclip'
  | 'Sparkles'
  | 'Video';

export type InboxActivityInput = Omit<
  Activity,
  'icon' | 'actionButton' | 'subActivities'
> & {
  iconKey?: InboxIconKey;
  actionButton?: {
    label: string;
    variant: 'default' | 'outline' | 'secondary';
  };
  subActivities?: InboxActivityInput[];
};

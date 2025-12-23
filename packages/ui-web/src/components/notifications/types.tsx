'use client';

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
  icon?: string;
  iconBg?: string;
  studentName?: string;
  participants?: Array<{ avatar?: string; initials: string }>;
  expandedContent?: string;
  actionButton?: {
    label: string;
    variant: 'default' | 'outline' | 'secondary';
    onClick: () => void;
  };
  subActivities?: Activity[];
  parentId?: string;
  category: string;
  date: string;
}

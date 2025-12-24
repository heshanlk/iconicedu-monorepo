'use client';

import type React from 'react';
import { useState } from 'react';
import { Badge } from '../../ui/badge';
import { ScrollArea } from '../../ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';
import { ActivityWithSubitems } from '../notifications/activity-with-subitems';
import type { Activity } from '../notifications/types';

const mockActivities: Activity[] = [
  {
    id: 'payment-1',
    type: 'payment',
    actor: 'Payment System',
    action: 'reminder for',
    target: 'March Tuition Payment',
    timestamp: '5m',
    isRead: false,
    initials: '$$',
    icon: 'CreditCard',
    iconBg: 'bg-red-100 text-red-700',
    category: 'payment',
    date: 'Today',
    expandedContent:
      'Your monthly tuition payment of $480 for both Zayne and Sophia is due on March 15th. Please complete payment by the due date to avoid late fees.',
    actionButton: {
      label: 'Pay Now',
      variant: 'default',
      onClick: () => console.log('Processing payment...'),
    },
  },
  {
    id: '1',
    type: 'class',
    actor: 'Ms. Dinesha',
    action: 'upcoming class for Zayne',
    target: 'Algebra I',
    timestamp: '15m',
    isRead: false,
    initials: 'MD',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dinesha',
    icon: 'GraduationCap',
    iconBg: 'bg-blue-500 text-white',
    studentName: 'Zayne',
    participants: [
      {
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dinesha',
        initials: 'MD',
      },
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zayne', initials: 'Z' },
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma', initials: 'EW' },
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jake', initials: 'JD' },
    ],
    category: 'class',
    date: 'Today',
    actionButton: {
      label: 'Join Now',
      variant: 'default',
      onClick: () => console.log('Joining class...'),
    },
    subActivities: [
      {
        id: '1-1',
        type: 'recording',
        actor: 'System',
        action: 'class recording completed',
        target: '',
        timestamp: '30m',
        isRead: false,
        initials: 'SY',
        icon: 'Video',
        iconBg: 'bg-green-100 text-green-700',
        studentName: 'Zayne',
        category: 'class',
        date: 'Today',
        actionButton: {
          label: 'Watch',
          variant: 'outline',
          onClick: () => console.log('Playing recording...'),
        },
        parentId: '1',
      },
      {
        id: '1-2',
        type: 'homework',
        actor: 'Zayne',
        action: 'submitted',
        target: 'Chapter 5 Assignment',
        timestamp: '45m',
        isRead: false,
        initials: 'Z',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zayne',
        icon: 'Paperclip',
        iconBg: 'bg-orange-100 text-orange-700',
        studentName: 'Zayne',
        category: 'class',
        date: 'Today',
        parentId: '1',
      },
      {
        id: '1-3',
        type: 'notes',
        actor: 'Ms. Dinesha',
        action: 'added class notes',
        target: 'Linear Equations Summary',
        timestamp: '1h',
        isRead: false,
        initials: 'MD',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dinesha',
        icon: 'FileText',
        iconBg: 'bg-amber-100 text-amber-700',
        studentName: 'Zayne',
        category: 'class',
        date: 'Today',
        actionButton: {
          label: 'View',
          variant: 'outline',
          onClick: () => console.log('Viewing notes...'),
        },
        parentId: '1',
      },
      {
        id: '1-4',
        type: 'ai-summary',
        actor: 'AI Assistant',
        action: 'generated lesson summary',
        target: '',
        timestamp: '1h',
        isRead: false,
        initials: 'AI',
        icon: 'Sparkles',
        iconBg: 'bg-violet-100 text-violet-700',
        studentName: 'Zayne',
        category: 'class',
        date: 'Today',
        expandedContent:
          "Today's lesson covered linear equations in algebra. Key concepts: slope-intercept form (y = mx + b), finding x and y intercepts, and graphing lines on coordinate planes. Practice problems assigned for homework.",
        parentId: '1',
      },
      {
        id: '1-5',
        type: 'homework',
        actor: 'Ms. Dinesha',
        action: 'graded',
        target: 'Previous Assignment',
        timestamp: '2h',
        isRead: false,
        initials: 'MD',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dinesha',
        icon: 'Paperclip',
        iconBg: 'bg-orange-100 text-orange-700',
        studentName: 'Zayne',
        category: 'class',
        date: 'Today',
        expandedContent:
          'Score: 94/100. Excellent work on understanding linear functions!',
        actionButton: {
          label: 'View Grade',
          variant: 'outline',
          onClick: () => console.log('Viewing grade...'),
        },
        parentId: '1',
      },
      {
        id: '1-6',
        type: 'notes',
        actor: 'Ms. Dinesha',
        action: 'shared',
        target: 'Practice Problems',
        timestamp: '2h',
        isRead: false,
        initials: 'MD',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dinesha',
        icon: 'FileText',
        iconBg: 'bg-amber-100 text-amber-700',
        studentName: 'Zayne',
        category: 'class',
        date: 'Today',
        actionButton: {
          label: 'Download',
          variant: 'outline',
          onClick: () => console.log('Downloading...'),
        },
        parentId: '1',
      },
    ],
  },
  {
    id: 'complete-1',
    type: 'complete-class',
    actor: 'System',
    action: 'reminder for Zayne',
    target: "Mark yesterday's Geometry class as complete",
    timestamp: '20m',
    isRead: false,
    initials: '✓',
    icon: 'CheckCircle2',
    iconBg: 'bg-yellow-100 text-yellow-700',
    studentName: 'Zayne',
    category: 'system',
    date: 'Today',
    expandedContent:
      'Your Geometry class with Mrs. Anderson ended yesterday. Please confirm that the class was completed successfully.',
    actionButton: {
      label: 'Mark Complete',
      variant: 'default',
      onClick: () => console.log('Marking class complete...'),
    },
  },
  {
    id: '10',
    type: 'class',
    actor: 'Mr. Kim',
    action: 'upcoming class for Sophia',
    target: 'Biology Lab',
    timestamp: '30m',
    isRead: false,
    initials: 'MK',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mrkim',
    icon: 'GraduationCap',
    iconBg: 'bg-blue-500 text-white',
    studentName: 'Sophia',
    participants: [
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mrkim', initials: 'MK' },
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophia', initials: 'S' },
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lucy', initials: 'LB' },
    ],
    category: 'class',
    date: 'Today',
    actionButton: {
      label: 'Join Now',
      variant: 'default',
      onClick: () => console.log('Joining class...'),
    },
    subActivities: [
      {
        id: '10-1',
        type: 'homework',
        actor: 'Sophia',
        action: 'submitted',
        target: 'Cell Structure Lab Report',
        timestamp: '45m',
        isRead: false,
        initials: 'S',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophia',
        icon: 'Paperclip',
        iconBg: 'bg-orange-100 text-orange-700',
        studentName: 'Sophia',
        category: 'class',
        date: 'Today',
        parentId: '10',
      },
      {
        id: '10-2',
        type: 'notes',
        actor: 'Mr. Kim',
        action: 'posted',
        target: 'Lab Instructions',
        timestamp: '50m',
        isRead: false,
        initials: 'MK',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mrkim',
        icon: 'FileText',
        iconBg: 'bg-amber-100 text-amber-700',
        studentName: 'Sophia',
        category: 'class',
        date: 'Today',
        actionButton: {
          label: 'View',
          variant: 'outline',
          onClick: () => console.log('Viewing instructions...'),
        },
        parentId: '10',
      },
      {
        id: '10-3',
        type: 'ai-summary',
        actor: 'AI Assistant',
        action: 'created study guide',
        target: '',
        timestamp: '1h',
        isRead: false,
        initials: 'AI',
        icon: 'Sparkles',
        iconBg: 'bg-violet-100 text-violet-700',
        studentName: 'Sophia',
        category: 'class',
        date: 'Today',
        expandedContent:
          'Key topics: Cell membrane structure, organelles and their functions, differences between prokaryotic and eukaryotic cells.',
        parentId: '10',
      },
    ],
  },
  {
    id: 'reminder-1',
    type: 'reminder',
    actor: 'System',
    action: 'reminder for Sophia',
    target: 'Physics class starts in 2 hours',
    timestamp: '35m',
    isRead: false,
    initials: '⏰',
    icon: 'Bell',
    iconBg: 'bg-purple-500 text-white',
    studentName: 'Sophia',
    category: 'system',
    date: 'Today',
    expandedContent:
      "Your Physics class with Dr. Martinez is scheduled for 3:00 PM today. Don't forget to prepare your lab materials!",
    actionButton: {
      label: 'View Class',
      variant: 'outline',
      onClick: () => console.log('Viewing class details...'),
    },
  },
  {
    id: '2',
    type: 'homework',
    actor: 'Mr. Rodriguez',
    action: 'uploaded homework for Zayne',
    target: 'Polynomials Worksheet',
    timestamp: '1h',
    isRead: false,
    initials: 'MR',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rodriguez',
    icon: 'Paperclip',
    iconBg: 'bg-orange-100 text-orange-700',
    studentName: 'Zayne',
    category: 'class',
    date: 'Today',
    expandedContent:
      'Complete problems 1-15 on page 87. Focus on factoring techniques. Due by Friday at 5:00 PM.',
    actionButton: {
      label: 'View Assignment',
      variant: 'outline',
      onClick: () => console.log('Viewing assignment...'),
    },
  },
  {
    id: 'survey-1',
    type: 'survey',
    actor: 'Feedback System',
    action: 'feedback request for',
    target: "Ms. Dinesha's Algebra I Class",
    timestamp: '1h',
    isRead: false,
    initials: '📝',
    icon: 'ClipboardCheck',
    iconBg: 'bg-cyan-100 text-cyan-700',
    category: 'system',
    date: 'Today',
    expandedContent:
      "We'd love to hear your feedback about Zayne's recent Algebra I class with Ms. Dinesha. Your input helps us improve the learning experience!",
    actionButton: {
      label: 'Take Survey',
      variant: 'default',
      onClick: () => console.log('Opening survey...'),
    },
  },
  {
    id: '3',
    type: 'homework',
    actor: 'Ms. Chen',
    action: "graded Zayne's homework",
    target: 'Algebra Quiz #3',
    timestamp: '2h',
    isRead: false,
    initials: 'MC',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chen',
    icon: 'Paperclip',
    iconBg: 'bg-orange-100 text-orange-700',
    studentName: 'Zayne',
    category: 'class',
    date: 'Today',
    expandedContent:
      'Score: 92/100. Great work on linear equations! Review problem #8 for improvement.',
    actionButton: {
      label: 'View Results',
      variant: 'outline',
      onClick: () => console.log('Viewing results...'),
    },
  },
  {
    id: '4',
    type: 'message',
    actor: 'Ms. Dinesha',
    action: 'sent message to Zayne in',
    target: 'Algebra I Chat',
    timestamp: '3h',
    isRead: false,
    initials: 'MD',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dinesha',
    icon: 'MessageSquare',
    iconBg: 'bg-blue-500 text-white',
    studentName: 'Zayne',
    category: 'class',
    date: 'Today',
    expandedContent:
      "Great job on today's class! Don't forget to review the practice problems for next week's quiz. Let me know if you have any questions.",
  },
  {
    id: '5',
    type: 'notes',
    actor: 'Mr. Rodriguez',
    action: 'added notes to',
    target: 'Math Study Group',
    timestamp: '4h',
    isRead: false,
    initials: 'MR',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rodriguez',
    icon: 'FileText',
    iconBg: 'bg-amber-100 text-amber-700',
    studentName: 'Zayne',
    category: 'class',
    date: 'Today',
    expandedContent:
      "Study guide for next week's test: Chapter 5 (Polynomials), Chapter 6 (Factoring). Focus on completing the square and quadratic formula.",
  },
  {
    id: '6',
    type: 'recording',
    actor: 'System',
    action: 'class recording ready for Sophia',
    target: 'Biology Lab Session',
    timestamp: '5h',
    isRead: false,
    initials: 'SY',
    icon: 'Video',
    iconBg: 'bg-green-100 text-green-700',
    studentName: 'Sophia',
    category: 'class',
    date: 'Today',
    actionButton: {
      label: 'Watch Recording',
      variant: 'outline',
      onClick: () => console.log('Playing recording...'),
    },
  },
  {
    id: '7',
    type: 'homework',
    actor: 'Mrs. Patel',
    action: "graded Sophia's homework",
    target: 'Biology Lab Report',
    timestamp: '1d',
    isRead: true,
    initials: 'MP',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=patel',
    icon: 'Paperclip',
    iconBg: 'bg-orange-100 text-orange-700',
    studentName: 'Sophia',
    category: 'class',
    date: 'Yesterday',
    expandedContent:
      'Score: 95/100. Excellent work! Your hypothesis was clear and data analysis was thorough.',
    actionButton: {
      label: 'View Feedback',
      variant: 'outline',
      onClick: () => console.log('Viewing feedback...'),
    },
  },
  {
    id: '8',
    type: 'message',
    actor: 'Coach Anderson',
    action: 'sent message about Sophia',
    target: 'Track & Field',
    timestamp: '2d',
    isRead: true,
    initials: 'CA',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anderson',
    icon: 'MessageSquare',
    iconBg: 'bg-blue-500 text-white',
    studentName: 'Sophia',
    category: 'class',
    date: 'Earlier',
    expandedContent:
      'Great job at practice today! Your technique on the hurdles has improved significantly. Keep up the excellent work!',
  },
  {
    id: '9',
    type: 'reminder',
    actor: 'System',
    action: 'reminder for Sophia',
    target: 'Spanish II class tomorrow at 3:00 PM',
    timestamp: '2d',
    isRead: true,
    initials: 'SY',
    icon: 'Bell',
    iconBg: 'bg-purple-500 text-white',
    studentName: 'Sophia',
    category: 'system',
    date: 'Earlier',
  },
];

const TAB_FILTERS = {
  all: (_activity: Activity) => true,
  classes: (activity: Activity) => activity.category === 'class',
  payment: (activity: Activity) => activity.category === 'payment',
  system: (activity: Activity) => activity.category === 'system',
} as const;
type TabKey = keyof typeof TAB_FILTERS;

const groupActivitiesByDate = (items: Activity[]) =>
  Object.entries(
    items.reduce(
      (acc, activity) => {
        if (!acc[activity.date]) {
          acc[activity.date] = [];
        }
        acc[activity.date].push(activity);
        return acc;
      },
      {} as Record<string, Activity[]>,
    ),
  );

export function InboxContainer() {
  const [activities, setActivities] = useState(mockActivities);
  const [activeTab, setActiveTab] = useState<TabKey>('all');

  const unreadCount = activities.filter((a) => !a.isRead).length;
  const groupedActivities = groupActivitiesByDate(activities);
  const tabFilter = TAB_FILTERS[activeTab];
  const tabCounts = {
    all: activities.filter((activity) => !activity.isRead).length,
    classes: activities.filter(
      (activity) => activity.category === 'class' && !activity.isRead,
    ).length,
    payment: activities.filter(
      (activity) => activity.category === 'payment' && !activity.isRead,
    ).length,
    system: activities.filter(
      (activity) => activity.category === 'system' && !activity.isRead,
    ).length,
  };

  const filteredGroupedActivities = groupedActivities
    .map(([date, dateActivities]) => {
      const filtered = dateActivities.filter(tabFilter);
      return [date, filtered] as const;
    })
    .filter(([, dateActivities]) => dateActivities.length > 0);

  const handleTabChange = (value: string) => {
    if (value in TAB_FILTERS) {
      setActiveTab(value as TabKey);
    }
  };

  const markAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActivities((prev) =>
      prev.map((activity) => {
        if (activity.id === id) {
          return { ...activity, isRead: true };
        }
        // Also mark sub-activities as read
        if (activity.subActivities) {
          return {
            ...activity,
            subActivities: activity.subActivities.map((sub) =>
              sub.id === id ? { ...sub, isRead: true } : sub,
            ),
          };
        }
        return activity;
      }),
    );
  };

  return (
    <Tabs
      value={activeTab}
      defaultValue="all"
      onValueChange={handleTabChange}
      className="flex size-full flex-col"
    >
      <div className="flex items-center justify-between border-b px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Latest activity</h1>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="h-5 px-2 text-xs">
              {unreadCount} new
            </Badge>
          )}
        </div>
      </div>

      <div className="border-b px-4 py-2">
        <TabsList>
          <TabsTrigger value="all" className="gap-2">
            <span>All</span>
            {tabCounts.all > 0 && (
              <Badge className="h-4 px-1.5 text-[10px] bg-rose-500 text-white">
                {tabCounts.all}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="classes" className="gap-2">
            <span>Classes</span>
            {tabCounts.classes > 0 && (
              <Badge className="h-4 px-1.5 text-[10px] bg-rose-500 text-white">
                {tabCounts.classes}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="payment" className="gap-2">
            <span>Payment</span>
            {tabCounts.payment > 0 && (
              <Badge className="h-4 px-1.5 text-[10px] bg-rose-500 text-white">
                {tabCounts.payment}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <span>System</span>
            {tabCounts.system > 0 && (
              <Badge className="h-4 px-1.5 text-[10px] bg-rose-500 text-white">
                {tabCounts.system}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value={activeTab} className="mt-0">
        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="p-4 space-y-8">
            {filteredGroupedActivities.map(([date, dateActivities]) => (
              <div key={date} className="space-y-1">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  {date}
                </h2>
                <div className="space-y-1">
                  {dateActivities.map((activity) => (
                    <ActivityWithSubitems
                      key={activity.id}
                      activity={activity}
                      onMarkRead={markAsRead}
                      className="relative"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}

import type { CalendarEvent } from '@iconicedu/shared-types';

const getDateOffset = (daysOffset: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date;
};

export const sampleEvents: CalendarEvent[] = [
  {
    id: 'today-1',
    title: 'Team standup',
    startTime: '9:30 AM',
    endTime: '10:30 AM',
    date: new Date(),
    color: 'blue',
    description:
      "Join us for our daily team standup. We'll discuss progress updates, blockers, and plan for the day ahead.\n\nTopic: Daily standup meeting to sync on current sprint tasks.",
    organizer: 'Engineering Team',
    location: 'Virtual Meeting Room',
    visibility: 'Team members only',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike&backgroundColor=c0aede',
      ],
      count: 8,
    },
  },
  {
    id: 'today-2',
    title: 'Client presentation',
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    date: new Date(),
    color: 'purple',
    description:
      'Quarterly review presentation for Acme Corp covering Q4 performance metrics and 2025 roadmap.\n\nTopic: Strategic business review and future planning session.',
    organizer: 'Sales Department',
    location: 'Conference Room A',
    visibility: 'Open to everyone',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=John&backgroundColor=ffd5dc',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily&backgroundColor=ffeaa7',
      ],
      count: 6,
    },
  },
  {
    id: 'today-3',
    title: 'Lunch meeting',
    startTime: '12:30 PM',
    endTime: '1:30 PM',
    date: new Date(),
    color: 'green',
    description:
      'Casual lunch to discuss upcoming projects and team building activities.\n\nTopic: Informal team discussion over lunch.',
    organizer: 'Team Lead',
    location: 'Downtown Cafe',
    visibility: 'Open to everyone',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=b6e3f4',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan&backgroundColor=d1d4f9',
      ],
      count: 5,
    },
  },
  {
    id: 'today-4',
    title: 'Code review session',
    startTime: '2:00 PM',
    endTime: '3:00 PM',
    date: new Date(),
    color: 'blue',
    description:
      'Reviewing recent pull requests and discussing code quality improvements.\n\nTopic: Code quality and best practices discussion.',
    organizer: 'Tech Lead',
    location: 'Development Office',
    visibility: 'Engineering team',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris&backgroundColor=c0aede',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor&backgroundColor=ffd5dc',
      ],
      count: 4,
    },
  },
  {
    id: 'today-5',
    title: 'Design feedback',
    startTime: '4:00 PM',
    endTime: '5:00 PM',
    date: new Date(),
    color: 'pink',
    description:
      'Review and provide feedback on the latest design mockups for the mobile app redesign.\n\nTopic: Mobile app UI/UX design review session.',
    organizer: 'Design Team',
    location: 'Design Studio',
    visibility: 'Open to everyone',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan&backgroundColor=ffeaa7',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Casey&backgroundColor=b6e3f4',
      ],
      count: 7,
    },
  },

  {
    id: 'yesterday-1',
    title: 'Product planning',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    date: getDateOffset(-1),
    color: 'purple',
    description:
      'Discussing upcoming product releases and roadmap updates.\n\nTopic: Product roadmap planning session.',
    organizer: 'Product Team',
    location: 'Virtual Meeting Room',
    visibility: 'Engineering team',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan&backgroundColor=d1d4f9',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=b6e3f4',
      ],
      count: 6,
    },
  },
  {
    id: 'yesterday-2',
    title: 'Sales call',
    startTime: '2:00 PM',
    endTime: '3:00 PM',
    date: getDateOffset(-1),
    color: 'green',
    description:
      'Weekly sales call to discuss targets, strategies, and client interactions.\n\nTopic: Sales performance review and strategy session.',
    organizer: 'Sales Team',
    location: 'Virtual Call Room',
    visibility: 'Sales team',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily&backgroundColor=ffeaa7',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=John&backgroundColor=ffd5dc',
      ],
      count: 5,
    },
  },

  {
    id: 'tomorrow-1',
    title: 'Engineering sync',
    startTime: '9:00 AM',
    endTime: '10:00 AM',
    date: getDateOffset(1),
    color: 'blue',
    description:
      'Weekly engineering sync to align on technical priorities and architectural decisions.\n\nTopic: Technical roadmap and architecture planning.',
    organizer: 'Engineering Manager',
    location: 'Zoom Meeting',
    visibility: 'Engineering team',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam&backgroundColor=c0aede',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley&backgroundColor=d1d4f9',
      ],
      count: 12,
    },
  },
  {
    id: 'tomorrow-2',
    title: 'Sprint planning',
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    date: getDateOffset(1),
    color: 'green',
    description:
      'Sienna is inviting you to a scheduled Zoom meeting.\n\nTopic: Plan upcoming two-week sprint. Review backlog priorities and assign story points.\n\nJoin Zoom Meeting: https://us02web.zoom.us/j/86341969512',
    organizer: 'Product Team',
    location: 'Mohakhali, Dhaka',
    visibility: 'Open to everyone',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sienna&backgroundColor=ffd5dc',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Quinn&backgroundColor=ffeaa7',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Drew&backgroundColor=b6e3f4',
      ],
      count: 15,
    },
  },
  {
    id: 'tomorrow-3',
    title: 'Design review',
    startTime: '2:00 PM',
    endTime: '3:00 PM',
    date: getDateOffset(1),
    color: 'pink',
    description:
      'Comprehensive design review covering all recent projects and design system updates.\n\nTopic: Design system consistency and component library review.',
    organizer: 'Design Lead',
    location: 'Creative Space',
    visibility: 'Design team',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Avery&backgroundColor=c0aede',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie&backgroundColor=d1d4f9',
      ],
      count: 6,
    },
  },
  {
    id: 'tomorrow-4',
    title: 'All hands meeting',
    startTime: '4:00 PM',
    endTime: '5:00 PM',
    date: getDateOffset(1),
    color: 'purple',
    description:
      'Quarterly all hands meeting to update on company progress and discuss future goals.\n\nTopic: Company updates and strategic planning session.',
    organizer: 'CEO',
    location: 'Main Conference Hall',
    visibility: 'Open to everyone',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=CEO&backgroundColor=ffeaa7',
      ],
      count: 50,
    },
  },

  {
    id: 'day2-1',
    title: 'Customer demo',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    date: getDateOffset(2),
    color: 'blue',
    description:
      'Live product demonstration for potential customers showcasing key features and capabilities.\n\nTopic: Product walkthrough and customer Q&A session.',
    organizer: 'Sales Team',
    location: 'Virtual Demo Room',
    visibility: 'Open to everyone',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Blake&backgroundColor=ffeaa7',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Reese&backgroundColor=b6e3f4',
      ],
      count: 10,
    },
  },
  {
    id: 'day2-2',
    title: 'Team lunch',
    startTime: '12:00 PM',
    endTime: '1:00 PM',
    date: getDateOffset(2),
    color: 'green',
    description:
      'Relaxing lunch for the team to bond and discuss personal and professional matters.\n\nTopic: Casual team lunch and social interaction.',
    organizer: 'Team Lead',
    location: 'Downtown Cafe',
    visibility: 'Open to everyone',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan&backgroundColor=d1d4f9',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=b6e3f4',
      ],
      count: 10,
    },
  },
  {
    id: 'day2-3',
    title: 'Architecture discussion',
    startTime: '3:00 PM',
    endTime: '4:00 PM',
    date: getDateOffset(2),
    color: 'purple',
    description:
      'Discussing architectural changes and improvements for the upcoming projects.\n\nTopic: System architecture planning and discussion.',
    organizer: 'Tech Lead',
    location: 'Development Office',
    visibility: 'Engineering team',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris&backgroundColor=c0aede',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor&backgroundColor=ffd5dc',
      ],
      count: 8,
    },
  },

  {
    id: 'day3-1',
    title: 'Weekly standup',
    startTime: '9:00 AM',
    endTime: '10:00 AM',
    date: getDateOffset(3),
    color: 'blue',
    description:
      'Weekly standup to discuss progress, challenges, and next steps for the ongoing projects.\n\nTopic: Project progress and team alignment meeting.',
    organizer: 'Engineering Team',
    location: 'Virtual Meeting Room',
    visibility: 'Team members only',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike&backgroundColor=c0aede',
      ],
      count: 12,
    },
  },
  {
    id: 'day3-2',
    title: 'User testing',
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    date: getDateOffset(3),
    color: 'pink',
    description:
      'Conducting usability tests with real users to gather feedback on new features.\n\nTopic: User experience research and feedback collection.',
    organizer: 'UX Research Team',
    location: 'Research Lab',
    visibility: 'Research team',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Kai&backgroundColor=c0aede',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Skylar&backgroundColor=ffd5dc',
      ],
      count: 8,
    },
  },
  {
    id: 'day3-3',
    title: 'Budget review',
    startTime: '2:00 PM',
    endTime: '3:00 PM',
    date: getDateOffset(3),
    color: 'orange',
    description:
      'Reviewing the current budget and discussing financial strategies for the upcoming quarter.\n\nTopic: Budget analysis and financial planning session.',
    organizer: 'Finance Team',
    location: 'Finance Office',
    visibility: 'Open to everyone',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=John&backgroundColor=ffd5dc',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily&backgroundColor=ffeaa7',
      ],
      count: 10,
    },
  },

  {
    id: 'day4-1',
    title: 'Marketing strategy',
    startTime: '9:30 AM',
    endTime: '10:30 AM',
    date: getDateOffset(4),
    color: 'pink',
    description:
      'Discussing marketing strategies and campaigns for the next quarter.\n\nTopic: Marketing strategy planning and brainstorming session.',
    organizer: 'Marketing Team',
    location: 'Virtual Meeting Room',
    visibility: 'Open to everyone',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sienna&backgroundColor=ffd5dc',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Quinn&backgroundColor=ffeaa7',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Drew&backgroundColor=b6e3f4',
      ],
      count: 10,
    },
  },
  {
    id: 'day4-2',
    title: 'Content planning',
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    date: getDateOffset(4),
    color: 'blue',
    description:
      'Planning content for the upcoming quarter, including blog posts, social media updates, and email campaigns.\n\nTopic: Content calendar and strategy session.',
    organizer: 'Content Team',
    location: 'Creative Space',
    visibility: 'Open to everyone',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Avery&backgroundColor=c0aede',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie&backgroundColor=d1d4f9',
      ],
      count: 8,
    },
  },
  {
    id: 'day4-3',
    title: 'Strengthen Your Heart Through Daily Movement',
    startTime: '1:30 PM',
    endTime: '2:30 PM',
    date: getDateOffset(4),
    color: 'blue',
    description:
      'Sienna is inviting you to a scheduled Zoom meeting.\n\nTopic: Product demo for the new dashboard and Q&A session.\n\nJoin Zoom Meeting: https://us02web.zoom.us/j/86341969512',
    organizer: 'Wellness Insight Lab',
    location: 'Mohakhali, Dhaka',
    visibility: 'Open to everyone',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=c0aede',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper&backgroundColor=d1d4f9',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna&backgroundColor=ffd5dc',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Oscar&backgroundColor=ffeaa7',
      ],
      count: 52,
    },
  },
  {
    id: 'day4-4',
    title: 'Week retrospective',
    startTime: '4:00 PM',
    endTime: '5:00 PM',
    date: getDateOffset(4),
    color: 'green',
    description:
      "Reflecting on the past week's accomplishments and identifying areas for improvement.\n\nTopic: Week retrospective and action planning session.",
    organizer: 'Engineering Team',
    location: 'Virtual Meeting Room',
    visibility: 'Team members only',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike&backgroundColor=c0aede',
      ],
      count: 8,
    },
  },

  {
    id: 'day5-1',
    title: 'Coffee with mentor',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    date: getDateOffset(5),
    color: 'green',
    description:
      'Scheduled coffee meeting with a mentor to discuss career growth and development.\n\nTopic: Career guidance and mentorship session.',
    organizer: 'Mentor Program',
    location: 'Coffee Shop',
    visibility: 'Open to everyone',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Blake&backgroundColor=ffeaa7',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Reese&backgroundColor=b6e3f4',
      ],
      count: 2,
    },
  },
  {
    id: 'day5-2',
    title: 'Gym session',
    startTime: '6:00 PM',
    endTime: '7:00 PM',
    date: getDateOffset(5),
    color: 'orange',
    description:
      'Regular physical activity is one of the simplest ways to improve your heart health. Small, consistent habits can create meaningful, long-term benefits.\n\nTopic: Fitness and wellness session.',
    organizer: 'Wellness Team',
    location: 'Gym',
    visibility: 'Open to everyone',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Kai&backgroundColor=c0aede',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Skylar&backgroundColor=ffd5dc',
      ],
      count: 10,
    },
  },

  {
    id: 'day6-1',
    title: 'Brunch with family',
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    date: getDateOffset(6),
    color: 'green',
    description:
      'Enjoy a relaxing brunch with family to strengthen bonds and unwind.\n\nTopic: Family time and social interaction.',
    organizer: 'Personal',
    location: 'Home',
    visibility: 'Private',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=b6e3f4',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan&backgroundColor=d1d4f9',
      ],
      count: 5,
    },
  },
  {
    id: 'day6-2',
    title: 'Movie night',
    startTime: '7:00 PM',
    endTime: '8:00 PM',
    date: getDateOffset(6),
    color: 'yellow',
    description:
      'Watching a movie together as a team to foster collaboration and entertainment.\n\nTopic: Team bonding and movie night.',
    organizer: 'Entertainment Team',
    location: 'Cinema',
    visibility: 'Open to everyone',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike&backgroundColor=c0aede',
      ],
      count: 10,
    },
  },

  {
    id: 'nextweek-1',
    title: 'Planning session',
    startTime: '9:00 AM',
    endTime: '10:00 AM',
    date: getDateOffset(7),
    color: 'blue',
    description:
      'Weekly planning session to discuss goals, tasks, and timelines for the next week.\n\nTopic: Weekly planning and task allocation meeting.',
    organizer: 'Engineering Team',
    location: 'Virtual Meeting Room',
    visibility: 'Team members only',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan&backgroundColor=d1d4f9',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=b6e3f4',
      ],
      count: 10,
    },
  },
  {
    id: 'nextweek-2',
    title: 'Vendor meeting',
    startTime: '2:00 PM',
    endTime: '3:00 PM',
    date: getDateOffset(7),
    color: 'orange',
    description:
      'Meeting with vendors to discuss partnership opportunities and product updates.\n\nTopic: Vendor collaboration and product discussion.',
    organizer: 'Procurement Team',
    location: 'Vendor Conference Room',
    visibility: 'Open to everyone',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily&backgroundColor=ffeaa7',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=John&backgroundColor=ffd5dc',
      ],
      count: 8,
    },
  },
  {
    id: 'nextweek-3',
    title: 'Training workshop',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    date: getDateOffset(8),
    color: 'purple',
    description:
      'Training session for new team members to get up to speed on company processes and tools.\n\nTopic: Onboarding and training session.',
    organizer: 'HR Team',
    location: 'Training Room',
    visibility: 'Open to everyone',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Avery&backgroundColor=c0aede',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie&backgroundColor=d1d4f9',
      ],
      count: 12,
    },
  },
  {
    id: 'nextweek-4',
    title: 'Customer feedback',
    startTime: '3:00 PM',
    endTime: '4:00 PM',
    date: getDateOffset(8),
    color: 'pink',
    description:
      'Gathering customer feedback through surveys and interviews to improve product offerings.\n\nTopic: Customer feedback collection and analysis session.',
    organizer: 'Customer Support Team',
    location: 'Conference Room B',
    visibility: 'Open to everyone',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Kai&backgroundColor=c0aede',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Skylar&backgroundColor=ffd5dc',
      ],
      count: 10,
    },
  },
  {
    id: 'nextweek-5',
    title: 'Architecture review',
    startTime: '10:30 AM',
    endTime: '11:30 AM',
    date: getDateOffset(9),
    color: 'blue',
    description:
      'Reviewing the architecture of recent projects to ensure scalability and efficiency.\n\nTopic: Architecture review and optimization session.',
    organizer: 'Tech Lead',
    location: 'Development Office',
    visibility: 'Engineering team',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris&backgroundColor=c0aede',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor&backgroundColor=ffd5dc',
      ],
      count: 8,
    },
  },
  {
    id: 'nextweek-6',
    title: 'Performance optimization',
    startTime: '1:00 PM',
    endTime: '2:00 PM',
    date: getDateOffset(9),
    color: 'green',
    description:
      'Discussing ways to optimize system performance and user experience.\n\nTopic: Performance tuning and user experience enhancement session.',
    organizer: 'Engineering Team',
    location: 'Virtual Meeting Room',
    visibility: 'Team members only',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike&backgroundColor=c0aede',
      ],
      count: 10,
    },
  },
  {
    id: 'nextweek-7',
    title: 'Security audit',
    startTime: '9:00 AM',
    endTime: '10:00 AM',
    date: getDateOffset(10),
    color: 'orange',
    description:
      'Conducting a security audit to identify and address potential vulnerabilities.\n\nTopic: Security assessment and improvement session.',
    organizer: 'Security Team',
    location: 'Security Lab',
    visibility: 'Open to everyone',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily&backgroundColor=ffeaa7',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=John&backgroundColor=ffd5dc',
      ],
      count: 8,
    },
  },
  {
    id: 'nextweek-8',
    title: 'Investor pitch prep',
    startTime: '2:00 PM',
    endTime: '3:00 PM',
    date: getDateOffset(10),
    color: 'purple',
    description:
      'Preparing for an investor pitch to secure funding for upcoming projects.\n\nTopic: Investor pitch preparation and presentation session.',
    organizer: 'Finance Team',
    location: 'Board Room',
    visibility: 'Open to everyone',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Avery&backgroundColor=c0aede',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie&backgroundColor=d1d4f9',
      ],
      count: 10,
    },
  },
];

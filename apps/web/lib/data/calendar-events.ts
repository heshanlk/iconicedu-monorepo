import type { CalendarEvent } from '@iconicedu/shared-types';

export const getDateOffset = (daysOffset: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date;
};

export const baseEvents: CalendarEvent[] = [
  {
    id: 'recurring-math-eliyas',
    title: 'Eliyas - Math with Mr. Abhishek',
    startTime: '9:00 AM',
    endTime: '10:00 AM',
    date: getDateOffset(-7),
    recurrence: {
      frequency: 'weekly',
      interval: 1,
      byWeekday: ['SA'],
      exceptions: [],
      overrides: {},
    },
    color: 'blue',
    description:
      'Join Zoom Meeting\nhttps://us06web.zoom.us/j/88176711138?pwd=QyOYewr8ovQnVs5Kf5SEUHXzjlrGq7.1\n\nView meeting insights with Zoom AI Companion\nhttps://us06web.zoom.us/launch/edl?muid=55f36ba3-a6ef-46c8-a191-fc1847c48d60\n\nMeeting ID: 881 7671 1138\nPasscode: 903480',
    organizer: 'Mr Abhishek',
    location: 'Zoom',
    visibility: '1-1',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley&backgroundColor=b6e3f4',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam&backgroundColor=c0aede',
      ],
      count: 3,
    },
  },
  {
    id: 'recurring-math-zayne',
    title: 'Zayne - Math with Ms.Shenaly',
    startTime: '9:00 AM',
    endTime: '10:00 AM',
    date: getDateOffset(-7),
    recurrence: {
      frequency: 'weekly',
      interval: 1,
      byWeekday: ['SA'],
      exceptions: [],
      overrides: {},
    },
    color: 'purple',
    description:
      'Join Zoom Meeting\nhttps://us06web.zoom.us/j/88176711138?pwd=QyOYewr8ovQnVs5Kf5SEUHXzjlrGq7.1\n\nView meeting insights with Zoom AI Companion\nhttps://us06web.zoom.us/launch/edl?muid=55f36ba3-a6ef-46c8-a191-fc1847c48d60\n\nMeeting ID: 881 7671 1138\nPasscode: 903480',
    organizer: 'Ms Shenaly',
    location: 'Zoom',
    visibility: '1-1',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley&backgroundColor=b6e3f4',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam&backgroundColor=c0aede',
      ],
      count: 3,
    },
  },
  {
    id: 'recurring-chess-nailah',
    title: 'Nailah - Chess with Coach Rivi',
    startTime: '9:00 AM',
    endTime: '9:45 AM',
    date: getDateOffset(-7),
    recurrence: {
      frequency: 'weekly',
      interval: 1,
      byWeekday: ['SA'],
      exceptions: [],
      overrides: {},
    },
    color: 'pink',
    description:
      'Join Zoom Meeting\nhttps://us06web.zoom.us/j/88176711138?pwd=QyOYewr8ovQnVs5Kf5SEUHXzjlrGq7.1\n\nView meeting insights with Zoom AI Companion\nhttps://us06web.zoom.us/launch/edl?muid=55f36ba3-a6ef-46c8-a191-fc1847c48d60\n\nMeeting ID: 881 7671 1138\nPasscode: 903480',
    organizer: 'Coach Rivi',
    location: 'Zoom',
    visibility: '1-1',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley&backgroundColor=b6e3f4',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam&backgroundColor=c0aede',
      ],
      count: 3,
    },
  },
  {
    id: 'recurring-math-nailah',
    title: 'Nailah - Math with Ms. Shenaly',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    date: getDateOffset(-7),
    recurrence: {
      frequency: 'weekly',
      interval: 1,
      byWeekday: ['SA'],
      exceptions: [],
      overrides: {},
    },
    color: 'pink',
    description:
      'Join Zoom Meeting\nhttps://us06web.zoom.us/j/88176711138?pwd=QyOYewr8ovQnVs5Kf5SEUHXzjlrGq7.1\n\nView meeting insights with Zoom AI Companion\nhttps://us06web.zoom.us/launch/edl?muid=55f36ba3-a6ef-46c8-a191-fc1847c48d60\n\nMeeting ID: 881 7671 1138\nPasscode: 903480',
    organizer: 'Ms Shenaly',
    location: 'Zoom',
    visibility: '1-1',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley&backgroundColor=b6e3f4',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam&backgroundColor=c0aede',
      ],
      count: 3,
    },
  },
  {
    id: 'recurring-chess-tehara',
    title: 'Tehara - Chess with Coach Rivi',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    date: getDateOffset(-7),
    recurrence: {
      frequency: 'weekly',
      interval: 1,
      byWeekday: ['SA'],
      exceptions: [],
      overrides: {},
    },
    color: 'orange',
    description:
      'Join Zoom Meeting\nhttps://us06web.zoom.us/j/88176711138?pwd=QyOYewr8ovQnVs5Kf5SEUHXzjlrGq7.1\n\nView meeting insights with Zoom AI Companion\nhttps://us06web.zoom.us/launch/edl?muid=55f36ba3-a6ef-46c8-a191-fc1847c48d60\n\nMeeting ID: 881 7671 1138\nPasscode: 903480',
    organizer: 'Coach Rivi',
    location: 'Zoom',
    visibility: '1-1',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley&backgroundColor=b6e3f4',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam&backgroundColor=c0aede',
      ],
      count: 3,
    },
  },
  {
    id: 'recurring-math-tehara',
    title: 'Tehara - Math With Ms. Wickramasingha',
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    date: getDateOffset(-7),
    recurrence: {
      frequency: 'weekly',
      interval: 1,
      byWeekday: ['SA'],
      exceptions: [],
      overrides: {},
    },
    color: 'orange',
    description:
      'Join Zoom Meeting\nhttps://us06web.zoom.us/j/88176711138?pwd=QyOYewr8ovQnVs5Kf5SEUHXzjlrGq7.1\n\nView meeting insights with Zoom AI Companion\nhttps://us06web.zoom.us/launch/edl?muid=55f36ba3-a6ef-46c8-a191-fc1847c48d60\n\nMeeting ID: 881 7671 1138\nPasscode: 903480',
    organizer: 'Ms Wickramasingha',
    location: 'Zoom',
    visibility: '1-1',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley&backgroundColor=b6e3f4',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam&backgroundColor=c0aede',
      ],
      count: 3,
    },
  },
  {
    id: 'recurring-math-mairian',
    title: 'Mairian <> Maths with Ms. Wikramasingha',
    startTime: '12:30 PM',
    endTime: '1:30 PM',
    date: getDateOffset(-7),
    recurrence: {
      frequency: 'weekly',
      interval: 1,
      byWeekday: ['SA'],
      exceptions: [],
      overrides: {},
    },
    color: 'orange',
    description:
      'Join Zoom Meeting\nhttps://us06web.zoom.us/j/88176711138?pwd=QyOYewr8ovQnVs5Kf5SEUHXzjlrGq7.1\n\nView meeting insights with Zoom AI Companion\nhttps://us06web.zoom.us/launch/edl?muid=55f36ba3-a6ef-46c8-a191-fc1847c48d60\n\nMeeting ID: 881 7671 1138\nPasscode: 903480',
    organizer: 'Ms Wickramasingha',
    location: 'Zoom',
    visibility: '1-1',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley&backgroundColor=b6e3f4',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam&backgroundColor=c0aede',
      ],
      count: 3,
    },
  },
  {
    id: 'recurring-math-zayne-2',
    title: 'Zayne - Chess with Coach Rivi',
    startTime: '11:00 AM',
    endTime: '11:45 AM',
    date: getDateOffset(-7),
    recurrence: {
      frequency: 'weekly',
      interval: 1,
      byWeekday: ['SA'],
      exceptions: [],
      overrides: {},
    },
    color: 'blue',
    description:
      'Join Zoom Meeting\nhttps://us06web.zoom.us/j/88176711138?pwd=QyOYewr8ovQnVs5Kf5SEUHXzjlrGq7.1\n\nView meeting insights with Zoom AI Companion\nhttps://us06web.zoom.us/launch/edl?muid=55f36ba3-a6ef-46c8-a191-fc1847c48d60\n\nMeeting ID: 881 7671 1138\nPasscode: 903480',
    organizer: 'Coach Rivi',
    location: 'Zoom',
    visibility: '1-1',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley&backgroundColor=b6e3f4',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam&backgroundColor=c0aede',
      ],
      count: 3,
    },
  },
  {
    id: 'recurring-math-eliyas-2',
    title: 'Eliyas - Chess with Coach Rivi',
    startTime: '10:15 AM',
    endTime: '11:00 AM',
    date: getDateOffset(-7),
    recurrence: {
      frequency: 'weekly',
      interval: 1,
      byWeekday: ['SA'],
      exceptions: [],
      overrides: {},
    },
    color: 'blue',
    description:
      'Join Zoom Meeting\nhttps://us06web.zoom.us/j/88176711138?pwd=QyOYewr8ovQnVs5Kf5SEUHXzjlrGq7.1\n\nView meeting insights with Zoom AI Companion\nhttps://us06web.zoom.us/launch/edl?muid=55f36ba3-a6ef-46c8-a191-fc1847c48d60\n\nMeeting ID: 881 7671 1138\nPasscode: 903480',
    organizer: 'Coach Rivi',
    location: 'Zoom',
    visibility: '1-1',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley&backgroundColor=b6e3f4',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam&backgroundColor=c0aede',
      ],
      count: 3,
    },
  },
  {
    id: 'recurring-math-tehara-2',
    title: 'Tehara <> Math With Ms Wickramasingha',
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    date: getDateOffset(-7),
    recurrence: {
      frequency: 'weekly',
      interval: 1,
      byWeekday: ['SA'],
      exceptions: [],
      overrides: {},
    },
    color: 'blue',
    description:
      'Join Zoom Meeting\nhttps://us06web.zoom.us/j/88176711138?pwd=QyOYewr8ovQnVs5Kf5SEUHXzjlrGq7.1\n\nView meeting insights with Zoom AI Companion\nhttps://us06web.zoom.us/launch/edl?muid=55f36ba3-a6ef-46c8-a191-fc1847c48d60\n\nMeeting ID: 881 7671 1138\nPasscode: 903480',
    organizer: 'Ms Wickramasingha',
    location: 'Zoom',
    visibility: '1-1',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley&backgroundColor=b6e3f4',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam&backgroundColor=c0aede',
      ],
      count: 3,
    },
  },
];

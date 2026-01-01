import type {
  ChildProfileVM,
  EducatorProfileVM,
  GuardianProfileVM,
  PresenceVM,
  StaffProfileVM,
  UserProfileVM,
} from '@iconicedu/shared-types';
import { ACCOUNT_IDS, ORG_ID, PROFILE_IDS } from './ids';

const presenceOffline: PresenceVM = {
  state: { text: 'Offline', emoji: '🌙' },
  liveStatus: 'offline',
  lastSeenAt: '2026-02-10T21:15:00.000Z',
  presenceLoaded: true,
};

const presenceOnline: PresenceVM = {
  state: { text: 'Available', emoji: '✅' },
  liveStatus: 'away',
  lastSeenAt: '2026-02-10T22:05:00.000Z',
  presenceLoaded: true,
};

const presenceBusy: PresenceVM = {
  state: { text: 'In session', emoji: '🎧' },
  liveStatus: 'busy',
  lastSeenAt: '2026-02-10T22:30:00.000Z',
  presenceLoaded: true,
};

const presenceAway: PresenceVM = {
  state: { text: 'Away', emoji: '🌿' },
  liveStatus: 'away',
  lastSeenAt: '2026-02-10T20:00:00.000Z',
  presenceLoaded: true,
};

export const CHILD_AVA: ChildProfileVM = {
  kind: 'child',
  ids: {
    orgId: ORG_ID,
    id: PROFILE_IDS.childA,
    accountId: ACCOUNT_IDS.childA,
  },
  profile: {
    displayName: 'Ava Morgan',
    firstName: 'Ava',
    lastName: 'Morgan',
    bio: 'Loves puzzles, legos, and number games.',
    avatar: {
      source: 'seed',
      seed: 'child-ava',
      url: null,
      updatedAt: null,
    },
  },
  prefs: {
    timezone: 'America/New_York',
    locale: 'en-US',
    languagesSpoken: ['English'],
    notificationDefaults: null,
  },
  presence: presenceOffline,
  status: 'active',
  location: {
    countryCode: 'US',
    countryName: 'United States',
    region: 'NY',
    city: 'New York',
    postalCode: '10001',
  },
  internal: {
    notesInternal: 'Responds well to visual supports.',
  },
  meta: {
    createdAt: '2021-09-10T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z',
  },
  ui: {
    color: 'bg-green-500 text-white',
  },
  gradeLevel: { id: 3, label: 'Grade 3' },
  birthYear: 2016,
  schoolName: 'Maple Grove Elementary',
  schoolYear: '2025-2026',
  interests: ['Math puzzles', 'Robotics club'],
  strengths: ['Problem solving', 'Focus'],
  learningPreferences: ['Visual', 'Hands-on'],
  motivationStyles: ['Challenges', 'Badges'],
  confidenceLevel: 'medium',
  communicationStyle: 'chatty',
};

export const CHILD_MILO: ChildProfileVM = {
  kind: 'child',
  ids: {
    orgId: ORG_ID,
    id: PROFILE_IDS.childB,
    accountId: ACCOUNT_IDS.childB,
  },
  profile: {
    displayName: 'Milo Morgan',
    firstName: 'Milo',
    lastName: 'Morgan',
    bio: 'Science fan who loves hands-on experiments.',
    avatar: {
      source: 'seed',
      seed: 'child-milo',
      url: null,
      updatedAt: null,
    },
  },
  prefs: {
    timezone: 'America/New_York',
    locale: 'en-US',
    languagesSpoken: ['English', 'Spanish'],
    notificationDefaults: null,
  },
  presence: presenceOnline,
  status: 'active',
  location: {
    countryCode: 'US',
    countryName: 'United States',
    region: 'NY',
    city: 'Brooklyn',
    postalCode: '11201',
  },
  internal: {
    notesInternal: 'Enjoys small group activities.',
  },
  meta: {
    createdAt: '2020-08-20T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z',
  },
  ui: {
    color: 'bg-yellow-500 text-white',
  },
  gradeLevel: { id: 5, label: 'Grade 5' },
  birthYear: 2014,
  schoolName: 'Brooklyn Horizons',
  schoolYear: '2025-2026',
  interests: ['Science kits', 'Space facts'],
  strengths: ['Curiosity', 'Teamwork'],
  learningPreferences: ['Interactive', 'Collaborative'],
  motivationStyles: ['Praise', 'Discovery'],
  confidenceLevel: 'high',
  communicationStyle: 'chatty',
};

export const CHILD_MAYA: ChildProfileVM = {
  kind: 'child',
  ids: {
    orgId: ORG_ID,
    id: PROFILE_IDS.childC,
    accountId: ACCOUNT_IDS.childC,
  },
  profile: {
    displayName: 'Maya Morgan',
    firstName: 'Maya',
    lastName: 'Morgan',
    bio: 'Creative writer and bookworm.',
    avatar: {
      source: 'seed',
      seed: 'child-maya',
      url: null,
      updatedAt: null,
    },
  },
  prefs: {
    timezone: 'America/New_York',
    locale: 'en-US',
    languagesSpoken: ['English', 'French'],
    notificationDefaults: null,
  },
  presence: presenceAway,
  status: 'active',
  location: {
    countryCode: 'US',
    countryName: 'United States',
    region: 'NY',
    city: 'Queens',
    postalCode: '11101',
  },
  internal: {
    notesInternal: 'Prefers written feedback.',
  },
  meta: {
    createdAt: '2019-07-05T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z',
  },
  ui: {
    color: 'bg-red-500 text-white',
  },
  gradeLevel: { id: 6, label: 'Grade 6' },
  birthYear: 2013,
  schoolName: 'Queens Academy',
  schoolYear: '2025-2026',
  interests: ['Poetry', 'Debate club'],
  strengths: ['Writing', 'Reading comprehension'],
  learningPreferences: ['Reading', 'Discussion'],
  motivationStyles: ['Reflection', 'Recognition'],
  confidenceLevel: 'medium',
  communicationStyle: 'shy',
};

export const GUARDIAN_MORGAN: GuardianProfileVM = {
  kind: 'guardian',
  ids: {
    orgId: ORG_ID,
    id: PROFILE_IDS.guardian,
    accountId: ACCOUNT_IDS.guardian,
  },
  profile: {
    displayName: 'Riley Morgan',
    firstName: 'Riley',
    lastName: 'Morgan',
    bio: 'Parent advocate focused on growth and confidence.',
    avatar: {
      source: 'seed',
      seed: 'guardian-riley',
      url: null,
      updatedAt: null,
    },
  },
  prefs: {
    timezone: 'America/New_York',
    locale: 'en-US',
    languagesSpoken: ['English'],
    notificationDefaults: { inbox: true },
  },
  presence: presenceBusy,
  status: 'active',
  location: {
    countryCode: 'US',
    countryName: 'United States',
    region: 'NY',
    city: 'New York',
    postalCode: '10003',
  },
  internal: {
    notesInternal: 'Prefers weekly summaries over daily pings.',
  },
  meta: {
    createdAt: '2020-02-14T00:00:00.000Z',
    updatedAt: '2026-01-20T00:00:00.000Z',
  },
  ui: {
    color: 'bg-yellow-500 text-white',
  },
  joinedDate: '2020-02-14T00:00:00.000Z',
  sessionNotesVisibility: 'shared',
  children: {
    items: [CHILD_AVA, CHILD_MILO, CHILD_MAYA],
    total: 3,
  },
};

export const EDUCATOR_ELENA: EducatorProfileVM = {
  kind: 'educator',
  ids: {
    orgId: ORG_ID,
    id: PROFILE_IDS.educator1,
    accountId: ACCOUNT_IDS.educator1,
  },
  profile: {
    displayName: 'Elena Brooks',
    firstName: 'Elena',
    lastName: 'Brooks',
    bio: 'ELA specialist with a love for storytelling.',
    avatar: {
      source: 'seed',
      seed: 'educator-elena',
      url: null,
      updatedAt: null,
    },
  },
  prefs: {
    timezone: 'America/New_York',
    locale: 'en-US',
    languagesSpoken: ['English'],
    notificationDefaults: { inbox: true },
  },
  presence: presenceOnline,
  status: 'active',
  location: {
    countryCode: 'US',
    countryName: 'United States',
    region: 'NY',
    city: 'Brooklyn',
    postalCode: '11215',
  },
  internal: {
    notesInternal: 'Available Tue/Thu mornings.',
  },
  meta: {
    createdAt: '2018-06-01T00:00:00.000Z',
    updatedAt: '2026-01-21T00:00:00.000Z',
  },
  headline: 'Middle School ELA Coach',
  subjects: ['ELA', 'Writing'],
  gradesSupported: [
    { id: 5, label: 'Grade 5' },
    { id: 6, label: 'Grade 6' },
  ],
  education: 'M.Ed., Literacy Education',
  experienceYears: 8,
  certifications: [{ name: 'Reading Specialist', issuer: 'NYS', year: 2020 }],
  joinedDate: '2018-06-01T00:00:00.000Z',
  ageGroupsComfortableWith: ['upper-elementary', 'middle-school'],
  identityVerificationStatus: 'verified',
  curriculumTags: ['Reading circles', 'Writing workshops'],
  badges: ['Top Mentor'],
  averageRating: 4.9,
  totalReviews: 128,
  featuredVideoIntroUrl: 'https://example.com/videos/elena-intro.mp4',
};

export const EDUCATOR_KAI: EducatorProfileVM = {
  kind: 'educator',
  ids: {
    orgId: ORG_ID,
    id: PROFILE_IDS.educator2,
    accountId: ACCOUNT_IDS.educator2,
  },
  profile: {
    displayName: 'Kai Patel',
    firstName: 'Kai',
    lastName: 'Patel',
    bio: 'Math coach focused on confidence and fluency.',
    avatar: {
      source: 'seed',
      seed: 'educator-kai',
      url: null,
      updatedAt: null,
    },
  },
  prefs: {
    timezone: 'America/New_York',
    locale: 'en-US',
    languagesSpoken: ['English', 'Hindi'],
    notificationDefaults: { inbox: true },
  },
  presence: presenceBusy,
  status: 'active',
  location: {
    countryCode: 'US',
    countryName: 'United States',
    region: 'NJ',
    city: 'Jersey City',
    postalCode: '07302',
  },
  internal: {
    notesInternal: 'Prefers lesson planning on Mondays.',
  },
  meta: {
    createdAt: '2017-03-10T00:00:00.000Z',
    updatedAt: '2026-01-21T00:00:00.000Z',
  },
  headline: 'Math Foundations Tutor',
  subjects: ['Math'],
  gradesSupported: [{ id: 3, label: 'Grade 3' }],
  education: 'B.S. Mathematics',
  experienceYears: 6,
  certifications: [{ name: 'Math Specialist', issuer: 'NJ', year: 2019 }],
  joinedDate: '2017-03-10T00:00:00.000Z',
  ageGroupsComfortableWith: ['elementary'],
  identityVerificationStatus: 'verified',
  curriculumTags: ['Number sense', 'Fluency'],
  badges: ['Community Favorite'],
  averageRating: 4.8,
  totalReviews: 98,
  featuredVideoIntroUrl: 'https://example.com/videos/kai-intro.mp4',
};

export const EDUCATOR_PRIYA: EducatorProfileVM = {
  kind: 'educator',
  ids: {
    orgId: ORG_ID,
    id: PROFILE_IDS.educator3,
    accountId: ACCOUNT_IDS.educator3,
  },
  profile: {
    displayName: 'Priya Natarajan',
    firstName: 'Priya',
    lastName: 'Natarajan',
    bio: 'Science mentor specializing in hands-on labs.',
    avatar: {
      source: 'seed',
      seed: 'educator-priya',
      url: null,
      updatedAt: null,
    },
  },
  prefs: {
    timezone: 'America/New_York',
    locale: 'en-US',
    languagesSpoken: ['English', 'Tamil'],
    notificationDefaults: { inbox: true },
  },
  presence: presenceOnline,
  status: 'active',
  location: {
    countryCode: 'US',
    countryName: 'United States',
    region: 'NY',
    city: 'Hoboken',
    postalCode: '07030',
  },
  internal: {
    notesInternal: 'Focus on lab safety and collaboration.',
  },
  meta: {
    createdAt: '2019-01-12T00:00:00.000Z',
    updatedAt: '2026-01-21T00:00:00.000Z',
  },
  headline: 'Science Lab Mentor',
  subjects: ['Science', 'STEM'],
  gradesSupported: [{ id: 5, label: 'Grade 5' }],
  education: 'M.S. Biology',
  experienceYears: 5,
  certifications: [{ name: 'STEM Lead', issuer: 'NYC DOE', year: 2021 }],
  joinedDate: '2019-01-12T00:00:00.000Z',
  ageGroupsComfortableWith: ['upper-elementary'],
  identityVerificationStatus: 'verified',
  curriculumTags: ['Lab reports', 'Scientific method'],
  badges: ['STEM Coach'],
  averageRating: 4.7,
  totalReviews: 72,
  featuredVideoIntroUrl: 'https://example.com/videos/priya-intro.mp4',
};

export const EDUCATOR_LEO: EducatorProfileVM = {
  kind: 'educator',
  ids: {
    orgId: ORG_ID,
    id: PROFILE_IDS.educator4,
    accountId: ACCOUNT_IDS.educator4,
  },
  profile: {
    displayName: 'Leo Martinez',
    firstName: 'Leo',
    lastName: 'Martinez',
    bio: 'Chess coach and strategy mentor.',
    avatar: {
      source: 'seed',
      seed: 'educator-leo',
      url: null,
      updatedAt: null,
    },
  },
  prefs: {
    timezone: 'America/New_York',
    locale: 'en-US',
    languagesSpoken: ['English', 'Spanish'],
    notificationDefaults: { inbox: true },
  },
  presence: presenceAway,
  status: 'active',
  location: {
    countryCode: 'US',
    countryName: 'United States',
    region: 'NY',
    city: 'Bronx',
    postalCode: '10451',
  },
  internal: {
    notesInternal: 'Loves blitz practice sessions.',
  },
  meta: {
    createdAt: '2016-10-04T00:00:00.000Z',
    updatedAt: '2026-01-21T00:00:00.000Z',
  },
  headline: 'Chess Strategy Coach',
  subjects: ['Chess'],
  gradesSupported: [
    { id: 4, label: 'Grade 4' },
    { id: 6, label: 'Grade 6' },
  ],
  education: 'B.A. Education',
  experienceYears: 9,
  certifications: [{ name: 'USCF Coach', issuer: 'US Chess', year: 2018 }],
  joinedDate: '2016-10-04T00:00:00.000Z',
  ageGroupsComfortableWith: ['elementary', 'middle-school'],
  identityVerificationStatus: 'verified',
  curriculumTags: ['Strategy', 'Openings'],
  badges: ['Chess Master'],
  averageRating: 4.9,
  totalReviews: 110,
  featuredVideoIntroUrl: 'https://example.com/videos/leo-intro.mp4',
};

export const EDUCATOR_SOFIA: EducatorProfileVM = {
  kind: 'educator',
  ids: {
    orgId: ORG_ID,
    id: PROFILE_IDS.educator5,
    accountId: ACCOUNT_IDS.educator5,
  },
  profile: {
    displayName: 'Sofia Rossi',
    firstName: 'Sofia',
    lastName: 'Rossi',
    bio: 'Learning strategist focused on executive function.',
    avatar: {
      source: 'seed',
      seed: 'educator-sofia',
      url: null,
      updatedAt: null,
    },
  },
  prefs: {
    timezone: 'Europe/Rome',
    locale: 'it-IT',
    languagesSpoken: ['Italian', 'English'],
    notificationDefaults: { inbox: true },
  },
  presence: presenceOnline,
  status: 'active',
  location: {
    countryCode: 'IT',
    countryName: 'Italy',
    region: 'RM',
    city: 'Rome',
    postalCode: '00100',
  },
  internal: {
    notesInternal: 'Evening availability for EU timezones.',
  },
  meta: {
    createdAt: '2022-05-22T00:00:00.000Z',
    updatedAt: '2026-01-21T00:00:00.000Z',
  },
  headline: 'Learning Strategist',
  subjects: ['Study Skills'],
  gradesSupported: [
    { id: 5, label: 'Grade 5' },
    { id: 6, label: 'Grade 6' },
  ],
  education: 'M.A. Educational Psychology',
  experienceYears: 4,
  certifications: [{ name: 'Learning Coach', issuer: 'IEP', year: 2022 }],
  joinedDate: '2022-05-22T00:00:00.000Z',
  ageGroupsComfortableWith: ['upper-elementary'],
  identityVerificationStatus: 'verified',
  curriculumTags: ['Executive function', 'Goal setting'],
  badges: ['New Mentor'],
  averageRating: 4.8,
  totalReviews: 34,
  featuredVideoIntroUrl: 'https://example.com/videos/sofia-intro.mp4',
};

export const STAFF_SUPPORT: StaffProfileVM = {
  kind: 'staff',
  ids: {
    orgId: ORG_ID,
    id: PROFILE_IDS.staff,
    accountId: ACCOUNT_IDS.staff,
  },
  profile: {
    displayName: 'Jordan Lee',
    firstName: 'Jordan',
    lastName: 'Lee',
    bio: 'Support specialist for families and learning spaces.',
    avatar: {
      source: 'seed',
      seed: 'staff-jordan',
      url: null,
      updatedAt: null,
    },
  },
  prefs: {
    timezone: 'America/New_York',
    locale: 'en-US',
    languagesSpoken: ['English'],
    notificationDefaults: { inbox: true },
  },
  presence: presenceOnline,
  status: 'active',
  location: {
    countryCode: 'US',
    countryName: 'United States',
    region: 'NY',
    city: 'New York',
    postalCode: '10004',
  },
  internal: {
    notesInternal: 'Handles support chat and onboarding.',
  },
  meta: {
    createdAt: '2024-02-01T00:00:00.000Z',
    updatedAt: '2026-01-21T00:00:00.000Z',
  },
  department: 'Customer Success',
  jobTitle: 'Support Specialist',
  specialties: ['Onboarding', 'Scheduling help'],
  permissionsScope: 'standard',
  workingHoursRules: ['Weekdays 9am-6pm ET'],
};

export const CHILD_PROFILES: ChildProfileVM[] = [CHILD_AVA, CHILD_MILO, CHILD_MAYA];
export const EDUCATOR_PROFILES: EducatorProfileVM[] = [
  EDUCATOR_ELENA,
  EDUCATOR_KAI,
  EDUCATOR_PRIYA,
  EDUCATOR_LEO,
  EDUCATOR_SOFIA,
];

export const USER_PROFILES: UserProfileVM[] = [
  GUARDIAN_MORGAN,
  ...CHILD_PROFILES,
  STAFF_SUPPORT,
  ...EDUCATOR_PROFILES,
];

export const PROFILES_BY_ID: Record<string, UserProfileVM> = {
  [PROFILE_IDS.guardian]: GUARDIAN_MORGAN,
  [PROFILE_IDS.childA]: CHILD_AVA,
  [PROFILE_IDS.childB]: CHILD_MILO,
  [PROFILE_IDS.childC]: CHILD_MAYA,
  [PROFILE_IDS.staff]: STAFF_SUPPORT,
  [PROFILE_IDS.educator1]: EDUCATOR_ELENA,
  [PROFILE_IDS.educator2]: EDUCATOR_KAI,
  [PROFILE_IDS.educator3]: EDUCATOR_PRIYA,
  [PROFILE_IDS.educator4]: EDUCATOR_LEO,
  [PROFILE_IDS.educator5]: EDUCATOR_SOFIA,
};

import type {
  ChildProfileVM,
  EducatorProfileVM,
  FamilyLinkVM,
  FamilyVM,
  GradeLevelOption,
  GuardianProfileVM,
  PresenceVM,
  RoleKey,
  UserAccountVM,
  UserProfileVM,
  UUID,
} from '@iconicedu/shared-types';

export const MOCK_ORG_ID = '411bd6fd-47f6-429b-ad87-d504487fd086';

export const MOCK_GUARDIAN_ID = 'f1f6a9b4-3c6d-4b7b-9f2f-6b6f0c0a1001';

export const MOCK_CHILDREN_IDS = {
  ava: '4b9a1e5b-7a1f-4c2a-9e6b-3a4c5d6e7001',
  milo: '7d1c9a54-2b6e-4c8e-9d2f-5f6a7b8c9002',
  maya: '1f2e3d4c-5b6a-7c8d-9e0f-1a2b3c4d5003',
} as const;

export const MOCK_EDUCATOR_IDS = {
  elena: '2b3c4d5e-6f70-4a1b-8c9d-0e1f2a3b4004',
  kai: '3c4d5e6f-7081-4b2c-9d0e-1f2a3b4c5005',
  priya: '4d5e6f70-8192-4c3d-0e1f-2a3b4c5d6006',
  leo: '5e6f7081-92a3-4d4e-1f2a-3b4c5d6e7007',
  sofia: '6f708192-a3b4-4e5f-2a3b-4c5d6e7f8008',
} as const;

export const MOCK_FAMILY_ID = '8e1b52f0-9e1b-4c66-9b6e-9e617ed08001';

export const MOCK_FAMILY: FamilyVM = {
  orgId: MOCK_ORG_ID,
  id: MOCK_FAMILY_ID,
  displayName: 'Morgan Family',
};

export const MOCK_FAMILY_LINKS: FamilyLinkVM[] = [
  {
    orgId: MOCK_ORG_ID,
    id: '1d79f9a9-2d42-4e74-9a7a-40b4a9092001',
    familyId: MOCK_FAMILY_ID,
    guardianAccountId: MOCK_GUARDIAN_ID,
    childAccountId: MOCK_CHILDREN_IDS.ava,
    relation: 'guardian',
    permissionsScope: ['messages', 'class-schedule', 'learning-spaces'],
  },
  {
    orgId: MOCK_ORG_ID,
    id: '1d79f9a9-2d42-4e74-9a7a-40b4a9092002',
    familyId: MOCK_FAMILY_ID,
    guardianAccountId: MOCK_GUARDIAN_ID,
    childAccountId: MOCK_CHILDREN_IDS.milo,
    relation: 'guardian',
    permissionsScope: ['messages', 'class-schedule', 'learning-spaces'],
  },
  {
    orgId: MOCK_ORG_ID,
    id: '1d79f9a9-2d42-4e74-9a7a-40b4a9092003',
    familyId: MOCK_FAMILY_ID,
    guardianAccountId: MOCK_GUARDIAN_ID,
    childAccountId: MOCK_CHILDREN_IDS.maya,
    relation: 'guardian',
    permissionsScope: ['messages', 'class-schedule', 'learning-spaces'],
  },
];

const grade3: GradeLevelOption = { id: 3, label: 'Grade 3' };
const grade5: GradeLevelOption = { id: 5, label: 'Grade 5' };
const grade6: GradeLevelOption = { id: 6, label: 'Grade 6' };

const presenceIdle: PresenceVM = {
  state: { text: 'Offline', emoji: '🌙' },
  liveStatus: 'offline',
  lastSeenAt: '2025-01-10T18:20:00.000Z',
  presenceLoaded: true,
};

const presenceOnline: PresenceVM = {
  state: { text: 'Online', emoji: '✅' },
  liveStatus: 'away',
  lastSeenAt: '2025-01-10T19:10:00.000Z',
  presenceLoaded: true,
};

const presenceBusy: PresenceVM = {
  state: { text: 'In session', emoji: '🎧' },
  liveStatus: 'busy',
  lastSeenAt: '2025-01-10T19:45:00.000Z',
  presenceLoaded: true,
};

const presenceAway: PresenceVM = {
  state: { text: 'Away', emoji: '🌿' },
  liveStatus: 'away',
  lastSeenAt: '2025-01-10T17:10:00.000Z',
  presenceLoaded: true,
};

export const MOCK_CHILDREN: ChildProfileVM[] = [
  {
    orgId: MOCK_ORG_ID,
    id: MOCK_CHILDREN_IDS.ava,
    accountId: MOCK_CHILDREN_IDS.ava,
    displayName: 'Ava Morgan',
    firstName: 'Ava',
    lastName: 'Morgan',
    bio: 'Loves puzzles and building things.',
    avatar: {
      source: 'seed',
      seed: 'child-ava',
      url: null,
      updatedAt: null,
    },
    timezone: 'America/New_York',
    locale: 'en-US',
    notificationDefaults: null,
    presence: presenceIdle,
    status: 'active',
    countryCode: 'US',
    countryName: 'United States',
    region: 'NY',
    city: 'New York',
    postalCode: '10001',
    createdAt: '2021-09-10T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    gradeLevel: grade3,
    birthYear: 2016,
    schoolName: 'Maple Grove Elementary',
    schoolYear: '2024-2025',
    color: 'bg-green-500 text-white',
    interests: ['Math games', 'Robotics'],
    strengths: ['Problem solving', 'Focus'],
    learningPreferences: ['Visual', 'Hands-on'],
    motivationStyles: ['Challenges', 'Badges'],
    confidenceLevel: 'medium',
    communicationStyle: 'chatty',
  },
  {
    orgId: MOCK_ORG_ID,
    id: MOCK_CHILDREN_IDS.milo,
    accountId: MOCK_CHILDREN_IDS.milo,
    displayName: 'Milo Morgan',
    firstName: 'Milo',
    lastName: 'Morgan',
    bio: 'Curious about science experiments.',
    avatar: {
      source: 'seed',
      seed: 'child-milo',
      url: null,
      updatedAt: null,
    },
    timezone: 'America/New_York',
    locale: 'en-US',
    notificationDefaults: null,
    presence: presenceOnline,
    status: 'active',
    countryCode: 'US',
    countryName: 'United States',
    region: 'NY',
    city: 'New York',
    postalCode: '10002',
    createdAt: '2020-08-20T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
    gradeLevel: grade5,
    birthYear: 2014,
    schoolName: 'Maple Ridge Middle School',
    schoolYear: '2024-2025',
    color: 'bg-green-500 text-white',
    interests: ['Astronomy', 'Chemistry'],
    strengths: ['Curiosity', 'Teamwork'],
    learningPreferences: ['Discussion', 'Projects'],
    motivationStyles: ['Goals', 'Feedback'],
    confidenceLevel: 'high',
    communicationStyle: 'chatty',
  },
  {
    orgId: MOCK_ORG_ID,
    id: MOCK_CHILDREN_IDS.maya,
    accountId: MOCK_CHILDREN_IDS.maya,
    displayName: 'Maya Morgan',
    firstName: 'Maya',
    lastName: 'Morgan',
    bio: 'Enjoys stories and chess puzzles.',
    avatar: {
      source: 'seed',
      seed: 'child-maya',
      url: null,
      updatedAt: null,
    },
    timezone: 'America/New_York',
    locale: 'en-US',
    notificationDefaults: null,
    presence: presenceBusy,
    status: 'active',
    countryCode: 'US',
    countryName: 'United States',
    region: 'NY',
    city: 'New York',
    postalCode: '10003',
    createdAt: '2019-08-12T00:00:00.000Z',
    updatedAt: '2025-01-03T00:00:00.000Z',
    gradeLevel: grade6,
    birthYear: 2013,
    schoolName: 'Maple Ridge Middle School',
    schoolYear: '2024-2025',
    color: 'bg-green-500 text-white',
    interests: ['Reading', 'Chess'],
    strengths: ['Creativity', 'Patience'],
    learningPreferences: ['Visual', 'Independent work'],
    motivationStyles: ['Recognition', 'Clear milestones'],
    confidenceLevel: 'medium',
    communicationStyle: 'shy',
  },
];

export const MOCK_GUARDIAN: GuardianProfileVM = {
  orgId: MOCK_ORG_ID,
  id: MOCK_GUARDIAN_ID,
  accountId: MOCK_GUARDIAN_ID,
  displayName: 'Avery Morgan',
  firstName: 'Avery',
  lastName: 'Morgan',
  bio: 'Focused on steady routines and thoughtful progress.',
  avatar: {
    source: 'upload',
    seed: 'guardian-avery',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/avatar-mike-T2UMe9BlbWWIxlq7z99cJWqwEagAuc.jpg',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  timezone: 'America/New_York',
  locale: 'en-US',
  notificationDefaults: null,
  presence: {
    state: { text: 'Wrapping up', emoji: '📞' },
    liveStatus: 'busy',
    lastSeenAt: '2025-01-10T19:40:00.000Z',
    presenceLoaded: true,
  },
  status: 'active',
  countryCode: 'US',
  countryName: 'United States',
  region: 'NY',
  city: 'New York',
  postalCode: '10004',
  createdAt: '2022-01-05T00:00:00.000Z',
  updatedAt: '2025-01-05T00:00:00.000Z',
  children: {
    items: [MOCK_CHILDREN[0], MOCK_CHILDREN[1], MOCK_CHILDREN[2]],
    total: 3,
  },
  joinedDate: '2022-01-05T00:00:00.000Z',
  notesInternal: 'Prefers weekly summaries.',
  sessionNotesVisibility: 'shared',
  leadSource: 'referral',
};

export const MOCK_EDUCATOR_1: EducatorProfileVM = {
  orgId: MOCK_ORG_ID,
  id: MOCK_EDUCATOR_IDS.elena,
  accountId: MOCK_EDUCATOR_IDS.elena,
  displayName: 'Ms. Elena Brooks',
  firstName: 'Elena',
  lastName: 'Brooks',
  bio: 'Builds confident readers and writers.',
  avatar: {
    source: 'upload',
    seed: 'educator-elena',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/avatar-sarah-Vsp1gZWstExMvD0Qce0ogsgN6nv2pC.png',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  timezone: 'America/New_York',
  locale: 'en-US',
  notificationDefaults: null,
  presence: {
    state: { text: 'Office hours', emoji: '📚' },
    liveStatus: 'busy',
    lastSeenAt: '2025-01-10T19:15:00.000Z',
    presenceLoaded: true,
  },
  status: 'active',
  countryCode: 'US',
  countryName: 'United States',
  region: 'NY',
  city: 'Brooklyn',
  postalCode: '11201',
  createdAt: '2016-08-15T00:00:00.000Z',
  updatedAt: '2025-01-02T00:00:00.000Z',
  headline: 'ELA specialist focused on joyful reading.',
  subjects: ['English Language Arts', 'Reading'],
  gradesSupported: [
    { id: 4, label: 'Grade 4' },
    { id: 5, label: 'Grade 5' },
  ],
  education: 'M.Ed., Literacy Education',
  experienceYears: 10,
  certifications: [
    { name: 'Elementary Education Certification', issuer: 'State Board', year: 2014 },
  ],
  joinedDate: '2016-08-15T00:00:00.000Z',
  notesInternal: 'Prefers parent summaries on Fridays.',
  ageGroupsComfortableWith: ['8-12'],
  identityVerificationStatus: 'verified',
  curriculumTags: ['Writing workshop', 'Phonics'],
  badges: ['Top Rated', 'Student Favorite'],
  averageRating: 4.9,
  totalReviews: 128,
  featuredVideoIntroUrl: 'https://example.com/intro-elena',
  leadSource: 'referral',
};

export const MOCK_EDUCATOR_2: EducatorProfileVM = {
  orgId: MOCK_ORG_ID,
  id: MOCK_EDUCATOR_IDS.kai,
  accountId: MOCK_EDUCATOR_IDS.kai,
  displayName: 'Mr. Kai Santos',
  firstName: 'Kai',
  lastName: 'Santos',
  bio: 'Makes math feel approachable through games.',
  avatar: {
    source: 'seed',
    seed: 'educator-kai',
    url: null,
    updatedAt: null,
  },
  timezone: 'America/New_York',
  locale: 'en-US',
  notificationDefaults: null,
  presence: {
    state: { text: 'Reviewing work', emoji: '🧮' },
    liveStatus: 'away',
    lastSeenAt: '2025-01-10T18:50:00.000Z',
    presenceLoaded: true,
  },
  status: 'active',
  countryCode: 'US',
  countryName: 'United States',
  region: 'NJ',
  city: 'Hoboken',
  postalCode: '07030',
  createdAt: '2018-02-12T00:00:00.000Z',
  updatedAt: '2025-01-02T00:00:00.000Z',
  headline: 'Math coach specializing in confidence building.',
  subjects: ['Math', 'Problem Solving'],
  gradesSupported: [
    { id: 3, label: 'Grade 3' },
    { id: 4, label: 'Grade 4' },
  ],
  education: 'B.S., Applied Mathematics',
  experienceYears: 8,
  certifications: [
    { name: 'Math Instruction Credential', issuer: 'State Board', year: 2018 },
  ],
  joinedDate: '2018-02-12T00:00:00.000Z',
  notesInternal: 'Uses short formative checks.',
  ageGroupsComfortableWith: ['7-12'],
  identityVerificationStatus: 'verified',
  curriculumTags: ['Number sense', 'Visual models'],
  badges: ['Math Mentor'],
  averageRating: 4.8,
  totalReviews: 94,
  featuredVideoIntroUrl: 'https://example.com/intro-kai',
  leadSource: 'website',
};

export const MOCK_EDUCATOR_3: EducatorProfileVM = {
  orgId: MOCK_ORG_ID,
  id: MOCK_EDUCATOR_IDS.priya,
  accountId: MOCK_EDUCATOR_IDS.priya,
  displayName: 'Dr. Priya Nair',
  firstName: 'Priya',
  lastName: 'Nair',
  bio: 'Science educator who loves experiments.',
  avatar: {
    source: 'seed',
    seed: 'educator-priya',
    url: null,
    updatedAt: null,
  },
  timezone: 'America/New_York',
  locale: 'en-US',
  notificationDefaults: null,
  presence: {
    state: { text: 'Lab prep', emoji: '🔬' },
    liveStatus: 'busy',
    lastSeenAt: '2025-01-10T18:30:00.000Z',
    presenceLoaded: true,
  },
  status: 'active',
  countryCode: 'US',
  countryName: 'United States',
  region: 'NY',
  city: 'Queens',
  postalCode: '11101',
  createdAt: '2015-09-01T00:00:00.000Z',
  updatedAt: '2025-01-02T00:00:00.000Z',
  headline: 'Inquiry-driven science lessons.',
  subjects: ['Science', 'STEM'],
  gradesSupported: [
    { id: 5, label: 'Grade 5' },
    { id: 6, label: 'Grade 6' },
  ],
  education: 'Ph.D., Biology',
  experienceYears: 12,
  certifications: [{ name: 'STEM Specialist', issuer: 'State Board', year: 2013 }],
  joinedDate: '2015-09-01T00:00:00.000Z',
  notesInternal: 'Likes to send experiment recaps.',
  ageGroupsComfortableWith: ['9-13'],
  identityVerificationStatus: 'verified',
  curriculumTags: ['Lab safety', 'Scientific method'],
  badges: ['Science Star'],
  averageRating: 4.9,
  totalReviews: 142,
  featuredVideoIntroUrl: 'https://example.com/intro-priya',
  leadSource: 'conference',
};

export const MOCK_EDUCATOR_4: EducatorProfileVM = {
  orgId: MOCK_ORG_ID,
  id: MOCK_EDUCATOR_IDS.leo,
  accountId: MOCK_EDUCATOR_IDS.leo,
  displayName: 'Coach Leo Kim',
  firstName: 'Leo',
  lastName: 'Kim',
  bio: 'Chess coach focused on strategy and calm focus.',
  avatar: {
    source: 'seed',
    seed: 'educator-leo',
    url: null,
    updatedAt: null,
  },
  timezone: 'America/New_York',
  locale: 'en-US',
  notificationDefaults: null,
  presence: {
    state: { text: 'Reviewing games', emoji: '♟️' },
    liveStatus: 'busy',
    lastSeenAt: '2025-01-10T17:45:00.000Z',
    presenceLoaded: true,
  },
  status: 'active',
  countryCode: 'US',
  countryName: 'United States',
  region: 'NY',
  city: 'Staten Island',
  postalCode: '10301',
  createdAt: '2019-01-10T00:00:00.000Z',
  updatedAt: '2025-01-02T00:00:00.000Z',
  headline: 'Practical strategy for young players.',
  subjects: ['Chess', 'Logic'],
  gradesSupported: [
    { id: 3, label: 'Grade 3' },
    { id: 6, label: 'Grade 6' },
  ],
  education: 'USCF Certified Instructor',
  experienceYears: 6,
  certifications: [{ name: 'Chess Coach Level 1', issuer: 'USCF', year: 2019 }],
  joinedDate: '2019-01-10T00:00:00.000Z',
  notesInternal: 'Uses annotated game review videos.',
  ageGroupsComfortableWith: ['7-13'],
  identityVerificationStatus: 'pending',
  curriculumTags: ['Openings', 'Tactics'],
  badges: ['Top Coach'],
  averageRating: 4.7,
  totalReviews: 76,
  featuredVideoIntroUrl: 'https://example.com/intro-leo',
  leadSource: 'community',
};

export const MOCK_EDUCATOR_5: EducatorProfileVM = {
  orgId: MOCK_ORG_ID,
  id: MOCK_EDUCATOR_IDS.sofia,
  accountId: MOCK_EDUCATOR_IDS.sofia,
  displayName: 'Ms. Sofia Alvarez',
  firstName: 'Sofia',
  lastName: 'Alvarez',
  bio: 'Specialist in executive function skills.',
  avatar: {
    source: 'seed',
    seed: 'educator-sofia',
    url: null,
    updatedAt: null,
  },
  timezone: 'America/New_York',
  locale: 'en-US',
  notificationDefaults: null,
  presence: presenceAway,
  status: 'active',
  countryCode: 'US',
  countryName: 'United States',
  region: 'NY',
  city: 'Manhattan',
  postalCode: '10010',
  createdAt: '2017-06-05T00:00:00.000Z',
  updatedAt: '2025-01-02T00:00:00.000Z',
  headline: 'Study skills and organization coaching.',
  subjects: ['Study Skills', 'Organization'],
  gradesSupported: [
    { id: 5, label: 'Grade 5' },
    { id: 6, label: 'Grade 6' },
  ],
  education: 'M.A., Education',
  experienceYears: 9,
  certifications: [{ name: 'Executive Function Coach', issuer: 'COA', year: 2017 }],
  joinedDate: '2017-06-05T00:00:00.000Z',
  notesInternal: 'Shares planning checklists.',
  ageGroupsComfortableWith: ['9-14'],
  identityVerificationStatus: 'verified',
  curriculumTags: ['Habits', 'Planning'],
  badges: ['Organization Pro'],
  averageRating: 4.8,
  totalReviews: 110,
  featuredVideoIntroUrl: 'https://example.com/intro-sofia',
  leadSource: 'newsletter',
};

export const MOCK_EDUCATORS: EducatorProfileVM[] = [
  MOCK_EDUCATOR_1,
  MOCK_EDUCATOR_2,
  MOCK_EDUCATOR_3,
  MOCK_EDUCATOR_4,
  MOCK_EDUCATOR_5,
];

const toRoleLabel = (roleKey: RoleKey | undefined) => {
  if (!roleKey) return undefined;
  return roleKey.charAt(0).toUpperCase() + roleKey.slice(1);
};

export const toProfileUser = (
  profile: EducatorProfileVM | GuardianProfileVM,
  account?: UserAccountVM,
): UserProfileVM & {
  role?: string;
  email?: string | null;
  phone?: string | null;
  joinedDate?: string;
  headline?: string | null;
  bio?: string | null;
  subjects?: string[] | null;
  gradesSupported?: GradeLevelOption[] | null;
  experienceYears?: number | null;
  certifications?: Array<{
    name: string;
    issuer?: string;
    year?: number;
  }> | null;
  childrenNames?: string[];
} => ({
  ...profile,
  role: toRoleLabel(account?.userRoles?.[0]?.roleKey),
  email: account?.contacts.email ?? null,
  phone: account?.contacts.phoneE164 ?? null,
  joinedDate: profile.joinedDate,
  headline: 'headline' in profile ? (profile.headline ?? null) : null,
  bio: 'bio' in profile ? (profile.bio ?? null) : null,
  subjects: 'subjects' in profile ? (profile.subjects ?? null) : null,
  gradesSupported:
    'gradesSupported' in profile ? (profile.gradesSupported ?? null) : null,
  experienceYears:
    'experienceYears' in profile ? (profile.experienceYears ?? null) : null,
  certifications: 'certifications' in profile ? (profile.certifications ?? null) : null,
  childrenNames:
    'children' in profile && profile.children?.items?.length
      ? [
          profile.children.items[0]?.displayName ?? '',
          profile.children.items[1]?.displayName ?? '',
          profile.children.items[2]?.displayName ?? '',
        ].filter(Boolean)
      : undefined,
});

export const MOCK_USER_ACCOUNTS: UserAccountVM[] = [
  {
    orgId: MOCK_ORG_ID,
    id: MOCK_GUARDIAN_ID,
    contacts: {
      email: 'avery.morgan@email.com',
      phoneE164: '+15551234567',
      emailVerified: true,
      phoneVerified: true,
      verifiedAt: '2022-01-06T00:00:00.000Z',
      preferredContactChannels: ['email', 'sms'],
    },
    status: 'active',
    createdAt: '2022-01-05T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
    userRoles: [
      {
        orgId: MOCK_ORG_ID,
        id: 'b6ac5d18-0a79-4dc8-8b6b-82b2718a3101',
        roleKey: 'guardian',
        assignedAt: '2022-01-05T00:00:00.000Z',
        assignedBy: MOCK_EDUCATOR_IDS.elena,
      },
    ],
    activeContext: { roleKey: 'guardian', familyLink: MOCK_FAMILY_LINKS[0] },
  },
  {
    orgId: MOCK_ORG_ID,
    id: MOCK_CHILDREN_IDS.ava,
    contacts: {},
    status: 'active',
    createdAt: '2021-09-10T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    userRoles: [
      {
        orgId: MOCK_ORG_ID,
        id: 'b6ac5d18-0a79-4dc8-8b6b-82b2718a3102',
        roleKey: 'child',
        assignedAt: '2021-09-10T00:00:00.000Z',
        assignedBy: MOCK_GUARDIAN_ID,
      },
    ],
    activeContext: { roleKey: 'child', familyLink: MOCK_FAMILY_LINKS[0] },
  },
  {
    orgId: MOCK_ORG_ID,
    id: MOCK_CHILDREN_IDS.milo,
    contacts: {},
    status: 'active',
    createdAt: '2020-08-20T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
    userRoles: [
      {
        orgId: MOCK_ORG_ID,
        id: 'b6ac5d18-0a79-4dc8-8b6b-82b2718a3103',
        roleKey: 'child',
        assignedAt: '2020-08-20T00:00:00.000Z',
        assignedBy: MOCK_GUARDIAN_ID,
      },
    ],
    activeContext: { roleKey: 'child', familyLink: MOCK_FAMILY_LINKS[1] },
  },
  {
    orgId: MOCK_ORG_ID,
    id: MOCK_CHILDREN_IDS.maya,
    contacts: {},
    status: 'active',
    createdAt: '2019-08-12T00:00:00.000Z',
    updatedAt: '2025-01-03T00:00:00.000Z',
    userRoles: [
      {
        orgId: MOCK_ORG_ID,
        id: 'b6ac5d18-0a79-4dc8-8b6b-82b2718a3104',
        roleKey: 'child',
        assignedAt: '2019-08-12T00:00:00.000Z',
        assignedBy: MOCK_GUARDIAN_ID,
      },
    ],
    activeContext: { roleKey: 'child', familyLink: MOCK_FAMILY_LINKS[2] },
  },
  {
    orgId: MOCK_ORG_ID,
    id: MOCK_EDUCATOR_IDS.elena,
    contacts: {
      email: 'elena.brooks@iconicedu.com',
      phoneE164: '+1555010001',
      emailVerified: true,
      phoneVerified: true,
      verifiedAt: '2016-08-20T00:00:00.000Z',
      preferredContactChannels: ['email'],
    },
    status: 'active',
    createdAt: '2016-08-15T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
    userRoles: [
      {
        orgId: MOCK_ORG_ID,
        id: 'b6ac5d18-0a79-4dc8-8b6b-82b2718a3105',
        roleKey: 'educator',
        assignedAt: '2016-08-15T00:00:00.000Z',
      },
    ],
    activeContext: { roleKey: 'educator' },
  },
  {
    orgId: MOCK_ORG_ID,
    id: MOCK_EDUCATOR_IDS.kai,
    contacts: {
      email: 'kai.santos@iconicedu.com',
      phoneE164: '+1555010002',
      emailVerified: true,
      phoneVerified: true,
      verifiedAt: '2018-02-12T00:00:00.000Z',
      preferredContactChannels: ['email', 'sms'],
    },
    status: 'active',
    createdAt: '2018-02-12T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
    userRoles: [
      {
        orgId: MOCK_ORG_ID,
        id: 'b6ac5d18-0a79-4dc8-8b6b-82b2718a3106',
        roleKey: 'educator',
        assignedAt: '2018-02-12T00:00:00.000Z',
      },
    ],
    activeContext: { roleKey: 'educator' },
  },
  {
    orgId: MOCK_ORG_ID,
    id: MOCK_EDUCATOR_IDS.priya,
    contacts: {
      email: 'priya.nair@iconicedu.com',
      phoneE164: '+1555010003',
      emailVerified: true,
      phoneVerified: true,
      verifiedAt: '2015-09-01T00:00:00.000Z',
      preferredContactChannels: ['email'],
    },
    status: 'active',
    createdAt: '2015-09-01T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
    userRoles: [
      {
        orgId: MOCK_ORG_ID,
        id: 'b6ac5d18-0a79-4dc8-8b6b-82b2718a3107',
        roleKey: 'educator',
        assignedAt: '2015-09-01T00:00:00.000Z',
      },
    ],
    activeContext: { roleKey: 'educator' },
  },
  {
    orgId: MOCK_ORG_ID,
    id: MOCK_EDUCATOR_IDS.leo,
    contacts: {
      email: 'leo.kim@iconicedu.com',
      phoneE164: '+1555010004',
      emailVerified: true,
      phoneVerified: true,
      verifiedAt: '2019-01-10T00:00:00.000Z',
      preferredContactChannels: ['email', 'sms'],
    },
    status: 'active',
    createdAt: '2019-01-10T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
    userRoles: [
      {
        orgId: MOCK_ORG_ID,
        id: 'b6ac5d18-0a79-4dc8-8b6b-82b2718a3108',
        roleKey: 'educator',
        assignedAt: '2019-01-10T00:00:00.000Z',
      },
    ],
    activeContext: { roleKey: 'educator' },
  },
  {
    orgId: MOCK_ORG_ID,
    id: MOCK_EDUCATOR_IDS.sofia,
    contacts: {
      email: 'sofia.alvarez@iconicedu.com',
      phoneE164: '+1555010005',
      emailVerified: true,
      phoneVerified: true,
      verifiedAt: '2017-06-05T00:00:00.000Z',
      preferredContactChannels: ['email'],
    },
    status: 'active',
    createdAt: '2017-06-05T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
    userRoles: [
      {
        orgId: MOCK_ORG_ID,
        id: 'b6ac5d18-0a79-4dc8-8b6b-82b2718a3109',
        roleKey: 'educator',
        assignedAt: '2017-06-05T00:00:00.000Z',
      },
    ],
    activeContext: { roleKey: 'educator' },
  },
];

export const getMockUserAccountById = (accountId: UUID) =>
  MOCK_USER_ACCOUNTS.find((account) => account.id === accountId);

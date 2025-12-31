import type {
  ChildProfileVM,
  EducatorProfileVM,
  FamilyLinkVM,
  FamilyVM,
  GradeLevelOption,
  GuardianProfileVM,
  PresenceVM,
  UserAccountVM,
  UserProfileVM,
} from '@iconicedu/shared-types';

export const MOCK_ORG_ID = '4b42a874-ec51-4a54-aeda-28101b99441c';

export const MOCK_GUARDIAN_ID = '70614329-205e-43e2-bc17-ed303e827360';

export const MOCK_CHILDREN_IDS = {
  ava: 'd7435636-4fb5-46b2-8630-f6a7f2b8501c',
  milo: '84a00444-8262-4699-9a0e-b53b3105fd2d',
  maya: '265b19f6-e323-4115-8fbd-abff9446db8b',
} as const;

export const MOCK_EDUCATOR_IDS = {
  elena: '573bd37e-66ae-4b34-b0fe-bb0b2f7310ef',
  kai: 'e7f4e7f6-0387-4e66-8c64-1e68bcddd2f1',
  priya: 'b0269aaf-9dbb-4a91-81f9-e39c362a9f09',
  leo: 'a68522cb-ce0f-4b31-af52-66911fde9f1e',
  sofia: '55996d5f-fd1a-4523-bdff-f3c4253bf4c6',
} as const;

export const MOCK_FAMILY_ID = '8a83b476-c373-4110-b156-f039bac0d37d';

export const MOCK_FAMILY: FamilyVM = {
  orgId: MOCK_ORG_ID,
  id: MOCK_FAMILY_ID,
  displayName: 'Morgan Family',
};

export const MOCK_FAMILY_LINKS: FamilyLinkVM[] = [
  {
    orgId: MOCK_ORG_ID,
    id: 'faff4a21-4f26-4474-9cb7-ca1bb1d6b439',
    familyId: MOCK_FAMILY_ID,
    guardianAccountId: MOCK_GUARDIAN_ID,
    childAccountId: MOCK_CHILDREN_IDS.ava,
    relation: 'guardian',
    permissionsScope: ['messages', 'class-schedule', 'learning-spaces'],
  },
  {
    orgId: MOCK_ORG_ID,
    id: '2d0cf15d-3381-44e7-af30-b1a89b89f225',
    familyId: MOCK_FAMILY_ID,
    guardianAccountId: MOCK_GUARDIAN_ID,
    childAccountId: MOCK_CHILDREN_IDS.milo,
    relation: 'guardian',
    permissionsScope: ['messages', 'class-schedule', 'learning-spaces'],
  },
  {
    orgId: MOCK_ORG_ID,
    id: '6cb15d1f-76c2-4b8a-85db-8ef83a667e4f',
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
    kind: 'child',
    ids: {
      orgId: MOCK_ORG_ID,
      id: MOCK_CHILDREN_IDS.ava,
      accountId: MOCK_CHILDREN_IDS.ava,
    },
    profile: {
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
    },
    prefs: {
      timezone: 'America/New_York',
      locale: 'en-US',
      languagesSpoken: ['English'],
      notificationDefaults: null,
    },
    presence: presenceIdle,
    status: 'active',
    location: {
      countryCode: 'US',
      countryName: 'United States',
      region: 'NY',
      city: 'New York',
      postalCode: '10001',
    },
    internal: {
      notesInternal: 'Responds well to visual cues.',
    },
    meta: {
      createdAt: '2021-09-10T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    },
    ui: {
      color: 'bg-green-500 text-white',
    },
    gradeLevel: grade3,
    birthYear: 2016,
    schoolName: 'Maple Grove Elementary',
    schoolYear: '2024-2025',
    interests: ['Math games', 'Robotics'],
    strengths: ['Problem solving', 'Focus'],
    learningPreferences: ['Visual', 'Hands-on'],
    motivationStyles: ['Challenges', 'Badges'],
    confidenceLevel: 'medium',
    communicationStyle: 'chatty',
  },
  {
    kind: 'child',
    ids: {
      orgId: MOCK_ORG_ID,
      id: MOCK_CHILDREN_IDS.milo,
      accountId: MOCK_CHILDREN_IDS.milo,
    },
    profile: {
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
    },
    prefs: {
      timezone: 'America/New_York',
      locale: 'en-US',
      languagesSpoken: ['English'],
      notificationDefaults: null,
    },
    presence: presenceOnline,
    status: 'active',
    location: {
      countryCode: 'US',
      countryName: 'United States',
      region: 'NY',
      city: 'New York',
      postalCode: '10002',
    },
    internal: {
      notesInternal: 'Likes group projects.',
    },
    meta: {
      createdAt: '2020-08-20T00:00:00.000Z',
      updatedAt: '2025-01-02T00:00:00.000Z',
    },
    ui: {
      color: 'bg-green-500 text-white',
    },
    gradeLevel: grade5,
    birthYear: 2014,
    schoolName: 'Maple Ridge Middle School',
    schoolYear: '2024-2025',
    interests: ['Astronomy', 'Chemistry'],
    strengths: ['Curiosity', 'Teamwork'],
    learningPreferences: ['Discussion', 'Projects'],
    motivationStyles: ['Goals', 'Feedback'],
    confidenceLevel: 'high',
    communicationStyle: 'chatty',
  },
  {
    kind: 'child',
    ids: {
      orgId: MOCK_ORG_ID,
      id: MOCK_CHILDREN_IDS.maya,
      accountId: MOCK_CHILDREN_IDS.maya,
    },
    profile: {
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
    },
    prefs: {
      timezone: 'America/New_York',
      locale: 'en-US',
      languagesSpoken: ['English'],
      notificationDefaults: null,
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
      notesInternal: 'Prefers quiet workspaces.',
    },
    meta: {
      createdAt: '2019-08-12T00:00:00.000Z',
      updatedAt: '2025-01-03T00:00:00.000Z',
    },
    ui: {
      color: 'bg-green-500 text-white',
    },
    gradeLevel: grade6,
    birthYear: 2013,
    schoolName: 'Maple Ridge Middle School',
    schoolYear: '2024-2025',
    interests: ['Reading', 'Chess'],
    strengths: ['Creativity', 'Patience'],
    learningPreferences: ['Visual', 'Independent work'],
    motivationStyles: ['Recognition', 'Clear milestones'],
    confidenceLevel: 'medium',
    communicationStyle: 'shy',
  },
];

export const MOCK_GUARDIAN: GuardianProfileVM = {
  kind: 'guardian',
  ids: {
    orgId: MOCK_ORG_ID,
    id: MOCK_GUARDIAN_ID,
    accountId: MOCK_GUARDIAN_ID,
  },
  profile: {
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
  },
  prefs: {
    timezone: 'America/New_York',
    locale: 'en-US',
    languagesSpoken: ['English'],
    notificationDefaults: null,
  },
  presence: {
    state: { text: 'Wrapping up', emoji: '📞' },
    liveStatus: 'busy',
    lastSeenAt: '2025-01-10T19:40:00.000Z',
    presenceLoaded: true,
  },
  status: 'active',
  location: {
    countryCode: 'US',
    countryName: 'United States',
    region: 'NY',
    city: 'New York',
    postalCode: '10004',
  },
  internal: {
    notesInternal: 'Prefers weekly summaries.',
    leadSource: 'referral',
  },
  meta: {
    createdAt: '2022-01-05T00:00:00.000Z',
    updatedAt: '2025-01-05T00:00:00.000Z',
  },
  children: {
    items: [MOCK_CHILDREN[0], MOCK_CHILDREN[1], MOCK_CHILDREN[2]],
    total: 3,
  },
  joinedDate: '2022-01-05T00:00:00.000Z',
  sessionNotesVisibility: 'shared',
};

export const MOCK_EDUCATOR_1: EducatorProfileVM = {
  kind: 'educator',
  ids: {
    orgId: MOCK_ORG_ID,
    id: MOCK_EDUCATOR_IDS.elena,
    accountId: MOCK_EDUCATOR_IDS.elena,
  },
  profile: {
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
  },
  prefs: {
    timezone: 'America/New_York',
    locale: 'en-US',
    languagesSpoken: ['English', 'Spanish'],
    notificationDefaults: null,
  },
  presence: {
    state: { text: 'Office hours', emoji: '📚' },
    liveStatus: 'busy',
    lastSeenAt: '2025-01-10T19:15:00.000Z',
    presenceLoaded: true,
  },
  status: 'active',
  location: {
    countryCode: 'US',
    countryName: 'United States',
    region: 'NY',
    city: 'Brooklyn',
    postalCode: '11201',
  },
  internal: {
    notesInternal: 'Prefers parent summaries on Fridays.',
    leadSource: 'referral',
  },
  meta: {
    createdAt: '2016-08-15T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
  },
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
  ageGroupsComfortableWith: ['8-12'],
  identityVerificationStatus: 'verified',
  curriculumTags: ['Writing workshop', 'Phonics'],
  badges: ['Top Rated', 'Student Favorite'],
  averageRating: 4.9,
  totalReviews: 128,
  featuredVideoIntroUrl: 'https://example.com/intro-elena',
};

export const MOCK_EDUCATOR_2: EducatorProfileVM = {
  kind: 'educator',
  ids: {
    orgId: MOCK_ORG_ID,
    id: MOCK_EDUCATOR_IDS.kai,
    accountId: MOCK_EDUCATOR_IDS.kai,
  },
  profile: {
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
  },
  prefs: {
    timezone: 'America/New_York',
    locale: 'en-US',
    languagesSpoken: ['English', 'Portuguese'],
    notificationDefaults: null,
  },
  presence: {
    state: { text: 'Reviewing work', emoji: '🧮' },
    liveStatus: 'away',
    lastSeenAt: '2025-01-10T18:50:00.000Z',
    presenceLoaded: true,
  },
  status: 'active',
  location: {
    countryCode: 'US',
    countryName: 'United States',
    region: 'NJ',
    city: 'Hoboken',
    postalCode: '07030',
  },
  internal: {
    notesInternal: 'Uses short formative checks.',
    leadSource: 'website',
  },
  meta: {
    createdAt: '2018-02-12T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
  },
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
  ageGroupsComfortableWith: ['7-12'],
  identityVerificationStatus: 'verified',
  curriculumTags: ['Number sense', 'Visual models'],
  badges: ['Math Mentor'],
  averageRating: 4.8,
  totalReviews: 94,
  featuredVideoIntroUrl: 'https://example.com/intro-kai',
};

export const MOCK_EDUCATOR_3: EducatorProfileVM = {
  kind: 'educator',
  ids: {
    orgId: MOCK_ORG_ID,
    id: MOCK_EDUCATOR_IDS.priya,
    accountId: MOCK_EDUCATOR_IDS.priya,
  },
  profile: {
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
  },
  prefs: {
    timezone: 'America/New_York',
    locale: 'en-US',
    languagesSpoken: ['English', 'Hindi'],
    notificationDefaults: null,
  },
  presence: {
    state: { text: 'Lab prep', emoji: '🔬' },
    liveStatus: 'busy',
    lastSeenAt: '2025-01-10T18:30:00.000Z',
    presenceLoaded: true,
  },
  status: 'active',
  location: {
    countryCode: 'US',
    countryName: 'United States',
    region: 'NY',
    city: 'Queens',
    postalCode: '11101',
  },
  internal: {
    notesInternal: 'Likes to send experiment recaps.',
    leadSource: 'conference',
  },
  meta: {
    createdAt: '2015-09-01T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
  },
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
  ageGroupsComfortableWith: ['9-13'],
  identityVerificationStatus: 'verified',
  curriculumTags: ['Lab safety', 'Scientific method'],
  badges: ['Science Star'],
  averageRating: 4.9,
  totalReviews: 142,
  featuredVideoIntroUrl: 'https://example.com/intro-priya',
};

export const MOCK_EDUCATOR_4: EducatorProfileVM = {
  kind: 'educator',
  ids: {
    orgId: MOCK_ORG_ID,
    id: MOCK_EDUCATOR_IDS.leo,
    accountId: MOCK_EDUCATOR_IDS.leo,
  },
  profile: {
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
  },
  prefs: {
    timezone: 'America/New_York',
    locale: 'en-US',
    languagesSpoken: ['English'],
    notificationDefaults: null,
  },
  presence: {
    state: { text: 'Reviewing games', emoji: '♟️' },
    liveStatus: 'busy',
    lastSeenAt: '2025-01-10T17:45:00.000Z',
    presenceLoaded: true,
  },
  status: 'active',
  location: {
    countryCode: 'US',
    countryName: 'United States',
    region: 'NY',
    city: 'Staten Island',
    postalCode: '10301',
  },
  internal: {
    notesInternal: 'Uses annotated game review videos.',
    leadSource: 'community',
  },
  meta: {
    createdAt: '2019-01-10T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
  },
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
  ageGroupsComfortableWith: ['7-13'],
  identityVerificationStatus: 'pending',
  curriculumTags: ['Openings', 'Tactics'],
  badges: ['Top Coach'],
  averageRating: 4.7,
  totalReviews: 76,
  featuredVideoIntroUrl: 'https://example.com/intro-leo',
};

export const MOCK_EDUCATOR_5: EducatorProfileVM = {
  kind: 'educator',
  ids: {
    orgId: MOCK_ORG_ID,
    id: MOCK_EDUCATOR_IDS.sofia,
    accountId: MOCK_EDUCATOR_IDS.sofia,
  },
  profile: {
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
  },
  prefs: {
    timezone: 'America/New_York',
    locale: 'en-US',
    languagesSpoken: ['English', 'Spanish'],
    notificationDefaults: null,
  },
  presence: presenceAway,
  status: 'active',
  location: {
    countryCode: 'US',
    countryName: 'United States',
    region: 'NY',
    city: 'Manhattan',
    postalCode: '10010',
  },
  internal: {
    notesInternal: 'Shares planning checklists.',
    leadSource: 'newsletter',
  },
  meta: {
    createdAt: '2017-06-05T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
  },
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
  ageGroupsComfortableWith: ['9-14'],
  identityVerificationStatus: 'verified',
  curriculumTags: ['Habits', 'Planning'],
  badges: ['Organization Pro'],
  averageRating: 4.8,
  totalReviews: 110,
  featuredVideoIntroUrl: 'https://example.com/intro-sofia',
};

export const MOCK_EDUCATORS: EducatorProfileVM[] = [
  MOCK_EDUCATOR_1,
  MOCK_EDUCATOR_2,
  MOCK_EDUCATOR_3,
  MOCK_EDUCATOR_4,
  MOCK_EDUCATOR_5,
];

export const MOCK_USER_ACCOUNTS: UserAccountVM[] = [
  {
    ids: {
      orgId: MOCK_ORG_ID,
      id: MOCK_GUARDIAN_ID,
    },
    contacts: {
      email: 'avery.morgan@email.com',
      phoneE164: '+15551234567',
      emailVerified: true,
      phoneVerified: true,
      verifiedAt: '2022-01-06T00:00:00.000Z',
      preferredContactChannels: ['email', 'sms'],
    },
    access: {
      userRoles: [
        {
          ids: {
            orgId: MOCK_ORG_ID,
            id: 'b250990f-0a59-4409-bea8-f29b9c0609f7',
          },
          roleKey: 'guardian',
          audit: {
            assignedAt: '2022-01-05T00:00:00.000Z',
            assignedBy: MOCK_EDUCATOR_IDS.elena,
          },
        },
      ],
      activeContext: { roleKey: 'guardian', familyLink: MOCK_FAMILY_LINKS[0] },
    },
    lifecycle: {
      status: 'active',
      createdAt: '2022-01-05T00:00:00.000Z',
      updatedAt: '2025-01-02T00:00:00.000Z',
    },
  },
  {
    ids: {
      orgId: MOCK_ORG_ID,
      id: MOCK_CHILDREN_IDS.ava,
    },
    contacts: {},
    access: {
      userRoles: [
        {
          ids: {
            orgId: MOCK_ORG_ID,
            id: 'c31fa005-f8ed-4e30-b653-ed030bf4a33b',
          },
          roleKey: 'child',
          audit: {
            assignedAt: '2021-09-10T00:00:00.000Z',
            assignedBy: MOCK_GUARDIAN_ID,
          },
        },
      ],
      activeContext: { roleKey: 'child', familyLink: MOCK_FAMILY_LINKS[0] },
    },
    lifecycle: {
      status: 'active',
      createdAt: '2021-09-10T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    },
  },
  {
    ids: {
      orgId: MOCK_ORG_ID,
      id: MOCK_CHILDREN_IDS.milo,
    },
    contacts: {},
    access: {
      userRoles: [
        {
          ids: {
            orgId: MOCK_ORG_ID,
            id: 'c1a2b670-6bff-4e79-8b7f-570f42d39b51',
          },
          roleKey: 'child',
          audit: {
            assignedAt: '2020-08-20T00:00:00.000Z',
            assignedBy: MOCK_GUARDIAN_ID,
          },
        },
      ],
      activeContext: { roleKey: 'child', familyLink: MOCK_FAMILY_LINKS[1] },
    },
    lifecycle: {
      status: 'active',
      createdAt: '2020-08-20T00:00:00.000Z',
      updatedAt: '2025-01-02T00:00:00.000Z',
    },
  },
  {
    ids: {
      orgId: MOCK_ORG_ID,
      id: MOCK_CHILDREN_IDS.maya,
    },
    contacts: {},
    access: {
      userRoles: [
        {
          ids: {
            orgId: MOCK_ORG_ID,
            id: '567eabe4-5ac6-4b5e-a4fd-f385ac8c2745',
          },
          roleKey: 'child',
          audit: {
            assignedAt: '2019-08-12T00:00:00.000Z',
            assignedBy: MOCK_GUARDIAN_ID,
          },
        },
      ],
      activeContext: { roleKey: 'child', familyLink: MOCK_FAMILY_LINKS[2] },
    },
    lifecycle: {
      status: 'active',
      createdAt: '2019-08-12T00:00:00.000Z',
      updatedAt: '2025-01-03T00:00:00.000Z',
    },
  },
  {
    ids: {
      orgId: MOCK_ORG_ID,
      id: MOCK_EDUCATOR_IDS.elena,
    },
    contacts: {
      email: 'elena.brooks@iconicedu.com',
      phoneE164: '+1555010001',
      emailVerified: true,
      phoneVerified: true,
      verifiedAt: '2016-08-20T00:00:00.000Z',
      preferredContactChannels: ['email'],
    },
    access: {
      userRoles: [
        {
          ids: {
            orgId: MOCK_ORG_ID,
            id: '0dbfc9ef-c58e-4aef-883f-fa194bca6e40',
          },
          roleKey: 'educator',
          audit: {
            assignedAt: '2016-08-15T00:00:00.000Z',
          },
        },
      ],
      activeContext: { roleKey: 'educator' },
    },
    lifecycle: {
      status: 'active',
      createdAt: '2016-08-15T00:00:00.000Z',
      updatedAt: '2025-01-02T00:00:00.000Z',
    },
  },
  {
    ids: {
      orgId: MOCK_ORG_ID,
      id: MOCK_EDUCATOR_IDS.kai,
    },
    contacts: {
      email: 'kai.santos@iconicedu.com',
      phoneE164: '+1555010002',
      emailVerified: true,
      phoneVerified: true,
      verifiedAt: '2018-02-12T00:00:00.000Z',
      preferredContactChannels: ['email', 'sms'],
    },
    access: {
      userRoles: [
        {
          ids: {
            orgId: MOCK_ORG_ID,
            id: '53149bab-7ed7-4c81-ab4c-4e0cb3393180',
          },
          roleKey: 'educator',
          audit: {
            assignedAt: '2018-02-12T00:00:00.000Z',
          },
        },
      ],
      activeContext: { roleKey: 'educator' },
    },
    lifecycle: {
      status: 'active',
      createdAt: '2018-02-12T00:00:00.000Z',
      updatedAt: '2025-01-02T00:00:00.000Z',
    },
  },
  {
    ids: {
      orgId: MOCK_ORG_ID,
      id: MOCK_EDUCATOR_IDS.priya,
    },
    contacts: {
      email: 'priya.nair@iconicedu.com',
      phoneE164: '+1555010003',
      emailVerified: true,
      phoneVerified: true,
      verifiedAt: '2015-09-01T00:00:00.000Z',
      preferredContactChannels: ['email'],
    },
    access: {
      userRoles: [
        {
          ids: {
            orgId: MOCK_ORG_ID,
            id: 'c1e49f64-71a6-419d-b931-1a4de4a04ce1',
          },
          roleKey: 'educator',
          audit: {
            assignedAt: '2015-09-01T00:00:00.000Z',
          },
        },
      ],
      activeContext: { roleKey: 'educator' },
    },
    lifecycle: {
      status: 'active',
      createdAt: '2015-09-01T00:00:00.000Z',
      updatedAt: '2025-01-02T00:00:00.000Z',
    },
  },
  {
    ids: {
      orgId: MOCK_ORG_ID,
      id: MOCK_EDUCATOR_IDS.leo,
    },
    contacts: {
      email: 'leo.kim@iconicedu.com',
      phoneE164: '+1555010004',
      emailVerified: true,
      phoneVerified: true,
      verifiedAt: '2019-01-10T00:00:00.000Z',
      preferredContactChannels: ['email', 'sms'],
    },
    access: {
      userRoles: [
        {
          ids: {
            orgId: MOCK_ORG_ID,
            id: '0182fdac-5df8-40dd-b4eb-ffa7677dd71e',
          },
          roleKey: 'educator',
          audit: {
            assignedAt: '2019-01-10T00:00:00.000Z',
          },
        },
      ],
      activeContext: { roleKey: 'educator' },
    },
    lifecycle: {
      status: 'active',
      createdAt: '2019-01-10T00:00:00.000Z',
      updatedAt: '2025-01-02T00:00:00.000Z',
    },
  },
  {
    ids: {
      orgId: MOCK_ORG_ID,
      id: MOCK_EDUCATOR_IDS.sofia,
    },
    contacts: {
      email: 'sofia.alvarez@iconicedu.com',
      phoneE164: '+1555010005',
      emailVerified: true,
      phoneVerified: true,
      verifiedAt: '2017-06-05T00:00:00.000Z',
      preferredContactChannels: ['email'],
    },
    access: {
      userRoles: [
        {
          ids: {
            orgId: MOCK_ORG_ID,
            id: '31bf437b-a620-4038-8b1c-2753fc83af2f',
          },
          roleKey: 'educator',
          audit: {
            assignedAt: '2017-06-05T00:00:00.000Z',
          },
        },
      ],
      activeContext: { roleKey: 'educator' },
    },
    lifecycle: {
      status: 'active',
      createdAt: '2017-06-05T00:00:00.000Z',
      updatedAt: '2025-01-02T00:00:00.000Z',
    },
  },
];

export const MOCK_PROFILES: UserProfileVM[] = [
  MOCK_GUARDIAN,
  ...MOCK_CHILDREN,
  ...MOCK_EDUCATORS,
];

import type { UserAccountVM } from '@iconicedu/shared-types';
import { ACCOUNT_IDS, ORG_ID } from './ids';
import {
  ROLE_CHILD_AVA,
  ROLE_CHILD_MAYA,
  ROLE_CHILD_MILO,
  ROLE_EDUCATOR_ELENA,
  ROLE_EDUCATOR_KAI,
  ROLE_EDUCATOR_LEO,
  ROLE_EDUCATOR_PRIYA,
  ROLE_EDUCATOR_SOFIA,
  ROLE_GUARDIAN,
  ROLE_STAFF_SUPPORT,
} from './roles';
import {
  FAMILY_LINK_AVA,
  FAMILY_LINK_MAYA,
  FAMILY_LINK_MILO,
} from './families';

export const ACCOUNT_GUARDIAN: UserAccountVM = {
  ids: {
    orgId: ORG_ID,
    id: ACCOUNT_IDS.guardian,
  },
  contacts: {
    email: 'riley.morgan@example.com',
    phoneE164: '+12125551234',
    emailVerified: true,
    phoneVerified: true,
    preferredContactChannels: ['email', 'sms'],
  },
  access: {
    userRoles: [ROLE_GUARDIAN],
    activeContext: {
      roleKey: 'guardian',
      familyLink: FAMILY_LINK_AVA,
    },
  },
  lifecycle: {
    status: 'active',
    createdAt: '2020-02-14T00:00:00.000Z',
    updatedAt: '2026-01-20T00:00:00.000Z',
  },
};

export const ACCOUNT_CHILD_AVA: UserAccountVM = {
  ids: {
    orgId: ORG_ID,
    id: ACCOUNT_IDS.childA,
  },
  contacts: {
    email: null,
    phoneE164: null,
    emailVerified: false,
    phoneVerified: false,
    preferredContactChannels: null,
  },
  access: {
    userRoles: [ROLE_CHILD_AVA],
    activeContext: {
      roleKey: 'child',
      familyLink: FAMILY_LINK_AVA,
    },
  },
  lifecycle: {
    status: 'active',
    createdAt: '2016-05-18T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z',
  },
};

export const ACCOUNT_CHILD_MILO: UserAccountVM = {
  ids: {
    orgId: ORG_ID,
    id: ACCOUNT_IDS.childB,
  },
  contacts: {
    email: null,
    phoneE164: null,
    emailVerified: false,
    phoneVerified: false,
    preferredContactChannels: null,
  },
  access: {
    userRoles: [ROLE_CHILD_MILO],
    activeContext: {
      roleKey: 'child',
      familyLink: FAMILY_LINK_MILO,
    },
  },
  lifecycle: {
    status: 'active',
    createdAt: '2014-04-11T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z',
  },
};

export const ACCOUNT_CHILD_MAYA: UserAccountVM = {
  ids: {
    orgId: ORG_ID,
    id: ACCOUNT_IDS.childC,
  },
  contacts: {
    email: null,
    phoneE164: null,
    emailVerified: false,
    phoneVerified: false,
    preferredContactChannels: null,
  },
  access: {
    userRoles: [ROLE_CHILD_MAYA],
    activeContext: {
      roleKey: 'child',
      familyLink: FAMILY_LINK_MAYA,
    },
  },
  lifecycle: {
    status: 'active',
    createdAt: '2013-03-06T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z',
  },
};

export const ACCOUNT_EDUCATOR_ELENA: UserAccountVM = {
  ids: {
    orgId: ORG_ID,
    id: ACCOUNT_IDS.educator1,
  },
  contacts: {
    email: 'elena.brooks@example.com',
    phoneE164: '+19175550112',
    emailVerified: true,
    phoneVerified: true,
    preferredContactChannels: ['email'],
  },
  access: {
    userRoles: [ROLE_EDUCATOR_ELENA],
    activeContext: { roleKey: 'educator' },
  },
  lifecycle: {
    status: 'active',
    createdAt: '2018-06-01T00:00:00.000Z',
    updatedAt: '2026-01-21T00:00:00.000Z',
  },
};

export const ACCOUNT_EDUCATOR_KAI: UserAccountVM = {
  ids: {
    orgId: ORG_ID,
    id: ACCOUNT_IDS.educator2,
  },
  contacts: {
    email: 'kai.patel@example.com',
    phoneE164: '+12015550119',
    emailVerified: true,
    phoneVerified: true,
    preferredContactChannels: ['email', 'sms'],
  },
  access: {
    userRoles: [ROLE_EDUCATOR_KAI],
    activeContext: { roleKey: 'educator' },
  },
  lifecycle: {
    status: 'active',
    createdAt: '2017-03-10T00:00:00.000Z',
    updatedAt: '2026-01-21T00:00:00.000Z',
  },
};

export const ACCOUNT_EDUCATOR_PRIYA: UserAccountVM = {
  ids: {
    orgId: ORG_ID,
    id: ACCOUNT_IDS.educator3,
  },
  contacts: {
    email: 'priya.natarajan@example.com',
    phoneE164: '+12015550120',
    emailVerified: true,
    phoneVerified: true,
    preferredContactChannels: ['email'],
  },
  access: {
    userRoles: [ROLE_EDUCATOR_PRIYA],
    activeContext: { roleKey: 'educator' },
  },
  lifecycle: {
    status: 'active',
    createdAt: '2019-01-12T00:00:00.000Z',
    updatedAt: '2026-01-21T00:00:00.000Z',
  },
};

export const ACCOUNT_EDUCATOR_LEO: UserAccountVM = {
  ids: {
    orgId: ORG_ID,
    id: ACCOUNT_IDS.educator4,
  },
  contacts: {
    email: 'leo.martinez@example.com',
    phoneE164: '+17185550121',
    emailVerified: true,
    phoneVerified: true,
    preferredContactChannels: ['email', 'sms'],
  },
  access: {
    userRoles: [ROLE_EDUCATOR_LEO],
    activeContext: { roleKey: 'educator' },
  },
  lifecycle: {
    status: 'active',
    createdAt: '2016-10-04T00:00:00.000Z',
    updatedAt: '2026-01-21T00:00:00.000Z',
  },
};

export const ACCOUNT_EDUCATOR_SOFIA: UserAccountVM = {
  ids: {
    orgId: ORG_ID,
    id: ACCOUNT_IDS.educator5,
  },
  contacts: {
    email: 'sofia.rossi@example.com',
    phoneE164: '+390699955501',
    emailVerified: true,
    phoneVerified: false,
    preferredContactChannels: ['email'],
  },
  access: {
    userRoles: [ROLE_EDUCATOR_SOFIA],
    activeContext: { roleKey: 'educator' },
  },
  lifecycle: {
    status: 'active',
    createdAt: '2022-05-22T00:00:00.000Z',
    updatedAt: '2026-01-21T00:00:00.000Z',
  },
};

export const ACCOUNT_STAFF_SUPPORT: UserAccountVM = {
  ids: {
    orgId: ORG_ID,
    id: ACCOUNT_IDS.staff,
  },
  contacts: {
    email: 'support@iconicedu.com',
    phoneE164: '+12125550099',
    emailVerified: true,
    phoneVerified: false,
    preferredContactChannels: ['email'],
  },
  access: {
    userRoles: [ROLE_STAFF_SUPPORT],
    activeContext: { roleKey: 'staff' },
  },
  lifecycle: {
    status: 'active',
    createdAt: '2024-02-01T00:00:00.000Z',
    updatedAt: '2026-01-21T00:00:00.000Z',
  },
};

export const USER_ACCOUNTS: UserAccountVM[] = [
  ACCOUNT_GUARDIAN,
  ACCOUNT_CHILD_AVA,
  ACCOUNT_CHILD_MILO,
  ACCOUNT_CHILD_MAYA,
  ACCOUNT_EDUCATOR_ELENA,
  ACCOUNT_EDUCATOR_KAI,
  ACCOUNT_EDUCATOR_PRIYA,
  ACCOUNT_EDUCATOR_LEO,
  ACCOUNT_EDUCATOR_SOFIA,
  ACCOUNT_STAFF_SUPPORT,
];

export const ACCOUNTS_BY_ID: Record<string, UserAccountVM> = {
  [ACCOUNT_IDS.guardian]: ACCOUNT_GUARDIAN,
  [ACCOUNT_IDS.childA]: ACCOUNT_CHILD_AVA,
  [ACCOUNT_IDS.childB]: ACCOUNT_CHILD_MILO,
  [ACCOUNT_IDS.childC]: ACCOUNT_CHILD_MAYA,
  [ACCOUNT_IDS.educator1]: ACCOUNT_EDUCATOR_ELENA,
  [ACCOUNT_IDS.educator2]: ACCOUNT_EDUCATOR_KAI,
  [ACCOUNT_IDS.educator3]: ACCOUNT_EDUCATOR_PRIYA,
  [ACCOUNT_IDS.educator4]: ACCOUNT_EDUCATOR_LEO,
  [ACCOUNT_IDS.educator5]: ACCOUNT_EDUCATOR_SOFIA,
  [ACCOUNT_IDS.staff]: ACCOUNT_STAFF_SUPPORT,
};

import type { UserRoleVM } from '@iconicedu/shared-types';
import { ACCOUNT_IDS, ORG_ID, ROLE_IDS } from './ids';

export const ROLE_GUARDIAN: UserRoleVM = {
  ids: {
    orgId: ORG_ID,
    id: ROLE_IDS.guardian,
  },
  roleKey: 'guardian',
  audit: {
    assignedBy: ACCOUNT_IDS.guardian,
    assignedAt: '2020-02-14T00:00:00.000Z',
  },
};

export const ROLE_CHILD_AVA: UserRoleVM = {
  ids: {
    orgId: ORG_ID,
    id: ROLE_IDS.childA,
  },
  roleKey: 'child',
  audit: {
    assignedBy: ACCOUNT_IDS.guardian,
    assignedAt: '2020-02-14T00:00:00.000Z',
  },
};

export const ROLE_CHILD_MILO: UserRoleVM = {
  ids: {
    orgId: ORG_ID,
    id: ROLE_IDS.childB,
  },
  roleKey: 'child',
  audit: {
    assignedBy: ACCOUNT_IDS.guardian,
    assignedAt: '2020-02-14T00:00:00.000Z',
  },
};

export const ROLE_CHILD_MAYA: UserRoleVM = {
  ids: {
    orgId: ORG_ID,
    id: ROLE_IDS.childC,
  },
  roleKey: 'child',
  audit: {
    assignedBy: ACCOUNT_IDS.guardian,
    assignedAt: '2020-02-14T00:00:00.000Z',
  },
};

export const ROLE_EDUCATOR_ELENA: UserRoleVM = {
  ids: {
    orgId: ORG_ID,
    id: ROLE_IDS.educator1,
  },
  roleKey: 'educator',
  audit: {
    assignedBy: ACCOUNT_IDS.guardian,
    assignedAt: '2018-06-01T00:00:00.000Z',
  },
};

export const ROLE_EDUCATOR_KAI: UserRoleVM = {
  ids: {
    orgId: ORG_ID,
    id: ROLE_IDS.educator2,
  },
  roleKey: 'educator',
  audit: {
    assignedBy: ACCOUNT_IDS.guardian,
    assignedAt: '2017-03-10T00:00:00.000Z',
  },
};

export const ROLE_EDUCATOR_PRIYA: UserRoleVM = {
  ids: {
    orgId: ORG_ID,
    id: ROLE_IDS.educator3,
  },
  roleKey: 'educator',
  audit: {
    assignedBy: ACCOUNT_IDS.guardian,
    assignedAt: '2019-01-12T00:00:00.000Z',
  },
};

export const ROLE_EDUCATOR_LEO: UserRoleVM = {
  ids: {
    orgId: ORG_ID,
    id: ROLE_IDS.educator4,
  },
  roleKey: 'educator',
  audit: {
    assignedBy: ACCOUNT_IDS.guardian,
    assignedAt: '2016-10-04T00:00:00.000Z',
  },
};

export const ROLE_EDUCATOR_SOFIA: UserRoleVM = {
  ids: {
    orgId: ORG_ID,
    id: ROLE_IDS.educator5,
  },
  roleKey: 'educator',
  audit: {
    assignedBy: ACCOUNT_IDS.guardian,
    assignedAt: '2022-05-22T00:00:00.000Z',
  },
};

export const ROLE_STAFF_SUPPORT: UserRoleVM = {
  ids: {
    orgId: ORG_ID,
    id: ROLE_IDS.staff,
  },
  roleKey: 'staff',
  audit: {
    assignedBy: ACCOUNT_IDS.guardian,
    assignedAt: '2024-02-01T00:00:00.000Z',
  },
};

export const USER_ROLES: UserRoleVM[] = [
  ROLE_GUARDIAN,
  ROLE_CHILD_AVA,
  ROLE_CHILD_MILO,
  ROLE_CHILD_MAYA,
  ROLE_STAFF_SUPPORT,
  ROLE_EDUCATOR_ELENA,
  ROLE_EDUCATOR_KAI,
  ROLE_EDUCATOR_PRIYA,
  ROLE_EDUCATOR_LEO,
  ROLE_EDUCATOR_SOFIA,
];

export const USER_ROLES_BY_ID: Record<string, UserRoleVM> = {
  [ROLE_IDS.guardian]: ROLE_GUARDIAN,
  [ROLE_IDS.childA]: ROLE_CHILD_AVA,
  [ROLE_IDS.childB]: ROLE_CHILD_MILO,
  [ROLE_IDS.childC]: ROLE_CHILD_MAYA,
  [ROLE_IDS.staff]: ROLE_STAFF_SUPPORT,
  [ROLE_IDS.educator1]: ROLE_EDUCATOR_ELENA,
  [ROLE_IDS.educator2]: ROLE_EDUCATOR_KAI,
  [ROLE_IDS.educator3]: ROLE_EDUCATOR_PRIYA,
  [ROLE_IDS.educator4]: ROLE_EDUCATOR_LEO,
  [ROLE_IDS.educator5]: ROLE_EDUCATOR_SOFIA,
};

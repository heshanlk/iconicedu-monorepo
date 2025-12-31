import type { FamilyLinkVM, FamilyVM } from '@iconicedu/shared-types';
import { ACCOUNT_IDS, FAMILY_IDS, ORG_ID } from './ids';

export const MORGAN_FAMILY: FamilyVM = {
  ids: {
    orgId: ORG_ID,
    id: FAMILY_IDS.family,
  },
  displayName: 'Morgan Family',
};

export const FAMILY_LINK_AVA: FamilyLinkVM = {
  ids: {
    orgId: ORG_ID,
    id: FAMILY_IDS.linkA,
    familyId: FAMILY_IDS.family,
  },
  accounts: {
    guardianAccountId: ACCOUNT_IDS.guardian,
    childAccountId: ACCOUNT_IDS.childA,
  },
  relation: 'guardian',
  permissionsScope: ['view-progress', 'schedule-session', 'message-educator'],
};

export const FAMILY_LINK_MILO: FamilyLinkVM = {
  ids: {
    orgId: ORG_ID,
    id: FAMILY_IDS.linkB,
    familyId: FAMILY_IDS.family,
  },
  accounts: {
    guardianAccountId: ACCOUNT_IDS.guardian,
    childAccountId: ACCOUNT_IDS.childB,
  },
  relation: 'caregiver',
  permissionsScope: ['view-progress', 'schedule-session', 'message-educator'],
};

export const FAMILY_LINK_MAYA: FamilyLinkVM = {
  ids: {
    orgId: ORG_ID,
    id: FAMILY_IDS.linkC,
    familyId: FAMILY_IDS.family,
  },
  accounts: {
    guardianAccountId: ACCOUNT_IDS.guardian,
    childAccountId: ACCOUNT_IDS.childC,
  },
  relation: 'guardian',
  permissionsScope: ['view-progress', 'schedule-session', 'message-educator'],
};

export const FAMILIES: FamilyVM[] = [MORGAN_FAMILY];

export const FAMILY_LINKS: FamilyLinkVM[] = [
  FAMILY_LINK_AVA,
  FAMILY_LINK_MILO,
  FAMILY_LINK_MAYA,
];

export const FAMILY_LINKS_BY_ID: Record<string, FamilyLinkVM> = {
  [FAMILY_IDS.linkA]: FAMILY_LINK_AVA,
  [FAMILY_IDS.linkB]: FAMILY_LINK_MILO,
  [FAMILY_IDS.linkC]: FAMILY_LINK_MAYA,
};

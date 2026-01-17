import type {
  UserOnboardingStatusRow,
  UserOnboardingStatusVM,
} from '@iconicedu/shared-types';

export function mapUserOnboardingStatusRowToVM(
  row: UserOnboardingStatusRow,
): UserOnboardingStatusVM {
  return {
    id: row.id,
    orgId: row.org_id,
    profileId: row.profile_id,
    currentStep: row.current_step ?? null,
    lastCompletedStep: row.last_completed_step ?? null,
    progress: row.progress ?? null,
    completed: row.completed,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

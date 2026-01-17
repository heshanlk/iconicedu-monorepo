import type { ISODateTime, OnboardingStep, UUID } from '../shared/shared';

export interface UserOnboardingStatusVM {
  id: UUID;
  orgId: UUID;
  profileId: UUID;
  currentStep?: OnboardingStep | null;
  lastCompletedStep?: OnboardingStep | null;
  progress?: Record<string, unknown> | null;
  completed: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

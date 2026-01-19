'use strict';

import type { DayAvailability } from '@iconicedu/shared-types';

export interface EducatorAvailabilityVM {
  classTypes?: string[] | null;
  weeklyCommitment?: number | null;
  availability?: DayAvailability | null;
}

export type EducatorAvailabilityInput = {
  classTypes?: string[] | null;
  weeklyCommitment?: number | null;
  availability?: DayAvailability | null;
};

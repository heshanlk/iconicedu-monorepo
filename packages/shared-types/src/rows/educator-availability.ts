'use strict';

import type { DayAvailability } from '@iconicedu/shared-types';

export interface EducatorAvailabilityRow {
  profile_id: string;
  org_id: string;
  class_types: string[] | null;
  weekly_commitment: number | null;
  availability: DayAvailability | null;
  created_at: string;
  created_by: string | null;
  updated_at: string;
  updated_by: string | null;
  deleted_at: string | null;
  deleted_by: string | null;
}

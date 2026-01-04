import type { StaffProfileVM, UserProfileVM } from '@iconicedu/shared-types';
import type { ProfileRow } from '@iconicedu/shared-types';
import type { SupabaseClient } from '@supabase/supabase-js';

import { getStaffProfile, getStaffSpecialties } from '../queries/staff.query';

export async function buildStaffProfile(
  supabase: SupabaseClient,
  baseProfile: Omit<UserProfileVM, 'kind'>,
  profileRow: ProfileRow,
): Promise<StaffProfileVM> {
  const [staff, specialties] = await Promise.all([
    getStaffProfile(supabase, profileRow.id),
    getStaffSpecialties(supabase, profileRow.id),
  ]);

  return {
    ...baseProfile,
    kind: 'staff',
    department: staff.data?.department ?? null,
    managerStaffId: staff.data?.manager_staff_id ?? null,
    jobTitle: staff.data?.job_title ?? null,
    permissionsScope: staff.data?.permissions_scope ?? null,
    specialties: specialties.data?.map((row) => row.specialty) ?? null,
    workingHoursRules: staff.data?.working_hours_rules ?? null,
  };
}

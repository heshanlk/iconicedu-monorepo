## MVP follow-ups

1. ✅ Refine `child_profiles` RLS so guardians linked via `family_links` can update/delete their children (applied via `20260118050000_039_child_profiles_guardian_policy_refine.sql`).
2. ✅ Tighten `profiles` RLS so guardians update child profiles through the parent -> account -> child chain (`20260118070000_040_profiles_guardian_policy_refine.sql`).
3. ⚠️ **Pending:** Verify RLS enforcement before MVP: confirm that updating a child account through the Family tab still works when the guardian’s session hits the `profiles` and `child_profiles` tables, and document the policy check steps for QA.
4. ⚠️ **Pending:** Revisit the invite-child flow to ensure existing child accounts (matching by email) get the necessary updates instead of silently skipping them, especially when inviting children already added to the `accounts` table.

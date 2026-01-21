# AI Project Instructions

## 1. Project Overview
- This monorepo powers a multi-platform education platform (web, mobile, API).
- Web is the canonical UI for admin/parent workflows; mobile targets student/teacher use cases.
- Shared ViewModels (VMs) define UI-facing data contracts across apps.

## 2. Tech Stack & Versions
- Next.js (App Router) for web.
- NestJS for API and business logic.
- Supabase for Auth, DB, RLS, and Realtime.
- React Native for mobile.
- TypeScript (strict) everywhere.
- Tailwind CSS + shadcn/ui for UI.
- Turborepo + pnpm for monorepo tooling.

## 3. Monorepo Structure & Ownership Rules
- `apps/web` owns web routes, server/client components, and data wiring.
- `apps/api` (NestJS) owns all business logic, validation, and writes.
- `apps/mobile` owns native UI and mobile-only UX logic.
- `packages/shared-types` owns VM and shared types; no app-specific logic.
- `packages/ui-web` owns reusable UI components and shadcn wrappers.
- Do not bypass ownership by importing across boundaries (e.g., UI into API).

## 4. Data Access & Security Rules
- All writes and business logic must go through NestJS API.
- Supabase RLS must remain enabled for all tables.
- Never use service role keys in client apps.
- Realtime is allowed only via Supabase channels with RLS policies in place.
- Avoid client-side direct DB mutations; use API contracts.
- When data must be fetched or mutated during onboarding or user settings flows, prefer server actions (e.g., `app/actions/*`) so the browser never talks directly to Supabase and we keep auth/cleanup logic centralized.

## 5. TypeScript & API Design Rules
- Use strict typing and prefer explicit interfaces/types.
- VMs live in `packages/shared-types` and are the only shared UI contract.
- Avoid circular references in VM types.
- Keep API payloads separate from UI VMs unless explicitly aligned.
- Use discriminated unions for message/attachment variants.

## 6. UI & Design System Rules
- Use Tailwind CSS and shadcn/ui components consistently.
- Prefer composition of shadcn primitives over custom components.
- Reference the official shadcn component docs (https://ui.shadcn.com/docs/components) before recreating a UI pattern; strive to reuse those building blocks rather than invent new ones.
- When a layout or interaction is repeated across views, add a shared, shadcn-friendly component inside `packages/ui-web/src/components` instead of duplicating markup in multiple files.
- Theming uses `ThemeKey` and `theme-*` classes; avoid inline colors.
- Keep mobile responsiveness in mind for all layouts.

## 7. Naming & File Conventions
- Use `kebab-case` for files and folders.
- Components are `PascalCase`.
- VMs are suffixed with `VM`.
- Keep related code colocated; avoid duplicate utilities.

## 8. Error Handling & Validation
- Validate all inputs on the API layer (NestJS).
- Use typed errors and surface user-safe messages in UI.
- Never suppress errors silently; log with context.

## 9. Performance & Scalability Principles
- Avoid unnecessary data mapping or heavy client transforms.
- Use pagination/cursors for message and thread lists.
- Prefer server-side aggregation over client-side computation.
- Keep UI lists virtualizable and avoid deep nesting in render loops.

## 10. AI Output Rules
- When modifying code, return either:
  - full updated file, or
  - a focused diff
  - Never return partial snippets without context.
  - Call out breaking changes explicitly.
  - Prefer existing patterns over inventing new ones.
  - Do not introduce new dependencies unless explicitly requested.

## 11. TODO Reference
- Keep track of follow-up work, blockers, and reiteration items in `docs/TODO.md`.
- Before making design/process changes, check `docs/TODO.md` to understand outstanding tickets and to avoid duplicate reminders; use that file as the single source for pending work descriptions.

## 12. Shadcn MCP Server (new)
- We now keep a pointer to the official MCP server workflow in `docs/SHADCN-MCP.md`. Use that guide when you want to launch the interactive component preview that ships with `shadcn/ui`. No need to add custom scripts beyond the ones described there; follow the `pnpm shadcn:mcp` helper in `packages/ui-web/package.json`.

## 13. Data & Structure Guidance
- Follow the existing `apps/web/lib` layout—do not introduce new folder patterns. Each entity (user, org, family, class-space, learning-space, etc.) deserves its own bundle with explicit `queries`, `mappers`, and `builders` subfolders under `apps/web/lib/<entity>`. Keep fixtures in `lib/data`, sidebar wiring in `lib/sidebar`, and keep the entity bundles focused on reusable data access or transformation logic.
- Create or extend row definitions, view models, and helpers in `packages/shared-types` before using them in apps. Once the shared contract exists, mirror it under the matching `apps/web/lib/<entity>` bundle so every entity follows the same `queries`→`mappers`→`builders` pipeline. Treat the `apps/web/lib/user` bundle as the canonical pattern and replicate it when onboarding new domains.

## 14. Stability-first habits
- Do not add novel folder layouts or structural patterns without agreement—extend the existing query/builder/mapping layout instead. Treat `packages/shared-types` as the single source for new data contracts and update related queries/mappers/builders before touching UI or API layers. Keeping this disciplined structure avoids hidden dependencies and ensures everyone can find the relevant pieces when extending an entity.
- **Migrations mandate:** Never edit an existing migration once it has been committed; always author a new migration file that describes the change (timestamped in `supabase/migrations`) and references the triggering logic so the change history stays linear.

## 15. Onboarding guidance
- Required onboarding collapsibles must open by default while any other collapsible inside the same tab is disabled until the user completes the current required section to keep the flow focused.
- Build onboarding guidance logic with reusable helpers/hooks (e.g., maintaining a shared guidance map per step in `UserSettingsTabs`) so the wiring stays maintainable and scalable without scattering ad-hoc state across the dialog.
- Deliver production-grade implementations for these flows: reuse existing folder patterns, follow common React/Next.js practices (hooks, single-responsibility helpers, context if needed), and keep the data/UI layers decoupled to allow future iterations without rewriting the entire dialog.

## 16. Adding new onboarding-required fields
- When a new field becomes required (job title, weekly availability, etc.), update the shared onboarding map in `UserSettingsTabs`/`user-settings-dialog` and the server-visible onboarding status logic (e.g., `determineOnboardingStep`) so the step stays active until every required field is filled.
- Use the `useSequentialHighlight` hook alongside `BorderBeam` in the target section to show a subtle animation on the required inputs/buttons; keep the beam small (`size=26` for buttons, `size=52` for inputs) and use the `from-transparent via-amber-700 to-transparent` gradient for consistency.
- Only show the beam during onboarding (guard with the `enabled` flag) and base the `satisfied` map on the same validation checks used in the backend (e.g., trimmed text or non-empty availability arrays). Keep required collapsibles open by default via `defaultOpen` and disable other sections until the user completes the required flow.

## 16. Entity operation safety
- Every multi-table entity write must behave atomically: wrap the work in a database transaction when available, or implement explicit cleanup/rollback logic so either all inserts/updates succeed or any newly created rows are removed. Capture that strategy in the relevant code and document it when editing entity operations.

## 17. Adding new onboarding-required sections or tabs
- When a required collapsible, field, or entire tab is added to the onboarding flow, update both the UI guidance and the server-side step tracking simultaneously. Extend `OnboardingStep`, `ONBOARDING_SECTION_CONFIG`, and `determineOnboardingStep` (and any related helpers) so the new step is discoverable and the dialog knows which tab/section to open.
- Wrap the new controls with `useSequentialHighlight`/`BorderBeam` (size 26 for buttons, 52 for inputs/selects) to reuse the existing onboarding highlight pattern, keeping the `enabled` flag tied to the new step and the `satisfied` map aligned with backend validation (e.g., trimmed text or non-empty arrays).
- Keep the required section open by default (`defaultOpen`) and disable other collapsibles until the current one is complete. Document the gating logic in this file so future agents know the hook order, beam styling, and how to wire the guidance map in `UserSettingsTabs`.

## 18. Sample family seeds
- Refer to the newly added migration at `supabase/migrations/20260203000000_014_seed_family_learning_spaces.sql` when you need to reproduce the classes, channels, and weekly schedules for the guardian account `77d50ed9-00ff-4996-8527-4d5c20a53043` with child IDs `adbe4160-f7a5-4882-9dd1-6b84ed66b083` and `cc1d8646-bf7f-4e2b-abe6-70f798e884d3`. That SQL also introduces the educators Ms. Charmain, Ms. Wickramasinghe, and Ms. Shenaly so you can trace their participation across `learning_spaces`, `channels`, and `class_schedules`.
- Keep the TypeScript fixtures under `apps/web/lib/data` in sync with those seeds; when you tweak the schedule interfaces or learning-space wiring, mirror the same shape in `class-schedule-events.ts`, `learning-spaces.ts`, and related builders inside `apps/web/lib` using the contracts defined in `packages/shared-types/src/vm/class-schedule.ts`.

## 19. Command logging notes
- Log significant shell commands and developer workflow steps (especially when a user asked for it) directly in this file so future agents can trace the steps taken.
- Each entry should briefly describe the command, why it was run, and whether it succeeded, keeping the log concise yet actionable.
- Treat this section as high priority when a user explicitly requests “agent updates per command” so the policy is captured in the shared instructions themselves.
- Command log:
  - `apply_patch` to add `ChevronDown` + icon rotation logic in `packages/ui-web/src/components/sidebar/nav-admin.tsx` (supporting the open/closed carrot indicator).
  - `apply_patch` to append the command-logging instructions and log header into `docs/AGENTS.md`.

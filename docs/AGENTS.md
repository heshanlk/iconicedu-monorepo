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

## 5. TypeScript & API Design Rules
- Use strict typing and prefer explicit interfaces/types.
- VMs live in `packages/shared-types` and are the only shared UI contract.
- Avoid circular references in VM types.
- Keep API payloads separate from UI VMs unless explicitly aligned.
- Use discriminated unions for message/attachment variants.

## 6. UI & Design System Rules
- Use Tailwind CSS and shadcn/ui components consistently.
- Prefer composition of shadcn primitives over custom components.
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

## 12. Data & Structure Guidance
- Follow the existing `apps/web/lib` layout—do not introduce new folder patterns. Each entity (user, org, family, class-space, learning-space, etc.) deserves its own bundle with explicit `queries`, `mappers`, and `builders` subfolders under `apps/web/lib/<entity>`. Keep fixtures in `lib/data`, sidebar wiring in `lib/sidebar`, and keep the entity bundles focused on reusable data access or transformation logic.
- Create or extend row definitions, view models, and helpers in `packages/shared-types` before using them in apps. Once the shared contract exists, mirror it under the matching `apps/web/lib/<entity>` bundle so every entity follows the same `queries`→`mappers`→`builders` pipeline. Treat the `apps/web/lib/user` bundle as the canonical pattern and replicate it when onboarding new domains.

## 13. Stability-first habits
- Do not add novel folder layouts or structural patterns without agreement—extend the existing query/builder/mapping layout instead. Treat `packages/shared-types` as the single source for new data contracts and update related queries/mappers/builders before touching UI or API layers. Keeping this disciplined structure avoids hidden dependencies and ensures everyone can find the relevant pieces when extending an entity.

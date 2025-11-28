# ICONIC EDU Monorepo

A Turborepo that ships a **Next.js 16** web console with **Tailwind CSS v4**, an **Expo React Native 0.82** app styled with **NativeWind v4**, and a **NestJS 11** API. Shared UI kits, utilities, and type definitions keep the stack consistent across platforms.

## Stack
- Next.js 16 + React 19 (Tailwind CSS v4)
- Expo SDK 54 + React Native 0.82 (NativeWind v4)
- NestJS 11 + Prisma 7
- TypeScript 5.9, pnpm 9, Turborepo 2

## Workspace layout
```
apps/
  api/      # NestJS service
  mobile/   # Expo + NativeWind app
  web/      # Next.js + Tailwind CSS v4 app
packages/
  config-eslint/   # Shared ESLint config
  config-tsconfig/ # Shared TSConfig presets (base, next, react-native, nestjs)
  jest-presets/    # Shared Jest preset
  shared-types/    # Domain types
  ui-native/       # Native component library
  ui-web/          # Web component library
  utils/           # Cross-platform helpers
```

## Step-by-step bootstrap (mirrors this repo)
1. **Create the Turborepo shell**
   ```bash
   pnpm dlx create-turbo@latest iconicedu-monorepo --use-pnpm
   cd iconicedu-monorepo
   ```

2. **Add shared tooling packages**
   ```bash
   pnpm dlx json -I -f package.json 'this.devDependencies.turbo="^2.6.1"'
   pnpm add -D @typescript-eslint/eslint-plugin@^8.48.0 @typescript-eslint/parser@^8.48.0 eslint@^9.39.1 prettier@^3.7.1 typescript@^5.9.3 husky@^9.1.7 lint-staged@^16.2.7
   mkdir -p packages/config-eslint packages/config-tsconfig packages/jest-presets
   ```

3. **Seed TSConfig presets** (`packages/config-tsconfig`)
   - Create `base.json` with strict ES2022 + bundler settings.
   - Add `next.json`, `react-native.json`, and `nestjs.json` that extend `base.json` with framework-specific options.

4. **Wire ESLint + Jest presets**
   - `packages/config-eslint/index.cjs` exports the shared rule set (React + TypeScript + Prettier).
   - `packages/jest-presets/jest-preset.cjs` exports the shared `ts-jest` preset and marks `jest`/`ts-jest`/`typescript` as peers.

5. **Create shared libraries**
   ```bash
   mkdir -p packages/{ui-web,ui-native,shared-types,utils}/src
   # add Button components, domain types, and helpers
   ```
   Each package uses `@iconicedu/config-tsconfig/base.json` (or `react-native.json`) and outputs to `dist/`.

6. **Scaffold the web app**
   ```bash
   pnpm dlx create-next-app@latest apps/web --ts --app --eslint --no-tailwind --src-dir false --import-alias "@/*"
   pnpm add -C apps/web next@^16.0.5 react@^19.2.0 react-dom@^19.2.0 @tanstack/react-query@^5.90.11 @supabase/auth-helpers-nextjs@^0.15.0 @supabase/supabase-js@^2.86.0 @iconicedu/ui-web@workspace:*
   pnpm add -C apps/web -D tailwindcss@^4.1.17 postcss@^8.4.49 autoprefixer@^10.4.20 eslint-config-next@^16.0.5
   ```
   - `postcss.config.mjs` uses the Tailwind v4 plugin.
   - `tailwind.config.ts` points at the app and `packages/ui-web` sources.
   - `app/globals.css` uses the Tailwind v4 `@import "tailwindcss";` entrypoint plus shared design tokens.

7. **Scaffold the mobile app**
   ```bash
   pnpm dlx create-expo-app@latest apps/mobile -t expo-template-blank-typescript
   pnpm add -C apps/mobile expo@^54.0.25 react@^19.2.0 react-native@^0.82.1 nativewind@^4.2.1 react-native-reanimated@^4.1.5 react-native-safe-area-context@^5.6.2 react-native-screens@^4.18.0 @react-navigation/native@^7.1.22 @react-navigation/native-stack@^7.8.1 @supabase/supabase-js@^2.86.0 @tanstack/react-query@^5.90.11 @iconicedu/ui-native@workspace:*
   pnpm add -C apps/mobile -D @babel/core@^7.28.5 typescript@^5.9.3
   ```
   - Enable NativeWind in `babel.config.js` and wrap `tailwind.config.js` with `nativewind()`.
   - Add `global.d.ts` with `/// <reference types="nativewind/types" />`.

8. **Scaffold the API**
   ```bash
   pnpm dlx @nestjs/cli new api --package-manager pnpm --directory apps/api
   pnpm add -C apps/api @nestjs/common@^11.1.9 @nestjs/core@^11.1.9 @nestjs/platform-express@^11.1.9 @nestjs/config@^4.0.2 @nestjs/swagger@^11.2.3 @nestjs/jwt@^11.0.1 @nestjs/passport@^11.0.5 passport@^0.7.0 jsonwebtoken@^9.0.2 reflect-metadata@^0.2.2 rxjs@^7.8.2 @prisma/client@^7.0.1
   pnpm add -C apps/api -D @nestjs/cli@^11.0.14 @nestjs/schematics@^11.0.9 @nestjs/testing@^11.1.9 prisma@^7.0.1 ts-node@^10.9.2 typescript@^5.9.3
   ```
   - `tsconfig.json` extends `@iconicedu/config-tsconfig/nestjs.json`.

9. **Wire shared tooling**
   - `tsconfig.base.json` extends `packages/config-tsconfig/base.json` and defines workspace `paths` for all packages.
   - `turbo.json` defines `build`, `dev`, `lint`, and `test` pipelines.
   - `pnpm-workspace.yaml` includes `apps/*` and `packages/*`.

10. **Run the dev targets**
    ```bash
    pnpm dev:web    # Next.js + Tailwind v4
    pnpm dev:mobile # Expo + NativeWind
    pnpm dev:api    # NestJS + Prisma
    ```

## Everyday commands
- `pnpm lint` — runs the shared ESLint config via Turborepo
- `pnpm build` — builds packages and apps with cache-aware pipelines
- `pnpm test` — uses the shared Jest preset (install `jest` + `ts-jest` in each package)

## Styling notes
- **Web:** Tailwind CSS v4 with design tokens defined in `apps/web/tailwind.config.ts` and shared components from `@iconicedu/ui-web`.
- **Mobile:** NativeWind v4 + Tailwind v4 tokens via `nativewind()` wrapping the Tailwind config; className support is enabled through `nativewind/babel` and `global.d.ts`.


# 📘 ICONIC EDU — Monorepo

A communication-first education platform connecting **parents, teachers, students, advisors, and staff** through:

* Modern chat & channels
* Scheduling & classes
* Progress tracking
* Homework workflows
* Parent Advisor support
* Multi-role dashboards
* Web, Mobile, and API apps

This monorepo powers the entire ecosystem.

---

# 🏗️ Tech Stack

### **Frontend**

* **Next.js 14** (App Router) — Web app
* **Expo / React Native** — Mobile app
* **Tailwind CSS** — Web styling
* **NativeWind** — Mobile styling
* **Turborepo** — Monorepo orchestration
* **Shared UI libraries** (Web + Native)

### **Backend**

* **NestJS 10** — API service
* **Prisma** — ORM
* **Supabase Postgres** — Database
* **Supabase Auth** — Authentication
* **Supabase Storage** — Files / homework uploads
* **RLS** — Row-level security

### **Package Management**

* **pnpm 9**
* **TypeScript everywhere**
* Local packages:

  * `@iconicedu/ui-web`
  * `@iconicedu/ui-native`
  * `@iconicedu/shared-types`
  * `@iconicedu/utils`

---

# 📁 Monorepo Structure

```
iconicedu-monorepo/
├─ apps/
│  ├─ web/        # Next.js web app
│  ├─ mobile/     # Expo mobile app
│  └─ api/        # NestJS backend
│
├─ packages/
│  ├─ ui-web/       # Web UI kit (Tailwind + React)
│  ├─ ui-native/    # Native UI kit (React Native + NativeWind)
│  ├─ shared-types/ # Shared DTOs, domain models
│  ├─ utils/        # Shared utilities
│  ├─ config-eslint/
│  └─ config-tsconfig/
│
├─ supabase/
│  ├─ schema.sql    # Tables + RLS
│  └─ migrations/   # Optional
│
├─ turbo.json
├─ pnpm-workspace.yaml
├─ package.json
├─ .nvmrc
├─ .tool-versions
└─ README.md
```

## 🚀 Build this monorepo from scratch (step-by-step)

The commands below mirror the [Vercel Turborepo examples](https://github.com/vercel/turborepo/tree/main/examples) but pin everything to the latest stable releases, Tailwind CSS v4 for web, and NativeWind for mobile.

1. **Create the workspace shell**

   ```bash
   pnpm dlx create-turbo@latest iconicedu-monorepo --use-pnpm --no-git
   cd iconicedu-monorepo
   mkdir -p apps packages supabase
   ```

2. **Scaffold the apps** (NestJS API, Next.js web, Expo RN mobile)

   ```bash
   pnpm dlx @nestjs/cli new apps/api --package-manager pnpm --skip-install
   pnpm dlx create-next-app@latest apps/web --ts --app --eslint --no-src-dir --use-pnpm
   pnpm dlx create-expo-app@latest apps/mobile -t blank-typescript
   ```

3. **Create shared packages**

   ```bash
   pnpm init -w
   mkdir -p packages/ui-web/src/components packages/ui-native/src/components packages/shared-types/src packages/utils/src
   pnpm pkg set workspaces[0]="apps/*" workspaces[1]="packages/*"
   pnpm pkg set scripts.dev:web="turbo run dev --filter=web" scripts.dev:mobile="turbo run dev --filter=mobile" scripts.dev:api="turbo run dev --filter=api"
   ```

4. **Add configuration packages** (ESLint, TS, Jest preset)

   ```bash
   mkdir -p packages/config-eslint packages/config-tsconfig packages/jest-presets
   # ESLint base
   cat > packages/config-eslint/index.cjs <<'EOF'
   module.exports = {
     extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
     parser: '@typescript-eslint/parser',
     plugins: ['@typescript-eslint'],
   };
   EOF
   # TSConfig base
   cat > packages/config-tsconfig/tsconfig.json <<'EOF'
   { "extends": "@tsconfig/recommended/tsconfig.json" }
   EOF
   # Jest preset using SWC
   cat > packages/jest-presets/preset.cjs <<'EOF'
   module.exports = {
     testEnvironment: 'node',
     transform: { '^.+\\.(t|j)sx?$': ['@swc/jest'] },
   };
   EOF
   ```

5. **Install dependencies** (latest stable, Tailwind v4, NativeWind)

   ```bash
   pnpm add -D turbo typescript prettier eslint @typescript-eslint/{parser,eslint-plugin}
   pnpm --filter web add next@latest react@latest react-dom@latest @tanstack/react-query @supabase/auth-helpers-nextjs @supabase/supabase-js
   pnpm --filter web add -D tailwindcss@next eslint-config-next
   pnpm --filter api add @nestjs/{common,core,platform-express,config,swagger,jwt,passport} reflect-metadata rxjs
   pnpm --filter api add -D @nestjs/{cli,schematics,testing} ts-node
   pnpm --filter mobile add expo react react-native nativewind @tanstack/react-query @react-navigation/native @react-navigation/native-stack @supabase/supabase-js
   ```

6. **Initialize Tailwind CSS v4 in Next.js**

   ```bash
   cd apps/web
   npx tailwindcss init --ts --simple
   # Update tailwind.config.ts content globs to include app/**/* and ../../packages/ui-web/src/**/*
   # Replace globals.css with the v4 single-import + @theme tokens (see this repo for reference).
   cd ../../
   ```

7. **Initialize NativeWind in Expo**

   ```bash
   cd apps/mobile
   npx tailwindcss init --simple
   # Set tailwind.config.js content to app/**/*.{ts,tsx} and ../../packages/ui-native/src/**/*.{ts,tsx}
   # Enable the babel plugin in babel.config.js: plugins: ['nativewind/babel']
   cd ../../
   ```

8. **Wire workspace tooling**

   ```bash
   pnpm install
   pnpm turbo lint
   pnpm turbo dev --parallel
   ```

These steps produce the same layout as this repository with up-to-date dependencies and no deprecated packages.

---

# ⚙️ Requirements

To avoid Node / pnpm / Expo issues, all devs MUST use:

* **Node 20.18.1**
* **pnpm 9.12.0**
* macOS, Linux, or Windows via **WSL2**

## Recommended OS for development

| Platform             | Supported | Notes                                   |
| -------------------- | --------- | --------------------------------------- |
| **macOS**            | ✅ Best    | Required for iOS simulator              |
| **Linux (Ubuntu)**   | ✅         | Fastest builds                          |
| **Windows (native)** | ❌ NO      | Not supported due to Expo/Prisma issues |
| **Windows (WSL2)**   | ✅         | Required for Windows devs               |

---

# 🪟 Windows Setup (WSL2 Required)

### 1. Enable WSL2

```powershell
wsl --install
```

### 2. Install build tools inside Ubuntu

```bash
sudo apt update
sudo apt install -y build-essential curl git openssl
```

### 3. Install ASDF (recommended)

```bash
git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.14.0
echo '. "$HOME/.asdf/asdf.sh"' >> ~/.bashrc
source ~/.bashrc
```

Add tool plugins:

```bash
asdf plugin-add nodejs
asdf plugin-add pnpm
asdf plugin-add yarn
asdf install
```

---

# 🐧 Linux Setup (Ubuntu / Debian)

### Install dependencies

```bash
sudo apt update
sudo apt install -y build-essential curl git libssl-dev libudev-dev pkg-config
```

Then install ASDF or NVM.

---

# 🍎 macOS Setup

### Install Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Install Node version manager (choose one)

#### Option A — NVM

```bash
brew install nvm
mkdir ~/.nvm
```

Add to `~/.zshrc`:

```bash
export NVM_DIR="$HOME/.nvm"
source $(brew --prefix nvm)/nvm.sh
```

Install Node:

```bash
nvm install 20.18.1
nvm use 20.18.1
```

#### Option B — ASDF

```bash
brew install asdf
asdf plugin-add nodejs
asdf plugin-add pnpm
asdf plugin-add yarn
asdf install
```

---

# 🧩 Node & pnpm Versions (Important)

The repo includes:

### `.nvmrc`

```
20.18.1
```

### `.tool-versions`

```
nodejs 20.18.1
pnpm 9.12.0
yarn 1.22.22
```

To ensure your environment matches, run:

```bash
nvm use
# or
asdf install
```

---

# 📦 Install Dependencies

From the project root:

```bash
pnpm install
```

pnpm automatically links all workspace packages.

---

# 🔐 Environment Variables

Create `.env` files:

```
apps/web/.env.local
apps/api/.env
apps/mobile/.env
```

Typical variables include:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
```

---

# ▶️ Running the Apps

## Web App (Next.js)

```bash
pnpm dev:web
```

Runs at: [http://localhost:3000](http://localhost:3000)

---

## Mobile App (Expo)

```bash
pnpm dev:mobile
```

Opens Expo Dev Tools:

* Press **i** — iOS Simulator (macOS only)
* Press **a** — Android Emulator
* Scan QR — physical device

---

## API Server (NestJS)

```bash
pnpm dev:api
```

Backend runs at:
`http://localhost:3001`

Swagger docs:
`http://localhost:3001/docs`

---

# 🗄️ Database Setup (Supabase)

### 1. Install Supabase CLI

```bash
brew install supabase/tap/supabase
```

### 2. Link to your project

```bash
supabase login
supabase link --project-ref <PROJECT_ID>
```

### 3. Apply the schema

```bash
supabase db push
```

or:

```bash
psql $DATABASE_URL -f supabase/schema.sql
```

---

# 🧰 Useful Commands

Build everything:

```bash
pnpm build
```

Lint everything:

```bash
pnpm lint
```

Run tests:

```bash
pnpm test
```

Update all shared packages:

```bash
pnpm -w build
```

---

# 🧨 Troubleshooting

### ❗ `ERR_PNPM_FETCH_404`

You forgot to use `"workspace:*"` in dependencies.

### ❗ Corepack signature error

Use Node 20:

```bash
nvm use 20
corepack prepare pnpm@9.12.0 --activate
```

### ❗ Expo throws Metro symlink errors

Do NOT run on Windows native Node — use WSL2.

### ❗ SWC errors on Next.js

Means your Node version mismatched.
Fix with:

```bash
nvm use
```

---

# 🤝 Contributing

1. Use Node 20
2. Use pnpm
3. Ensure all shared packages build:

```bash
pnpm -w build
```

4. Open PR with clear scope
5. All changes must pass lint + typecheck

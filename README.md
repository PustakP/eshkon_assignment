# Eshkon Page Builder

RBAC-powered page builder with draft/preview/publish workflows, built with Next.js 14 (App Router), Supabase, and TipTap.

## Architecture

```
src/
├── app/
│   ├── (auth)/          # login, register
│   ├── (dashboard)/     # pages, users, settings (auth required)
│   ├── (public)/        # published pages (no auth)
│   └── api/auth/        # supabase auth callback
├── lib/
│   ├── rbac/            # roles, permissions, withPermission wrapper
│   ├── supabase/        # client, server, admin, middleware helpers
│   └── actions/         # server actions (pages, users)
├── components/
│   ├── builder/         # tiptap editor, block renderer, toolbar
│   └── ui/              # sidebar, topbar, shared components
└── types/               # typescript types
```

## RBAC Model

Enforcement at three layers:

1. **Next.js Middleware** — redirects unauthenticated users
2. **Server Actions** — `withPermission(action, fn)` validates role before mutations
3. **Supabase RLS** — database-level row security as last line of defense

| Action | viewer | editor | admin | super_admin |
|---|---|---|---|---|
| View published pages | ✓ | ✓ | ✓ | ✓ |
| Create/edit drafts | | ✓ | ✓ | ✓ |
| Preview unpublished | | ✓ | ✓ | ✓ |
| Publish/unpublish | | | ✓ | ✓ |
| Manage users | | | ✓ | ✓ |
| System settings | | | | ✓ |

## Setup

### Prerequisites

- Node.js 20+
- pnpm
- Supabase project

### 1. Install dependencies

```bash
pnpm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Database setup

Open **Supabase SQL Editor** and run the contents of `supabase/schema.sql`. This creates:

- `profiles` table with auto-creation trigger on signup
- `pages` table with JSONB content
- `page_versions` table for audit trail
- RLS policies for all tables
- Performance indexes

### 4. First super admin

After registering your first user, promote them to super_admin via SQL:

```sql
update public.profiles set role = 'super_admin' where email = 'your@email.com';
```

### 5. Run development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Testing

```bash
pnpm test        # run all tests
pnpm test:watch  # watch mode
```

Tests cover:
- RBAC permission matrix (all role × action combinations)
- Role hierarchy and manageable roles

## CI/CD

**GitHub Actions** (`.github/workflows/ci.yml`) runs on every push/PR to `main`:
- lint → typecheck → unit tests

**Vercel** handles deployment automatically via its GitHub integration. On every push to `main`, Vercel builds and deploys. To block deploys on test failure, enable "Required status checks" in your GitHub branch protection rules and add the `test` job.

No GitHub Secrets are required for the CI pipeline — Vercel manages env vars through its own dashboard.

## Commit Convention

Follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(rbac): add server-side permission enforcement
feat(builder): implement block-based page editor
fix(pages): prevent slug collision on publish
chore(ci): add github actions workflow
docs: add readme with setup instructions
```

## Tech Stack

- **Framework**: Next.js 14 (App Router), TypeScript (strict)
- **Auth & DB**: Supabase (Auth + Postgres + RLS)
- **Editor**: TipTap (ProseMirror)
- **Styling**: Tailwind CSS v4 (orange/beige/mint-green, sharp corners)
- **Testing**: Vitest + Testing Library
- **CI/CD**: GitHub Actions → Vercel
- **Package Manager**: pnpm

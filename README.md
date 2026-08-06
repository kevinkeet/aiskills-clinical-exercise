# Skill AI RCT

Research platform for **Stanford IRB-86737** — a randomized trial testing whether internal medicine
residents who work a clinical case *with* an AI assistant acquire knowledge they can later deploy
*without* it.

**Live study site:** https://aiskills.kevinkeet.com

### Start here

| If you want to… | Read |
|---|---|
| **Understand the study at a glance** | **[`PROJECT-OVERVIEW.md`](PROJECT-OVERVIEW.md)** ← one page, start here |
| Work on the code / run operations | [`HANDOFF.md`](HANDOFF.md) — stack, deploy, database, playbooks, conventions |
| Read the paper or study materials | [`docs/`](docs/) — manuscript, preregistration, literature review, quiz + answer key |

### Quick start (development)

```bash
npm install
npm run dev          # http://localhost:3000
```

Requires `.env.local` (Supabase, Anthropic, admin/session secrets) — see `.env.local.example`.
Verify changes with `npx tsc --noEmit` and `npx next build`; pushes to `main` auto-deploy to Vercel.

> ⚠️ **Tasks and quiz questions live in the database**, edited via `/admin` — not in `src/data/*.ts`
> (those are seed-if-empty backups). Deploying code alone will not change what participants see.

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind · Supabase (Postgres) · Anthropic SDK · Vercel.

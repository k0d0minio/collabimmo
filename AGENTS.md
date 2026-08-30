# AGENTS.md — Layer 0: Repository Identity & Routing

> This is the **first file any agent session reads.** It says what this repo is and where
> to go for a given task. Keep it short; detail lives in `README.md` and the routed files.

## What this repo is

**collabimmo** — the professional website for **Collabimmo**, a bespoke real-estate
transaction business. The site is **in French**: copy, `README.md` and the client
documents under `doc/` are all French, and French is the working language of anything
user-facing here.

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Radix UI · Framer Motion ·
Resend + React Email for mail · **Cloudflare Turnstile** on the forms · Biome · deployed
on Vercel, with a `ci.yml` workflow.

**There is an admin surface.** `middleware.ts` protects every `/admin` route behind a
shared admin password (`lib/admin/auth.ts`), redirecting unauthenticated requests to
`/admin/login` with a `next` param. Treat that gate as load-bearing.

## Routing — "if the task is… → go to…"

| The task | Go to |
|---|---|
| Pages and routes | [`app/`](app/) |
| Page sections, layout chrome, shared UI | [`components/sections/`](components/sections/) · [`components/layout/`](components/layout/) · [`components/common/`](components/common/) · [`components/ui/`](components/ui/) |
| The admin surface | [`components/admin/`](components/admin/) + [`lib/admin/`](lib/admin/) + [`middleware.ts`](middleware.ts) |
| Site name, description, metadata, nav, hero media | [`config/site.ts`](config/site.ts) · [`config/navigation.ts`](config/navigation.ts) · [`config/heroMedia.ts`](config/heroMedia.ts) |
| Environment variables and their validation | [`lib/env.ts`](lib/env.ts) |
| Form validation, sanitising, rate limiting | [`lib/validations.ts`](lib/validations.ts) · [`lib/sanitize.ts`](lib/sanitize.ts) · [`lib/rateLimit.ts`](lib/rateLimit.ts) |
| Transactional email | [`components/email.tsx`](components/email.tsx) + Resend |
| WhatsApp integration | [`lib/whatsapp/`](lib/whatsapp/) |
| SEO, metadata, structured data | [`lib/seo.ts`](lib/seo.ts) + `config/site.ts` |
| Client-supplied source material | [`doc/`](doc/) — the presentation deck and the modifications brief |
| CI | [`.github/workflows/ci.yml`](.github/workflows/ci.yml) |
| Plan or track work on this repo | [`.icm/intake/`](.icm/intake/) — epics and stubs, contract in its README |

## Standing rules

- **User-facing copy is French.** Do not introduce English strings into the site, and do
  not "correct" French copy toward English phrasing.
- **Site identity comes from `config/site.ts` and the environment**, not from hardcoded
  strings scattered through components.
- **The `/admin` gate and the form defences are load-bearing.** Turnstile, rate limiting
  and sanitising exist because this is a public form on a real business — never disable one
  for local convenience.
- **CI is the source of truth.** Never run `build`/`lint`/`typecheck` locally — push and
  read the checks.
- **Planning is tickets.** Any plan or backlog becomes stubs in `.icm/intake/`, never a
  loose `TODO.md`. Ticket-only commits go straight to `main`; everything else through a PR
  on a `claude/` branch.
- **Gates are human checkboxes** — read them, never tick them.
- **No secrets in git, ever.** Env vars only (`RESEND_API_KEY`, the Turnstile pair, the
  admin password); flag any plaintext credential found.

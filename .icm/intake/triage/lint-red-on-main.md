# Stub: `main` is red — a `react-hooks` error in the Turnstile component

- feature-slug: lint-red-on-main
- lane: bug
- priority: P2
- sources: found during the estate AGENTS.md rollout, 2026-08-30 · CI run 33307194567

## What this is

The `Lint & Type Check` workflow fails on `main`, and has for at least the last three
pushes — including two that touched nothing but `.icm/` and `.claude/`. Every PR opened
here inherits a red check, so a real failure is indistinguishable from the background one.

One error, `react-hooks/set-state-in-effect`, in
`components/ui/Turnstile.tsx:28`:

```tsx
useEffect(() => {
  setIsMounted(true);
}, []);
```

The mounted-flag pattern — render nothing on the server, flip a flag after hydration —
which the React compiler now rejects. It is not a false positive so much as an outdated
idiom: the same effect is usually replaceable by `next/dynamic` with `ssr: false` on the
Turnstile widget, or by rendering the placeholder unconditionally and letting the script
attach.

This one matters more than a lint nit because it is the **Cloudflare Turnstile** widget —
the CAPTCHA in front of a public contact form on a real business. Any change here needs
checking against a real submission, not just a green lint.

## Prompt

Get collabimmo's `main` green. Read .icm/intake/triage/lint-red-on-main.md first. The
single failure is `react-hooks/set-state-in-effect` at `components/ui/Turnstile.tsx:28` —
the `setIsMounted(true)` hydration-flag idiom. Replace the shape (client-only dynamic
import, or unconditional render) rather than suppressing the rule, and verify a real form
submission still passes the Turnstile challenge before calling it done — this is the
CAPTCHA on a live public form. Open a PR on a claude/ branch and read the result from CI.

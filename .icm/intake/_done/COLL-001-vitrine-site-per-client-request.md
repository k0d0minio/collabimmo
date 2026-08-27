# COLL-001 · Build the collabimmo.be vitrine per the client's request

| | |
|---|---|
| Status | ready |
| Type | feature |
| Priority | P1 |
| Size | M |
| Sources | [.icm/docs/customer-request.md](../docs/customer-request.md) (client email, verbatim, French) |

## Problem

The client has specified what collabimmo.be must be: a single sober vitrine page — not a
listings site — whose entire job is driving visitors to a contact form that collects as much
information as possible. Colours from their logo; the call to action is the focus; the
professionals page of their partner site (https://v-immo.be/professionnels/) is the style
reference.

## Acceptance

- [ ] Single vitrine page, sober, in the logo's colours.
- [ ] Contact form is the dominant CTA and captures the info the client needs.
- [ ] No property-listing machinery anywhere.
- [ ] Client sign-off against their email (kept verbatim in `.icm/docs/customer-request.md`).

## Prompt

Build the collabimmo.be vitrine site in this repo. Read
.icm/intake/COLL-001-vitrine-site-per-client-request.md and the client's verbatim request in
.icm/docs/customer-request.md for full context. Keep it to one sober page focused on the
contact-form CTA, styled from the logo's colours, referencing
https://v-immo.be/professionnels/ for tone. Open a PR on a claude/ branch; do not run local
checks — CI is the source of truth.

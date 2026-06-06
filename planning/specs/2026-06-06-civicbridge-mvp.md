---
id: civicbridge-mvp-001
type: design
date: 2026-06-06
status: draft
parents: []
---

# CivicBridge MVP Spec Draft

## One-line idea

A platform where constituents verify where they live, discover their elected representatives at each relevant level, and send managed communications through CivicBridge.

## Initial user story

As a constituent, I can enter my address, verify it enough for the product's trust requirements, see my representatives, and submit a message that CivicBridge can route/manage.

## MVP scope

The MVP should prove the core constituent journey:

1. Address capture.
2. Address normalization/geocoding.
3. District/representative lookup.
4. Representative display grouped by level.
5. Constituent message intake.
6. Admin queue for reviewing/routing messages.
7. Audit log for message lifecycle.

## Explicit non-goals for MVP

- No live in-app representative accounts yet.
- No direct representative messaging yet.
- No donation processing yet.
- No campaign contribution conduit behavior yet.
- No claim of legal compliance readiness.
- No storing raw identity documents.

## Why donation processing is deferred

Political donation processing/conduit behavior is legally and operationally sensitive. It likely introduces campaign finance reporting, donor eligibility, payment processor, refund, KYC/KYB, fraud, chargeback, and state/federal compliance questions. This belongs in a separate Tier 1 spec after the communication MVP proves demand.

## Representative lookup data options

Known options to investigate:

- Geocodio: address geocoding plus congressional/state legislative district and legislator data.
- OpenStates: legislative data and district/representative data, likely useful but may need separate geocoding/district matching.
- DataMade My Reps / open civic datasets: useful reference/possible integration.
- Official sources: House.gov, USAGov, FEC/public data where needed.

Google Civic Information Representatives API appears to have a shutdown/turndown history and should not be assumed as the long-term dependency without verification.

## Threat/compliance model draft

Tier 1 trust-root areas:

- Address verification and district mapping.
- Representative identity/contact mapping.
- Message audit log.
- Consent and user communication preferences.
- Any future donation/payment/conduit feature.

Tier 2 areas:

- Public marketing pages.
- Basic UI polish.
- Non-sensitive admin convenience UI.

Important risks:

- Wrong representative shown for address.
- Message sent to wrong official.
- Impersonation/fake constituent spam.
- Sensitive constituent information retained unnecessarily.
- Partisan/compliance exposure if donation/conduit features are bolted on prematurely.
- Representative contact data staleness.

## Design alternatives

### Alternative A: Full-stack monolith first

A Next.js app with server actions/API routes, Postgres, and a small admin dashboard.

Pros:
- Fastest to MVP.
- Easy deployment.
- One repo and one dev loop.

Cons:
- Must be careful not to mix trust-root logic deeply into UI code.

### Alternative B: API/backend plus separate frontend

Dedicated backend service with web frontend.

Pros:
- Cleaner service boundary.
- Easier future mobile/API integrations.

Cons:
- More overhead before product-market learning.

### Alternative C: No-code/low-code prototype

Use Airtable/Retool/forms plus scripts.

Pros:
- Fastest demo.

Cons:
- Weak trust model and harder to mature into reliable civic infrastructure.

## Current recommendation

Use Alternative A for MVP, but isolate trust-root domain logic into explicit modules/packages with contract tests. This keeps the development loop fast while preserving a path to stronger architecture.

## Proposed initial stack

Draft recommendation, not locked:

- Next.js + TypeScript for app/UI/API.
- PostgreSQL for durable data.
- Prisma or Drizzle for schema and migrations.
- Playwright for browser verification.
- Vitest/Jest for unit tests.
- ESLint/TypeScript strict mode.

## Open questions

1. Political scope: nonpartisan civic utility, partisan platform, or campaign infrastructure?
2. Geographic scope for MVP: one state/county/city, or national from day one?
3. Address verification strength: normalized address only, email/SMS confirmation, voter-file/KYC integration later?
4. Representative data provider preference and budget.
5. First communication channel: email routing, generated letters, internal admin-managed queue, or API/webhook integrations?
6. Legal/compliance advisor availability before donation features.
7. Brand/codename preference.

## Self-critique pass 1

- The spec is intentionally conservative around donations because that is likely the highest-risk product area.
- The biggest unresolved technical risk is accurate representative lookup across all levels, especially local offices.
- The biggest unresolved product risk is whether representatives are users, recipients, or merely listed entities in the early phase.
- The MVP should probably start with one jurisdiction or a provider that covers the needed levels, instead of promising every level nationally on day one.
- Need independent critique before implementation plan.

## Independent critique placeholder

Pending Claude/Codex authentication.

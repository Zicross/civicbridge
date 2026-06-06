---
id: civicbridge-mvp-001
type: design
date: 2026-06-06
status: revised-for-plan
parents: []
---

# ConstiuINT MVP Spec

## Working name

The working product name is **ConstiuINT** — constituent intelligence. The earlier repo/project codename remains CivicBridge until renamed, but product-facing copy and implementation planning should use ConstiuINT.

## Product intent

ConstiuINT is intended to become a production public product, not a throwaway demo. The MVP should therefore keep a narrow scope while treating civic identity, address-to-representative mapping, consent, message intake, auditability, abuse prevention, and privacy/data retention as Tier 1 trust-root areas.

## One-line idea

A public platform where constituents can enter an address, discover supported elected representatives with clear provenance, and submit a managed message for ConstiuINT admin review and triage.

## MVP user story

As a constituent, I can enter my address, confirm control of an email address, review representatives that ConstiuINT can identify for my supported jurisdiction/levels, consent to storage/admin review, and submit a message into an internal admin queue.

## Revised MVP scope after independent critique

The initial public-product MVP should prove a narrow but honest loop:

1. Public landing/intake flow under the ConstiuINT name.
2. Email-confirmed constituent identity for message submission.
3. Address capture with normalization/geocoding through a provider abstraction.
4. District/representative lookup for a deliberately limited support shape.
5. Representative display grouped by level, with source, confidence, and as-of/last-verified metadata.
6. Explicit consent before storing the message/address-derived data and placing the message in an admin-reviewed queue.
7. Constituent message intake into an internal queue only.
8. Admin queue with lifecycle states and no hidden external-routing side effects.
9. Append-only audit event API for lifecycle changes, with payload minimization.
10. Provider/lookup, message-state, consent, audit, and browser-flow verification gates.

## MVP support-shape default

Default for implementation planning unless the user overrides:

- Geographic/level scope: **national federal + state legislative lookup only**, not comprehensive local-office coverage.
- Local/county/city/school-board coverage is explicitly deferred until a named jurisdiction and verified data source are selected.
- Representative display must make support limits visible; no UI copy may imply "all representatives at every level" for unsupported levels.

Rationale: this avoids the national local-office data swamp while preserving a public national intake path. A later plan can add one named local jurisdiction with verified local data.

## MVP trust and verification bar

Default for implementation planning unless the user overrides:

- Address verification means provider-backed address normalization/geocoding plus user self-attestation. It does **not** mean legal residency verification, voter-file matching, KYC, or identity-document review.
- Message submission requires email confirmation/magic-link session and basic abuse controls.
- ConstiuINT must not claim that a submitter is a legally verified resident.
- ConstiuINT must not claim delivery to representatives in the MVP.

## Message outcome and user-facing promise

MVP messages are submitted to ConstiuINT for internal admin review and triage. The MVP does not automatically email, mail, API-send, or otherwise deliver messages to offices or representatives.

Required wording principle: say "submit a message for ConstiuINT review/triage," not "send a message to your representative," until external delivery is separately specified and verified.

## Data/provider approach

Initial provider strategy for planning:

- Primary likely provider: Geocodio for normalized/geocoded address plus congressional/state legislative districts/legislator data, subject to ToS, pricing, and political/civic use verification before production use.
- Secondary/reference provider: OpenStates for state legislative metadata where useful.
- Google Civic Information Representatives API should not be assumed as long-term foundation without fresh verification.
- All provider calls must sit behind adapter interfaces. UI/routes must not call provider SDKs directly.
- Provider results must include source, confidence, and as-of/lookup timestamp.
- Provider payloads should not be stored raw unless a reviewed retention reason exists.

## Representative lookup model

A representative record in MVP should distinguish:

- person identity
- office/seat identity
- jurisdiction/level
- district identifier
- term/source metadata when available
- contact/channel metadata, if available
- source provider and last verified/as-of timestamp
- confidence and support-level status

Contact data should be separated from person/office identity because it changes independently and may not be used for external delivery during MVP.

## Privacy, retention, and audit defaults

Default minimization policy for implementation planning:

- Store only the constituent email, normalized address components required for support/debugging, derived district identifiers, representative snapshot metadata, message body, consent timestamp/version, message status, and audit event metadata.
- Do not duplicate raw address, full message body, or raw provider payloads into audit logs.
- Audit events reference message/user IDs and store event type, actor, timestamps, previous/new state, and minimal reason metadata.
- Provider payload retention is off by default. If a raw payload snapshot is later needed for debugging or disputes, it requires a separate retention decision.
- Secrets/API keys never live in repo docs.

## Admin lifecycle states

Initial state machine:

- `new`
- `needs_review`
- `approved_for_manual_handling`
- `rejected`
- `archived`

Every lifecycle transition must be validated by domain code and emit an audit event. External delivery remains out of scope.

## Explicit non-goals for MVP

- No comprehensive local-office coverage nationally.
- No live in-app representative accounts.
- No automated/direct representative messaging or delivery claims.
- No donation processing.
- No campaign contribution conduit behavior.
- No claim of legal compliance readiness.
- No KYC/voter-file/legal-residency verification.
- No storing raw identity documents.
- No raw provider payload retention by default.

## Why donation processing is deferred

Political donation processing/conduit behavior is legally and operationally sensitive. It likely introduces campaign finance reporting, donor eligibility, payment processor, refund, KYC/KYB, fraud, chargeback, and state/federal compliance questions. This belongs in a separate Tier 1 spec after the communication MVP proves demand.

## Design alternatives

### Alternative A: Full-stack monolith first

A Next.js app with server actions/API routes, Postgres, and a small admin dashboard.

Pros:
- Fastest production-grade MVP loop.
- One repo and one dev loop.
- Easy to deploy as a single product surface.

Cons:
- Must enforce boundaries so trust-root logic does not leak into UI/routes.

### Alternative B: API/backend plus separate frontend

Dedicated backend service with web frontend.

Pros:
- Cleaner hard service boundary.
- Easier future mobile/API integrations.

Cons:
- More overhead before product-market learning.

### Alternative C: No-code/low-code prototype

Use forms/Retool/Airtable/scripts.

Pros:
- Fastest demo.

Cons:
- Inappropriate default for a public production product touching civic identity and political communication.

## Chosen approach

Use Alternative A for MVP, but enforce a concrete trust-core boundary:

- `src/core/address` — value types, normalization outputs, confidence rules, retention helpers.
- `src/core/representatives` — representative/office/district models, support-level rules, lookup results.
- `src/core/messages` — intake validation, consent requirements, lifecycle state machine.
- `src/core/audit` — append-only event API and PII minimization policy.
- `src/providers/*` — provider adapters behind interfaces only.
- `src/server/*` — persistence, auth/session, rate limiting, API/server actions.
- `src/app/*` — Next.js routes/UI that call server/domain services, not providers directly.

## Proposed initial stack

- Next.js App Router + TypeScript.
- PostgreSQL for durable data.
- Drizzle ORM for explicit schema/migration control.
- Vitest for unit/contract tests.
- Playwright for browser verification.
- ESLint + TypeScript strict mode.
- Auth.js or equivalent email magic-link/session boundary for constituents/admins.
- Basic rate limiting and bot-mitigation hooks before public intake.

## Open questions

### Must answer before production launch or external delivery

1. Provider ToS/pricing/political-use confirmation for the selected production data providers.
2. Hosting/deployment target and production secrets workflow.
3. Legal/compliance review of user-facing copy, privacy policy, retention policy, and future delivery/donation features.
4. Whether/when to add a named local jurisdiction and verified local-office data.
5. Whether/when messages are externally delivered, by what channel, and under what consent/liability model.

### Defaulted for Plan 1

1. Political positioning: nonpartisan civic utility.
2. Geographic/level scope: national federal + state legislative only.
3. Address verification: normalized/geocoded address plus self-attestation, not legal residence verification.
4. Submitter identity: email magic-link confirmation.
5. Message channel: internal admin-managed queue only.
6. ORM: Drizzle.
7. Product-facing name: ConstiuINT.

## Independent critique results

Claude Code and Codex were run as independent critics before implementation planning.

Persisted artifacts:

- `planning/handoffs/claude-critique-2026-06-06.json`
- `planning/handoffs/codex-critique-2026-06-06.md`
- `planning/handoffs/2026-06-06-independent-critique-synthesis.md`

Synthesis:

- Both critics returned `REVISE_SPEC_FIRST`, not `BLOCKED`.
- Both highlighted geographic/level scope, verification semantics, message outcome, consent, retention, audit-log minimization, representative-data provenance, and anti-abuse controls as plan-shaping decisions.
- This revised spec defaults those decisions conservatively so Plan 1 can proceed without pretending the high-risk questions are solved.

## Verification expectations

Plan 1 must include:

- Provider adapter contract tests and fixture-based golden lookup tests.
- No ZIP-only district fallback.
- Representative display includes source/as-of/confidence/support limits.
- Consent required before message submission.
- Message lifecycle state-machine unit tests.
- Audit tests proving raw address/message body/provider payloads are not duplicated into audit events.
- Rate-limit/session tests around message intake.
- Playwright public intake and admin review smoke flows.
- Import-boundary/static checks keeping `src/core/*` framework-independent.
- Dedicated Tier 1 review before implementation is considered complete.

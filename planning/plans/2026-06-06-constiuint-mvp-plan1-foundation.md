# ConstiuINT MVP Foundation Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task. Use strict TDD for behavior changes. For parallel execution, workers write files only; Hermes/orchestrator owns git operations.

**Goal:** Build the production-grade MVP foundation for ConstiuINT: email-confirmed public structured feedback intake, provider-backed representative lookup for the supported federal/state scope, an internal admin queue, and privacy-minimized audit lifecycle events.

**Architecture:** Use a Next.js TypeScript monolith for speed, with trust-root logic isolated in framework-independent `src/core/*` modules. Provider integrations sit behind adapter interfaces. Persistence/auth/server actions live under `src/server/*`; UI routes live under `src/app/*` and call server/domain services rather than provider SDKs directly. Treat messaging as one workflow inside a broader constituent-intelligence platform: the data model should support issue/topic categorization and future aggregated constituency signals without implementing representative polling in Plan 1.

**Tech Stack:** Next.js App Router, TypeScript strict mode, PostgreSQL, Drizzle ORM, Auth.js/email magic-link or equivalent session boundary, Vitest, Playwright, ESLint, import-boundary checks, provider fixtures plus Geocodio-first adapter.

**Spec Reference:** `planning/specs/2026-06-06-civicbridge-mvp.md` (status: revised-for-plan)

**Critique Inputs:**
- `planning/handoffs/claude-critique-2026-06-06.json`
- `planning/handoffs/codex-critique-2026-06-06.md`
- `planning/handoffs/2026-06-06-independent-critique-synthesis.md`

---

## Scope guardrails

### In scope for Plan 1

- Product-facing name ConstiuINT.
- Production-oriented scaffold, not disposable prototype.
- National federal + state legislative support shape only.
- Address normalization/geocoding + district/representative lookup through provider abstraction.
- Email-confirmed constituent session before message submission.
- Consent-gated structured feedback intake into internal admin queue.
- Issue/topic categorization so feedback can later roll up into constituency intelligence.
- Admin lifecycle state machine: `new`, `needs_review`, `approved_for_manual_handling`, `rejected`, `archived`.
- Append-only audit event API with PII minimization.
- Abuse controls sufficient for public intake baseline: rate-limit hook, email session requirement, bot-mitigation integration point.
- Test/lint/typecheck/browser gates.

### Explicitly out of scope for Plan 1

- Automated or manual implementation of external delivery to representatives.
- Any copy that claims a message was sent to a representative.
- Comprehensive local/county/city/school-board coverage nationally.
- Representative accounts or representative-side messaging.
- Representative-initiated polling, surveys, or outbound constituency campaigns.
- Donation/conduit/payment behavior.
- Voter-file/KYC/legal-residency verification.
- Raw identity document handling.
- Production deployment unless a later plan specifies hosting/secrets/observability.

---

## Target file structure

```text
.
├── AGENTS.md
├── README.md
├── .env.example
├── package.json
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── playwright.config.ts
├── vitest.config.ts
├── drizzle.config.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── intake/page.tsx
│   │   ├── intake/actions.ts
│   │   ├── admin/page.tsx
│   │   └── admin/actions.ts
│   ├── components/
│   │   ├── AddressLookupForm.tsx
│   │   ├── RepresentativeList.tsx
│   │   ├── ConsentCheckbox.tsx
│   │   ├── MessageForm.tsx
│   │   └── AdminQueueTable.tsx
│   ├── core/
│   │   ├── address/
│   │   │   ├── types.ts
│   │   │   ├── normalize.ts
│   │   │   └── minimization.ts
│   │   ├── representatives/
│   │   │   ├── types.ts
│   │   │   ├── supportScope.ts
│   │   │   └── lookup.ts
│   │   ├── messages/
│   │   │   ├── types.ts
│   │   │   ├── consent.ts
│   │   │   └── stateMachine.ts
│   │   └── audit/
│   │       ├── types.ts
│   │       └── redaction.ts
│   ├── providers/
│   │   ├── representativeProvider.ts
│   │   ├── fixtures/
│   │   │   ├── fixtureProvider.ts
│   │   │   └── goldenAddresses.ts
│   │   └── geocodio/
│   │       ├── geocodioProvider.ts
│   │       └── mapper.ts
│   ├── server/
│   │   ├── db/
│   │   │   ├── client.ts
│   │   │   ├── schema.ts
│   │   │   └── migrations/
│   │   ├── auth/
│   │   │   ├── config.ts
│   │   │   └── requireAdmin.ts
│   │   ├── rateLimit.ts
│   │   ├── services/
│   │   │   ├── lookupService.ts
│   │   │   ├── messageService.ts
│   │   │   └── auditService.ts
│   │   └── env.ts
│   └── test/
│       ├── setup.ts
│       └── factories.ts
├── tests/
│   ├── unit/
│   ├── contract/
│   ├── integration/
│   └── e2e/
└── docs/
    ├── architecture/
    │   ├── trust-core-boundaries.md
    │   └── pii-data-flow.md
    └── product/
        └── supported-scope.md
```

---

## Global verification commands

Use these as gates throughout the plan:

```bash
npm run lint
npm run typecheck
npm run test
npm run test:contract
npm run test:e2e
npm run build
```

Expected final outcome: all commands pass with zero unexplained TODOs in Tier 1 modules (`src/core`, `src/providers`, `src/server/services`, `src/server/db`).

---

## Task 1: Scaffold the production TypeScript/Next.js foundation

**Objective:** Create the app scaffold and quality gates without implementing product behavior yet.

**Files:**
- Create/modify: `package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `vitest.config.ts`, `playwright.config.ts`, `.env.example`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/test/setup.ts`
- Modify: `README.md`

**Step 1: Scaffold app dependencies**

Create a Next.js TypeScript app in the existing repo without overwriting planning docs. Install or configure:

- Next.js App Router
- React/React DOM
- TypeScript
- ESLint
- Vitest + Testing Library
- Playwright
- Drizzle + Postgres driver
- Zod
- Auth.js/email-provider dependencies or a clearly isolated placeholder auth adapter if mail provider is not configured yet

**Step 2: Add scripts**

`package.json` must expose:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:contract": "vitest run tests/contract",
    "test:e2e": "playwright test",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate"
  }
}
```

Adjust `lint` if the installed Next.js version uses ESLint directly rather than `next lint`.

**Step 3: Add environment template**

`.env.example` must include placeholders only:

```text
DATABASE_URL=postgres://postgres:postgres@localhost:5432/constiuint
NEXTAUTH_SECRET=replace-me
NEXTAUTH_URL=http://localhost:3000
EMAIL_SERVER=smtp://user:pass@example.com:587
EMAIL_FROM=noreply@example.com
GEOCODIO_API_KEY=replace-me
ADMIN_EMAILS=admin@example.com
```

No real secrets.

**Step 4: Add basic app shell**

Home page should use the ConstiuINT name and conservative wording:

- "Find supported representatives"
- "Submit a message for ConstiuINT review"
- Must not say "send to your representative"

**Step 5: Run gates**

Run:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Expected: pass or, for first scaffold, only documented install/tooling issues fixed before commit.

**Commit block:**

```bash
git add package.json package-lock.json next.config.ts tsconfig.json eslint.config.mjs vitest.config.ts playwright.config.ts .env.example src/app src/test README.md
git commit -m "chore: scaffold ConstiuINT app foundation"
```

---

## Task 2: Define trust-core domain types and import boundaries

**Objective:** Create framework-independent domain modules for address, representatives, messages, and audit.

**Files:**
- Create: `src/core/address/types.ts`, `src/core/address/minimization.ts`
- Create: `src/core/representatives/types.ts`, `src/core/representatives/supportScope.ts`
- Create: `src/core/messages/types.ts`, `src/core/messages/consent.ts`, `src/core/messages/stateMachine.ts`
- Create: `src/core/audit/types.ts`, `src/core/audit/redaction.ts`
- Create: `tests/unit/core/*.test.ts`
- Create: `docs/architecture/trust-core-boundaries.md`

**Step 1: Write failing import-boundary/documentation test**

Add a test or lint rule asserting `src/core/**` does not import from:

- `next/*`
- `react`
- `drizzle-orm`
- provider SDKs
- `src/server/*`

Expected RED: fails until boundary mechanism exists or modules are created.

**Step 2: Implement core types**

Define explicit types for:

- normalized address and address confidence
- supported scope result (`supported`, `unsupported-local`, `low-confidence`, `no-match`)
- representative person/office/district/contact/source metadata
- message consent version/timestamp
- message lifecycle states and transitions
- audit event metadata with no raw message/address fields

**Step 3: Implement lifecycle transition rules**

Allowed transitions:

- `new` → `needs_review`
- `new` → `rejected`
- `needs_review` → `approved_for_manual_handling`
- `needs_review` → `rejected`
- `approved_for_manual_handling` → `archived`
- `rejected` → `archived`

All others reject with typed errors.

**Step 4: Implement redaction/minimization helpers**

Add tests proving audit-safe event payloads do not contain:

- full raw address string
- raw provider payload
- message body

**Step 5: Run gates**

```bash
npm run test -- tests/unit/core
npm run lint
npm run typecheck
```

**Commit block:**

```bash
git add src/core tests/unit/core docs/architecture/trust-core-boundaries.md
git commit -m "feat: define ConstiuINT trust-core domain contracts"
```

---

## Task 3: Create provider abstraction and fixture contract tests

**Objective:** Build representative lookup behind a provider interface with fixture-based golden addresses before any live provider dependency.

**Files:**
- Create: `src/providers/representativeProvider.ts`
- Create: `src/providers/fixtures/fixtureProvider.ts`
- Create: `src/providers/fixtures/goldenAddresses.ts`
- Create: `tests/contract/representativeProvider.contract.test.ts`
- Create: `docs/product/supported-scope.md`

**Step 1: Write failing contract tests**

Tests must cover:

- supported federal + state address returns representatives with source/as-of/confidence
- unsupported local level is explicit and not silently omitted
- low-confidence address returns no authoritative representatives
- no ZIP-only district fallback exists
- representative contact metadata is separate from office/person identity

Expected RED: provider interface/fixture not implemented.

**Step 2: Implement provider interface**

Interface should accept a normalized/geocoded address input and return a typed lookup result:

- `status`
- `normalizedAddress`
- `districts`
- `representatives`
- `source`
- `asOf`
- `confidence`
- `unsupportedLevels`
- `warnings`

**Step 3: Implement fixture provider**

Use deterministic fixtures for at least five addresses initially:

- normal supported address
- low-confidence address
- address with only federal/state support and local unsupported
- no-match address
- edge-case address with warning metadata

The later live provider task can expand this to ≥30 golden addresses.

**Step 4: Document supported scope**

`docs/product/supported-scope.md` must state:

- national federal + state legislative only in MVP
- local offices deferred
- no delivery claim
- source/as-of/confidence required in UI

**Step 5: Run gates**

```bash
npm run test:contract
npm run typecheck
```

**Commit block:**

```bash
git add src/providers tests/contract docs/product/supported-scope.md
git commit -m "feat: add representative provider contracts and fixtures"
```

---

## Task 4: Add database schema and migration for minimized persistence

**Objective:** Create Postgres/Drizzle schema that supports users, address-derived lookup snapshots, messages, consent, admin states, and audit events without duplicating sensitive payloads into audit logs.

**Files:**
- Create: `src/server/db/client.ts`, `src/server/db/schema.ts`, `drizzle.config.ts`
- Create: `tests/unit/server/schemaShape.test.ts` or equivalent schema assertions
- Create: `docs/architecture/pii-data-flow.md`
- Update: `.env.example`

**Step 1: Write failing schema/privacy tests**

Tests should assert:

- audit events table has no `messageBody`, `rawAddress`, or `rawProviderPayload` column
- message table stores message body once
- address snapshot stores normalized components and provider/source metadata, not raw provider payload by default
- consent version/timestamp is required for message submission
- issueCategory is required so submissions can support structured feedback and future aggregated constituency intelligence

**Step 2: Implement schema**

Minimum tables:

- `users`: id, email, emailVerifiedAt, createdAt
- `sessions`/auth tables if required by auth library
- `addressLookups`: id, userId, normalized address fields, geocode coordinates if needed, districts JSON or normalized child table, provider source, confidence, asOf, createdAt
- `representativeSnapshots`: id, lookupId, person/office/district/source/contact metadata snapshot, confidence, asOf
- `messages`: id, userId, addressLookupId, issueCategory, issueTags, body, status, consentVersion, consentedAt, createdAt, updatedAt
- `auditEvents`: id, entityType, entityId, actorType, actorId, eventType, previousState, newState, reasonCode/reasonSummary, metadata JSON minimized, createdAt
- optional `wrongRepresentativeFlags`: id, userId/messageId/lookupId, details, createdAt

**Step 3: Add migration generation**

Run:

```bash
npm run db:generate
```

Expected: migration created under `src/server/db/migrations/` or configured Drizzle migrations directory.

**Step 4: Write PII data-flow doc**

Document:

- address input path
- geocoder/provider path
- persisted fields
- audit fields
- fields deliberately not retained
- unresolved production privacy-policy/legal-review items

**Step 5: Run gates**

```bash
npm run test -- tests/unit/server
npm run typecheck
npm run db:generate
```

**Commit block:**

```bash
git add drizzle.config.ts src/server/db tests/unit/server docs/architecture/pii-data-flow.md .env.example
git commit -m "feat: add minimized persistence schema"
```

---

## Task 5: Implement consent, auth boundary, and intake service

**Objective:** Ensure only email-confirmed users with explicit consent can submit messages into the internal queue.

**Files:**
- Create: `src/server/auth/config.ts`, `src/server/auth/requireAdmin.ts`
- Create: `src/server/rateLimit.ts`
- Create: `src/server/services/messageService.ts`, `src/server/services/auditService.ts`
- Create: `tests/unit/server/messageService.test.ts`, `tests/unit/server/auditService.test.ts`
- Update: `src/core/messages/consent.ts`

**Step 1: Write failing service tests**

Tests must verify:

- unauthenticated user cannot submit message
- email-unverified user cannot submit message
- missing consent blocks submission
- missing issue category blocks submission
- consent version/timestamp is recorded
- initial message status is `new`
- audit event is created without raw message body/address/provider payload
- rate-limit hook is called before accepting submission

**Step 2: Implement auth/session abstraction**

Use Auth.js/email magic-link or a narrow internal abstraction if SMTP is not configured yet. The service layer should depend on an authenticated `userId/emailVerified` context, not directly on UI details.

**Step 3: Implement message service**

`submitMessage` should:

1. verify authenticated/verified user
2. enforce rate-limit/bot-mitigation hook
3. require current consent version
4. persist lookup snapshot/message with issue category/tags
5. create minimized audit event
6. return message ID/status

**Step 4: Implement audit service**

Audit service should be append-only at application level. DB-level append-only grants may be deferred until deployment/role setup but must be documented as a production gate.

**Step 5: Run gates**

```bash
npm run test -- tests/unit/server/messageService.test.ts tests/unit/server/auditService.test.ts
npm run typecheck
```

**Commit block:**

```bash
git add src/server/auth src/server/rateLimit.ts src/server/services tests/unit/server src/core/messages
git commit -m "feat: enforce consent-gated message intake"
```

---

## Task 6: Implement lookup service and Geocodio adapter skeleton

**Objective:** Wire the provider contract into server-side lookup while keeping live API use optional and safely isolated.

**Files:**
- Create: `src/server/services/lookupService.ts`
- Create: `src/providers/geocodio/geocodioProvider.ts`, `src/providers/geocodio/mapper.ts`
- Create: `tests/unit/providers/geocodioMapper.test.ts`
- Create: `tests/integration/lookupService.test.ts`
- Update: `.env.example`

**Step 1: Write failing mapper tests**

Tests should use saved sanitized sample payloads or synthetic provider-shaped objects. Cover:

- maps districts/representatives to core types
- includes source/as-of/confidence
- flags unsupported local levels
- rejects/marks low-confidence results
- never falls back from ZIP alone

**Step 2: Implement Geocodio mapper**

Mapping code must be pure and separately testable. Do not call network from mapper tests.

**Step 3: Implement provider adapter skeleton**

Adapter should:

- read `GEOCODIO_API_KEY` via `src/server/env.ts`
- fail closed with a typed configuration error if missing in live mode
- support fixture provider for tests/local dev
- not expose raw payload to UI

**Step 4: Implement lookup service**

Service should call configured provider, persist lookup/representative snapshots through DB boundary, and return UI-safe lookup results.

**Step 5: Run gates**

```bash
npm run test -- tests/unit/providers tests/integration/lookupService.test.ts
npm run test:contract
npm run typecheck
```

**Commit block:**

```bash
git add src/server/services/lookupService.ts src/providers/geocodio tests/unit/providers tests/integration .env.example
git commit -m "feat: add lookup service and Geocodio adapter boundary"
```

---

## Task 7: Build public intake UI with conservative product copy

**Objective:** Implement the user-facing flow: address lookup, representative intelligence display, issue/topic selection, consent, and structured feedback submission into admin queue.

**Files:**
- Create/modify: `src/app/intake/page.tsx`, `src/app/intake/actions.ts`
- Create/modify: `src/components/AddressLookupForm.tsx`, `RepresentativeList.tsx`, `ConsentCheckbox.tsx`, `MessageForm.tsx`
- Create: `tests/e2e/intake.spec.ts`
- Create/modify: component tests under `tests/unit/components/`

**Step 1: Write failing Playwright flow**

Test must verify:

1. page uses ConstiuINT name
2. copy says "submit for review/triage," not "send to representative"
3. user enters fixture address
4. representative list renders grouped federal/state results with source/as-of/confidence
5. unsupported local levels are shown honestly
6. user must choose an issue/topic category before submission
7. submission is blocked until consent checkbox is checked
8. successful submission displays internal-review status, not delivery confirmation

**Step 2: Implement components**

Components should receive UI-safe data only. They must not import provider/server modules directly.

**Step 3: Implement server actions**

Actions should call `lookupService` and `messageService`. No provider SDK calls in route/action code.

**Step 4: Run browser and tests**

```bash
npm run test -- tests/unit/components
npm run test:e2e -- tests/e2e/intake.spec.ts
npm run lint
npm run typecheck
```

**Commit block:**

```bash
git add src/app/intake src/components tests/e2e/intake.spec.ts tests/unit/components
git commit -m "feat: build consent-gated public intake flow"
```

---

## Task 8: Build admin queue UI and lifecycle actions

**Objective:** Let an authorized admin review messages and move them through lifecycle states with audited transitions.

**Files:**
- Create/modify: `src/app/admin/page.tsx`, `src/app/admin/actions.ts`
- Create/modify: `src/components/AdminQueueTable.tsx`
- Create: `tests/unit/server/adminActions.test.ts`
- Create: `tests/e2e/admin.spec.ts`

**Step 1: Write failing lifecycle/admin tests**

Tests must verify:

- non-admin cannot access admin queue
- admin can view message list without seeing raw audit payloads
- valid state transitions work
- invalid state transitions fail
- every transition creates audit event
- no transition sends or implies external delivery

**Step 2: Implement admin authorization**

Use `ADMIN_EMAILS` allowlist for Plan 1, isolated behind `requireAdmin` for future role model.

**Step 3: Implement admin queue**

Queue should show:

- message summary/body where appropriate for admin review
- normalized address/district summary
- representative snapshot metadata
- status
- audit history metadata
- action buttons for valid next states

**Step 4: Run gates**

```bash
npm run test -- tests/unit/server/adminActions.test.ts
npm run test:e2e -- tests/e2e/admin.spec.ts
npm run lint
npm run typecheck
```

**Commit block:**

```bash
git add src/app/admin src/components/AdminQueueTable.tsx tests/unit/server/adminActions.test.ts tests/e2e/admin.spec.ts
git commit -m "feat: add audited admin review queue"
```

---

## Task 9: Add Tier 1 verifier and production-readiness docs

**Objective:** Add a dedicated verifier script/checklist for trust-root constraints and document remaining launch blockers.

**Files:**
- Create: `scripts/verify-tier1.ts` or `scripts/verify-tier1.mjs`
- Create: `docs/architecture/tier1-verification.md`
- Create: `docs/product/launch-blockers.md`
- Update: `package.json`

**Step 1: Write verifier expectations**

Verifier should check or require evidence for:

- `src/core/*` imports no framework/provider/server modules
- no audit event schema columns for raw address/message/provider payload
- supported-scope doc exists and mentions federal/state-only MVP
- user-facing copy avoids "send to representative" delivery claim
- provider ToS/pricing/political-use is listed as unresolved production gate unless actually verified
- no TODO/FIXME in Tier 1 paths unless allowlisted with rationale

**Step 2: Add script**

`package.json`:

```json
{
  "scripts": {
    "verify:tier1": "tsx scripts/verify-tier1.ts"
  }
}
```

**Step 3: Document launch blockers**

`docs/product/launch-blockers.md` must list:

- provider ToS/pricing/political-use verification
- privacy policy/legal copy
- production database role/grant setup for audit append-only hardening
- hosting/secrets/observability plan
- email provider configuration and deliverability
- bot mitigation provider choice
- legal review before external delivery or donations

**Step 4: Run final gates**

```bash
npm run verify:tier1
npm run lint
npm run typecheck
npm run test
npm run test:contract
npm run test:e2e
npm run build
```

**Commit block:**

```bash
git add scripts/verify-tier1.ts docs/architecture/tier1-verification.md docs/product/launch-blockers.md package.json package-lock.json
git commit -m "test: add Tier 1 verification gate"
```

---

## Final integration review

After all tasks are implemented:

1. Run the full gate suite:

```bash
npm run verify:tier1
npm run lint
npm run typecheck
npm run test
npm run test:contract
npm run test:e2e
npm run build
```

2. Start the dev server and exercise the UI in a browser:

```bash
npm run dev
```

Browser checks:

- Home page uses ConstiuINT.
- Intake flow does not claim delivery to representatives.
- Representative results include source/as-of/confidence.
- Unsupported local levels are visible.
- Consent is required.
- Submission confirms internal review/triage only.
- Admin state changes create visible audit events.

3. Run independent review:

- Claude Code reviews spec compliance and Tier 1 risks.
- Codex reviews implementation quality and tests.
- Hermes verifies claims through git diff, test output, and browser evidence.

4. Only then commit any remaining integration docs or create a handoff.

---

## Parallel execution guidance

This plan can be executed sequentially at first. If parallelizing:

- Wave 1: Task 1 only.
- Wave 2 after scaffold: Task 2 and Task 3 can run in parallel if workers do not touch the same files.
- Wave 3: Task 4 must land before Tasks 5, 7, and 8.
- Wave 4: Task 5 and Task 6 can run in parallel with careful service-boundary coordination.
- Wave 5: Task 7 then Task 8.
- Wave 6: Task 9 and final review.

Parallel workers must not run git operations. Hermes/orchestrator stages and commits after reviewing diffs.

---

## Plan self-critique

- This plan intentionally defaults national federal/state support to avoid local-office data overclaiming. If the user wants local offices in MVP, write a separate data-provider spike and named-jurisdiction plan before implementation.
- The plan uses fixture provider tests first because production provider keys/ToS/pricing may not be available at implementation time. This is acceptable only if production launch remains gated on provider verification.
- Email magic-link auth may require real SMTP/provider setup. If unavailable during local development, use an isolated test auth adapter but do not weaken the production requirement that public message submission requires verified email.
- DB-level append-only audit enforcement may require deployment-specific roles/grants. The app-level audit API and schema tests are Plan 1; production DB grants remain a launch blocker unless implemented in this plan's environment.
- This plan is too large for a single blind coding pass. Execute task-by-task with TDD and two-stage review.

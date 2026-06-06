Executive verdict: **REVISE_SPEC_FIRST**

The spec is directionally sane, but too many Tier 1 decisions are unresolved to produce a reliable implementation plan. The main problem is not stack choice. It is that address-to-representative mapping, message authority, consent, retention, and routing semantics are still underspecified. Planning now would force implementers to invent compliance-sensitive product behavior.

**Top 10 Findings**

1. **Critical: Geographic scope is not plan-ready**
   Plan impact: A national MVP and a one-jurisdiction MVP are different products. Provider choice, schemas, district levels, test fixtures, admin workflows, and error handling all depend on this. Pick one jurisdiction or explicitly limit MVP to federal + state for supported addresses only.

2. **Critical: “Verify where they live” is undefined**
   Plan impact: Normalized address, deliverable address, residency assertion, and legal identity verification are very different trust levels. The plan must define MVP as “address normalization + constituent self-attestation” unless stronger verification is actually required.

3. **Critical: Message routing authority is ambiguous**
   Plan impact: “CivicBridge can route/manage” could mean storing a draft, emailing an office, generating a letter, or manual admin forwarding. Each has different consent, abuse, audit, deliverability, and liability implications. MVP should default to admin-reviewed internal queue only, with no external sending until separately specified.

4. **High: Representative lookup accuracy/staleness is a trust-root risk**
   Plan impact: Provider integration cannot be treated as a convenience API. The plan needs provider freshness metadata, lookup confidence, source attribution, failure modes, and tests using known boundary addresses. Never silently present stale or uncertain representatives as authoritative.

5. **High: Representative identity/contact mapping is underspecified**
   Plan impact: A “representative” needs stable identity, office, district, term, jurisdiction, source, contact channel, last verified timestamp, and confidence. Contact information should be separated from person/office identity because it changes independently.

6. **High: Consent model is missing**
   Plan impact: Message intake needs explicit user consent for storage, admin review, possible forwarding, and communication preferences. Without this, implementation will scatter consent assumptions across UI, DB, and admin flows.

7. **High: Audit log could become a privacy liability**
   Plan impact: “Audit log for message lifecycle” must distinguish immutable operational events from sensitive message contents. The plan should log event metadata and state transitions, not duplicate full message text or raw address data into append-only logs.

8. **High: Retention/minimization policy is missing**
   Plan impact: Address, message body, contact info, IP/user-agent, admin actions, and provider responses need retention rules before schema design. Default should be minimal storage: normalized address components and derived districts, not raw provider payloads unless justified.

9. **Medium: Abuse/spam/impersonation controls are absent**
   Plan impact: Even without direct sending, message intake can be abused. The plan should include rate limiting, CAPTCHA or equivalent, email confirmation if accounts are not used, admin status controls, and moderation states.

10. **Medium: Stack recommendation is acceptable but boundary guidance needs teeth**
   Plan impact: “Next.js monolith with isolated modules” is fine, but the plan must enforce boundaries: provider adapters, trust-root domain services, persistence layer, admin UI, and public UI should not directly call each other ad hoc.

**Revised MVP Scope Recommendation**

Build a narrow “constituent message intake and review” MVP:

- Support **one named jurisdiction** or a deliberately limited representative level set.
- Accept address input and normalize/geocode via one provider.
- Store normalized address, derived districts, source, confidence, and lookup timestamp.
- Display representatives only when lookup confidence meets a defined threshold.
- Intake messages into an internal admin queue.
- Do **not** externally send, email, or represent delivery to officials in MVP.
- Require explicit consent for storage and admin review.
- Provide admin review states: `new`, `needs_review`, `approved_for_manual_handling`, `rejected`, `archived`.
- Maintain an audit trail of lifecycle events without duplicating sensitive payloads.
- Defer representative accounts, direct messaging, automated routing, donations, voter-file/KYC, and national/local completeness claims.

**Must Answer Before Coding**

- What is the exact MVP geography: one city/county/state, or limited national federal/state lookup?
- What trust claim is being made about residence: normalized address only, deliverable address, or verified resident?
- Will CivicBridge send messages externally in MVP? Recommended answer: no.
- What provider is the initial source of truth for geocoding/districts/representatives?
- What levels of government are in scope for the first release?
- What consent text and message lifecycle states are required?
- What sensitive data is retained, for how long, and what is excluded from audit logs?

**Can Be Defaulted In The Plan**

- Stack: Next.js + TypeScript + Postgres.
- ORM: choose Prisma or Drizzle based on repo preference; either is acceptable.
- Test framework: Vitest plus Playwright.
- Auth: simple admin auth for MVP, but isolate it behind an auth boundary.
- UI polish: basic accessible forms/admin tables are enough.
- Provider abstraction: one implementation now, adapter interface from day one.

**Architecture Boundary Recommendation**

Use a fast monolith, but isolate trust-root logic:

- `domain/address`: normalization result types, confidence rules, minimization helpers.
- `domain/representatives`: office/person/district/contact models and matching rules.
- `domain/messages`: consent, intake validation, lifecycle state machine.
- `domain/audit`: append-only event API with payload minimization.
- `providers/*`: Geocodio/OpenStates/etc. adapters only.
- `app/*` or UI routes: call domain services, never provider APIs directly.
- `admin/*`: review workflow only, no hidden routing side effects.

**Verification Gates For The Plan**

- Contract tests for provider adapter responses and failure modes.
- Golden-address fixtures for supported jurisdiction boundaries.
- Tests for low-confidence/no-result/multiple-match representative lookup.
- Schema migration review for sensitive fields and retention assumptions.
- Unit tests for message lifecycle transitions and consent requirements.
- Audit log tests proving message text/raw address is not duplicated into events.
- Rate-limit/abuse-control tests for message intake.
- Playwright browser flow: address lookup, representative display, consent, message submission, admin review.
- Dedicated Tier 1 review before implementation is marked complete.
- No TODOs or “temporary compliance” comments in trust-root modules.
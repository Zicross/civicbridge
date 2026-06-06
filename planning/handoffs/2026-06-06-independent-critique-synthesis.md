# Independent Critique Synthesis — ConstiuINT MVP — 2026-06-06

## Inputs

- Claude Code critique: `planning/handoffs/claude-critique-2026-06-06.json`
- Codex critique: `planning/handoffs/codex-critique-2026-06-06.md`
- Source spec: `planning/specs/2026-06-06-civicbridge-mvp.md`
- Repo methodology: `AGENTS.md`

## Shared verdict

Both Claude Code and Codex returned `REVISE_SPEC_FIRST`. Neither called the project blocked, but both warned that proceeding directly to code would force implementers to invent Tier 1 product/compliance behavior.

## Converged findings

1. Geographic/level scope must be narrowed before planning.
2. "Verify where they live" must be defined as a specific trust claim.
3. MVP message outcome must not imply delivery to representatives if only an admin queue exists.
4. Representative lookup needs source, confidence, freshness/as-of metadata, and explicit unsupported-level behavior.
5. Consent and communication preferences are not optional UI copy; they shape schema and workflow.
6. Audit logs can become a privacy liability if they duplicate raw address, raw provider payloads, or message bodies.
7. Abuse/spam/impersonation controls belong in MVP because public civic message intake is abuse-prone.
8. A Next.js monolith is acceptable only if trust-root domain logic is isolated and tested.

## Decisions/defaults adopted for Plan 1

- Product-facing working name: ConstiuINT.
- Product class: production public product, not throwaway demo.
- Political posture: nonpartisan civic utility.
- Coverage: national federal + state legislative only for MVP; local comprehensive coverage deferred.
- Verification: email-confirmed user plus provider-normalized/geocoded address and self-attestation; no legal-residency/voter-file/KYC claim.
- Message outcome: internal admin review/triage only; no delivery to offices/representatives in MVP.
- Data provider: Geocodio-first adapter behind interface, subject to ToS/pricing/political-use verification before production use; fixtures/stubs available for tests/local dev.
- Audit: lifecycle event metadata only; no duplication of raw address, provider payload, or message body.
- Stack: Next.js + TypeScript + Postgres + Drizzle + Vitest + Playwright.
- Product concept refinement after user feedback: treat messaging as one workflow inside a broader constituent-intelligence/structured-feedback platform. Add issue/topic categorization in Plan 1 so future representative polling and aggregated constituency signals are not blocked, but do not implement representative-initiated polling yet.

## Resulting plan implication

Plan 1 should build a production-grade foundation and vertical slice, not a fake full civic network. The first implementation must prioritize trust-core boundaries, schema/state/audit contracts, provider abstraction, and verification gates before UI breadth.

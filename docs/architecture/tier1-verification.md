# Tier 1 Verification

ConstiuINT treats trust-root areas with higher scrutiny. This document defines the verification gates that must pass before the MVP is considered production-ready.

## Trust-Tier Classification

| Tier | Scope | Verification Gate |
|------|-------|-------------------|
| Tier 1 (trust root) | Schemas, migrations, audit chains, state machines, identity/address mapping, provider abstraction, consent enforcement, verifier scripts | Contract tests, self-critique, independent/mechanical verifier, migration + rollback plan, zero verifier failures, zero unexplained TODOs |
| Tier 2 (outer layer) | UI polish, convenience screens, docs, non-sensitive helpers | Tests, lint/typecheck, review; justified shortcuts may be documented |

## Verification Checklist

Run the Tier 1 verifier with:

```bash
npm run verify:tier1
```

### Import Boundary Check

- `src/core/*` must NOT import from:
  - `next/*` (Next.js framework)
  - `react` (React - allowed only in UI components)
  - `drizzle-orm` (ORM - allowed only in server/db)
  - Provider SDKs (allowed only in src/providers/*)
  - `src/server/*` (server modules)

### Audit Schema Check

The `audit_events` table must NOT contain columns for:
- Raw address data (`rawAddress`, `addressRaw`, etc.)
- Raw message body (`messageBody`, `rawMessage`, etc.)
- Raw provider payloads (`rawProviderPayload`, `providerPayload`, etc.)

All audit events must store redacted/minimized metadata only.

### Supported Scope Documentation

`docs/product/supported-scope.md` must exist and clearly state:
- National federal + state legislative coverage only in MVP
- Local/county/city/school-board coverage is NOT included
- UI must indicate unsupported levels
- All results include `source`, `asOf`, and `confidence` metadata

### User-Facing Copy Check

All user-facing copy must avoid delivery claims:
- ❌ "Send to your representative"
- ❌ "Your message will be sent to"
- ❌ "Delivered to representatives"
- ✅ "Submit for ConstiuINT review"
- ✅ "Your message will be reviewed by ConstiuINT staff"
- ✅ "May be manually forwarded at staff discretion"

### Provider Verification

Provider ToS/pricing/political-use verification must be documented:
- Either as **verified** in docs after legal review
- Or as **unresolved** in `docs/product/launch-blockers.md` until verified

### TODO/FIXME Check

Tier 1 code paths must have zero unexplained TODOs/FIXMEs:
- `src/core/*`
- `src/providers/*`
- `src/server/services/*`
- `src/server/db/*`

Any TODOs must be allowlisted with documented rationale.

## Verification Script

The `scripts/verify-tier1.ts` script automates these checks:

```bash
npm run verify:tier1
```

Exit codes:
- `0`: All checks passed (or warnings only)
- `1`: Critical failures found

## Manual Verification Steps

Beyond the automated script:

1. **Review audit events** in database schema and service code
2. **Verify consent enforcement** in message submission flow
3. **Check admin state machine** transitions are properly audited
4. **Verify no delivery claims** in any UI copy
5. **Review provider abstraction** for proper isolation

## Remediation

If verification fails:

1. **Import boundary violations**: Move framework-specific code out of `src/core/*`
2. **Audit schema issues**: Use minimized metadata JSON instead of raw columns
3. **Copy issues**: Update UI text to use conservative wording
4. **Provider issues**: Update blockers doc or complete verification
5. **TODOs**: Either fix or document rationale for allowlisting

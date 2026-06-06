# Trust-core boundaries

ConstiuINT treats address handling, representative lookup semantics, message consent/lifecycle, and audit minimization as Tier 1 trust-root code.

## Boundary rule

`src/core/**` is framework-independent domain code. It must not import:

- `next/*`
- `react`
- `drizzle-orm`
- provider SDKs or provider adapters
- `src/server/*`

The unit test `tests/unit/core/importBoundary.test.ts` scans the current core tree for forbidden imports. Later Plan 1 work may replace or supplement this with a dedicated static verifier, but the invariant should remain the same.

## Current core modules

- `src/core/address` — normalized address types and minimization helpers. Raw address strings and raw provider payloads are not part of the persistable snapshot type.
- `src/core/representatives` — jurisdiction level, district, representative person/office/contact/source types, and support-scope evaluation for the federal/state MVP.
- `src/core/messages` — current consent version, issue categories, lifecycle states, and allowed state transitions.
- `src/core/audit` — audit event payload types and metadata redaction helpers that drop raw address, message body, and raw provider payload fields.

## Product constraints preserved

- MVP support is national federal + state legislative lookup only; local coverage must remain explicit when unsupported.
- Message lifecycle transitions are validated in domain code before later server/admin actions persist them.
- Audit payloads should identify entities and state transitions while avoiding duplicated PII or message content.
- Representative contact metadata is modeled separately from person and office identity because contact channels change independently and are not used for external delivery in Plan 1.

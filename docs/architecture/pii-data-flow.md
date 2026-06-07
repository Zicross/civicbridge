# PII Data Flow Documentation

This document describes how PII flows through the ConstiuINT system, what is retained, and what is deliberately excluded from retention.

## Data Retention Philosophy

ConstiuINT follows a data minimization approach:
- Store only what is necessary for the service to function
- Never duplicate sensitive data unnecessarily
- Keep audit logs free of raw PII

---

## Data Flow Paths

### 1. User/Constituent Data

| Field | Stored | Location | Notes |
|-------|--------|----------|-------|
| Email | ✅ Yes | `users.email` | Required for session/authentication |
| Email verified timestamp | ✅ Yes | `users.createdAt` | Tracks account creation time |
| Password | ❌ No | N/A | Using magic-link auth, no passwords stored |

### 2. Address Data

| Field | Stored | Location | Notes |
|-------|--------|----------|-------|
| Raw address input | ❌ No | Never stored | Only normalized JSON stored |
| Normalized address | ✅ Yes | `address_lookup.addressJson` | JSON with street, city, state, zip, geocode |
| Full provider payload | ❌ No | Not retained | Only metadata (source, confidence, asOf) kept |
| Geocode coordinates | ✅ Yes | In addressJson | For debugging/support purposes |

### 3. Message Data

| Field | Stored | Location | Notes |
|-------|--------|----------|-------|
| Message body | ✅ Yes | `messages.body` | Single storage location |
| Issue category | ✅ Yes | `messages.issueCategory` | Required for structured feedback |
| Issue tags | ✅ Yes | `messages.issueTags` | JSON array for topic classification |
| Consent version | ✅ Yes | `messages.consentVersion` | Track which consent text user accepted |
| Consent timestamp | ✅ Yes | `messages.consentedAt` | When consent was given |

### 4. Audit Events

| Field | Stored | Location | Notes |
|-------|--------|----------|-------|
| Raw message body | ❌ No | Never in audit | Only status/state changes |
| Raw address string | ❌ No | Never in audit | Only entity IDs referenced |
| Raw provider payload | ❌ No | Never in audit | Only metadata JSON |
| Entity type/ID | ✅ Yes | `audit_events.entityType/Id` | Reference to affected entity |
| Actor type/ID | ✅ Yes | `audit_events.actorType/Id` | Who performed the action |
| State changes | ✅ Yes | `audit_events.previousState/newState` | Before/after status |
| Reason metadata | ✅ Yes | `audit_events.reasonCode/reasonSummary` | Minimal reason text |

---

## Audit Event Flow

When a message lifecycle transition occurs (e.g., `new` → `needs_review`):

1. **Trigger**: Admin action or system event
2. **Capture**:
   - `entityType`: "message"
   - `entityId`: Message ID
   - `actorType`: "admin" or "system"
   - `previousState`: "new"
   - `newState`: "needs_review"
   - `reasonCode`: e.g., "admin_review"
   - `metadata`: Minimal JSON (no body/address)

3. **Stored**: Single audit event row with redacted metadata

---

## Unresolved Production Items

The following items require review before production deployment:

1. **Audit table append-only**: At app level, audit is append-only. Production should revoke DELETE/UPDATE grants on `audit_events` table.

2. **Provider payload debugging**: If raw provider payload is needed for disputes/debugging, it requires a separate retention policy decision.

3. **Data deletion/retention policy**: Need explicit policy for:
   - How long to keep user accounts without activity
   - Message retention after archived
   - Address lookup history

---

## Verification

Run the audit minimization test to verify no PII leaks:

```bash
npm run test -- tests/unit/core/minimization.test.ts
```

This test confirms:
- Audit events do not contain message body
- Audit events do not contain raw address strings
- Audit events do not contain raw provider payloads

---

## Related Documents

- `docs/product/supported-scope.md` - Geographic/jurisdictional support limits
- `docs/architecture/trust-core-boundaries.md` - Framework-independent core modules
- `docs/product/launch-blockers.md` - Production blockers and compliance items
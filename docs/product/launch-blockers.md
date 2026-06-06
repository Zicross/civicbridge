# Launch Blockers

This document tracks items that must be resolved before ConstiuINT can launch as a production public product. Items are categorized by severity and ownership.

## Legend

- 🔴 **Critical**: Must resolve before any production deployment
- 🟠 **High**: Should resolve before public launch
- 🟡 **Medium**: Resolve before scaling to many users
- 🟢 **Low**: Future consideration

---

## Provider & Data

### 🔴 Provider ToS/Pricing/Political-Use Verification

**Status**: Unresolved

**Description**: Geocodio (primary) and OpenStates (secondary) must have their Terms of Service reviewed for:
- Political/civic use authorization
- Pricing tier confirmation (free tier limits, production costs)
- Data redistribution rights
- Commercial use terms

**Owner**: Legal/Product

**Blocking**: Production provider integration

---

## Legal & Compliance

### 🔴 Privacy Policy

**Status**: Unresolved

**Description**: Must publish a privacy policy covering:
- What data is collected (email, address components, message content)
- How data is minimized and retained
- Audit log access and retention
- User rights (deletion, access, correction)
- Third-party data sharing (if any)

**Owner**: Legal/Product

**Blocking**: Public deployment

---

### 🔴 Legal Copy Review

**Status**: Unresolved

**Description**: All user-facing copy must be reviewed by legal to ensure:
- No false claims about representative delivery
- Consent language is clear and enforceable
- No implied verification of constituent status
- Clear distinction between ConstiuINT and representatives

**Owner**: Legal/Product

**Blocking**: Public deployment

---

### 🟠 Campaign Finance Compliance

**Status**: Deferred (out of MVP scope)

**Description**: If future features include:
- Political donation processing
- Campaign contribution conduit behavior
- Representative campaign engagement

These require explicit legal/compliance architecture review.

**Owner**: Legal

**Blocking**: Donation/payment features (not in MVP)

---

## Technical & Infrastructure

### 🟠 Production Database Role/Grant Setup

**Status**: Unresolved

**Description**: For production hardening:
- Audit table should be append-only at database level (revoke DELETE/UPDATE)
- Read-only access for reporting roles
- Row-level security for multi-tenant consideration

**Owner**: DevOps

**Blocking**: Production deployment (app-level audit is MVP-ready)

---

### 🟠 Hosting/Secrets/Observability Plan

**Status**: Unresolved

**Description**: Must decide:
- Hosting target (Vercel, AWS, GCP, self-hosted)
- Secrets management (env vars, secret manager, vault)
- Observability (logging, metrics, alerting)
- CI/CD pipeline

**Owner**: DevOps/Engineering

**Blocking**: Production deployment

---

### 🟡 Email Provider Configuration

**Status**: Unresolved

**Description**: Email magic-link authentication requires:
- SMTP configuration (SendGrid, AWS SES, Postmark, etc.)
- Email deliverability testing
- SPF/DKIM/DMARC setup
- Template for magic-link emails

**Owner**: Engineering

**Blocking**: Full auth flow in production

---

### 🟡 Bot Mitigation

**Status**: Unresolved

**Description**: Public intake form needs bot protection:
- CAPTCHA (Cloudflare Turnstile, hCaptcha, reCAPTCHA)
- Rate limiting at edge
- Behavioral analysis (optional)

**Owner**: Engineering

**Blocking**: Production public deployment (basic rate limit is MVP-ready)

---

## Product Features

### 🟢 External Delivery

**Status**: Explicitly out of MVP scope

**Description**: MVP does NOT include:
- Automatic email to representatives
- Direct message routing to offices
- External API integration with representative offices

This remains a future feature requiring:
- Provider ToS verification for political communication
- Legal review of liability model
- Consent model for external delivery

**Owner**: Product

**Blocking**: Not in MVP

---

### 🟢 Representative Polling

**Status**: Explicitly out of MVP scope

**Description**: Future capability, not in MVP:
- Representative-initiated polls to constituents
- Survey/feedback requests
- Constituent preference aggregation

Requires separate spec and compliance review.

**Owner**: Product

**Blocking**: Not in MVP

---

## Summary

| Blocker | Severity | Status |
|---------|----------|--------|
| Provider ToS verification | 🔴 Critical | Unresolved |
| Privacy policy | 🔴 Critical | Unresolved |
| Legal copy review | 🔴 Critical | Unresolved |
| Production DB hardening | 🟠 High | Unresolved |
| Hosting/secrets plan | 🟠 High | Unresolved |
| Email provider | 🟡 Medium | Unresolved |
| Bot mitigation | 🟡 Medium | Unresolved |
| External delivery | 🟢 Low | Deferred (out of scope) |
| Representative polling | 🟢 Low | Deferred (out of scope) |

## Notes

- The MVP can proceed with fixture providers for development/testing
- Production deployment requires resolving all Critical items
- App-level audit is implemented; DB-level append-only is production hardening
- Bot mitigation has basic rate limiting; full solution deferred

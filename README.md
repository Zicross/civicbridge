# ConstiuINT (CivicBridge repo)

ConstiuINT is high-trust constituency feedback infrastructure. The product goal is structured civic feedback and constituent intelligence: constituents can understand supported representation for an address, provide consentful issue/topic feedback, and help create higher-quality constituency signals over time.

This repository is still named `civicbridge`, but product-facing copy should use **ConstiuINT**.

## Current status

Plan 1 foundation is underway. The repo now contains a production-oriented Next.js/TypeScript scaffold and planning artifacts for the MVP trust-core buildout.

## MVP promise

The MVP must be conservative and accurate:

- Find supported representatives.
- Submit a message for ConstiuINT review/triage.
- Do **not** claim messages are sent or delivered to representatives.
- Support national federal + state legislative lookup first; local offices are deferred until verified data is selected.
- Treat consent, auditability, address/provider boundaries, and privacy minimization as Tier 1 product requirements.

## Development commands

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run test
npm run test:contract
npm run test:e2e
npm run build
```

`test:contract` and `test:e2e` will become more meaningful as Plan 1 provider and browser-flow tasks land.

## Environment

Copy `.env.example` to a local secret-bearing env file when needed. Do not commit real secrets.

## Planning workflow

Start with:

- `AGENTS.md`
- `planning/agent-dev-team-workflow.md`
- `planning/autonomous-operations.md`
- `planning/specs/2026-06-06-civicbridge-mvp.md`
- `planning/plans/2026-06-06-constiuint-mvp-plan1-foundation.md`

# ConstiuINT Autonomous Run Handoff — 2026-06-06

## Current repo state

Repo: `/home/hermes/projects/civicbridge`

Latest relevant commits before autonomous loop setup:

- `9e9cbd3 docs: define agent dev-team workflow`
- `ac064fd docs: refine ConstiuINT as structured civic feedback`
- `e1163f8 docs: plan ConstiuINT MVP foundation`

## User direction

The user wants Hermes to act as autonomous orchestrator/chief-of-staff and build toward a real product with minimal human input until there is a genuine product ready to review.

The user explicitly authorized broad operational autonomy, including creating accounts/credentials if needed, but Hermes should remain responsible and avoid unnecessary paid/external/security-sensitive actions.

The user wants consistent Discord reporting.

## Operating model

Read first:

1. `AGENTS.md`
2. `planning/agent-dev-team-workflow.md`
3. `planning/autonomous-operations.md`
4. `planning/specs/2026-06-06-civicbridge-mvp.md`
5. `planning/plans/2026-06-06-constiuint-mvp-plan1-foundation.md`

## Discord reporting target

Primary: `discord:#hermes-status`

Use alert/status split from `planning/autonomous-operations.md`.

## Current product thesis

ConstiuINT is high-trust constituency feedback infrastructure:

- constituent intelligence
- structured civic feedback
- future representative polling of direct constituencies
- timelier feedback loops
- less political text-spam

Not merely a message-to-representative app.

## Next recommended work

Begin executing Plan 1:

`planning/plans/2026-06-06-constiuint-mvp-plan1-foundation.md`

Start with Task 1: scaffold the production TypeScript/Next.js foundation.

## Agent availability

- Claude Code CLI authenticated with Claude Max.
- Codex CLI authenticated with ChatGPT OAuth.
- Hermes profile list currently only shows `default`; no separate Kanban specialist profiles exist yet.

## Autonomy boundaries

Proceed without asking for ordinary dev dependencies, local scaffold work, tests, docs, commits, and Discord reports.

Pause/escalate before paid external services, production deployment, real constituent data, representative/constituent outbound messaging, domains/phone numbers, payment/donation/conduit features, or publishing public claims.

# ConstiuINT Operations Dashboard

## Purpose

Track the autonomous operating system around ConstiuINT so progress, agents, cron jobs, reports, and decision gates are visible outside any one session.

## Current status

- Product thesis: high-trust constituency feedback infrastructure.
- Active plan: `planning/plans/2026-06-06-constiuint-mvp-plan1-foundation.md`.
- Active handoff: `planning/handoffs/2026-06-06-autonomous-run-handoff.md`.
- Primary Discord report channel: `discord:#hermes-status`.
- Workflow/retro Discord channel: `discord:#system-improvement-and-fine-tuning`.
- Alert Discord channel: `discord:#hermes-alerts`.

## Hermes profiles / agent lanes

Generic profiles created for use across all projects, not only ConstiuINT:

| Profile | Role | Intended use |
|---|---|---|
| `product` | Product strategist | User value, business model, wedge, roadmap, risk framing, specs/decision memos |
| `architect` | Architecture/trust reviewer | Systems, schemas, interfaces, security/privacy boundaries, verification gates |
| `builder` | Implementation worker | Bounded plan execution, code/docs/tests, no git ops unless explicitly instructed |
| `reviewer` | Independent reviewer | Spec compliance, code quality, security/privacy, test coverage, launch readiness |
| `curator` | Workflow/knowledge curator | Handoffs, retros, playbooks, Obsidian/project context, reusable patterns |

The default Hermes profile remains the orchestrator/chief-of-staff and git owner.

## Cron jobs

| Job ID | Name | Schedule | Delivery | Purpose |
|---|---|---|---|---|
| `382e4619cf63` | ConstiuINT autonomous build loop | every 2h | `discord:#hermes-status` | Advance implementation plan, verify, commit, report |
| `edac9fcdf729` | ConstiuINT daily product/workflow retro | daily 09:00 UTC | `discord:#system-improvement-and-fine-tuning` | Review product/workflow, update docs/retros |
| `ca2abd5496c9` | Weekly Agentic Project OS Review | Mondays 11:00 UTC | `discord:#system-improvement-and-fine-tuning` | Generalize workflow across all projects, not only ConstiuINT/software |

## Reporting format

```text
ConstiuINT status — <timestamp>
Mode: build / review / blocked / planning / workflow-improvement
Changed: <bullets>
Evidence: <tests, commits, files, reviews>
Next: <next autonomous action>
Needs human: <none or exact question>
```

## Human escalation triggers

Pause/escalate before:

- paid services or subscriptions
- production deployment/public launch
- domains/phone numbers/legal entities
- real user or constituent data
- outbound messaging to representatives/constituents
- donation/payment/conduit features
- sensitive credentials requiring user-owned accounts
- legal/compliance claims

## Tracking checklist

- [x] Repo methodology exists: `AGENTS.md`.
- [x] Agent dev-team workflow exists.
- [x] Autonomous operations contract exists.
- [x] Discord reporting target discovered and used.
- [x] Autonomous build cron exists.
- [x] Daily retro cron exists.
- [x] Generic multi-project Hermes profiles created.
- [x] Cross-project reusable skill created: `agentic-project-operating-system`.
- [x] Generic profile lanes created for all projects: `product`, `architect`, `builder`, `reviewer`, `curator`.
- [x] Weekly cross-project Agentic Project OS review cron exists.
- [x] First autonomous build loop completes implementation Task 1.
- [x] Plan 1 Task 2 trust-core domain contracts and import-boundary tests complete.
- [ ] First daily retro produces workflow improvements.
- [ ] Dedicated Kanban board/profile dispatch is configured if needed.
- [ ] Production deployment/secrets plan exists before any public launch.

## Maintenance rule

Update this dashboard whenever:

- cron jobs are added/removed/paused
- profiles/agent lanes change
- report channels change
- autonomy boundaries change
- a major plan/handoff becomes active
- human escalation creates a new blocker

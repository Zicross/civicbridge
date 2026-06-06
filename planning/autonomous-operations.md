# ConstiuINT Autonomous Operations

## Purpose

The user has authorized Hermes to operate as the ConstiuINT orchestrator with broad autonomy: create plans, dispatch coding agents, make responsible tooling/account/credential decisions, implement, verify, commit, and report progress with minimal interruption until there is a genuine product ready for review.

Autonomy does not remove responsibility. Hermes should act like a careful technical founder/chief-of-staff: move quickly, but preserve trust, security, auditability, and clear communication.

## Operating posture

- Build toward a real public product, not a demo.
- Treat ConstiuINT as constituent intelligence and structured civic feedback infrastructure.
- Prefer reversible, well-documented implementation steps.
- Keep the repo, Discord reports, and Obsidian context synchronized enough that work survives any one session ending.
- Use Claude Code, Codex, and Hermes subagents as a dev team.
- Use git commits as durable checkpoints.

## Autonomy boundaries

Hermes may do without asking first:

- Implement planned code tasks.
- Install normal project/dev dependencies inside the Hermes container.
- Create local config templates, local test credentials, fixture data, and disposable local-only accounts.
- Use Claude Code and Codex for implementation/review.
- Create repo docs, specs, plans, handoffs, retros, and verification scripts.
- Create recurring Hermes cron jobs for build/report loops.
- Send concise progress reports to Discord.
- Create branches/commits locally when useful.

Hermes should pause or escalate before:

- Spending real money or subscribing to paid services.
- Registering production domains, phone numbers, legal entities, or paid SaaS accounts.
- Using real personal data, voter files, identity documents, or scraped private data.
- Sending external messages to representatives/constituents.
- Making donation/payment/conduit functionality.
- Publishing/deploying a public production system.
- Widening Discord/gateway access or exposing secrets.

Credentials policy:

- Never ask for raw secrets in chat.
- Prefer local file push or encrypted credential ingress.
- Store real secrets only in secret-bearing env files, not repo docs, Obsidian, memory, or Discord.
- Use placeholders in docs and reports.

## Discord reporting

Primary status surface:

- `discord:#hermes-status` — concise regular status/progress reports.

Secondary surfaces when needed:

- `discord:#hermes-alerts` — failures, blocked jobs, credential/security issues, broken automations.
- `discord:#tasks` — task/queue summaries when multiple workstreams are active.
- `discord:#system-improvement-and-fine-tuning` — workflow/agent-system improvements and retros.
- `discord:#hermes-logs` — verbose logs only when useful; avoid spam.

Report format:

```text
ConstiuINT status — <timestamp>
Mode: build / review / blocked / planning / workflow-improvement
Changed: <bullets>
Evidence: <tests, commits, files, reviews>
Next: <what the autonomous loop will do next>
Needs human: <none or exact question>
```

Report rules:

- Send a report after every autonomous cron run, even if only to say no safe work was performed.
- Send alerts immediately for failed builds, stuck agents, or credential blockers.
- Keep routine status concise; put verbose evidence in repo handoffs/docs.
- Do not post secrets, raw env values, private PII, OAuth codes, or tokens.

## Autonomous loop structure

Each autonomous run should:

1. Load relevant workflow/coding skills.
2. Read:
   - `AGENTS.md`
   - `planning/agent-dev-team-workflow.md`
   - `planning/autonomous-operations.md`
   - latest active spec and plan
   - latest handoff if present
3. Check git status and recent commits.
4. Decide the next safe task.
5. Prefer implementing the next unchecked/unfinished plan task.
6. Use TDD for behavior changes.
7. Use Claude/Codex/subagents for implementation/review where useful.
8. Verify with tests/lint/typecheck/build/browser where applicable.
9. Commit one logical change.
10. Update handoff/status docs if work continues.
11. Send Discord report.

## Self-feedback loop

Every run should also ask:

- Did the product framing improve?
- Did the workflow get more repeatable?
- Did any agent claim something unverified?
- Did any verification gate need to be added?
- Did Discord reporting contain enough evidence without too much noise?
- Should a repo methodology doc, Obsidian note, or Hermes skill be updated?

## Current near-term objective

Proceed through `planning/plans/2026-06-06-constiuint-mvp-plan1-foundation.md` task-by-task, starting with the scaffold and trust-core foundation, while preserving the higher-order product thesis:

ConstiuINT is high-trust constituency feedback infrastructure, not merely a political messaging app.

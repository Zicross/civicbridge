# CivicBridge New Session Handoff — 2026-06-06

## Recommended next session objective

Work on the CivicBridge constituent-representative app, starting from the repo bootstrap and MVP spec. Use Hermes as orchestrator, with Claude Code and Codex available as independent critique/implementation agents.

## Current repo

Path:

```text
/home/hermes/projects/civicbridge
```

Current git state at handoff:

```text
b59de76 chore: bootstrap CivicBridge planning repo
```

## Important repo files

- `AGENTS.md` — repo-resident AI/coding workflow conventions.
- `README.md` — initial project overview.
- `planning/specs/2026-06-06-civicbridge-mvp.md` — initial MVP spec.
- `planning/decisions/0001-record-architecture-decisions.md` — ADR convention.
- `planning/handoffs/2026-06-06-new-session-handoff.md` — this file.

## Obsidian context

Vault path:

```text
/home/hermes/Documents/Obsidian Vault/Hermes Brain/
```

Relevant notes:

- `Projects/CivicBridge Context Packet.md`
- `Coding Workflow Integration.md`
- `Documentation Intake Workflow.md`
- `Integrations/Integration Registry.md`
- `Hermes Brain MOC.md`

## Tooling status

Claude Code:

```text
~/.local/npm-global/bin/claude
```

Authenticated with Claude Max account. Verify with:

```bash
PATH="$HOME/.local/npm-global/bin:$PATH" claude auth status --text
```

Codex:

```text
~/.local/npm-global/bin/codex
```

Authenticated with ChatGPT OAuth credentials at `~/.codex/auth.json`. Verify with:

```bash
PATH="$HOME/.local/npm-global/bin:$PATH" codex login status
```

Hermes compression config was changed for future sessions:

```yaml
compression:
  threshold: 0.75
  target_ratio: 0.25
  protect_last_n: 30
```

## Product summary

CivicBridge is a constituent-representative communication platform. Core loop:

1. User enters/verifies address.
2. System maps user to representatives at relevant government levels.
3. Constituent submits managed communication.
4. Representative/staff side receives structured intake.
5. Future phase may explore donation/conduit revenue model, but this is explicitly deferred because it is compliance-sensitive.

## Working assumptions

- Start in Hermes container repo, not external laptop/server yet.
- Use repo-resident conventions, not chat-only instructions.
- Treat address verification, representative lookup, identity/consent, audit trail, and future donations as high-rigor trust-root areas.
- Do not begin with donations.
- Build the first vertical slice around address → representative lookup/provider abstraction → message intake → admin queue.

## Suggested next workflow

1. Load relevant skills:
   - `subagent-driven-development`
   - `writing-plans`
   - `test-driven-development`
   - `claude-code`
   - `codex`
   - possibly `github-pr-workflow` later

2. Read:
   - `/home/hermes/projects/civicbridge/AGENTS.md`
   - `/home/hermes/projects/civicbridge/planning/specs/2026-06-06-civicbridge-mvp.md`
   - `/home/hermes/Documents/Obsidian Vault/Hermes Brain/Projects/CivicBridge Context Packet.md`

3. Use Claude and Codex immediately for independent critique of the MVP spec.

4. Synthesize critiques into:
   - revised MVP scope
   - open questions
   - implementation plan

5. Pick stack unless user overrides. Default recommendation:
   - Next.js
   - TypeScript
   - PostgreSQL
   - Prisma or Drizzle
   - Playwright
   - unit tests + lint + typecheck

6. Scaffold only after spec/plan is accepted or after user grants default approval.

## Teaching/framework goal

The user wants this system to generate reusable frameworks that can be taught to others. During the CivicBridge work, capture patterns such as:

- session-boundary heuristics
- agent-orchestrated coding workflow
- documentation intake workflow
- spec/critique/plan/execute/verify/retro loop
- memory routing rules
- tool-auth/integration patterns

Store teaching-grade frameworks in Obsidian and reusable procedures as skills when appropriate.

## Suggested first prompt in the new session

```text
Continue CivicBridge from the handoff at /home/hermes/projects/civicbridge/planning/handoffs/2026-06-06-new-session-handoff.md. Load the relevant coding/orchestration skills, read AGENTS.md and the MVP spec, then use Claude Code and Codex as independent critics before writing the implementation plan.
```

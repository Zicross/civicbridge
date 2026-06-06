# ConstiuINT Agent Dev-Team Workflow

## Purpose

ConstiuINT should be built like a business and like a real software team, not like a single long-running chat session. Hermes acts as orchestrator/chief-of-staff, while Claude Code, Codex, and future subagents act as independent specialists. The repo, not any one model session, is the source of truth.

This workflow is also part of the product work: every ConstiuINT build cycle should improve the reusable agentic coding system.

## Operating principles

1. **Repo-resident truth**
   - Decisions, specs, plans, gates, handoffs, and retros live in the repo.
   - Chat context is useful but never authoritative.
   - Any fresh session or different model should be able to continue from repo artifacts.

2. **Hermes as orchestrator**
   - Maintains product direction, architecture boundaries, and verification standards.
   - Assigns tasks to Claude/Codex/subagents.
   - Owns final diff review, git operations, commits, and handoffs.
   - Keeps Obsidian/project context updated when decisions matter beyond the repo.

3. **Agents as a dev team**
   - Claude Code: large-context implementation/refactor lane.
   - Codex: independent critic, alternate implementation, CI/debugging lane.
   - Hermes subagents: focused spec review, code quality review, investigations, documentation, or test design.
   - No worker stages, commits, pushes, rebases, or merges unless Hermes explicitly delegates a one-off local-only task.

4. **Business-grade product discipline**
   - Optimize for durable product learning, not just code volume.
   - Treat trust, privacy, compliance, and user promise as product features.
   - Maintain a visible backlog of product/technical risks.
   - Defer features that create legal/compliance exposure until explicitly specified.

5. **Workflow improvement as a first-class deliverable**
   - After meaningful work, ask: what made this easier/harder for agents?
   - Promote useful patterns into `AGENTS.md`, planning docs, Obsidian, or Hermes skills.
   - Do not let process lessons remain trapped in one session.

## Roles

### Hermes / Orchestrator

Responsibilities:

- Read current handoff/spec/plan before acting.
- Maintain the product thesis: ConstiuINT is constituent intelligence and structured civic feedback, not merely a messaging app.
- Decide execution mode: sequential, parallel wave, external Claude/Codex lane, or Hermes subagent.
- Write/maintain plans that fresh agents can execute.
- Run or request independent critique before major implementation.
- Verify worker claims with actual files, diffs, tests, browser checks, and logs.
- Own git status, staging, commits, branch hygiene, and final handoffs.

### Claude Code lane

Best for:

- Large implementation tasks.
- Broad codebase navigation.
- Refactors across multiple files.
- UI + server integration when the plan is explicit.

Rules:

- Prefer one bounded plan task or wave at a time.
- Provide exact task text, files, scope guardrails, and no-git rule.
- Use Claude output as self-report until Hermes verifies diffs and gates.

### Codex lane

Best for:

- Independent critique.
- Test/debugging passes.
- Alternative implementation suggestions.
- Focused review of diffs and CI failures.

Rules:

- Run read-only for critique/review unless explicitly implementing in an isolated worktree.
- Ask for severity, evidence, and plan impact.
- Use a different model from the implementer for review when possible.

### Hermes subagents

Best for:

- Spec compliance review.
- Code quality review.
- Focused file-level investigations.
- Documentation or test-design support.

Rules:

- Pass complete context; do not make subagents infer from chat history.
- Fresh subagent per task/review.
- Require PASS/REQUEST_CHANGES style output.

## Standard build loop

### 1. Intake

Before work starts:

- Read the latest handoff in `planning/handoffs/` if one exists.
- Read `AGENTS.md`.
- Read the active spec and plan.
- Check git status.
- Identify whether the work is Tier 1 or Tier 2.

### 2. Product/architecture framing

For material changes, Hermes writes or updates:

- spec under `planning/specs/`
- implementation plan under `planning/plans/`
- critique synthesis under `planning/handoffs/` when multiple agents critique

A plan should answer:

- what business/product outcome this task advances
- what files change
- what is deliberately out of scope
- what tests/gates prove success
- who implements and who reviews

### 3. Dispatch

For each task/wave, Hermes creates a worker prompt with:

- repo path
- relevant spec/plan paths
- exact task text
- files allowed/expected to touch
- no-git rule
- TDD requirements
- verification commands
- output format

Parallel workers must avoid overlapping files unless intentionally paired as implementer/reviewer.

### 4. Review

Every non-trivial implementation gets two review dimensions:

1. **Spec compliance** — did it build the required behavior and avoid scope creep?
2. **Code/product quality** — is it maintainable, safe, tested, and aligned with ConstiuINT's trust model?

For Tier 1 areas, require stronger gates:

- contract tests
- privacy/minimization checks
- state-machine tests
- audit-event tests
- import-boundary checks
- independent critique by a different model/agent

### 5. Verify

Hermes verifies before reporting success:

- `git diff` and `git status`
- relevant tests
- lint/typecheck/build
- browser checks for UI flows
- docs/handoffs updated when needed

### 6. Commit

Commit rules:

- One logical change per commit.
- Never stage unrelated work.
- Do not bypass hooks.
- Commit messages should be business-readable and technical enough to audit.

### 7. Handoff

For any work that may continue later, create/update a handoff under:

`planning/handoffs/YYYY-MM-DD-<topic>-handoff.md`

Handoff should include:

- current repo state and latest commit
- what changed
- what is intentionally deferred
- next recommended objective
- exact files to read first
- open risks/questions
- suggested agent assignments

### 8. Retro / process improvement

After significant work, capture:

- What surprised us?
- What did an agent get wrong or right?
- What verification caught issues?
- What should become a repo rule, Obsidian note, or Hermes skill?
- What can be taught as a reusable framework?

## Cadence model

Think of the work like a small startup engineering cadence:

- **Product strategy thread:** value props, user promise, market wedge, trust/compliance posture.
- **Architecture thread:** boundaries, schema, provider strategy, deployment posture.
- **Implementation thread:** planned tasks, tests, reviews, commits.
- **Workflow thread:** how the agent team itself gets better.

Each session should know which thread it is advancing.

## Current product thesis to preserve

ConstiuINT is not merely a political messaging app. It is high-trust constituency feedback infrastructure:

- constituents understand who represents them and at what level
- feedback is structured, consentful, and tied to supported constituency context
- representatives eventually receive more accurate/timely signals from direct constituents
- future polling/engagement avoids noisy political text-spam patterns
- privacy and trust boundaries are product features

## Anti-patterns

- Building from chat memory instead of repo artifacts.
- Letting a single agent both implement and be the only reviewer.
- Letting workers run git operations in parallel.
- Shipping UI claims that exceed verified product behavior.
- Treating compliance/privacy as paperwork after coding.
- Building representative polling before constituency and consent foundations are reliable.
- Capturing process lessons only in a chat transcript.

# Agent Methodology for CivicBridge

This repo uses repo-resident conventions. Do not rely on any single model's memory as the source of truth.

## Operating loop for non-trivial coding work

1. Brainstorm
   - Restate intent.
   - Surface unstated constraints.
   - Propose 2-3 alternatives and tradeoffs.
   - Stop before assuming product/legal/compliance decisions.

2. Spec
   - Specs live in `planning/specs/YYYY-MM-DD-<slug>.md`.
   - Include YAML frontmatter with `id`, `type`, `date`, `status`, and parent references.
   - Cover problem statement, threat/compliance model, alternatives, chosen approach, tests, tradeoffs.
   - Run self-critique until no material issues remain.
   - Run an independent critique from another model when available.

3. Plan
   - Plans live in `planning/plans/YYYY-MM-DD-<slug>-planN-<name>.md`.
   - Plans must be executable by a fresh agent with no conversation context.
   - Include file structure, scope guardrails, numbered checkbox tasks, verification commands, and commit blocks.

4. Execute
   - Small plans: sequential task-by-task.
   - Large plans: parallel waves using `planning/handoffs/`.
   - Parallel subagents write files only. They do not run git operations.
   - Orchestrator owns staging, commits, pushes, PRs, and final verification.

5. Verify
   - Evidence before assertions.
   - Tier 1 trust-root changes require stronger gates: contract tests, dedicated verifier, schema/migration plan, rollback plan, zero new TODOs.
   - Tier 2 changes require tests, lint/typecheck, and review.
   - UI changes require browser exercise, not just unit tests.

6. Commit + handoff
   - One logical change per commit.
   - Never bypass hooks.
   - Update status/handoff docs when multi-session work continues.

7. Retro
   - Write retros for surprises, incidents, or generalizable lessons.
   - Generalizable lessons should be promoted into methodology, skills, or project docs.

## Product-specific guardrails

- This product touches civic identity, political communication, and potentially campaign finance. Treat compliance and trust as Tier 1 concerns.
- Never store secrets, private keys, API keys, or raw sensitive identity documents in repo docs.
- Donation/conduit functionality is out of MVP until legal/compliance architecture is explicitly specified.
- Verification/address matching should be designed to minimize retained sensitive data.

## AI agent usage

See `planning/agent-dev-team-workflow.md` for the full orchestration model.

- Hermes/GPT-5.5: orchestrator/chief-of-staff, product/architecture planner, final reviewer, git owner, memory/Obsidian curator.
- Claude Code: implementation/refactor/codebase navigation lane when authenticated.
- Codex: alternate implementation, independent critic/reviewer, CI/debugging lane when authenticated.
- Hand-off documents should explicitly include a `plan_path` field linking to the associated plan file for quicker dispatch.
- Hermes subagents: focused spec-compliance reviews, code-quality reviews, investigations, and documentation/test support.
- Independent review should use a different model/agent than the implementer when possible.
- Parallel workers write files only. They do not stage, commit, push, rebase, or merge; Hermes owns git operations.
- Every meaningful build cycle should improve both ConstiuINT and the reusable agentic coding workflow.

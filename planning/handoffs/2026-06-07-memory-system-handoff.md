---
type: handoff
date: 2026-06-07
to: Isaac (via Discord)
subject: Hermes memory system needs an overhaul — I'm fumbling
---

# Hermes Memory System Handoff

## Problem

I am forgetting things I should know:

| What I Forgot | When | Impact |
|--------------|------|--------|
| Workflow settled: Opus→Gemma (not Hermes→Claude/Codex) | Today | Wasted time correcting me |
| Gemma 4 already set up on laptop | Today | I suggested setting it up |
| Model stack (MiniMax M2.5, not GPT-5.5) | Today | Confidently stated wrong facts |
| Discord guild Discord channel IDs | Multiple | Repeated requests for same info |

**Root cause:** My current memory system is a single 2,200-char text block. That's a post-it note, not a memory system.

---

## What We've Already Created

Today I created "memory scaffolding" that should help:

| Artifact | Location | Purpose |
|----------|----------|---------|
| Strategy Decisions | Obsidian: `Operating Systems/Hermes Strategy Decisions.md` | Track settled decisions |
| Cross-Project Brief | Obsidian: `Operating Systems/Cross-Project Brief.md` | Weekly overview |
| Claude Code Memory Base | `/home/hermes/claude-code-memory/` | Shared context for Claude Code |

But these are **files I have to remember to read** — and I demonstrably don't.

---

## What A Real Memory System Needs

### Tier 1: Auto-Loaded Context (solves 80% of my mistakes)

What should be injected into EVERY session start:
1. Model stack (what models, where they run, what's free/paid)
2. Current workflow (who does what)
3. Active projects + their status
4. User preferences (mobile-first, cost-conscious, etc.)
5. Key environment facts (Gemma already on laptop, Claude Code OAuth, etc.)

**How:** A single `SYSTEM_BOOT.md` that gets read at the start of every session. Not opt-in. Forced.

### Tier 2: Cross-Session Knowledge (solves the "we talked about this" problem)

What should survive across sessions:
1. Settled decisions
2. Project context
3. Discord IDs/channels
4. Environment quirks

**How:** A structured metadata file that I update after every session. Loaded on each new session.

### Tier 3: Active Memory (the current 2,200 chars)

Keep this but make it better — compact facts only, no stale info.

---

## Recommended Action: SYSTEM_BOOT.md

Single file in `~/.hermes/SYSTEM_BOOT.md` that Hermes reads at session start:

```markdown
# Hermes Session Boot

## Model Stack (SETTLED)
- Sensitive: Claude Pro + Gemma 4 26b (laptop, already running)
- Everyday Hermes: MiniMax M2.5 (free via OpenRouter)
- Coding: User (Opus) → Gemma 4 → Opus reviews
- NOT: Hermes doing day-to-day coding orchestration

## Workflow (SETTLED)
- Hermes = strategic oversight, cross-project, NOT implementation
- Big projects on host, personal on laptop
- Hermes owns git push for ConstiuINT

## Active Projects
- ConstiuINT: github.com/Zicross/civicbridge, MVP in progress

## User Preferences
- Mobile-first, not desktop-first
- Cost-conscious (prefer free models, watch quotas)
- Minimal human input — autonomous when possible
- Practical over complicated

## Environment
- LXD container on zicrone, IP 10.186.45.111
- Claude Code + Codex via OAuth (not API keys)
- Laptop Ollama: Gemma 4 26b, accessible via Tailscale
```

---

## What I Need From You

1. **Confirm the SYSTEM_BOOT approach** — or suggest something else
2. **Dictate what else belongs in SYSTEM_BOOT** — what am I still missing?
3. **Create the hermes-memory GitHub repo** — for the shared Claude Code memory base
4. **After you clone ConstiuINT to the host**, I'll update AGENTS.md paths accordingly

---

## ConstiuINT Status

- Pushed to GitHub: `9801b0c docs: update workflow to Opus→Gemma (Hermes strategic only)`
- Latest: Plan 1 Task 8 (admin queue UI) is next
- Pull: `git clone https://github.com/Zicross/civicbridge.git` on the host
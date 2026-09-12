---
name: delivery-gate
description: "Use when stop hook that blocks Claude from finishing until quality checks pass. Detects rationalization patterns (surface text heuristics), stale learning logs (filesystem mtime), and low disk space. Complements self-audit by mechanically enforcing learning capture habits. Triggers on \"delivery-gate\", \"delivery gate\", \"gate\"."
version: 1.1.1
metadata:
  origin: ECC
---

# Delivery Gate — Mechanical Quality Gate for Claude Code

A **Stop hook** that checks three things before Claude can finish a session, using only **deterministic checks** — file modification timestamps, disk usage, and regex patterns on the transcript text. No AI inference.

This is distinct from reasoning gates (like `self-audit`): delivery-gate checks machine-verifiable facts; self-audit checks output quality across four reasoning dimensions. Together they form defense in depth:
- **delivery-gate**: "Was the learning library touched today? Is disk space safe?"
- **self-audit**: "Is the file content correct, complete, and honest?"

This is the same pattern as CI pipeline gates — automated, deterministic checks that verify machine-readable facts rather than trusting self-reported status.

## What It Checks

| Check | Mechanism | On Hit |
|-------|-----------|--------|
| Rationalization patterns | Regex on transcript tail | **Warning only** (never blocks) |
| Stale learning libraries | mtime on 5 configurable paths | Warning if some stale; **Block** if >=3 stale OR growth-log stale + complex task |
| Disk space < 50GB | `shutil.disk_usage` | Warning |
| Disk space < 15GB | `shutil.disk_usage` | **Block** (exit 2) |

Rationalization detection warns about patterns like "skip tests for now" and "pre-existing bug" — surface signals that thinking may have been cut short. It never blocks on its own, because regex heuristics can false-positive. The blocking conditions are: disk critical, `>=3 learning libs stale`, OR `growth-log` specifically stale (all require complex task >=3 edits).

## Why

Claude Code's built-in checks cover code quality (build → type → lint → test). But there's a different failure mode: the agent produces working code while the **session hygiene was neglected** — learning not captured, rationalized shortcuts, disk running out silently.

Over many sessions of "ship and forget," the human hasn't grown. This hook enforces the habit: complex task → must touch learning libraries.

## Install

```bash
cp quality-gate.py ~/.claude/scripts/
```

Add to `~/.claude/settings.json`:
```json
{
  "hooks": {
    "Stop": [{
      "hooks": [{
        "type": "command",
        "command": "python3 ~/.claude/scripts/quality-gate.py",
        "timeout": 5000
      }]
    }]
  }
}
```

## Learning Libraries

Create these files in your project's memory directory. The hook checks if at least one was updated today:

```
memory/
├── growth-log/          # Daily learning entries (directory)
├── decisions/log.md     # Decision log
├── output-index.md      # Index of session outputs
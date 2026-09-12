---
name: agnostic-repo-mirror
description: "Use when one repo must serve Claude, Codex, and other harnesses from a single canonical config without duplicated rules. Triggers on \"agnostic repo\", \"same brain\", \"AGENTS.md canonical\", \"claude code and codex\", \"skills symlink\", \"drift audit\". Non-triggers: memory handoff between agents (use unified-memory). Outcome: AGENTS.md as source of truth with thin per-harness imports, linked skills dir, and a passing drift audit."
metadata:
  origin: ECC
---

# Agnostic Repo Mirror

One repo, many harnesses. Keep `AGENTS.md` as the canonical source of
truth, shrink `CLAUDE.md` to a thin import, serve one shared skills
directory through a link, and audit drift on a schedule. File-level
mirror, not memory handoff: `unified-memory` moves context between
agents, this skill keeps the repo surfaces identical.

## When To Activate

- The user says same brain, stop choosing between harnesses, Claude
  plus Codex, repo agnostic, or skills in two places.
- Rules live in both `CLAUDE.md` and `AGENTS.md` and already disagree.
- Skills are duplicated under per-harness folders and fixes land in
  only one copy.
- A team adds a second harness to a repo that was Claude-only.

## Layout

```text
repo/
|-- AGENTS.md             # canonical rules, edit here
|-- CLAUDE.md             # thin import, do not extend
|-- .agents/
|   `-- skills/           # canonical skills
`-- .claude/
    `-- skills -> ../.agents/skills   # link, not a copy
```

- Canonical content lives in exactly one place. Every other surface
  imports or links to it.
- No rule text is typed twice. Duplicated text is drift waiting to
  happen.

## Workflow

### 1. Promote AGENTS.md to canon

- Move all durable rules into `AGENTS.md`: identity, routing, model
  policy, tool policy, style, done criteria.
- Delete harness-specific paths from the canon. Keep generic tokens
  like `<repo>` and `<skills-dir>` instead of per-tool paths.
- Commit the canon before touching any import.

### 2. Shrink CLAUDE.md to an import

- Reduce `CLAUDE.md` to a short header plus one import line pointing
  at the canon:

```text
@AGENTS.md
```

- Keep at most a small Claude-only appendix below the import for
  genuinely Claude-only behavior. Anything shared moves up.
- Rule: edits to shared behavior go to `AGENTS.md`, never to the
  appendix.

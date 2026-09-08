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

### 3. Unify the skills directory

- Move the real skills to `.agents/skills/`.
- Replace `.claude/skills/` with a link to the canonical dir.
- On Linux and Mac use a symlink:

```text
ln -s ../.agents/skills .claude/skills
```

- On Windows use a directory junction (needs no drive-letter path):

```text
mklink /J .claude\skills .agents\skills
```

- Verify the link resolves from both sides: list skills through the
  harness path and through the canonical path, compare counts.

### 4. Mirror configs without forking rules

- Mirror MCP servers, hooks, and commands by reference where the
  harness supports includes or shared config files.
- Where no include exists, generate the per-harness file from the
  canon with a small script and mark it generated. Never hand-edit
  generated copies.

### 5. Run the periodic drift audit

- On a schedule (weekly or per sprint), diff the surfaces:

```text
1. list files under .claude/skills and .agents/skills, compare
2. grep rule sentences in CLAUDE.md missing from AGENTS.md
3. grep rule sentences in AGENTS.md shadowed by the appendix
4. report each drift item as canon-wins or appendix-wins with a reason
```

- Fix drift at the canon first, regenerate, re-run the audit until
  the report is empty. Keep the last passing report as evidence.

### 6. Verify both harnesses

- Open the repo once per harness (Claude, Codex, or next harness).
- Ask each to state the active rule source and list visible skills.
- Done when both answers name the canon and list the same skill set.

## Anti-Patterns

- Editing `CLAUDE.md` as the real rules file -> canon is `AGENTS.md`.
- Copying skills per harness instead of linking -> one dir plus link.
- Absolute personal paths in rules or links -> relative repo paths.
- Appendix that silently overrides the canon -> appendix stays tiny.
- Skipping the drift audit -> surfaces diverge within weeks.
- Using vault handoff to fix duplicated rules -> handoff moves
  context, it does not dedupe files.

## Relations

- `unified-memory`: vault handoff of context between harnesses; pair
  with this skill, which dedupes the repo files themselves.
- `universal-portability`: portable skill authoring; this skill is the
  repo layout that makes portability stick.
- `context-budget`: keeps the canon short enough to load everywhere.
- `skill-comply`: checks agents actually follow the mirrored rules.
- `criar-skill`: authoring rules for new skills added to the canon.

## Sources

- Agnostic repo pattern: canonical `AGENTS.md`, thin `CLAUDE.md`
  import, skills symlink and junction, periodic audit (2026-09-06,
  `https://www.youtube.com/watch?v=najOUxYfD5g`).
- Multi-harness behavior and migration effort in that video are
  anecdotal author measurements, not benchmarks - do not quote as facts.

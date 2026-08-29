# Rule Classifier — Heuristics for Rules → Hooks Migration

Reference for `rules-to-hooks-auditor` skill. Used to classify each rule in CLAUDE.md/AGENTS.md.

## Core Question (from Cole Medin video)

> **"Is this naming an event or encoding a judgment?"**

- **Event/Process** → Hook (deterministic guarantee)
- **Judgment/Convention** → Rule (guidance for model)
- **Vague/Redundant** → Delete

---

## Classification Patterns

### ✅ PROCESS/EVENT → HOOK

| Rule Pattern | Hook Type | Example |
|---|---|---|
| "when X happens, do Y" | Match event | "after implementing run tests" → Stop |
| "before X, do Y" | PreToolUse | "before editing routes read citations.py" → PreToolUse (Edit) |
| "never do X" | PreToolUse (block) | "never read .env" → PreToolUse (Read) |
| "always do X after Y" | PostToolUse | "log every command" → PostToolUse |
| "at session start, do X" | StartSession | "read decisions.md on start" → StartSession |
| "when sub-agent finishes, do X" | SubAgentStop | "audit sub-agent output" → SubAgentStop |

**Keywords that indicate PROCESS:**
- when, before, after, on, once
- always, never, must, ensure
- run, execute, check, validate, verify
- log, record, audit, track

### ✅ JUDGMENT/CONVENTION → RULE (KEEP)

| Rule Pattern | Keep as Rule | Example |
|---|---|---|
| "use X not Y" | Style/convention | "use snake_case not camelCase" |
| "prefer X over Y" | Preference | "prefer async/await over promises" |
| "X is the standard" | Standard | "REST APIs use plural nouns" |
| "name things X way" | Naming | "boolean vars start with is/has/can" |
| "architecture principle" | Principle | "single responsibility per module" |

**Keywords that indicate JUDGMENT:**
- prefer, avoid, use, don't use
- standard, convention, pattern
- naming, style, format
- architecture, design, principle
- best practice, idiomatic

### 🗑️ VAGUE/REDUNDANT → DELETE

| Rule Pattern | Action | Example |
|---|---|---|
| "write clean code" | Delete | Model already knows |
| "be helpful" | Delete | Useless |
| "follow best practices" | Delete | Too vague |
| "don't make mistakes" | Delete | Not actionable |
| "think before you code" | Delete | Already in system prompt |

---

## Decision Tree

```
                    ┌─────────────────────┐
                    │   Rule text         │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │ Names specific event?│
                    │ (when/before/after/  │
                    │  on/once + action)  │
                    └──────────┬──────────┘
                     Yes       │       No
                               │
                    ┌──────────▼──────────┐
                    │ Encodes judgment/   │
                    │ convention/standard?│
                    └──────────┬──────────┘
                     Yes       │       No
                               │
              ┌────────────────┘       └────────────────┐
              ▼                                        ▼
        ┌───────────┐                           ┌─────────────┐
        │ KEEP AS   │                           │   DELETE    │
        │ RULE      │                           │ (vague/     │
        │           │                           │  redundant) │
        └───────────┘                           └─────────────┘
```

---

## Hook Type Mapping

| Event Trigger | Hook Event | Matcher | Exit Code Meaning |
|---|---|---|---|
| Session starts | `StartSession` | (none) | 0=inject context, 1=error |
| Before tool call | `PreToolUse` | Tool name (Read, Bash, Edit...) | 0=allow, 2=block, 1=error |
| After tool call | `PostToolUse` | Tool name | 0=continue, 2=retry?, 1=error |
| Conversation ends | `Stop` | (none) | 0=allow end, 2=block (force resume), 1=error |
| Sub-agent ends | `SubAgentStop` | (none) | 0=continue, 2=block parent, 1=error |
| Notification | `Notification` | (none) | 0=ack, 1=error |

---

## Common Migration Examples

| Original Rule | Classification | Hook Generated |
|---|---|---|
| "after implementing run the tests" | Process → Stop Hook | `stop-run-tests.py` |
| "never read the .env file" | Process → PreToolUse (Read) | `pretool-block-env.py` |
| "before you edit anything in routes, read rag/citations.py first" | Process → PreToolUse (Edit) | `pretool-file-coupling.py` |
| "when the session starts, read the decisions.md" | Process → StartSession | `startsession-inject-context.py` |
| "log every command you run" | Process → PostToolUse (Bash) | `posttool-log-actions.py` |
| "never run a recursive force delete" | Process → PreToolUse (Bash) | `pretool-block-rm-rf.py` |
| "money is integer cents never floats" | Judgment → Keep Rule | (none) |
| "use snake_case for variables" | Judgment → Keep Rule | (none) |
| "write clean code" | Vague → Delete | (none) |

---

## Validation Checklist

After migration, verify:
- [ ] Each hook script exists in `.claude/hooks/`
- [ ] Each hook is executable (`chmod +x`)
- [ ] `settings.json` has correct matcher + command
- [ ] Exit codes tested (0=pass, 2=block)
- [ ] Hook runs < 30s (timeout)
- [ ] Error handling in script (try/except)
- [ ] No hardcoded absolute paths
- [ ] Backup of original `settings.json` created
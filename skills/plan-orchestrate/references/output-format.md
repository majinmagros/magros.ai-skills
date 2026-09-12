# Phase 3 — Compress task description

Each emitted `<task description>` must:

- Be self-contained (the first agent does not need the plan document open).
- Start with `[Plan: <path>#step-<id>]`.
- Include 1–3 verifiable Acceptance criteria.
- Include a Scope guard (`Out of scope: ...`) **only if the plan declares one for this step**. Inherit verbatim. If the plan has no out-of-scope statement, omit the clause entirely — do not invent one.
- Be 200–600 characters; one line; embedded `"` escaped as `\"`; no literal newlines.

# Phase 4 — Output

Emit Markdown using **the form determined by `ECC_MODE`**. The output uses one form throughout — every `{ORCH_CMD}` and every agent name is rendered with the matching prefix from Phase 0. **Do not emit both forms; do not include "this is plugin form" / "strip the prefix" instructions in the rendered output.**

Concrete rendering rules:

- `{ORCH_CMD}` = `/ecc:orchestrate` under `plugin`, `/orchestrate` under `legacy`.
- `{AGENT(name)}` = `ecc:<name>` under `plugin`, `<name>` under `legacy`.
- The overview-table "Chain" column uses the same `{AGENT(name)}` rendering.
- Per-step bash blocks contain only the runnable command. **No `# plugin form` or `# legacy form` comments** — the form is implicit and uniform across the whole output.

Output structure:

````markdown
# Plan-Orchestrate Result

**Plan**: `<path>`
**Lang**: `<detected-or-given>`
**ECC mode**: `<plugin | legacy>`
**Steps**: <N>
**Scope**: <all | step:n | range:a-b>

## Steps overview

| # | Title | Tags | Chain |
|---|---|---|---|
| 1 | ... | impl, db | `{AGENT(tdd-guide)},{AGENT(database-reviewer)},{AGENT(python-reviewer)}` |
| ... | | | |

---

## Step 1 — <title>

**Intent**: <1–3 sentences>
**Tags**: <a, b>
**Chain rationale**: <why this chain; which agent closes the loop>

```bash
{ORCH_CMD} custom "{AGENT(tdd-guide)},{AGENT(database-reviewer)},{AGENT(python-reviewer)}" "[Plan: docs/foo.md#step-1] <compressed task description>; Acceptance: <1–3 items>; Out of scope: <…>"
```
````

> The `{ORCH_CMD}` and `{AGENT(...)}` notation above describes the substitution this skill performs at runtime. The actual emitted Markdown contains the resolved strings, never the placeholders.

Append a final "Batch execution" block aggregating every step's command in order so the user can paste them all at once. **Skip the Batch block in overview-only mode**: when only the overview table is being emitted, there are no per-step commands to aggregate.

# Phase 5 — Self-check (run before emitting)

- [ ] Every agent in every chain comes from the catalogue (after stripping any `ecc:` prefix that appeared in the plan).
- [ ] Resolved `{ORCH_CMD}` and every resolved `{AGENT(...)}` use the **same** form (`plugin` or `legacy`) — never mixed in one output.
- [ ] No `# plugin form` / `# legacy form` annotations and no "strip the prefix" instructions remain in the rendered output.
- [ ] No invented `--mode` / `--gate` / `--agents=...` fields.
- [ ] Each task description is single-line, double-quoted, with embedded `"` escaped.
- [ ] Each task description begins with `[Plan: <path>#step-<id>]` and includes Acceptance (1–3 items). The `Out of scope:` clause is present only when inherited from the plan.
- [ ] No duplicate agent in any chain after dedup.
- [ ] Chain length ≤ 4.
- [ ] Steps tagged `impl`/`refactor`/`migration` end with a reviewer-class agent. `test` and `build` are exempt.
- [ ] Zero-tag steps emit `code-reviewer` with the rationale `no tag matched; default review-only chain`.
- [ ] Overview table lists every step in the plan, regardless of `--scope`.
- [ ] Per-step detail block count matches the resolved `--scope`. In overview-only mode, no per-step blocks and no Batch block are emitted.

# Edge cases

- **No clear steps**: prefer H2/H3 splitting; if still ambiguous, report "no structured steps detected" with the document outline and ask the user to confirm running by outline.
- **Large plan (>1500 lines)**: enter **overview-only mode** — emit only the overview table and ask the user to narrow with `--scope` before re-running for details. In this mode, skip per-step detail blocks and skip the Batch execution block.
- **Step too broad** (e.g. "complete all backend work"): do not force a single chain. Suggest splitting into N.a and N.b and propose a split.
- **Plan declares agents** (rare): first **strip any `ecc:` prefix** to get the bare catalogue name, then validate against the catalogue. Replace invalid agents and explain under "Chain rationale". The bare name is re-prefixed at output time per `ECC_MODE`.
- **Polyglot project where `--lang=auto` cannot pick a winner**: set `lang=unknown`; reviewer resolves to `code-reviewer` and build resolver to `build-error-resolver`. Mention the fallback under "Chain rationale".

# Examples

## Example 1 — Plugin mode, Python plan

Input:

```
plan-orchestrate @docs/plan/example-feature.md --lang=python
```

Excerpt of expected output:

````markdown
## Step 2 — Encrypt sensitive UserProfile fields

**Intent**: Introduce an `EncryptedString` SQLAlchemy type and AES-GCM encrypt `birth_datetime` / `location` before persistence; load the key from an environment variable.
**Tags**: impl, security, db
**Chain rationale**: Security-sensitive write path, so `security-reviewer` closes the chain; `database-reviewer` validates the alembic migration; `python-reviewer` covers typing and PEP 8.

```bash
/ecc:orchestrate custom "ecc:tdd-guide,ecc:database-reviewer,ecc:python-reviewer,ecc:security-reviewer" "[Plan: docs/plan/example-feature.md#step-2] Implement EncryptedString SQLAlchemy type and migrate UserProfile.birth_datetime/location columns; key from ENV APP_DB_KEY; Acceptance: encrypt/decrypt roundtrip tests pass; alembic upgrade/downgrade clean on empty DB; no plaintext in DB after migrate; Out of scope: cross-tenant profile sharing logic"
```
````

## Example 2 — Legacy mode, same step

If `ECC_MODE=legacy` were detected, the same step would be emitted as a single uniform command (no plugin-prefixed forms anywhere in the output):

```bash
/orchestrate custom "tdd-guide,database-reviewer,python-reviewer,security-reviewer" "[Plan: docs/plan/example-feature.md#step-2] ..."
```

The two examples above illustrate **the two possible outputs** for two different environments. A single skill invocation produces only one of them, end to end.

# Notes

- Generative only. Never invoke `/orchestrate` from inside this skill.
- Match the language of the plan document for task descriptions (agent names always remain English).
- Do not insert "Co-Authored-By" lines or emoji in the output unless the user explicitly asks.
- Skip when the work is one ad-hoc step → call `/orchestrate custom` directly.

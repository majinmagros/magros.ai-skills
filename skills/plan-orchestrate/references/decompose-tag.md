# Inputs

```
<plan-doc-path> [--lang=python|typescript|go|rust|cpp|java|kotlin|flutter|auto] [--scope=all|step:<n>|range:<a>-<b>] [--dry-run]
```

- `<plan-doc-path>` — required; relative or absolute path (`@docs/...` accepted).
- `--lang` — reviewer language variant; defaults to `auto` (detected from project).
- `--scope` — limits emitted steps; defaults to `all`.
- `--dry-run` — print decomposition + chain rationale only; do not emit final prompts.

# Phase 0 — Detect ECC mode + language

1. Read `<plan-doc-path>`. If missing or empty, report and stop.
2. Detect ECC install form once and freeze it into `ECC_MODE`. Algorithm (run in order, stop at the first match):
   1. If `<claude-home>/plugins/marketplaces/ecc/` exists → `ECC_MODE=plugin`.
   2. Else if `<claude-home>/agents/` exists and contains at least one ECC agent file (e.g. `tdd-guide.md`, `code-reviewer.md`) → `ECC_MODE=legacy`.
   3. Else → default to `ECC_MODE=legacy` and emit a one-line warning at the top of the output: `> Warning: could not detect ECC install; defaulting to legacy form. If you use the plugin install, edit the prefixes manually.`
   4. If both markers exist (mixed install), `plugin` wins — the plugin namespace is the only one that resolves agent names without fuzzy matching.

   From this point on, every emitted line uses the matching prefix on **both** the slash command and every agent name. **Never emit both forms in the same output.**
3. Resolve `--lang`. When `auto`, run a polyglot-aware detection:
   - Probe markers: `pyproject.toml` / `uv.lock` / `requirements.txt` → python; `package.json` → typescript; `go.mod` → go; `Cargo.toml` → rust; `CMakeLists.txt` or top-level `*.cpp` → cpp; `pom.xml` / `build.gradle` (Java) → java; `build.gradle.kts` or top-level Kotlin → kotlin; `pubspec.yaml` → flutter.
   - **Polyglot tie-break**: if more than one marker matches, pick the language whose source files outnumber the others (count via `git ls-files`, excluding `vendor/`, `node_modules/`, `dist/`, `build/`, `.venv/`, generated files, and obvious test fixtures). On a tie or when no language exceeds 60% of source files, set `lang=unknown`.
   - No marker matched → set `lang=unknown`.
   - `lang=unknown` is a sentinel — it is **not** an agent name. Composition rules turn it into `code-reviewer` / `build-error-resolver` at chain composition time.
4. Detect a **PyTorch sub-profile**: when `lang=python` and any of `pyproject.toml` / `requirements.txt` / `uv.lock` declares a dependency on `torch`, set `pytorch=true`. This only affects `build` chain selection; the reviewer remains `python-reviewer`.
5. **Normalize any agent names declared in the plan**: if the plan text references agents by their plugin-prefixed form (e.g. `ecc:tdd-guide`), strip the prefix to get the bare catalogue name before validating or composing chains. Re-prefixing happens only at output time per `ECC_MODE`. Never let a pre-prefixed name flow into chain composition — it would double-prefix in plugin mode.

# Phase 1 — Decompose steps

Identify "step units" in priority order:

1. Explicit numbering: `## Step N` / `### Phase N` / `## N. ...` / top-level ordered list.
2. A "Step" column in a table.
3. `---`-separated blocks with verb-led headings.
4. Otherwise treat each H2 as one step.

Per step extract `id` (1-based), `title` (≤ 80 chars), `intent` (1–3 sentences), `tags`.

# Phase 2 — Tag table

Tag by intent (multi-tag allowed; chain built from primary + stacked secondaries):

Trigger words below are matched case-insensitively. Multilingual plans are supported by matching the word stems in any language as long as the meaning aligns with the listed English trigger words.

| Tag | Trigger words | Default chain |
|---|---|---|
| `design` | architecture, design, choose, evaluate, RFC | `planner,architect` |
| `plan` | plan, breakdown, milestone | `planner` |
| `impl` | implement, build, add, create, port | `tdd-guide,<lang>-reviewer` |
| `test` | test, coverage, e2e, integration | `tdd-guide,e2e-runner` |
| `refactor` | refactor, cleanup, dedupe, split | `architect,refactor-cleaner,<lang>-reviewer` |
| `migration` | migrate, upgrade, rewrite, port | `architect,tdd-guide,<lang>-reviewer` |
| `db` | schema, migration, index, SQL, Postgres, alembic, sqlmodel | `database-reviewer,<lang>-reviewer` |
| `security` | encrypt, auth, secret, OWASP, PII | `security-reviewer,<lang>-reviewer` |
| `build` | build, compile, lint failure, CI | `<lang>-build-resolver` (falls back to `build-error-resolver`) |
| `docs` | docs, readme, codemap, changelog | `doc-updater` |
| `lookup` | lookup, reference, API usage | `docs-lookup` |
| `review` | review, audit, verify | `<lang>-reviewer,code-reviewer` |
| `loop` | loop, autonomous, watchdog | `loop-operator` |

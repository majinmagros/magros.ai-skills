# Claude Code: Full Conversational Wizard

Inventory first, collect only supported choices, preview, confirm once, apply non-interactively, verify, welcome only after success. Never clone ECC to temp or copy plugin components by hand. Human terminal entry: `ecc setup` / `npx ecc-universal setup`; inside a harness use explicit non-interactive commands below.

## 1. Inventory Without Changing Anything

```bash
claude plugin list --json
claude plugin marketplace list --json
```

Summarize installed scope, enabled state, marketplace source. Single `ecc@ecc` = reconfiguration. Do not read provider "Open home page" as install evidence. On multiple scopes, legacy/manual install, malformed settings, or marketplace collision: stop, report setup's recovery — never guess deletions.

## 2. Collect Exactly Two Choices

Scope (require one): `user | project | local` — global for user, shared via repo, private to project. Mark only the selected scope as selected/installing. Different scope than existing install = scope migration → include `--move-scope`.

Hook mode (require one): `off | minimal | standard | strict` — skills+commands with no hooks, lightest safety, balanced, strongest checks. Hook preference is personal plugin config; it does not follow install scope.

## 3. Preview and Confirm Once

```bash
node "$CLAUDE_PLUGIN_ROOT/scripts/setup.js" --mode claude-plugin \
  --scope <scope> --hooks <hooks> [--move-scope] --dry-run --json
```

Fallback:

```bash
npx --yes --package ecc-universal ecc setup --mode claude-plugin \
  --scope <scope> --hooks <hooks> [--move-scope] --dry-run --json
```

Show one summary (action, scope, hook mode, marketplace action, migration). One yes/no question. Never run bare interactive `ecc setup` in a harness shell (commonly non-TTY).

## 4. Apply the Explicit Choices

After confirmation, rerun without `--dry-run`, keep `--yes --json`:

```bash
node "$CLAUDE_PLUGIN_ROOT/scripts/setup.js" --mode claude-plugin \
  --scope <scope> --hooks <hooks> [--move-scope] --yes --json
```

Fallback mirrors step 3 with `npx --yes --package ecc-universal ecc setup ... --yes --json`.

## 5. Verify, Then Render the Welcome

Require zero exit + setup result `scope`/`hooks` equal to selections. Then:

```bash
claude plugin list --json
```

Continue only with exactly one enabled `ecc@ecc` at the selected scope. With `$CLAUDE_PLUGIN_ROOT`, pass setup `action` (`installed`, `updated`, `migrated`, `resumed`, `already-migrated`) to the renderer — first require provider version to match `ECC_VERSION_PATTERN` from `scripts/lib/terminal-welcome.js`, reject unexpected text:

```bash
node -e 'const { renderTerminalWelcome } = require(process.env.CLAUDE_PLUGIN_ROOT + "/scripts/lib/terminal-welcome"); process.stdout.write(renderTerminalWelcome({ action: process.argv[1], version: process.argv[2], color: process.stdout.isTTY }));' "<action>" "<installed-version>"
```

Render once. On failure, dry-run, cancellation, mismatch, or unverifiable state: report error + recovery, no welcome. After verified changes: run `/reload-plugins` or restart Claude Code.

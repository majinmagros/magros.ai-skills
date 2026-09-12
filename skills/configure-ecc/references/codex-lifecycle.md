# Codex: Native Plugin Lifecycle

Use Codex's native plugin lifecycle. No Claude-style `user | project | local` selector. Codex native plugins support provider-specific hooks, but Codex requires explicit trust — let Codex show that decision; never ask the Claude four-profile hook question or claim those profiles map to Codex.

Inventory:

```bash
codex plugin marketplace list --json
codex plugin list --available --json
```

Marketplace missing → add; present → refresh:

```bash
codex plugin marketplace add affaan-m/ECC
codex plugin marketplace upgrade ecc --json
```

One confirmation, then install/refresh and verify:

```bash
codex plugin add ecc@ecc --json
codex plugin list --json
```

Continue only when JSON reports ECC installed with `installedPath`. Render the verified bundle's welcome using only the exact absolute `installedPath` from JSON. Reject control characters; require version to match `ECC_VERSION_PATTERN`. Invoke `node` directly with an argument array (tool API, not shell):

```text
["<installedPath>/scripts/welcome.js", "--action", "configured", "--version", "<installed-version>"]
```

If the harness cannot invoke an executable with a separate argument array, skip the welcome. Never build a shell command from Codex JSON values. Never claim Claude's `off | minimal | standard | strict` profiles were applied to Codex.

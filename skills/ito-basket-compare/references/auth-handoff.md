# First-Run Authentication Handoff

Resolve a concrete basket-read source and its auth contract before requesting authentication. Public catalog/detail endpoints need no login and suffice when they contain the required fields. If no authenticated basket-read source is configured, use public/pasted input — never request compute credentials.

`ecc ito auth --json` is an optional validation-only compute identity probe. It does not start login and cannot unlock basket reads. Use only when the user explicitly requests compute-account identity validation alongside the comparison.

For a concrete authenticated basket source whose documented contract explicitly uses the canonical Itô device credential (the public `/api/v1` does not):

1. Run `ecc ito auth --json` only if that source contract requires the same identity. Validation-only, never starts login.
2. On missing/expired/revoked credentials, pause and return `AUTH_REQUIRED` or `AUTH_REVOKED`. User runs `ecc ito login` (device authorization, verification page by default, token in macOS Keychain; `--no-browser` suppresses handoff). ECC performs no browser automation.
3. Preserve a secret-free resume summary: originating task/agent, user request, selected input identifiers, completed read-only steps.
4. After the user reports completion, return to the originating agent and run `ecc ito auth --json` once more. Resume only the original read-only request; never broaden scope because login succeeded.

`ITO_API_KEY` may be forwarded by compute `auth` only when already configured — never read or display it. The canonical Itô client is a separately installed, currently unpublished dependency via explicit absolute `ECC_ITO_CLI_EXECUTABLE`; ECC does not discover it through `PATH`. If absent, return `AUTH_REQUIRED` with installation guidance from `ito-compute`, without inventing success.

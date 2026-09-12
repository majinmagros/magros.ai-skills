---
name: ito-compute
description: Query live GPU inventory, submit an authenticated Itô fixed-rate RFQ, inspect RFQ or procurement status, revoke device credentials, and run explicitly gated node qualification through the separately installed canonical CLI. Use when a user asks to find H100/H200 capacity, request a fixed compute rate, check Itô compute status, validate GPU nodes, revoke Itô access, or rent or purchase GPU compute and needs the supported boundary explained.
---

# Itô Compute

Use the canonical Itô compute CLI or MCP server. ECC does not implement a
parallel client, local simulation, reservation, workload runner, or inference
server. ECC itself does no browser automation.

## Install the canonical local package

`ito-compute-cli` is currently unpublished. Build it from its canonical
repository instead of using `npx`, `npm exec`, or an unverified package:

```sh
git clone https://github.com/Ito-Markets/ito-cloud-runtime.git
cd ito-cloud-runtime/cli/ito-compute-cli
npm ci
npm run check
```

Set `ECC_ITO_CLI_EXECUTABLE` to the explicit absolute built entry:

```text
/absolute/path/to/ito-cloud-runtime/cli/ito-compute-cli/dist/bin/ito.js
```

ECC never discovers this credential-bearing client through `PATH`.
`ecc ito login` performs device authorization and never inherits `ITO_API_KEY`.
The validation-only `auth`, plus `find` and `status`, forward `ITO_API_KEY`
directly when configured; `ITO_AUTH_MODE=legacy` is not required. Never put a
key or token in arguments, tracked files, MCP results, logs, or chat.

## CLI workflow

1. Run `ecc ito login` before the first operation. ECC delegates this to the
   canonical CLI's device authorization, which opens the Itô verification page
   by default and persists a device token in macOS Keychain. Use
   `ecc ito login --no-browser` to suppress the page handoff. ECC itself does no
   browser automation. If the originating agent cannot complete the signed-in
   browser step, hand the exact command to the user; after approval finishes,
   return to the originating task and continue with `ecc ito auth`.
   Device tokens use macOS Keychain by default. File-token fallback is explicit
   and its directory and token file must remain owner-only (0700 and 0600).
2. Run `ecc ito auth` to validate existing credentials; it never starts login
   and rejects `--no-browser`.
3. Before `ecc ito find`, obtain explicit buyer authority to submit an RFQ.
   - Require `gpu`, `count`, whole `days`, `max-rate`, `nodes`,
     `gpus-per-node`, `storage-tb`, `start-window`, `form-factor`,
     `contract-type`, `fabric`, `region`, and the split-fill decision.
   - Require `count == nodes * gpus-per-node`; never derive topology.
   - Use `any` only when the buyer explicitly accepts any fabric or region.
   - Omitted `--allow-split` means false.
4. Run the live RFQ command:

   ```sh
   ecc ito find \
     --gpu h200 \
     --count 8 \
     --nodes 1 \
     --gpus-per-node 8 \
     --days 30 \
     --storage-tb 1 \
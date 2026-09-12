---
name: ito-inference
description: "Use when inspect the availability of model serving on a completed Itô compute booking and, when the canonical backend becomes available, hand off an explicitly confirmed serving manifest. Use after ito-compute has booked GPU nodes and the user asks for an OpenAI-compatib... Triggers on \"ito-inference\", \"ito inference\", \"inference\"."
metadata:
  origin: ECC
  status: scaffold
  aliases: ito-serve, hosted-open-weights
---

# Itô Inference

`ito-inference` is the sole canonical ECC skill for inference serving on Itô
compute. Requests naming `ito-serve` route here; do not create or install a
second `ito-serve` skill. ECC never SSHes to nodes, downloads weights, launches
an engine, or exposes an endpoint; it never books, reserves, or spends.

## Current production boundary

Managed serving is unavailable today. The ECC bridge exposes only `login`,
`auth`, `find`, `status`, and explicitly gated `evals`. It has no `serve` verb.
The canonical runtime documents `inference` only as an unsupported compatibility
probe; ECC does not invoke or depend on it. The MCP surface exposes only auth,
find, and status. The locally enforceable guarantee is that ECC rejects `serve`
before resolving or spawning the credential-bearing canonical client.

Therefore stop before authentication or any command invocation. Report the
missing capability and return to the originating agent. Never substitute a
local runner, SSH helper, browser workflow, purchase endpoint, or any untracked
local `ito-serve` draft.

## Required entitlement

When serving is implemented, its first gate is a server-verified completed
booking. Harness memory, an RFQ, a quote, node IPs, or SSH access are not proof
of entitlement. The backend must return fresh serving eligibility bound to the
authenticated account, booking, GPU topology, region, fabric, term, and model
policy. Expired, revoked, mismatched, incomplete, or already-released bookings
fail closed before confirmation.

## Future CLI and API contract

The intended command name is `serve`; `inference` may remain only as an
explicitly deprecated compatibility alias after the production contract lands.
The future handoff must be equivalent to:

```sh
ecc ito serve \
  --booking <server-verified-booking-id> \
  --manifest <absolute-reviewed-json-file> \
  --confirmation-ref <opaque-non-authorizing-reference> \
  --idempotency-key <stable-retry-key> \
  --json
```

The reviewed manifest must identify the model revision, engine and version,
quantization, tensor/pipeline topology, endpoint exposure policy, artifact
checksums, storage ceiling, runtime limits, optional TTFT/TPOT objectives, and
maximum incremental cost. No raw API key, SSH key, node password, or bearer
token belongs in arguments, manifests, logs, MCP results, or chat.

The client must canonicalize the manifest path, reject symlinks, open a regular
file without following links, require appropriate ownership and restrictive
permissions, enforce a bounded size, and hash bytes from the opened descriptor.
That digest must exactly equal the digest bound into confirmation before any
workload mutation. A path swap, digest mismatch, oversized file, or mutable
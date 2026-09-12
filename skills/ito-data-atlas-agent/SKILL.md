---
name: ito-data-atlas-agent
description: "Use when design source-grounded Data Atlas style agents for Itô basket research, market discovery, parameter drafting, and human-in-the-loop editing. Use for architecture and read-only workflow planning, not live order execution. Triggers on \"ito-data-atlas-agent\", \"ito data atlas agent\", \"agent\"."
metadata:
  origin: ECC
---

# Itô Data Atlas Agent

Design a background research agent that discovers data sources, drafts a basket
or parameter change, and returns an editable, source-grounded result to a human.
It may use Itô's documented read-only product-data surfaces. It never runs live
trading.

## Discovery

Trigger examples include:

- "discover data sources for an Itô basket"
- "draft a basket from these sources"
- "design a background research agent"
- "build a Data Atlas workflow with human review"

Do not trigger this skill for order placement, supplier outreach, customer
communication, production provisioning, or unsupervised publication.

## Supported Itô data surfaces and dependency gate

Data Atlas uses Itô's product-data APIs rather than the compute API:

- Anonymous, rate-limited edge reads at `https://itomarkets.com`, including
  `GET /api/baskets/bootstrap` and `GET /api/markets/hot`.
- The keyed developer API at `https://itomarkets.com/api/v1`, including market
  search/detail/history and basket analytics. Required scopes are
  `markets:read` and/or `baskets:read` for the requested operation.
- The canonical Python SDK package `ito-markets`, imported as `ito`, for typed
  basket, market, data, and backtest reads. Pin or record the installed version.

Prefer the SDK for authenticated, repeatable reads. Before using it, verify the
installed package/version, requested resource method, documented response type,
and least-privilege API-key scope. If the SDK is absent, installation changes
the environment: propose the exact package/version and obtain confirmation
before installing it. Direct HTTP is acceptable only for a documented GET
endpoint with its published response contract.

An `ITO_API_KEY` is a keyed developer API credential, not a compute credential.
The canonical `ito-compute-cli` and its device credential are compute-specific;
do not reuse the compute device credential as proof of `markets:read` or
`baskets:read` authorization. Never invent an endpoint, command, schema, scope,
or successful response. If a keyed read is unavailable, continue with documented
anonymous reads when they satisfy the objective and mark private/keyed access as
blocked rather than fabricating parity.

## Authentication and return handoff

The current developer API uses a scoped API key. Obtain it only through the
host's approved secret provider, pass it in memory to the SDK or Bearer header,
and never place it in chat, command arguments, screenshots, reports, or
committed files. Validate it with the smallest documented read and record only
status, SDK version, scopes (when returned), and timestamp.

If a future canonical client documents device authorization, use this flow:

1. Preserve the originating agent/task identifier and the pending read-only
   request before starting login.
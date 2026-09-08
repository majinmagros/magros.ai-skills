---
name: agent-commerce-interface
description: "Use when exposing a product so AI agents can buy or order through a CLI or MCP with typed commands, schemas, and idempotent operations. Triggers on \"agent commerce\", \"CLI for agents\", \"MCP product interface\", \"agent consumable API\". Non-triggers: building a plain MCP server with no ordering or payment semantics (use mcp-server-patterns). Outcome: an agent-readable product interface with commands, schemas, and safe retry rules."
metadata:
  origin: ECC
---

# Agent Commerce Interface

Design your product so an agent can consume it: typed commands, clear
schemas, idempotent orders, and observable runs. Human UI stays; the agent
path is a first-class interface, not a screen scrape.

## When To Activate

- The user says agents should order, book, or buy from our product, expose
  this as CLI or MCP, or support agent checkout.
- Orders need retries without double charges or duplicate deliveries.
- The agent must discover catalog, price, and status on its own.
- Approval or spending limits apply per agent or per task.

## Validation Warning

- The DoorDash-CLI pattern from the source video (an agent ordering food
  through a CLI) is treated here as an unconfirmed report. Validate the
  real case against primary sources before production design. Do not
  present it as a confirmed integration.

## Workflow

1. Define the agent surface: list the minimum commands (search catalog,
   get item, create order, get order status, cancel order). Nothing else
   ships in v1.
2. Write schemas first: typed inputs and outputs with IDs, quantities,
   prices, currency, and error codes. Publish examples for each command.
3. Make orders idempotent: require a client-supplied idempotency key on
   create; retries with the same key return the same order, never a
   duplicate.
4. Add budgets and approvals: per-task spend caps, allowlisted actions,
   and a human approval step above a threshold. Log every decision.
5. Expose state: every order returns a stable ID plus a status URL or
   status command the agent can poll without guessing.
6. Harden the path: least-privilege tokens, scoped keys per agent, rate
   limits, and a kill switch for the agent channel.
7. Test with a harness: scripted agent runs (happy path, retry, cancel,
   over-budget, revoked key) must pass before opening the interface.
8. Document for models: one short page with commands, schemas, limits,
   and errors, written so an agent can act without a human tutorial.

## Command Contract

- `search` returns items with stable IDs and prices.
- `order create` requires idempotency key + item ID + quantity.
- `order status` returns state plus next allowed actions.
- `order cancel` states refund or void outcome explicitly.

## Anti-Patterns

- Screen scraping your own UI instead of shipping typed commands.
- Orders without idempotency keys -> duplicates on retry.
- No spend caps or approvals on an ordering agent.
- Undocumented errors the agent cannot recover from.
- One shared admin key for all agents.
- Treating the DoorDash anecdote as a confirmed spec.

## Relations

- `api-connector-builder`: match the repo integration pattern for APIs.
- `mcp-server-patterns`: tools, resources, prompts, and transports.
- `agent-guardrails`: approvals, allowlists, and injection defenses.
- `agent-payment-x402`: payment execution with budgets where applicable.

## Sources

- MCP tools concepts: https://modelcontextprotocol.io/docs/concepts/tools
- OpenAPI spec (schema-first design): https://spec.openapis.org/oas/latest.html
- DoorDash CLI ordering as described in the source video is author
  measurement. Validate the real case before production use.

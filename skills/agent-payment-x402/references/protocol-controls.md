# Protocol, Decision Tree, Controls

x402 extends HTTP 402 into a machine-negotiable flow: on `402`, the payment tool negotiates price, checks budget, signs, and retries only inside the orchestrator's policy/confirmation boundary.

## Decision Tree

| Need | Recommended path |
|------|------------------|
| Agent pays a 402-gated API on Base or another agentwallet-supported chain | `agentwallet-sdk` as MCP payment server with strict spending policy |
| Agent pays a 402-gated API on X Layer | OKX Agent Payments Protocol from `okx/onchainos-skills`; `okx-x402-payment` is a deprecated legacy alias |
| TypeScript API charges agents | OKX Payments TypeScript seller SDK (Express, Hono, Fastify, Next.js) |
| Go API charges agents | OKX Payments Go seller SDK (Gin, Echo, `net/http`) |
| Rust API charges agents | OKX Payments Rust seller SDK (Axum) |
| Java API charges agents | OKX Payments Java seller SDK (Spring Boot 2/3, Java EE, Jakarta) |
| Python API charges agents | Check the OKX Payments repo first; a Python seller guide may not exist |

## Supported Networks

- `agentwallet-sdk`: confirm current coverage in package docs. Base Sepolia for dev; Base mainnet for production.
- OKX Payments / X Layer: seller docs target X Layer (`eip155:196`) + USDT0 settlement. Fetch current SDK docs before production code — packages and facilitator behavior change fast.

## Spending Controls

Every payment tool call enforces a `SpendingPolicy`:

- **Per-task budget** — max spend for a single agent action
- **Per-session budget** — cumulative session limit
- **Allowlisted recipients** — restrict payable addresses/services
- **Rate limits** — max transactions per minute/hour

## Non-Custodial Wallets

Agents hold keys via ERC-4337 smart accounts. The orchestrator sets policy before delegation; the agent spends only within bounds. No pooled funds, no custodial risk. Pairs with cost-aware-llm-pipeline and security-review.

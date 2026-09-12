# Best Practices and Production Reference

- **Set budgets before delegation**: attach a SpendingPolicy via the orchestration layer. Never unlimited spend.
- **Pin dependencies**: exact version in MCP config (e.g. `agentwallet-sdk@6.0.0`). Verify integrity before production.
- **Audit trails**: `list_transactions` in post-task hooks to log spend and reason.
- **Fail closed**: payment tool unreachable → block the paid action, no unmetered fallback.
- **Pair with security-review**: payment tools are high-privilege, same scrutiny as shell access.
- **Testnets first**: Base Sepolia for dev; Base mainnet for production.

## Production Reference

- **npm**: [`agentwallet-sdk`](https://www.npmjs.com/package/agentwallet-sdk)
- **NVIDIA NeMo Agent Toolkit**: [PR #17](https://github.com/NVIDIA/NeMo-Agent-Toolkit-Examples/pull/17) — x402 payment tool for NVIDIA agent examples
- **Protocol spec**: [x402.org](https://x402.org)
- **OKX Payments SDKs**: [`okx/payments`](https://github.com/okx/payments) — TypeScript, Go, Rust, Java seller integrations for X Layer x402
- **OKX Agent Payments Protocol skill**: [`okx/onchainos-skills`](https://github.com/okx/onchainos-skills/tree/main/skills/okx-agent-payments-protocol)
- **OKX Payments overview**: [web3.okx.com/onchainos/dev-docs/payments/overview](https://web3.okx.com/onchainos/dev-docs/payments/overview)

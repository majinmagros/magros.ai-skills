# MCP Integration

Payment layer exposes standard MCP tools for Claude Code / agent harnesses.

> **Security:** always pin the package version. This tool manages private keys — unpinned `npx` installs are supply-chain risk.

## Option A: agentwallet-sdk (Base / Multi-Chain)

```json
{
  "mcpServers": {
    "agentpay": {
      "command": "npx",
      "args": ["agentwallet-sdk@6.0.0"]
    }
  }
}
```

### Available Tools (Agent-Callable)

| Tool | Purpose |
|------|---------|
| `get_balance` | Check agent wallet balance |
| `send_payment` | Send payment to address or ENS |
| `check_spending` | Query remaining budget |
| `list_transactions` | Audit trail of all payments |

> Spending policy is set by the **orchestrator** before delegation — never by the agent. Configure via `set_policy` in the orchestration layer or pre-task hook, never as an agent-callable tool.

## Option B: OKX Agent Payments Protocol (X Layer)

For X Layer x402, Multi-Party Payment (MPP), session payment, charge, and A2A charge flows.

Buyer-side:

1. Install or reference the current `okx/onchainos-skills` repository.
2. Use `skills/okx-agent-payments-protocol/SKILL.md` as the dispatcher.
3. Treat `skills/okx-x402-payment/SKILL.md` as a deprecated compatibility alias.
4. Require explicit user confirmation before wallet checks or payments. Never hide payment execution behind a generic tool call.

Seller-side guides (fetch latest before generating code):

| Runtime | Current guide |
|---------|---------------|
| TypeScript | `https://raw.githubusercontent.com/okx/payments/main/typescript/SELLER.md` |
| Go | `https://raw.githubusercontent.com/okx/payments/main/go/x402/SELLER.md` |
| Rust | `https://raw.githubusercontent.com/okx/payments/main/rust/x402/SELLER.md` |
| Java | `https://raw.githubusercontent.com/okx/payments/main/java/SELLER.md` |

Never copy older examples without checking the current OKX repo.

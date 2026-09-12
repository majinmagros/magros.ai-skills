---
name: agent-payment-x402
description: "Use when adding x402 payment execution to agents with budgets and non-custodial wallets. Triggers on \"agent-payment-x402\", \"agent payment x402\", \"x402\"."
metadata:
  origin: ECC
---

# Agent Payment Execution (x402)

Policy-gated agent payments over x402 with spending controls, no custodial risk. Detalhes em `references/`.

## When to Activate

- Agent must pay for a 402-gated API call or service
- Settling payments with another agent (Base or X Layer)
- Enforcing per-task or per-session spending limits
- Managing a non-custodial agent wallet (ERC-4337)
- Exposing a seller API that charges agents via x402

## Core Principles

1. **Route by chain** — Base/multi-chain via agentwallet-sdk; X Layer via OKX protocol
2. **Policy before delegation** — orchestrator sets budgets; agent never self-escalates
3. **Pin versions** — key-handling subprocesses never float on unpinned `npx`
4. **Fail closed** — unreachable payment tool blocks the paid action
5. **Audit everything** — `list_transactions` in post-task hooks; testnets first

## Example

```json
{ "mcpServers": { "agentpay":
  { "command": "npx", "args": ["agentwallet-sdk@6.0.0"] } } }
```

## References

- `references/protocol-controls.md` — decision tree, networks, x402 flow, SpendingPolicy, wallets
- `references/mcp-setup.md` — pinned MCP config, agent tools, OKX buyer/seller paths
- `references/orchestrator-example.md` — set_policy + fail-closed preToolCheck (5 paths)
- `references/practices-production.md` — budgets, pinning, audit, testnets, production links

## Checklist

- [ ] Correct path: agentwallet-sdk (Base) vs OKX protocol (X Layer)
- [ ] Package version pinned; wallet key via env, validated pre-start
- [ ] `set_policy` verified successful before any delegation
- [ ] preToolCheck fail-closed on invalid input, transport, shape, budget
- [ ] Spend audited; dev on Base Sepolia before mainnet

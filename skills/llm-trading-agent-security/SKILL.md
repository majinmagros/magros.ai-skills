---
name: llm-trading-agent-security
description: "Use when security patterns for autonomous trading agents with wallet or transaction authority. Covers prompt injection, spend limits, pre-send simulation, circuit breakers, MEV protection, and key handling. Triggers on \"llm-trading-agent-security\", \"llm trading agent security\", \"security\"."
metadata:
  origin: ECC direct-port adaptation
version: "1.0.0"
---

# LLM Trading Agent Security

Autonomous trading agents have a harsher threat model than normal LLM apps: an injection or bad tool path can turn directly into asset loss.

## When to Use

- Building an AI agent that signs and sends transactions
- Auditing a trading bot or on-chain execution assistant
- Designing wallet key management for an agent
- Giving an LLM access to order placement, swaps, or treasury operations

## How It Works

Layer the defenses. No single check is enough. Treat prompt hygiene, spend policy, simulation, execution limits, and wallet isolation as independent controls.

## Examples

### Treat prompt injection as a financial attack

```python
import re

INJECTION_PATTERNS = [
    r'ignore (previous|all) instructions',
    r'new (task|directive|instruction)',
    r'system prompt',
    r'send .{0,50} to 0x[0-9a-fA-F]{40}',
    r'transfer .{0,50} to',
    r'approve .{0,50} for',
]

def sanitize_onchain_data(text: str) -> str:
    for pattern in INJECTION_PATTERNS:
        if re.search(pattern, text, re.IGNORECASE):
            raise ValueError(f"Potential prompt injection: {text[:100]}")
    return text
```

Do not blindly inject token names, pair labels, webhooks, or social feeds into an execution-capable prompt.

### Hard spend limits

```python
from decimal import Decimal

MAX_SINGLE_TX_USD = Decimal("500")
MAX_DAILY_SPEND_USD = Decimal("2000")

class SpendLimitError(Exception):
    pass

class SpendLimitGuard:
    def check_and_record(self, usd_amount: Decimal) -> None:
        if usd_amount > MAX_SINGLE_TX_USD:
            raise SpendLimitError(f"Single tx ${usd_amount} exceeds max ${MAX_SINGLE_TX_USD}")

        daily = self._get_24h_spend()
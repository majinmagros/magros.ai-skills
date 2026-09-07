---
name: alpaca-broker-ops
description: "Use when an AI agent must trade stocks/ETFs/crypto through the Alpaca API — paper-first connector setup, scheduled wakeup loops with file handoff, and financial guardrails. Triggers on \"Alpaca\", \"paper trading\", \"stock trader agent\", \"APCA_API_BASE_URL\", \"trading wakeups\", \"alpaca-broker\". Non-triggers: on-chain/crypto-wallet trading (use llm-trading-agent-security), prediction markets (use ito-trade-planner), generic backtesting without a broker. Outcome: a paper-first Alpaca operator with separate keys per environment, a wakeup schedule, file-based continuity, and hard spend/risk limits before any live order."
metadata:
  origin: ECC
---

# Alpaca Broker Ops

Operate Alpaca (stocks, ETFs, crypto) from an agent loop. The two non-negotiable
rules: **paper-first always**, and **live money only behind explicit approval
plus hard limits**.

## When To Activate

- The user wants an agent that trades, manages a portfolio, or runs a trading
  schedule via Alpaca.
- Paper-trading setup, Alpaca API keys, or paper-vs-live endpoint confusion.
- A 24/7 trading loop with wakeups, journals, and notifications.

## Connector (validated 2026-09-07)

Source: https://docs.alpaca.markets/us/docs/paper-trading

- Paper and live share the **same API spec**, different base URL and keys.
- Paper endpoint: `https://paper-api.alpaca.markets`
  via env `APCA_API_BASE_URL=https://paper-api.alpaca.markets`.
- Keys live in `.env` (never in chat, logs, or repo). Paper keys differ from
  live keys — generate fresh keys per paper account.
- Paper accounts start with a **$100k** default balance and can be re-created
  (dashboard → paper account number → Open New Paper Account).
- Paper is a **simulation**: fills follow real-time quotes but ignore market
  impact, slippage from latency, queue position, partial-fill randomness
  nuances, fees, and dividends. A strategy that works on paper is unproven live.
- Paper includes free IEX real-time data. Full Саудов feeds are paid tiers —
  verify the current plan/price on the Alpaca pricing page before quoting
  numbers (do not hardcode feed prices from videos).

## Paper-First Rule

1. Every new strategy runs on paper until it has a written track record
   (trades, fills, drawdowns) in the journal.
2. Promotion paper → live is a human approval gate, never automatic.
3. Live starts small, with daily loss limits and a kill switch (below).

## Wakeup Loop Pattern

Scheduled wakeups (example: pre-market news+watchlist, open, midday review,
afternoon manage, close-out, confirm+log) work because each wakeup is
**stateless** — continuity lives in files, not in context:

| File | Content |
|---|---|
| `strategy.md` | Rules, universe, position sizing, exit criteria |
| `progress.md` / handoff | What happened, open positions, next wakeup's job |
| `journal/` | Per-trade evidence: signal, fill, rationale |
| `.env` | `APCA_API_*` keys (never committed) |

- Keep all wakeups on the **same thread/project** to preserve file continuity;
  prefer local scheduled tasks when the cloud runner cannot pin the model or
  reasoning effort the strategy was validated on.
- Notifications (e.g. chat/DM digests at fixed times) follow the
  `approval-loop + morning-digest` pattern (G13): propose → human approves →
  execute. The loop never places live orders from a notification alone.

## Financial Guardrails

Layer on `agent-guardrails` + `llm-trading-agent-security`:

- Spend caps: max per-order, max daily loss, max open exposure.
- Circuit breakers: halt on consecutive losses, API errors, or stale data.
- Kill switch: one command revokes keys / flattens to paper.
- Pre-send checks: order side, symbol, qty, and estimated notional logged
  before submit; paper-run the exact payload first.
- `ito-trade-planner` does **not** apply here — it is explicitly
  non-execution and prediction-market scoped.

## Relations

- `llm-trading-agent-security`: spend limits, simulation, key handling.
- `agent-guardrails`: approval gates, sandboxing.
- `routines`, `continuous-agent-loop`, `agentic-os`: scheduling + file memory.
- `unified-memory`: handoff continuity across sessions.

## Sources

- Alpaca paper trading docs (validated 2026-09-07):
  https://docs.alpaca.markets/us/docs/paper-trading
- Pattern from Nate Herk "I Turned GPT-6 Astra Into a 24/7 Stock Trader"
  (2026-09-07, `TLQLfa7yH4I`): 6-wakeup schedule, file continuity, `.env`
  keys, paper-first, local tasks, DM digests. Model name "GPT-6 Astra" and the
  "$99/month market-data" figure are unverified video claims — re-check pricing
  before quoting.

---
name: 9router-resilient-fallback
description: Use when managing or configuring LLM agent loops experiencing frequent rate limits (429), quota exhaustion, or provider outages, implementing automatic failover and provider chains via 9Router. Triggers on "quedas de ia", "erro 429", "quota esgotada", "fallback automático", "9router fallback".
metadata:
  origin: ECC + 9Router
---

# 9Router Resilient Fallback

Mitigate AI downtime, rate limits (429), and provider quota exhaustion by routing agent requests through resilient fallback chains.

## Core Strategy
- **Centralized Gateway**: Route all agent calls through `NINEROUTER_URL` (`http://localhost:20128`).
- **Combo Chains**: Configure combos in 9Router SQLite DB or dashboard to automatically failover from premium models (Anthropic/OpenAI) to lightweight or free-tier alternatives (`qd/lite`, DeepSeek, local endpoints) when a 429/503 occurs.
- **Session Continuity**: Prevent agent loops from crashing mid-task due to transient network or provider failures.

## Quick Fix for Quota Exhaustion
If 9Router throws `503 All accounts unavailable` or frequent `429` errors:
1. Access the 9router DB at `$env:APPDATA\9router\db\data.sqlite` (tabela `combos`).
2. Move a responsive low-cost/free model (e.g., `qd/lite`) to the top of the combo chain.
3. Resume agent operations without restarting the router.

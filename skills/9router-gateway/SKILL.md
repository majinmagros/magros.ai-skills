---
name: 9router-gateway
description: Use when interacting with 9Router API gateway, managing local/remote AI proxies, fallback chains, auto-routing, and OpenAI-compatible endpoints for chat, image, TTS, embeddings, and web search. Triggers on "9router", "9Router API", "NINEROUTER_URL", "gateway de IA", "auto-fallback".
metadata:
  origin: decolua/9router
---

# 9Router Gateway

Local/remote AI gateway exposing OpenAI-compatible REST endpoints with automatic failover and provider aggregation.

## Setup & Endpoints

```bash
export NINEROUTER_URL="http://localhost:20128"
export NINEROUTER_KEY="sk-..."
```

- Chat / Completions: `$NINEROUTER_URL/v1/chat/completions`
- Models:
  - Chat: `$NINEROUTER_URL/v1/models`
  - Image: `$NINEROUTER_URL/v1/models/image`
  - TTS: `$NINEROUTER_URL/v1/models/tts`
  - Web: `$NINEROUTER_URL/v1/models/web`

## Error Handling
- **401**: Check/refresh `NINEROUTER_KEY`.
- **503 All accounts unavailable**: Quota exhausted across provider chain; rotate combo or update primary provider model.

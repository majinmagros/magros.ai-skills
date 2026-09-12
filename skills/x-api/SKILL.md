---
name: x-api
description: "Use when posting tweets, reading timelines, searching X, or tracking engagement programmatically. Triggers on \"x-api\", \"x api\", \"tweet\"."
metadata:
  origin: ECC
---

# X API

Programmatic posting, reading, search, and analytics on X (Twitter). Detalhes em `references/`.

## When to Activate

- User wants to post tweets or threads programmatically
- Reading timeline, mentions, or user data from X
- Searching X for content, trends, or conversations
- Building X integrations or bots
- Analytics and engagement tracking
- User says "post to X", "tweet", "X API", or "Twitter API"

## Core Principles

1. **Bearer for reads** — search, timelines, public data
2. **OAuth 1.0a for writes** — tweets, threads, media, DMs
3. **Read rate headers** — back off on `x-rate-limit-*`, never hardcode
4. **Secrets in env only** — never commit `.env`, rotate on exposure
5. **Draft before post** — voice profile → content-engine → approval → post

## Example

```python
resp = oauth.post("https://api.x.com/2/tweets",
    json={"text": "Hello from Claude Code"})
tweet_id = resp.json()["data"]["id"]
```

## References

- `references/auth.md` — Bearer app-only reads, OAuth 1.0a writes, env setup
- `references/operations.md` — tweet, thread, timeline, search, voice pull, user lookup, media
- `references/rate-limits-errors.md` — drift warning, header backoff, error map, security rules
- `references/content-integration.md` — brand-voice + content-engine flow, related skills

## Checklist

- [ ] Correct auth: Bearer for reads, OAuth 1.0a for writes
- [ ] Current docs verified (tiers/limits drift frequently)
- [ ] Rate-limit headers read; 429 backs off automatically
- [ ] No secrets in code or logs; `.env` gitignored
- [ ] Draft approved before posting; engagement tracked

# Core Concepts

## The Three Layers

Every data collection agent has three layers:

```
COLLECT → ENRICH → STORE
  │           │        │
Scraper    AI (LLM)  Database
runs on    scores/   Notion /
schedule   summarises Sheets /
           & classifies Supabase
```

## Free Stack

| Layer | Tool | Why |
|---|---|---|
| **Scraping** | `requests` + `BeautifulSoup` | No cost, covers 80% of public sites |
| **JS-rendered sites** | `playwright` (free) | When HTML fetching fails |
| **AI enrichment** | Gemini Flash via REST API | 500 req/day, 1M tokens/day — free |
| **Storage** | Notion API | Free tier, great UI for review |
| **Schedule** | GitHub Actions cron | Free for public repos |
| **Learning** | JSON feedback file in repo | Zero infra, persists in git |

## AI Model Fallback Chain

Build agents to auto-fallback across Gemini models on quota exhaustion:

```
gemini-2.0-flash-lite (30 RPM) →
gemini-2.0-flash (15 RPM) →
gemini-2.5-flash (10 RPM) →
gemini-flash-lite-latest (fallback)
```

## Batch API Calls for Efficiency

Never call the LLM once per item. Always batch:

```python
# BAD: 33 API calls for 33 items
for item in items:
    result = call_ai(item)  # 33 calls → hits rate limit

# GOOD: 7 API calls for 33 items (batch size 5)
for batch in chunks(items, size=5):
    results = call_ai(batch)  # 7 calls → stays within free tier
```

---

---
name: data-scraper-agent
description: Build a fully automated AI-powered data collection agent for any public source — job boards, prices, news, GitHub, sports, anything. Runs on a schedule, enriches data with a free LLM (Gemini Flash), stores results in Notion/Sheets/Supabase, and learns from user feedback. Runs 100% free on GitHub Actions. Use when the user wants to monitor, collect, or track any public data automatically.
metadata:
  origin: community
---

# Data Scraper Agent

Build a production-ready, AI-powered data collection agent for any public data source.
Runs on a schedule, enriches results with a free LLM, stores to a database, and improves over time.

**Stack: Python · Gemini Flash (free) · GitHub Actions (free) · Notion / Sheets / Supabase**

## When to Activate

- User wants to gather or monitor any public website or API
- User says "build a bot that checks...", "monitor X for me", "collect data from..."
- User wants to track jobs, prices, news, repos, sports scores, events, listings
- User asks how to automate data collection without paying for hosting
- User wants an agent that gets smarter over time based on their decisions

## When NOT to Use

- One-off scraping scripts (plain Python + requests/BeautifulSoup is enough)
- Paid SERP/API pipelines (use `deep-research`, `exa-search`)
- Video/transcript pipelines (use `claude-video`, `pipeline-video-agente`)

## Contents

| Topic | Reference |
|---|---|
| Layers, free stack, batching | `references/concepts.md` |
| Steps 1-2 (goal, architecture) | `references/workflow-design.md` |
| Steps 3-5 (connector, AI client, pipeline) | `references/connectors-ai.md` |
| Steps 6-8 (feedback, storage, main) | `references/feedback-storage.md` |
| Steps 9-10, patterns, limits | `references/ops-patterns.md` |

## Quality Checklist

Before marking the agent complete:

- [ ] `config.yaml` controls all user-facing settings — no hardcoded values
- [ ] `profile/context.md` holds user-specific context for AI matching
- [ ] Deduplication by URL before every storage push
- [ ] Gemini client has model fallback chain (4 models)
- [ ] Batch size ≤ 5 items per API call
- [ ] `maxOutputTokens` ≥ 2048
- [ ] `.env` is in `.gitignore`
- [ ] `.env.example` provided for onboarding
- [ ] `setup.py` creates DB schema on first run
- [ ] `enrich_existing.py` backfills AI scores on old rows
- [ ] GitHub Actions workflow commits `feedback.json` after each run
- [ ] README covers: setup in < 5 minutes, required secrets, customisation

---

## Real-World Examples

```
"Build me an agent that monitors Hacker News for AI startup funding news"
"Scrape product prices from 3 e-commerce sites and alert when they drop"
"Track new GitHub repos tagged with 'llm' or 'agents' — summarise each one"
"Collect Chief of Staff job listings from LinkedIn and Cutshort into Notion"
"Monitor a subreddit for posts mentioning my company — classify sentiment"
"Scrape new academic papers from arXiv on a topic I care about daily"
"Track sports fixture results and keep a running table in Google Sheets"
"Build a real estate listing watcher — alert on new properties under ₹1 Cr"
```

---

## Reference Implementation

A complete working agent built with this exact architecture would collect from 4+ sources,
batch Gemini calls, learn from Applied/Rejected decisions stored in Notion, and run
100% free on GitHub Actions. Follow Steps 1–9 above to build your own.

## Enriquecimento 2026-08-24 — tracker semanal de visibilidade de marca em engines de IA

Fonte `qiqw-_6TUZ0` (Grace Leung/Cowork). Receita: agente roda prompts de compra típicos ("melhor ferramenta para X") em Perplexity/ChatGPT/AI Overviews via browser, registra se/quando a marca aparece, acumula em planilha com abas por engine e coluna de tendência semana a semana. Agendar como job semanal (`routines`). É o "SEO da era answer-engine" — mesmo molde do data-scraper, alvo diferente. Claims do vídeo sobre features específicas do Cowork ainda requerem validação oficial antes de depender delas.

## Referências

- `references/concepts.md` — camadas, stack gratis, batching
- `references/workflow-design.md` — objetivo, arquitetura
- `references/connectors-ai.md` — conector, cliente IA, pipeline
- `references/feedback-storage.md` — memoria, storage, main.py
- `references/ops-patterns.md` — Actions, config.yaml, padroes, limites

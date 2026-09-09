---
name: claude-chrome-automation
description: Use when automating Chrome with Claude — autonomous navigation, ethical scraping, multi-tab research, form filling, approval gates. Triggers on "claude chrome automation", "chrome extension automation", "browser automation claude", "web scraping claude", "chrome extension claude".
metadata:
  origin: AUTORAL
  source_docs:
    - https://www.youtube.com/watch?v=Bezlzmti6_U (Luciana Papini video)
    - https://docs.anthropic.com/en/docs/claude-code/connectors
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: [hooks, commands]
---

# Claude Chrome Automation — Padrões de Automação Chrome

Navegação autônoma, scraping ético, pesquisa multi-aba, preenchimento, approval gates. Código em `scripts/`, ponte da extensão em `references/extension.md`.

## Quando usar (gatilhos concretos)

- "Automatizar navegação no Chrome"
- "Scraping ético com Claude"
- "Pesquisa multi-aba automatizada"
- "Preenchimento de formulários"
- "Approval gates para ações sensíveis"

## Quando NÃO usar

- Automação desktop (use `automacao-deterministica`)
- Automação mobile (use `mobile-automation` se existir)
- Automação apenas API (use `api-connector-builder`)

## Core Patterns (resumo — código em `scripts/`)

**1. Navegação** (`chrome_navigator.py`): extension ou CDP; `navigate(url, wait_for="networkidle")`; `multi_tab_research(queries, max_tabs=5)`.

**2. Scraping ético** (`ethical_scraper.py`): 1 req/s + robots.txt + UA identificado (`ClaudeBot/1.0`); retorna url/data/timestamp/ethical.

**3. Multi-aba** (`multi_tab_research.py`): `asyncio.gather` sobre queries (cap 5 abas).

**4. Formulários** (`form_filler.py`): mappers por tipo (email/name/address/select/checkbox/radio/file) + `fill_form(url, data)`.

**5. Approval gates** (`approval_gates.py`): blocklist (delete, payment, send_email, post_social, delete_file, admin, production_deploy); `check_approval` antes de agir.

**Extensão** (`references/extension.md`): manifest (activeTab, scripting, tabs, webNavigation, storage) + content.js (navigate/scrape/fill_form). Alternativa headless: Puppeteer.

```python
from skills.claude-chrome-automation.scripts.ethical_scraper import EthicalScraper
data = await EthicalScraper().scrape(url, {"title": "h1", "price": ".price"})
```

## Referências Oficiais

- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/)
- [Puppeteer](https://pptr.dev/) — alternativa headless

## Adapters (Por Plataforma)

```
adapters/
├── opencode/ (hooks, README)
├── cursor/ (hooks, README)
├── codex/ (hooks, README)
└── ...
```

---
name: claude-chrome-automation
description: |
  Padrões Chrome Ext: navegação autônoma, scraping, pesquisa, preenchimento, approval gates. Baseado no vídeo da Luciana Papini "Me de 34 minutos e eu te darei 10 000 horas de conhecimento do Claude".
  Use quando: "claude chrome automation", "chrome extension automation", "browser automation claude", "web scraping claude", "chrome extension claude", "browser automation claude". Non-triggers: automação desktop, automação mobile, automação API only.
  Outcome: Padrões para automação Chrome: navegação autônoma, scraping ético, pesquisa multi-aba, preenchimento, approval gates.
metadata:
  origin: AUTORAL
  source_docs:
    - https://www.youtube.com/watch?v=Bezlzmti6_U (Luciana Papini video)
    - https://docs.anthropic.com/en/docs/claude-code/connectors
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: [hooks, commands]
---

# Claude Chrome Automation — Padrões de Automação Chrome

Padrões para automação Chrome: **navegação autônoma, scraping ético, pesquisa multi-aba, preenchimento, approval gates**.

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

## Core Patterns

### 1. Navegação Autônoma

```python
# chrome_navigator.py
class ChromeNavigator:
    def __init__(self, chrome_extension=True):
        self.chrome_extension = chrome_extension
        self.tabs = {}
    
    async def navigate(self, url: str, wait_for: str = "networkidle") -> dict:
        """Navega para URL e aguarda condição."""
        if self.chrome_extension:
            return await self._ext_navigate(url, wait_for)
        else:
            return await self._cdp_navigate(url, wait_for)
    
    async def _ext_navigate(self, url, wait_for):
        # Usa Chrome Extension API
        return {"url": url, "status": "navigated"}
    
    async def multi_tab_research(self, queries: list, max_tabs: int = 5) -> list:
        """Pesquisa multi-aba paralela."""
        results = []
        for i, query in enumerate(queries[:max_tabs]):
            tab_id = await self._open_tab(f"https://google.com/search?q={query}")
            results.append({"query": query, "tab_id": tab_id})
        return results
```

### 2. Scraping Ético

```python
# ethical_scraper.py
class EthicalScraper:
    def __init__(self):
        self.rate_limit = 1.0  # 1 req/seg
        self.respect_robots = True
        self.user_agent = "ClaudeBot/1.0 (+https://anthropic.com)"
    
    async def scrape(self, url: str, selectors: dict) -> dict:
        """Scraping ético com rate limiting."""
        await self._respect_rate_limit()
        
        if self.respect_robots:
            if not self._check_robots_txt(url):
                raise Exception("Robots.txt disallows scraping")
        
        # Scraping com seletores CSS/XPath
        data = await self._scrape_with_selectors(url, selectors)
        
        return {
            "url": url,
            "data": data,
            "timestamp": datetime.now().isoformat(),
            "ethical": True
        }
    
    async def _respect_rate_limit(self):
        await asyncio.sleep(self.rate_limit)
    
    def _check_robots_txt(self, url: str) -> bool:
        # Check robots.txt
        return True  # Simplified
```

### 3. Pesquisa Multi-Aba

```python
# multi_tab_research.py
class MultiTabResearcher:
    def __init__(self, max_tabs: int = 5):
        self.max_tabs = max_tabs
        self.active_tabs = {}
    
    async def research_parallel(self, queries: list) -> list:
        """Pesquisa paralela em múltiplas abas."""
        tasks = []
        for query in queries[:self.max_tabs]:
            task = self._research_single(query)
            tasks.append(task)
        
        results = await asyncio.gather(*tasks)
        return results
    
    async def _research_single(self, query: str) -> dict:
        # Abre aba, pesquisa, extrai resultados
        pass
```

### 3. Preenchimento de Formulários

```python
# form_filler.py
class FormFiller:
    def __init__(self):
        self.field_mappers = {
            "email": self._fill_email,
            "name": self._fill_name,
            "address": self._fill_address,
            "select": self._fill_select,
            "checkbox": self._fill_checkbox,
            "radio": self._fill_radio,
            "file": self._fill_file
        }
    
    async def fill_form(self, url: str, data: dict) -> dict:
        """Preenche formulário com dados estruturados."""
        results = {}
        for field, value in data.items():
            if field in self.field_mappers:
                result = await self.field_mappers[field](value)
                results[field] = result
        return results
    
    async def _fill_email(self, value: str):
        # Preenche campo email com validação
        pass
```

### 3. Approval Gates

```python
# approval_gates.py
class ApprovalGates:
    def __init__(self, sensitive_actions: list = None):
        self.sensitive_actions = sensitive_actions or [
            "delete", "payment", "send_email", "post_social",
            "delete_file", "admin_action", "production_deploy"
        ]
    
    async def check_approval(self, action: str, context: dict) -> dict:
        """Verifica se ação precisa de aprovação."""
        if action in self.sensitive_actions:
            return {
                "approved": False,
                "requires_approval": True,
                "message": f"Ação '{action}' requer aprovação manual",
                "context": context
            }
        return {"approved": True}
    
    async def request_approval(self, action: str, context: dict) -> bool:
        """Solicita aprovação ao usuário."""
        # Integração com hook de aprovação
        pass
```

---

## Integração com Chrome Extension

```javascript
// chrome-extension/manifest.json
{
  "name": "Claude Automation",
  "permissions": [
    "activeTab",
    "scripting",
    "tabs",
    "webNavigation",
    "storage"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"]
  }]
}
```

```javascript
// content.js - Content script para comunicação
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case "navigate":
      window.location.href = request.url;
      sendResponse({success: true});
      break;
    case "scrape":
      const data = scrapePage(request.selectors);
      sendResponse({data});
      break;
    case "fill_form":
      fillForm(request.data);
      sendResponse({success: true});
      break;
  }
});
```

---

## Referências Oficiais

- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/)
- [Puppeteer](https://pptr.dev/) - Alternative for headless

---

## Adapters (Por Plataforma)

```
adapters/
├── opencode/
│   ├── hooks/
│   └── README.md
├── cursor/
│   ├── hooks/
│   └── README.md
├── codex/
│   ├── hooks/
│   └── README.md
└── ...
```
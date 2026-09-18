---
name: defuddle-leitura-limpa
description: Sanitize a web page to relevant content only before giving it to the agent (remove chrome/navigation/ads/scripts) to save context. Use when the user says "limpar página", "sanitizar HTML", "só o conteúdo", "página muito grande", "estourou contexto com web", or in EN "sanitize page", "clean HTML", "remove boilerplate", "defuddle page", "strip chrome/ads", "reduce page context".
---

# Defuddle — Leitura Limpa

Antes de entregar uma página web ao agente, reduza-a ao conteúdo
relevante: remove chrome, navegação, anúncios e scripts, preservando o
principal + metadados. Conceito da skill Defuddle (Maestros da IA, vídeo V1nMBWzXsCI).

## Quando usar / When to use

- "Pega o conteúdo dessa URL" e a página é grande / cheia de menus e ads.
- O agente estourou contexto lendo HTML cru.
- Pipeline de scraping/RAG antes de indexar ou resumir.
- Qualquer fetch web cujo HTML bruto > ~30 KB de texto útil estimado.

## Passos

1. **Extrair o bruto** — obtenha HTML ou texto da página (fetch, headless ou
   texto já coletado). Guarde URL original, título da aba/documento e data
   de coleta. Não resuma ainda.
2. **Remover boilerplate** — descarte, nesta ordem:
   - `<script>`, `<style>`, `<noscript>`, iframes de ads/trackers, SVGs decorativos;
   - `header`, `footer`, `nav`, sidebar, menus, breadcrumbs, paginação;
   - banners de cookie/LGPD, popups, paywall teasers, "assine", social share;
   - comentários, related-posts, "leia também", footers de SEO.
   - Regra: na dúvida entre menu e artigo, mantenha o artigo.
3. **Preservar conteúdo principal + metadados** — o output deve conter:
   - `título`, `URL`, `data de publicação` (se houver), `autor` (se houver);
   - corpo principal em ordem de leitura (h1–h3, parágrafos, listas, tabelas);
   - alt-text de imagens informativas; links relevantes como `[texto](url)`.
   - Se a página tiver múltiplos artigos (home, categoria), extraia só o
     solicitado ou liste títulos + links — nunca concatene tudo.
4. **Medir a redução** — reporte sempre:
   - `chars antes → chars depois (% redução)`;
   - estimativa de tokens (~chars/4) antes/depois;
   - o que foi removido (ex.: "nav+footer+3 ads+2 scripts").
   - Se redução < 20%, declare: página já era limpa ou extrator falhou.

## Regras

- NUNCA invente conteúdo para preencher buracos do boilerplate removido.
- NUNCA descarte tabelas, números, datas ou citações do corpo principal.
- NUNCA envie HTML cru ao modelo se a versão limpa já existe.
- Se o conteúdo principal não for identificável (JS-only, CAPTCHA, login),
  declare o bloqueio em vez de retornar chrome residual.
- Uma página = um documento limpo. Não misture páginas sem separar por URL.

## Output format

```text
Fonte: <título> — <URL> (<data>)
Redução: <antes> → <depois> chars (~<tokens antes> → ~<tokens depois> tokens, -X%)
Removido: [nav, footer, ads, scripts, ...]

<conteúdo principal em markdown>
```

## Related skills

- `exa-search` — buscar antes de limpar; limpe só o que vale ler.
- `data-scraper-agent` — pipeline de coleta em escala; defuddle é a etapa de limpeza.
- `context-budget` — quando a redução não basta e é preciso orçar contexto.

---
name: multi-source-researcher
description: Para cada link do inbox semanal, pesquisa contexto complementar em 4 fontes (Twitter/X, YouTube, Newsletters Gmail, Web search) e gera relatório estruturado em markdown. Trigger: "pesquisa multi-fonte", "pesquisa twitter youtube newsletter", "enriquece links semana".
metadata:
  origin: ECC
  depends_on:
    - whatsapp-link-collector
    - pesquisa-social
    - x-api
    - google-workspace-ops
---

# Skill: Multi-Source Researcher

Enriquece cada link do `inbox/links-semana-NN.json` com pesquisa em 4 fontes e gera `research/pesquisa-bruta-NN.md`.

## Quando usar

- "pesquisa as fontes dos links dessa semana"
- "enriquece o inbox com twitter, youtube, newsletters"
- Roda após `whatsapp-link-collector` (quinta à noite / sexta de manhã)

## Fontes

| Fonte | Skill/Tool | Query |
|---|---|---|
| **Twitter/X** | `x-api` / `pesquisa-social` | Autor do link + palavras-chave do título |
| **YouTube** | `google-workspace-ops` (YouTube Data API) | Busca vídeos recentes sobre o tema |
| **Newsletters** | `google-workspace-ops` (Gmail) | Tag `newsletter/ia` + busca por termos do link |
| **Web Search** | `pesquisa-social` / `exa-search` | Busca ampla + deep research se necessário |

## Entrada

`inbox/links-semana-2026-W38.json`

## Saída

`research/pesquisa-bruta-2026-W38.md`

```markdown
# Pesquisa Bruta — Semana 2026-W38

## Item 1: https://exemplo.com/artigo-sobre-ia
**URL original**: https://exemplo.com/artigo-sobre-ia
**Coletado em**: 2026-09-15T14:22:00Z

### Twitter/X (3 tweets relevantes)
- @usuario1: "Thread sobre X..." [link](https://x.com/...)
- @usuario2: "Comentário Y..." [link](https://x.com/...)

### YouTube (2 vídeos)
- "Título do vídeo" — Canal Z (2026-09-10) [link](https://youtu.be/...)
- ...

### Newsletters (Gmail tag: newsletter/ia)
- "Assunto do email" — Remetente (2026-09-14) — Trecho: "..."

### Web Search (Exa/Deep Research)
- Resumo: "Principais pontos..."
- Fontes: [1](url), [2](url)
```

## Variáveis de ambiente

| Variável | Obrigatório | Exemplo |
|---|---|---|
| `INBOX_DIR` | não | `./inbox` |
| `RESEARCH_DIR` | não | `./research` |
| `X_API_KEY` / `X_BEARER` | sim (Twitter) | — |
| `GMAIL_CREDENTIALS` / `GOOGLE_APPLICATION_CREDENTIALS` | sim (Gmail/YouTube) | — |
| `EXA_API_KEY` | não (fallback) | — |

## Lógica de fallback

1. Se Twitter API rate-limited → usa `pesquisa-social` (busca social genérica)
2. Se YouTube API falha → busca web por `site:youtube.com "tema"`
3. Se Gmail falha → pula newsletters, avisa no log
4. Sempre garante mínimo 2 fontes por item

## Gate de aceite

- Arquivo `.md` gerado com estrutura acima
- Cada item do inbox tem seção correspondente
- Pelo menos 2 fontes preenchidas por item
- Zero alucinação: citações com URLs reais
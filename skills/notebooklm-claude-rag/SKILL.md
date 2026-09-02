---
name: notebooklm-claude-rag
description: "Use NotebookLM 2.0 as RAG infra-free with Claude Code — chat to PPTX/XLSX/PDF, cloud sandbox, gap-agent, batch ingest. Triggers on \"NotebookLM\", \"NotebookLM 2.0\", \"claude rag\", \"gap agent\", \"batch ingest\""
---

# NotebookLM Claude RAG — Infra-Free

> Fonte: `Maestros da IA — YtrlYm10RRA` (NotebookLM 2.0, 451 linhas), transcript `YtrlYm10RRA.pt.dedup.txt:40-380`

NotebookLM vira biblioteca agêntica; Claude Code vira executor. Sem indexar/fatiar manual.

## Quando usar

- Biblioteca ancorada em fontes com artefatos editáveis (PPTX/XLSX/PDF)
- Precisa gap-agent que audita o que falta e importa com aprovação
- Quer batch ingest 50 arquivos ou council multi-notebook

## Workflows (5)

1. **Batch ingest** — pasta → NotebookLM (50 arquivos, workaround Ultra)
2. **Private-data analysis** — CSV Ads → framework → XLSX estratégico
3. **Council** — pergunte a Hormozi/Russell/Cialdini em paral. → tabela comparativa
4. **Gap-closer** — `o que falta?` → busca web → relatório → `importar?`
5. **Response→Product** — query → PPTX/XLSX/web (10% chat, 90% infra)

## Infra 2.0

- Chat → artefato editável (ex: 6 princípios Cialdini)
- Cloud sandbox por notebook (code execution)
- Gap-agent + approved import (RAG-grounded)

## Checklist

- [ ] Notebook com fontes + chat artefato
- [ ] Gap-agent validado
- [ ] Claude Code batch ingest ok

## Referências

- `references/rag-patterns.md` — NotebookLM como vector store

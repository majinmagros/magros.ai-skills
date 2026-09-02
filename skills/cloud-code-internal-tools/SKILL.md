---
name: cloud-code-internal-tools
description: Use when building internal tools from spreadsheets — sheet to app, automated reports, dashboards, internal APIs. Triggers on "internal tools", "planilha para app", "ferramenta interna", "dashboard interno", "relatorio automatizado".
---

# Cloud Code Internal Tools — Planilha → App

> Fonte: `Luciana Papini — Internal Tools` (pending).

Converte planilha/processo manual em ferramenta interna sem reinventar harness.

## Quando usar

- Planilha crítica que virou gargalo
- Relatórios manuais repetitivos
- Dashboard interno com dados sensíveis

## Workflow

1. Mapeie planilha → schema + regras
2. Gere app (CRUD + auth + import CSV) via `orch-build-mvp`
3. Valide com dono do processo; itere
4. Deploy restrito (VPS/Cloud Code) + audit log

## Checklist

- [ ] Schema validado
- [ ] Import/export CSV
- [ ] Permissão por papel

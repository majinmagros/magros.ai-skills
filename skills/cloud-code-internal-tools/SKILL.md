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

## Enriquecimento 2026-09-06 — Excel→dashboard em <15min (Karine Lago `CqvRVemfsBA`)

Caso real: planilha Excel → dashboard web com Cloud Code em <15min (vs 1 dia–1 semana em Power BI/Tableau), publicado no próprio domínio com login/senha, sem licença BI por usuário — mesmo processo vale p/ site institucional, landing e sistema interno pequeno.

- **Validação numérica obrigatória**: confira totais no Excel (tabela dinâmica) antes de aceitar — "IA é copiloto; se mostrar valor errado, a culpa é sua".
- **Auth**: peça camada login/senha + painel admin de usuários junto na primeira geração.
- **Versionamento**: conector GitHub → repo privado; cada iteração commitada permite rollback.
- **Limites de governança**: IA tem limite de linhas lidas (arquivo de 1GB não passa); empresas listadas/alta governança exigem estrutura completa de análise + auditoria — este fluxo é p/ projetos que precisam de flexibilidade e iteração rápida. Dados sensíveis → versões enterprise (sem treino com seus dados).
- **Stack gerada**: PHP + migrations + README; deploy via conector de hospedagem (ex: Hostinger) + domínio.

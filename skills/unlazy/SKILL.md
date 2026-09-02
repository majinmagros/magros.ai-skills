---
name: unlazy
description: Enforces completion discipline with Depth Tree + runnable gates ledger. Use when agent returns half-done, 80% report, or UI incomplete — triggers on "unlazy", "lazy ai", "preguicosa", "depth tree", "gates", "do not stop until done".
---

# Unlazy — Anti-Preguiça com Gates Executáveis

> Baseado em `Leonxlnx/unlazy` (MIT) apresentado em `Maestros da IA — 8fAuXr8fQBo` (2026-08-31). Fonte oficial: https://github.com/Leonxlnx/unlazy

Toda tarefa substancial vira um **ledger de gates** antes de começar. Done é o ledger, não a sensação.

## Quando usar

- IA entregou tecnicamente mas incompleto (80%, sem interação, placeholder)
- Relatório/tabela/app com funcionalidade faltando, precisa provar completo
- Build/audit/refactor com 3+ layers ou pipelines paralelos
- Explícito: `unlazy`, `tree N`, `gates`, `do not stop until done`

## Quando NÃO usar

- Edição trivial, resposta factual curta → use direto
- Precisa de gate visual (qualidade estética) → use `capricho` (evolução desta)
- Validação de ideia de negócio → use `triagem-ideias` / `validacao-ideia-24h`

## Conceito central

- **Depth Tree**: task → split recursivo N layers; leaves são único lugar de trabalho real. `tree 2-3` = feature solo, `4-5` = subsistema, `6-7` = projeto inteiro orquestrado.
- **Gates ledger** `.unlazy/<scope>/GATES.md` (solo) ou `.unlazy/<scope>/gates/leaf-*.md` (orquestrado): cada gate = checkbox + outcome observável + `CHECK:` (comando) + `EXPECT:` (substring ou /regex/) + `EVIDENCE:` (prova). `[x]` com `pending` = UNMET.
- **ABANDON honesto**: `ABANDON: <id> <reason>` → sai com `HANDOFF REQUIRED` (exit 1), nunca silent narrowing.

## Modos

| Modo | Tree | Como roda | Ledger |
|------|------|-----------|--------|
| **Solo** | 1-3 | uma sessão, sequencial | `GATES.md` único |
| **Orquestrado** | 4+ | leaves em subagentes paralelos, parent reverifica | `PLAN.md` + `gates/leaf-*.md` + `dispatch.json` |

## Workflow (solo resumido)

1. **Escreva gates antes do código** — 1 outcome observável por gate, com CHECK/EXPECT. Lint: `node <skill>/scripts/gate-lint.mjs GATES.md` (veja `references/gates.md`).
2. **Aprove explicitamente** — parse sem executar: `node <skill>/scripts/gate-check.mjs --status GATES.md` → leia cada CHECK/EXPECT/CWD/shell/PATH → ` --approve GATES.md`.
3. **Trabalhe cada leaf em 4 passes**: implemente completo → releia como expert → caçe bugs (corretude, integração, portabilidade, performance) → polish até passar limpo.
4. **Rode checker**: `node <skill>/scripts/gate-check.mjs GATES.md` — só marca `[x]` se exit 0 + EXPECT match; registra shell, CWD, exit, fingerprint.
5. **Re-verify antes de reportar**: rode de novo; se algum gate UNMET ou ABANDON, não reporte done. Reporte ledger completo com counts.

Orquestrado: veja `references/orchestration.md` — dispatch waves, lease, parent `--reverify`, Stop hook opcional.

## Gates que falham honestamente

- Use token de sucesso decisivo, exija exit 0 + EXPECT.
- Teste negativo contra controle positivo antes de confiar em ausência.
- Prefira scripts Node portáveis; não assuma `grep` no Windows.
- Ledger malformado, zero gates, id duplicado = erro, não done.

## Instalação (oficial)

```bash
npx skills add Leonxlnx/unlazy          # oficial MIT
# ou clone manual:
git clone --depth 1 https://github.com/Leonxlnx/unlazy ~/.claude/skills/unlazy
```

Esta skill ECC é um wrapper adaptado; scripts oficiais ficam em `<skill>/scripts/` quando instalada. Sem eles, use o ledger manualmente.

## Referências

- `references/gates.md` — formato completo do ledger
- `references/orchestration.md` — dispatch, waves, leases
- `references/method.md` — Depth Tree em detalhe
- Vídeo origem: https://www.youtube.com/watch?v=8fAuXr8fQBo (transcript local `8fAuXr8fQBo.pt.dedup.txt:19-687` em `YT_DIR`)

## Checklist

- [ ] Gates escritos e aprovados antes do código
- [ ] Checker exit 0, todas EVIDENCE não-pending
- [ ] Nenhum ABANDON silencioso
- [ ] Report com ledger + counts

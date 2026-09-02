---
name: capricho
description: Evolucao do unlazy com gates de qualidade visual + relatorio obrigatorio. Use when precisa de entrega caprichada: site/app com acabamento visual, Kanban drag-and-drop, boids/cardume. Triggers on "capricho", "caprichado", "acabamento visual", "entrega premium", "unlazy melhorado".
---

# Capricho — Unlazy com Acabamento Visual e Relatório

> Evolução criada por `Maestros da IA` sobre `Leonxlnx/unlazy` (vídeo `8fAuXr8fQBo` l.61-589, transcript local `8fAuXr8fQBo.pt.dedup.txt` em `YT_DIR`). `unlazy` = base open-source MIT; `capricho` = exclusiva comunidade, aqui reimplementada como extensão ECC open.

`Capricho = Unlazy + 2 gates extras` — o pipeline é o mesmo, mas vence onde `unlazy` falha: **qualidade visual** e **histórico reportável**.

## Quando usar

- Mesmos gatilhos de `unlazy` + precisa de nota visual (landing, dashboard, Three.js, cardume)
- Unlazy entregou funcional mas com "cara de AI slop" (vídeo l.221-242, l.565-581)
- Precisa de relatório que o agente e o humano consigam auditar depois (l.583-589)

## Quando NÃO usar

- Tarefa não-visual pura (ex: migração DB) → use `unlazy` puro (mais leve)
- Ideação/validação → use `triagem-ideias`

## O que muda vs Unlazy

| Dimensão | Unlazy | Capricho (esta) |
|----------|--------|-----------------|
| Gates funcionais | ✅ CHECK/EXPECT/EVIDENCE | ✅ idem |
| **Gate visual** | ❌ não avalia estética | ✅ gate manual com checklist visual + screenshot/preview obrigatório |
| **Gate de relatório** | opcional | ✅ obrigatório: `.capricho/RELATORIO.md` com gates, prints, custo, tempo |
| Pipeline | 4 passes (implement, re-read, hunt, polish) | **5 passes**: os 4 + `visual polish` (design system, micro-interações, densidade, tipografia) |
| Custo | ~$69 (video l.599-601) | ~$71 mas **mais rápido** (paralelismo melhor, video l.617-624) |

## Workflow

1. **Herde tudo de `unlazy`**: escreva gates funcionais (GATES.md, CHECK/EXPECT).
2. **Adicione 2 gates obrigatórios**:
   - `V1: Qualidade visual aprovada` — `EVIDENCE: screenshot <path> + checklist (tipografia, espaçamento, contraste, micro-interação)` — manual, mas bloqueia done.
   - `R1: Relatório gerado` — `CHECK: test -f .capricho/RELATORIO.md && grep -q "Gates:" .capricho/RELATORIO.md` / `EXPECT: Gates:`
3. **5 passes por leaf**: execute os 4 de unlazy + `visual polish` — aplique `frontend-patterns`, `taste`, `motion-patterns` conforme domínio.
4. **Gere relatório** (template em `references/relatorio-template.md`):
   ```md
   # Relatório Capricho — <task>
   Gates: N/N, Abandonados: 0
   Custo: $X, Tempo: Y min (wall-clock Z)
   Gates visuais: V1 [x] evidência <screenshot>
   Ledger: <cole GATES.md completo>
   ```
5. **Valide**: `gate-check.mjs` deve marcar V1 e R1 como met; sem eles, done bloqueia mesmo com gates funcionais OK.

## Checklist visual (gate V1)

- [ ] Densidade e hierarquia tipográfica ok (não wall of text)
- [ ] Espaçamento, bordas, sombras coerentes (evita AI slop)
- [ ] Interação chave funciona (ex: kanban drag-and-drop l.187-195, l.205-210)
- [ ] Screenshot anexado em `EVIDENCE`

## Solo vs Orquestrado

Mesma regra de `unlazy`: `tree ≤3` solo, `≥4` orquestrado com `dispatch.json` e parent `--reverify`. Capricho herda Stop hook.

## Referências

- `references/relatorio-template.md` — template do relatório
- `references/visual-gate.md` — checklist visual detalhado
- Base: `skills/unlazy/SKILL.md` + https://github.com/Leonxlnx/unlazy
- Vídeo: https://www.youtube.com/watch?v=8fAuXr8fQBo (l.557-650 para diff unlazy→capricho)

## Checklist de entrega

- [ ] Gates funcionais + V1 + R1 todos [x] com EVIDENCE
- [ ] Relatório em `.capricho/RELATORIO.md`
- [ ] Screenshots incluídos
- [ ] Custo/tempo registrado

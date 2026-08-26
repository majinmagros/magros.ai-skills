---
name: zed-deltadb-versioning
description: Use when implementing Zed Delta / DeltaDB versioning — Git alternative that records every operation with stable identity linked to conversation, not just commit snapshots. Triggers on "DeltaDB", "Zed Delta", "versionamento por operacao", "git alternative", "operation-based versioning".
metadata:
  origin: ECC
---

# Zed DeltaDB Versioning

Based on **Zed Delta** (video `otIhfQaex80` 2026-08-21, ai-code-king): standalone app separate from Zed editor built on **DeltaDB** — version control layer that records every operation between commits, gives each stable identity, and links every change to the conversation that produced it.

> Fonte: `otIhfQaex80.en.dedup.txt` (ai-code-king/RELATORIO.md 2026-08-26) — validado contra `zed.dev/delta` docs.

## Quando usar

- Agente que conversa em threads e você precisa rastrear *cada* edição entre commits (não só snapshot)
- Auditoria conversa→código: saber qual prompt gerou qual hunk
- Alternativa a Git para harnesses agenticos onde `git log` perde granularidade

## Quando NÃO usar

- Repo tradicional com review por PR (Git branchenough)
- Não precisa de link conversa→operação (use `git-workflow`)
- Time não usa Zed (Delta é standalone mas ótimo com Zed editor)

## Conceito central (Git vs DeltaDB)

```
Git:       snapshot --commit--> snapshot --commit--> snapshot  (perde granularidade)
DeltaDB:   op1(id:abc) → op2(id:def) → op3(id:ghi) ... cada op com id estável + conversa_id
           ↑ pode fazer checkout/replay de qualquer operação, não só commit
```

- **Stable identity**: cada operação tem id imutável (não rebase que muda hash)
- **Conversa-link**: toda op aponta para thread_id que a gerou (auditoria LLM)

## Uso

### Instalação

```bash
# Delta é app standalone (não plugin Zed)
curl -fsSL https://zed.dev/install-delta.sh | sh
delta --version
delta init  # inicia DeltaDB no repo (pode coexistir com .git)
```

### Dia a dia

```bash
delta thread --new "refactor auth"  # cria thread conversacional
delta edit src/auth.ts              # cada save = operação com id
delta log --thread  # mostra ops ligadas à conversa
delta replay abc123  # volta para operação específica sem perder histórico
delta diff --conversation # diff filtrado por conversa
```

### Com agente/harness

```js
import { DeltaDB } from 'zed-deltadb-versioning';
await DeltaDB.startThread({ topic: 'migrate to JWT', model: 'sonnet' });
await DeltaDB.record({ op: 'edit', file: 'src/auth.ts', conversationId });
```

## Relação com skills existentes

- `git-workflow` → snapshots + branches; **DeltaDB é por-operação**
- `terminal-ops` / `agent-harness-construction` → use DeltaDB como layer sob o harness
- `codebase-onboarding` → mapear repo com histórico DeltaDB mais rico

## Validação

- Docs: https://zed.dev/docs/delta (ou `zed.dev/delta`) — confirmar `DeltaDB`, comando `delta`
- App: Zed Delta (não confundir com Zed editor)
- Preço: checar tier Zed (free/paid)

## Erros comuns

- **Tratar Delta como Git** → não use `git rebase` mental model; use `replay`
- **Não linkar conversa** → sempre crie thread antes de editar, senão perde auditoria
- **Duplicar .git e DeltaDB sem sync** → escolha um como fonte de verdade por repo

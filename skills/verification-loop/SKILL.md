---
name: verification-loop
description: "Use when a comprehensive verification system for Claude Code sessions. Triggers on \"verification-loop\", \"verification loop\", \"loop\", \"verify skill\", \"runtime verification\", \"layout shift\", \"screenshot proof\", \"prove the change\". Covers build/type/lint/tests PLUS runtime checks in the running app with measurable pass criteria."
license: MIT
metadata:
  origin: ECC
---

# Verification Loop Skill

A comprehensive verification system for Claude Code sessions.

## When to Use

Invoke this skill:
- After completing a feature or significant code change
- Before creating a PR
- When you want to ensure quality gates pass
- After refactoring

## Verification Phases

### Phase 1: Build Verification
```bash
# Check if project builds
npm run build 2>&1 | tail -20
# OR
pnpm build 2>&1 | tail -20
```

If build fails, STOP and fix before continuing.

### Phase 2: Type Check
```bash
set -o pipefail
# TypeScript projects
npx --no-install tsc --noEmit 2>&1 | head -30

# Python projects
pyright . 2>&1 | head -30
```

Report all type errors. Fix critical ones before continuing.

### Phase 3: Lint Check
```bash
# JavaScript/TypeScript
npm run lint 2>&1 | head -30

# Python
ruff check . 2>&1 | head -30
```

### Phase 4: Test Suite
```bash
# Run tests with coverage
npm run test -- --coverage 2>&1 | tail -50

# Check coverage threshold
# Target: 80% minimum
```

Report:
- Total tests: X
- Passed: X

### Phase 5: Runtime Verification — prove the change in the app (leva YouTube 2026-10-03)

Fonte: Claude `@claude/mQZB0l-rhxE` ("Building verification loops in Claude Code", 2026-09-27). Princípio: build/type/lint/test verde **não prova** que a mudança faz o que você quis — a checagem manual que você faz depois (abrir a página, clicar, ver o console / chamar o endpoint / tocar nas telas) é o sinal real. Codifique esses passos para o Claude rodá-los sozinho (browser, terminal, iOS simulator). Falhou → fixa → roda de novo.

- Declare na skill **quando** ela roda (ex.: toda mudança de UI), **o que fazer quando falha** e **o que prova cada check**. Quanto mais mensurável, melhor (o Claude decide pass/fail sem você).
- Exemplos mensuráveis: layout shift via Chrome DevTools MCP (Core Web Vitals), performance budget, accessibility checklist, regras do design system.
- Entregue prova: screenshot + scores junto com a mudança (ex.: botão Like funcionando + página sem jump no load).
- Regra de bolso: toda vez que você se pegar checando algo à mão e dizendo ao Claude o que corrigir, pergunte "contra o que mensurável ele poderia checar sozinho?" — e codifique.

### Phase 6: Save working checks as a skill

A primeira vez que o loop funcionar, salve os passos que funcionaram como verify skill no projeto (o Claude Code já gera uma inicial). Trate a gerada como ponto de partida e estenda o que ela checa. Scripts executam — não entram no contexto.

### Non-goals (não duplique)

- App deployed comportando-se p/ usuário real, screenshot de falha, patch + rerun → `closed-loop-verifier-pattern` (+ `testsprite-cli-integration`).
- QA visual com checklist de designer → `browser-qa`.
- Loop genérico (goal decidível, anti-spin) → `loop-design-check`.
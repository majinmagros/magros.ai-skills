---
name: testsprite-cli-integration
description: Use when integrating TestSprite CLI as runtime verifier for closed-loop agents — deployed app vs mocks, screenshot failure detection, patch + rerun. Triggers on "testsprite", "closed loop verifier", "deployed app verification", "screenshot driven testing", "not mocks".
metadata:
  origin: ECC
  source_docs:
    - https://github.com/testsprite/testsprite-cli
    - https://www.npmjs.com/package/@testsprite/testsprite-cli
  video_source: "EIiXhCaZ4rw - I Mathematically CALCULATED the worth of Codex & Claude Code PLANS (AI Code King)"
  related_skills:
    - loop-design-check
    - verification-loop
    - gan-style-harness
    - agent-guardrails
    - outcome-rubric-verification
---

# Skill: testsprite-cli-integration — Runtime Verifier para Closed Loops

Integração do **TestSprite CLI** (open source, Apache 2.0) como **verifier de runtime**: o agent chama mid-build, TestSprite drive o **app deployed como usuário real** (não mocks), captura screenshot de falha, patch + rerun. Código em `references/implementation.md`.

> **"A green run on the agent's own machine proves nothing. The one signal that actually closes the loop: the deployed thing behaving for a real user."** — AI Code King

## Quando usar

- Você tem **agent loops** que precisam de verificação real (não mocks)
- Quer **closed-loop verification**: deployed app behaving = único sinal que fecha loop
- Precisa de **screenshot-driven debugging**: ver exatamente o que usuário vê
- Quer **auto-patch + rerun** quando verifier detecta falha
- Está construindo **gan-harness** com `--eval-mode testsprite`
- Precisa provar que **checkout flow, forms, navigation** funcionam de verdade

## Quando NÃO usar

- Testes unitários/integração tradicionais → use pytest/Jest/Vitest
- Visual regression only → use Playwright/Percy/Chromatic
- Load/performance testing → use k6/Locust
- Mock-based testing é suficiente → use testing library padrão

---

## Validação Oficial (2026-09-09)

| Claim | Status | Fonte |
|---|---|---|
| CLI: `npm install -g @testsprite/testsprite-cli` | ✅ | npm registry |
| `testsprite setup` + `testsprite auth status` | ✅ | docs testsprite |
| Drive live app como usuário real, screenshot de falha | ✅ | Video + docs |
| Open source Apache 2.0; Node 20.19+/22.13+/24+ | ✅ | GitHub + docs |

---

## Instalação e Setup

```bash
node --version  # >= 20.19 || >= 22.13 || >= 24
npm install -g @testsprite/testsprite-cli
testsprite setup   # cola a API key do dashboard (mostra uma vez só)
testsprite auth status  # → Connected: true
```

---

## O Padrão: Mid-Build Verification

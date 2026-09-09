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

```
agent gera código → deploy real → TestSprite drive o app → PASS? ship : screenshot + patch → rerun
```

`TestSpriteVerifier.verify(deployment_url)` roda `testsprite run <script>` contra a URL deployed e extrai o screenshot da falha. `ClosedLoopAgent.run_task()` orquestra generate → deploy → verify → patch (prompt com screenshot + erro: dead button? form? router? race?) até passar ou esgotar retries. Ver código completo em `references/implementation.md`.

```bash
# Como eval-mode no gan-harness:
/gan-build "build checkout flow" --eval-mode testsprite \
  --eval-config testsprite.config.json --max-iterations 5 --pass-threshold 1.0
```

---

## Anti-Patterns

| ❌ Errado | ✅ Correto |
|---|---|
| Unit tests com mocks | **Drive live deployed app** |
| "Green on my machine" | **Screenshot do que usuário vê** |
| Agent auto-avalia | **Verifier independente (TestSprite)** |
| Falha silenciosa | **Screenshot + error → patch** |
| Retry sem feedback visual | **Patch baseado no que usuário vê** |

---

## Custo e Troubleshooting

| Item | Nota |
|---|---|
| CLI | Free (Apache 2.0); Cloud (parallel/reporting) pago |
| Tempo | ~2-5 min por verificação; storage de screenshots mínimo |
| `command not found` | `npm install -g` + restart shell |
| `Authentication failed` | `testsprite setup` → nova key |
| Flaky tests | Em deployed real, flakiness = bug real |

---

## Integração com Skills Existentes

| Skill | Como Complementa |
|---|---|
| `loop-design-check` | TestSprite = **feedback gate** (judgment layer) runtime |
| `verification-loop` | Verification-loop = design-time; TestSprite = runtime |
| `gan-style-harness` | `--eval-mode testsprite` para app deployed |
| `agent-guardrails` | Guardrail de **runtime behavior** |
| `outcome-rubric-verification` | Outcome = rubric; TestSprite = behavioral verification |

---

## Referências

- [TestSprite CLI GitHub](https://github.com/testsprite/testsprite-cli) · [npm](https://www.npmjs.com/package/@testsprite/testsprite-cli) · [Dashboard](https://dashboard.testsprite.com)
- `references/implementation.md` — wrapper, closed loop, GAN config, test specs
- Video: `EIiXhCaZ4rw.en.dedup.txt` — linhas 60-93

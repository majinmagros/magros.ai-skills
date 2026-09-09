---
name: closed-loop-verifier-pattern
description: Use when implementing closed-loop agent verification — deployed app behaving is the ONLY signal that closes the loop; runtime verifiers drive live app; mocks prove nothing. Triggers on "closed loop verifier", "deployed app verification", "runtime verification", "not mocks", "screenshot driven testing".
metadata:
  origin: ECC
  source_docs:
    - https://github.com/testsprite/testsprite-cli
    - https://playwright.dev
    - https://pptr.dev
  video_source: "EIiXhCaZ4rw - I Mathematically CALCULATED the worth of Codex & Claude Code PLANS (AI Code King)"
  related_skills:
    - testsprite-cli-integration
    - loop-design-check
    - verification-loop
    - gan-style-harness
    - agent-guardrails
    - outcome-rubric-verification
---

# Skill: closed-loop-verifier-pattern — O Único Sinal que Fecha o Loop

> **"A green run on the agent's own machine proves nothing. The one signal that actually closes the loop: the deployed thing behaving for a real user."** — AI Code King

Runtime verifiers (TestSprite, Playwright, Puppeteer) drive o **app deployed como usuário real**, capturam screenshot de falha, permitem patch + rerun. Implementação em `references/implementation.md`.

## Quando usar

- Você tem **agent loops** que precisam de verificação real (não mocks)
- Quer provar que **checkout flow, forms, navigation, auth** funcionam de verdade
- Precisa de **screenshot-driven debugging**: ver exatamente o que usuário vê
- Quer **auto-patch + rerun** quando verifier detecta falha
- Está construindo **gan-harness** com verificação de runtime
- Precisa eliminar "green on mocks, broken in prod"

## Quando NÃO usar

- Testes unitários/integração tradicionais → use pytest/Jest/Vitest
- Visual regression only → use Playwright/Percy/Chromatic
- Load/performance testing → use k6/Locust
- Mock-based testing é suficiente → use testing library padrão
- Verificação design-time → use `verification-loop`, `loop-design-check`

---

## Conceito Central

```
TRADICIONAL (quebrado):  Generate → Test (mocks) → Pass (green) → Deploy 💥
CLOSED-LOOP (correto):   Generate → Deploy (real) → Verify (real) → PASS (real)
                                                          ↓ FAIL
                                              screenshot + patch → rerun
```

`ClosedLoopAgent.run()`: generate (informado por falhas anteriores) → deploy real → verifier drive o app → PASS? ship : captura falha para a próxima iteração. Ver `references/implementation.md` (`RuntimeVerifier` ABC, `ClosedLoopAgent`, `TestSpriteVerifier`, `PlaywrightVerifier`, specs prontas de checkout/auth/form, config GAN).

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
| Agent auto-avalia | **Verifier independente (runtime)** |
| Falha silenciosa | **Screenshot + error → patch** |
| Retry sem feedback visual | **Patch baseado no que usuário vê** |
| Deploy sem verificação | **Verify IS the deployment gate** |

---

## Integração com Skills Existentes

| Skill | Como Complementa |
|---|---|
| `testsprite-cli-integration` | Implementação concreta do verifier |
| `loop-design-check` | Closed-loop = **feedback gate** (judgment layer) |
| `verification-loop` | Verification-loop = design-time; closed-loop = runtime |
| `gan-style-harness` | `--eval-mode testsprite` para closed-loop |
| `agent-guardrails` | Guardrail de **runtime behavior** |
| `outcome-rubric-verification` | Outcome = rubric; closed-loop = behavioral verification |

---

## Referências

- `references/implementation.md` — ABC, agent, verifiers, specs, config GAN
- Video: `EIiXhCaZ4rw.en.dedup.txt` — linhas 60-93
- [TestSprite](https://github.com/testsprite/testsprite-cli) · [Playwright](https://playwright.dev)

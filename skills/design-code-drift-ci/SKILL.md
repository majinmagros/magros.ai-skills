---
name: design-code-drift-ci
description: Detect design-to-code drift in CI on every PR with headless engine and drift report. Use when design/ diverges from code, PR changes UI vs prod, need to break build on visual drift. TRIGGER when: design drift, drift report, headless design CI, PR vs main UI diff, AI review visual change. Gatilhos PT: drift design código, CI de drift visual, relatório de drift, quebrar build por divergência visual.
---

# Design Code Drift CI

## Quando usar

- Cada PR pode mudar UI sem atualizar `design/`.
- Precisa detectar divergência design ↔ código antes do merge.
- Quer AI review do que mudou visualmente vs. prod, não só diff de código.
- Distinto de `sast-gate-pr` (segurança/código) e `funil-cro-watch` (runtime/conversão). Este é drift ESTÁTICO design↔código em CI.

## Passos

1. **Defina o oráculo.** Fontes de verdade: `design/` + `design-system.md` (tokens, componentes, regras). Sem oráculo, sem CI de drift.
2. **Rode o motor headless em toda PR.** Na PR contra `main`: renderize rotas afetadas headless e compare com o oráculo. Escopo mínimo: arquivos tocados + dependentes de `lib`.
3. **Gere relatório de drift padronizado.** Formato fixo: `tela/rota | componente | esperado (design) | obtido (código) | severidade | evidência (screenshot/diff)`. Sem evidência visual, o achado é inválido.
4. **Acople AI review do delta vs. prod.** Para cada drift: o que mudou, por que importa, se viola `design-system.md`, e sugestão (atualizar código OU atualizar design). Review de código sem esse anexo é incompleto para PR visual.
5. **Decida gate vs. warn.** Drift crítico (token, componente global, quebra de layout): quebra o build. Drift local/cosmético: warn com dono e prazo. Regra do gate vive versionada no repo.
6. **Feche o loop.** Merge só após: código alinhado ao design OU design atualizado na mesma PR. Drift aceito sem nenhum dos dois é proibido.

## Regras

- CI de drift roda em toda PR que toca UI ou `design/`. Sem skip silencioso.
- Relatório sem screenshot/diff é ruído — rejeite.
- Nunca use este gate para falha de segurança (isso é `sast-gate-pr`) nem métrica de runtime (isso é `canary-watch`/`funil-cro-watch`).
- Oráculo ambíguo? Trave a PR e esclareça `design-system.md` primeiro.
- Build quebrado por drift crítico não se contorna com retry.

## Related skills

- `sast-gate-pr` — gate de segurança em workflow.
- `canary-watch` — vigilância pós-deploy de URL.
- `design-system` — oráculo de tokens e componentes.

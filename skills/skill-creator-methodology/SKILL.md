---
name: skill-creator-methodology
description: Use when creating reusable skills from scratch — detect repetition, document process, create, test, version, share. Triggers on "criar skill methodology", "metodologia criar skill", "skill creator process", "como criar skill", "skill development lifecycle".
metadata:
  origin: AUTORAL
  source_docs:
    - https://www.youtube.com/watch?v=Bezlzmti6_U (Luciana Papini video)
    - https://docs.anthropic.com/en/docs/claude-code/skills
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: [hooks, commands]
---

# Skill Creator Methodology — Criação de Skills Reutilizáveis

Metodologia: **detectar repetição → documentar → criar → testar → versionar → share**. Templates e checklists em `references/templates.md`.

## Quando usar (gatilhos concretos)

- "Como criar uma skill do zero"
- "Metodologia para criar skills reutilizáveis"
- "Processo de criação de skills"
- "Skill development lifecycle"

## Quando NÃO usar

- Usar skill existente → use `encontrar-skill` ou `skill-scout`
- Instalar skill → use `encontrar-skill` ou `skill-scout`

## Metodologia (4 Fases — resumo)

**Fase 1 — Detectar repetição:** mesma tarefa ou explicação **3+ vezes** + ROI > tempo de criação → vira skill. Teste dos 3 Ss (FullCycle #67): reutilizavel? procedural nao-obvio (o modelo erra sem ajuda)? estavel por dias/semanas? 3×sim = vira skill e vale versionar no projeto. (Checklist em `references/templates.md`.)

**Fase 2 — Documentar:** especificação com contexto (problema/gatilho/não-gatilho), inputs, steps, outputs, referências. (Template em `references/templates.md`.)

**Fase 3 — Criar & testar:** estrutura `SKILL.md` + `references/` + `scripts/`; frontmatter + gatilhos + pipeline + refs oficiais; testes happy path, edge, erro, integração; validação (`build-catalog.js`, `validate-no-personal-paths.js`, `git status` limpo).

**Fase 4 — Versionar & share:**

```bash
git add skills/<nome>/ && git commit -m "feat: add <nome> skill - <breve desc>" && git push origin main
node scripts/build-catalog.js
```

SKILL template pronto + checklist final de PR em `references/templates.md`.

## 4 práticas Anthropic (leva YouTube rodada 7)

Peças que faltavam no lifecycle acima (fonte: engenheiro Anthropic, vídeo HIRDzMtuWFk):

1. **DRY em skills** — script provado salvo em `scripts/` da skill; runs futuras
   EXECUTAM o arquivo em vez de reescrever (ex.: styling de slides). Nunca deixe o
   modelo resolver 2x o mesmo problema técnico.
2. **Progressive disclosure + protocolo de 3 testes** — no boot, só `name +
   description` do frontmatter; `SKILL.md` full só no match; scripts/refs lazy.
   Descriptions precisas com palavras reais do usuário, sem overlap. Valide cada
   description com 3 testes: request óbvio (deve disparar), paráfrase (deve
   disparar), negativo que NÃO deve disparar.
3. **Correção → menor lugar durável + rerun** — diagnosticar causa (processo vs.
   contexto vs. regra fraca vs. código) → editar o menor ponto durável → rerun +
   verificar. Portátil entre harnesses; performance entre modelos não garantida.
4. **Verificação com evidência externa** — acceptance criteria + 1º draft interno +
   inspeção (screenshot/teste/fonte/personas: iniciante confuso, comprador cético,
   audiência real) + 2º pass; reporte o que ficou NÃO-verificado. Ver também
   `santa-method` e `outcome-rubric-verification`.

## Referências Oficiais (Validados 2026-08-30)

- [Claude Code Skills Docs](https://docs.anthropic.com/en/docs/claude-code/skills)
- [Anthropic: Building Skills for Claude](https://www.anthropic.com/engineering/building-skills-for-claude)

## Adapters (Por Plataforma)

```
adapters/
├── opencode/ (hooks, README)
├── cursor/ (hooks, README)
├── codex/ (hooks, README)
└── ...
```

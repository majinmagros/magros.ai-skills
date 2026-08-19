---
name: gemini-cli-agent-skills
description: Use when working with Gemini CLI / Gemini Spark agent capabilities — Agent Skills (create/install skills), MCP apps and extensions, scheduled recurring tasks (Spark), Gemini Notebook (formerly NotebookLM), cheap Gemini Flash models, Lyria 3.5 music in Google Flow Music, and Google AI Studio (import from GitHub + publish free on a *.ai.studio subdomain). Triggers on "gemini cli", "gemini spark", "ai studio", "gemini skills", "notebooklm".
metadata:
  origin: ECC
---

# Skill: Gemini CLI / Spark Agent Skills

O ecossistema Google tem equivalentes a skills do Claude Code: **Agent
Skills** (pasta com `SKILL.md` + `scripts/`/`references/`/`assets/`, o mesmo
padrão aberto) no **Gemini CLI**, e skills + tarefas agendadas no **Gemini
Spark** (Gemini Apps). Diferenciais: **Gemini Notebook** (ex-NotebookLM) e
**AI Studio** com publicação grátis em subdomínio `*.ai.studio`.

## Quando usar

- Paridade de recursos entre harnesses (Claude Code ↔ Gemini CLI/Spark).
- Criar/instalar skills do Gemini.
- Conectar apps externos (MCP/extensões) ao Gemini.
- Publicar app/demo sem custo de hosting via AI Studio.

## Padrões

### 1. Agent Skills (formato oficial)
- Skill = pasta com `SKILL.md` (obrigatório) + `scripts/`, `references/`,
  `assets/` (opcionais) — mesmo padrão aberto do Claude Code.
- Ativação por descrição: o modelo ativa a skill quando o pedido bate com a
  `description` (tool interna `activate_skill`), com prompt de consentimento.
- Gestão: `gemini skills install|link|uninstall`, e dentro da sessão
  `/skills list|link|enable|disable` (escopo `user` ou `--scope workspace`).

### 2. Gemini Spark (Gemini Apps) — skills e tarefas agendadas
- Skills e agendamento de tarefas recorrentes vivem no **Spark** (app web,
  mobile e Mac). Não confundir com o Gemini CLI (terminal).
- Requer conta Google **pessoal**, 18+, assinatura **Google AI Pro/Ultra** e
  Keep Activity ligado; não disponível em algumas regiões (EEA, Nigéria,
  Suíça, Reino Unido).
- Use o agendador do Spark para rotinas determinísticas (postar, rodar job,
  enviar resumo).

### 3. MCP / extensões
- Conecte apps externos via MCP servers (config em `~/.gemini/settings.json`)
  e **extensões** (`gemini extensions install <url>`), que também podem
  embutir skills.

### 4. Modelos por custo
- **Gemini Flash** (família de baixo custo) para volume; modelo maior só
  quando o julgamento/qualidade for o gargalo.
- Nomes, versões e quotas mudam — confira a página oficial de pricing.

### 5. Áudio/música
- **Lyria 3.5** gera música/vocais no **Google Flow Music** (trilhas de até
  3 min) e no Gemini — alternativa ao Suno para trilhas em projetos de mídia.
- Confira o tier grátis vigente na página oficial do Flow Music.

### 6. AI Studio (publicação grátis)
- **Build** importa projeto do GitHub (desde jul/2026) e publica com
  **subdomínio grátis `*.ai.studio`** no Starter Tier (até 2 apps, sem
  cartão/Cloud project).
- Domínio próprio de verdade ainda passa por Cloud Run domain mapping ou
  Firebase Hosting (fora do grátis).

## Checklist
- [ ] Conhece a diferença Spark (Gemini Apps) vs Gemini CLI (terminal).
- [ ] Skills seguem o formato oficial (SKILL.md + pastas opcionais).
- [ ] App externo usa MCP/extensão, não scraping.
- [ ] Tarefa recorrente no agendador do Spark (não em cron manual).
- [ ] Modelo escolhido pelo custo da tarefa; preço conferido na página oficial.
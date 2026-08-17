---
name: gemini-cli-agent-skills
description: Use when working with Gemini CLI agent capabilities — Gemini Spark (agentic mode that creates/inserts skills, connects apps via MCP, uses @tool mentions, schedules tasks), Gemini Notebook, cost-efficient Gemini 3.6 Flash / 3.5 FlashLight, Lyria 3.5 Flow Music, and Google AI Studio (import project from GitHub + publish free with custom domain). Triggers on "gemini cli", "gemini spark", "ai studio", "gemini skills", "notebooklm".
metadata:
  origin: ECC
---

# Skill: Gemini CLI Agent Skills

O Gemini CLI (agente Spark) tem recursos equivalentes a skills no Claude Code:
criar/inserir skills, conectar aplicativos via MCP, referenciar ferramentas com
`@tool`, e agendar tarefas recorrentes. Diferenciais do ecossistema Google:
**Gemini Notebook** (antigo NotebookLM) e **AI Studio** com publish grátis em
domínio próprio.

## Quando usar

- Paridade de recursos entre harnesses (se você usa Claude Code e Gemini).
- Criar/editar skills do Gemini Spark.
- Conectar apps externos (MCP) ao Gemini.
- Publicar app sem custo de hosting via AI Studio.

## Padrões

### 1. Spark: skills e ferramentas
- Cria/insere skills no modo agentic (mesmo modelo de pastas+instruções).
- Referencie ferramentas com `@tool mention` para fixar escopo.
- Conecte apps (MCP) para o agente atuar em serviços externos.

### 2. Tarefas agendadas
- Gemini agenda tarefas recorrentes — mesmo conceito de `routines`/cron.
- Use para rotinas determinísticas (postar, rodar job, enviar resumo).

### 3. Modelos por custo
- **Gemini 3.6 Flash / 3.5 FlashLight** = custo-eficiente para volume.
- Modelo caro só quando o julgamento/qualidade for o gargalo.

### 4. Áudio/música
- **Lyria 3.5 (Flow Music)**: compõe/canta música licenciada, com tier grátis.
- Alternativa ao Suno para trilhas em projetos de mídia.

### 5. AI Studio (publicação grátis)
- Importa o projeto direto do GitHub e publica com domínio próprio.
- Caminho de deploy sem custo para MVPs e demos.

## Checklist
- [ ] Conhece a diferença Spark (agentic) vs chat comum.
- [ ] Skills seguem o mesmo formato pastas+arquivo+instruções.
- [ ] App externo usa MCP, não scraping.
- [ ] Tarefa recorrente ficou no agendador do Gemini (não em cron manual).
- [ ] Modelo escolhido pelo custo da tarefa, não por hábito.
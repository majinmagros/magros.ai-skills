---
name: sessoes-orquestradas
description: Use when orchestrating multiple Claude Code sessions that talk to each other by name — session-to-session handoff, parallel sessions (e.g. one researches while another builds), supervisor loop scoring candidates 0-100, and model routing (cheap executor + strong supervisor). Triggers on "sessões conversando", "session handoff", "supervisor loop", "orquestrar sessões", "nota 0-100", "uma sessão manda para a outra".
metadata:
  origin: ECC
---

# Skill: Sessões Orquestradas (session-to-session no Claude Code)

O Claude Code ganhou sessões que podem se falar pelo nome: você dá nome a uma
sessão e outra sessão envia/recebe contexto dela. Isso habilita orquestração
nativa sem ferramentas externas (sem tmux, sem agentes de equipe).

## Quando usar

- Dividir uma tarefa grande em sessões paralelas que cooperam.
- Pipeline de verificação onde um supervisor avalia o trabalho de executores.
- Handoff: sessão A termina e passa o bastão para a sessão B.

## Padrões

### 1. Duas sessões paralelas com handoff
- Nomeie as sessões de propósito (ex: `pesquisa-layout`, `build-site`).
- `pesquisa-layout` coleta referências/decide o plano; `build-site` recebe o
  resultado e constrói.
- A comunicação é nome-para-nome: a sessão construtora puxa o resumo da
  pesquisadora em vez de re-analisar do zero.

### 2. Supervisor loop com nota 0-100
- Executores (modelo barato, ex: Haiku) geram candidatos.
- Supervisor (modelo forte, ex: Opus) pontua cada um de 0 a 100.
- Rejeita abaixo do corte (ex: < 90) e pede nova iteração; aprova o melhor.
- Separe os papéis: quem gera não valida o próprio trabalho.

### 3. Roteamento de modelo por papel
- **Executor** = modelo barato (custo por tarefa baixo).
- **Supervisor/avaliador** = modelo forte (qualidade de julgamento).
- Não use o modelo caro para gerar em massa nem o barato para decidir.

## Checklist
- [ ] Sessões têm nomes únicos e intencionais.
- [ ] Cada sessão tem escopo pequeno e entregável claro.
- [ ] Handoff transfere decisões (não re-faz trabalho feito).
- [ ] Supervisor é independente do executor (não auto-avalia).
- [ ] Corte de nota definido antes de iterar.
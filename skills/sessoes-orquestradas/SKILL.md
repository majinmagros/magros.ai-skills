---
name: sessoes-orquestradas
description: Use when orchestrating multiple Claude Code sessions that talk to each other by name — session-to-session handoff, parallel sessions (e.g. one researches while another builds), supervisor loop scoring candidates 0-100, and model routing (cheap executor + strong supervisor). Triggers on "sessões conversando", "session handoff", "supervisor loop", "orquestrar sessões", "nota 0-100", "uma sessão manda para a outra".
metadata:
  origin: ECC
---

# Skill: Sessões Orquestradas (session handoff no Claude Code)

O Claude Code suporta sessões **nomeadas**, resumíveis por nome e
bifurcáveis: `claude -n <nome>` / `/rename`, `claude --resume <nome>` /
`/resume <nome>` e `/branch`. Handoff entre sessões = a sessão seguinte
**retoma a anterior pelo nome** (herda o contexto completo) ou recebe um
handoff doc. Para PARALELISMO real, use **worktrees** (cada worktree tem suas
próprias sessões) + sessões separadas. Não existe "uma sessão puxar contexto
da outra ao vivo" — a comunicação é via resume/handoff.

## Quando usar

- Dividir uma tarefa grande em sessões que cooperam em sequência ou em
  worktrees paralelas.
- Pipeline de verificação onde um supervisor avalia o trabalho de executores.
- Handoff: sessão A termina e passa o bastão para a sessão B.

## Padrões

### 1. Handoff nome-para-nome
- Nomeie as sessões de propósito (`claude -n pesquisa-layout` ou `/rename`).
- `pesquisa-layout` coleta referências/decide o plano; `build-site` retoma com
  `claude --resume pesquisa-layout` (ou `/resume <nome>`) e herda o contexto
  completo em vez de re-explicar.
- `/branch <nome>` cria uma cópia da conversa para tentar caminho alternativo
  sem perder a original.
- Para rodar sessões em paralelo de verdade: um worktree por sessão
  (`git worktree add`) — sessões em worktrees diferentes não interferem.

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

## Enriquecimento 2026-08-20 — sandbox + exe.dev
- Fonte `SEI_qIW4o2c`/`WAFUMBLOjHo`: para **scale beyond laptop**, mova sessões para `exe.dev` sandbox VM (isolation + scale + agency). Use Herder/Pi SDK padrão Indy; `cmux`/`tmux` (`dmux-workflows`) para acesso programático aos agentes (evita bottleneck `inside the loop`). Regra: factory em sandbox quando risco ou paralelismo > worktree local.
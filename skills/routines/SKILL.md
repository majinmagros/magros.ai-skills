---
name: routines
description: Use when scheduling autonomous Claude Code sessions in the cloud — recurring tasks that run without the machine being on. Triggers on "routines", "agendar", "tarefa recorrente", "funcionário 24/7", "roda todo dia", "webhook", "gatilho", "cloud code na nuvem". Covers schedule/webhook/GitHub triggers, vs VPS/n8n/Mac mini.
---

# Skill: Routines — sessões autônomas agendadas na nuvem

Agenda sessões completas do Claude Code na nuvem, sem deixar o computador
ligado e sem VPS/Mac mini. Uma rotina = skill + prompt de ativação.

## 1. Quando usar (vs alternativas)

| Opção | Bom para | Custo/limite |
|---|---|---|
| **Execução local** | Tarefa agendada no próprio PC | PC desligado/sem internet = não roda; RAM estoura |
| **VPS** | Fluxo flexível que decide no caminho | Setup técnico alto |
| **n8n/Make** | Pipeline previsível A+B=C | Rígido, quebra com atualização, sem agente LLM |
| **Routines** | Agente agêntico 24/7 na nuvem, fácil | Recurso da Anthropic; usa repositório no GitHub |

Routines vence quando o fluxo precisa de DECISÃO ao longo do caminho (n8n é
rígido demais) mas não vale o setup de VPS.

## 2. Gatilhos (3 formas de ativar)

1. **Agendamento**: horário fixo (todo dia às 8h, a cada X min, semanal).
2. **Endpoint/webhook**: HTTP request dispara o fluxo (ex.: cliente comprou →
   checkout chama o webhook → onboarding automático). Também permite falar com
   o agente via WhatsApp para um número.
3. **Evento GitHub**: PR aberto → revisão de código automática, atribuição,
   etc.

## 3. Como montar

1. Tenha o agente num **repositório no GitHub** (CLAUDE.md + skills já
   configurados).
2. Conecte o repo ao Routines (painel `claude.ai/code/routines`).
3. Descreva a rotina: **skill + prompt** que ativa a skill ("pesquise as
   notícias do dia e envie no meu e-mail").
4. Escolha o gatilho e conecte os connectors (e-mail, WhatsApp, Sheets).
5. Teste manualmente antes de agendar.

## 4. Regras

- O que roda na nuvem é uma **sessão completa** do Claude Code, não um script limitado.
- Tarefa sem decisão/revisão → considere n8n (mais barato/estável).
- Rotina com chave/credencial: mantenha em `.env`, nunca no repositório público.

## 5. Enriquecimento 2026-08-20 — Loop engineering + 5 tasks + V2 cloud (SimonScrapes)

- **Loop engineering `UfN4l2yCT54`**: loop = repeat until `done` (ex.: `every receipt matched or flagged`). **Done criteria** claro = setup rápido. Triggers: turn-based (mensagem), time-based (schedule Fri/1st), event-based (email/meeting) — event pode ser polled hourly via `check inbox`.
- **5 tasks exemplo time-based**: use esta taxonomia para desenhar qualquer workflow custom.
- **V2 Hands-Off `b3OiEUp1GIU`**: evolução v1 local (precisa laptop aberto `stay open`), v2 API `managed agents`, v3 VPS+tmux+Telegram (painful), v4 cloud zero setup (`describe task + pick schedule`, laptop shut, phone view). Matriz 4 opções guia migração VPS→cloud.

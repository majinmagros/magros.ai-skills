---
name: 12-factor-agents
description: Use when building or reviewing production LLM agent applications — applying the 12-Factor Agents methodology (humanlayer) for reliable, scalable, maintainable agentic software. Triggers on "12 factor agents", "12-factor agents", "agente de produção", "LLM app confiável", "build agent", "arquitetura de agente", "por que agentes falham em produção", "agente stateless", "own your context window". Turns the 12 principles into a review checklist and maps each factor to concrete ECC skills.
metadata:
  origin: ECC
---

# Skill: 12-factor-agents — princípios para LLM apps de produção

Baseado na metodologia **12-Factor Agents** (humanlayer/12-factor-agents, ~25k
estrelas), no espírito do 12-Factor App. A tese central: agentes bons são
**principalmente software determinístico com passos de LLM pontuais**, não
"aqui vai um prompt, um saco de tools, e um loop até atingir o objetivo". A
maioria dos frameworks leva a 80% de qualidade; passar disso exige engenharia.

## Quando usar

- Você está **construindo** uma aplicação LLM/agente para produção.
- Você está **revisando** uma arquitetura de agente existente (por que ele é
  frágil? por que trava? por que custa caro?).
- Decisão framework vs código modular ("framework é sedutor, mas o controle é seu").
- Antes de deixar um agente agir sem supervisão (loop autônomo).

Não use para: escolher modelo barato (isso é `roteamento-modelos-baratos`);
proteger o agente (isso é `agent-guardrails`); orquestrar sessões (isso é
`sessoes-orquestradas`); design de loop específico (isso é `loop-design-check`).

## Os 12 fatores (checklist de revisão)

| # | Fator | Pergunta-chave | Skill ECC que aprofunda |
|---|---|---|---|
| 1 | **Linguagem natural → tool calls** | O LLM decide o próximo passo; o código executa. O loop é: LLM emite step (JSON) → código determinístico executa → resultado volta ao contexto | `agent-harness-construction` |
| 2 | **Dono dos prompts** | Seus prompts são seus (versão, teste, controle) — não dependa de prompt embutido do framework | `prompt-builder` / `prompt-optimizer` |
| 3 | **Dono da janela de contexto** | "Own your context window": formato próprio, densidade de informação, não jogue tudo no formato padrão de mensagens | `context-budget` / `iterative-retrieval` / `strategic-compact` |
| 4 | **Tools são outputs estruturados** | Tool call = LLM emite JSON tipado; o código decide o que executar e como — separa decisão de execução | `regex-vs-llm-structured-text` |
| 5 | **Unifique estado de execução e de negócio** | Estado de execução (próximo passo, retries) e estado de negócio (mensagens, tool results) idealmente uma fonte de verdade só | `click-path-audit` |
| 6 | **Launch/Pause/Resume com APIs simples** | O agente pode ser iniciado, pausado e retomado — não é um processo que roda na sua cabeça só | `routines` |
| 7 | **Contate humanos com tool calls** | Aprovação humana é uma tool (request_approval), não uma exceção — permite tools de alto risco com segurança | `agent-guardrails` / `safety-guard` |
| 8 | **Dono do controle de fluxo** | Você controla o fluxo (if/else, loops, DAG), não o framework — agente não é caixa preta | `loop-design-check` / `continuous-agent-loop` |
| 9 | **Compacte erros na janela de contexto** | Erro vira informação estruturada pro LLM se recuperar; esconda erros já resolvidos do contexto | `error-handling` |
| 10 | **Agentes pequenos e focados** | Um agente por responsabilidade; modelos mais fortes resolvem mais, mas um agente focado é mais confiável que um gigante | `workflows` / `engenharia-de-grafos` |
| 11 | **Trigger de qualquer lugar** | Evento, cron, webhook, GitHub, mensagem — o agente "meet users where they are", incluindo agentes outer-loop sem humano | `routines` / `automacao-deterministica` |
| 12 | **Agente é um reducer stateless** | O agente é uma função pura: (estado anterior + evento) → (novo estado + ações); o estado vive fora dele | `continuous-agent-loop` |

Bônus (fator 13): **pré-busque todo o contexto que precisará** — evite ida e
volta de recuperação a cada passo.

## Pipeline de uso

1. **Construindo do zero**: comece do fator 1 (loop LLM→tool→contexto) e do
   12 (stateless reducer) — eles definem a forma do sistema.
2. **Revisando um agente existente**: rode o checklist dos 12 fatores; os
   fatores 3 (contexto), 8 (controle de fluxo) e 9 (erros) são onde agentes
   mais quebram em produção.
3. **Decidindo framework**: o framework entrega os 12 fatores de graça? Se
   precisa estender/reverse-engineer pra passar do 80%, considere código
   modular com os fatores como guia.
4. **Antes do autônomo**: confira 6 (pause/resume), 7 (humano no loop) e 12
   (reducer) antes de deixar o agente rodar sozinho.

## Fontes oficiais

- Metodologia: `github.com/humanlayer/12-factor-agents` (CC BY-SA 4.0; código Apache 2.0).
- Base: 12-factor app (`12factor.net`).
- Complemento: Anthropic "Building Effective Agents"
  (`anthropic.com/engineering/building-effective-agents`).
- Não é padrão formal — é framework de referência da comunidade; valide o que
  aplicar contra as docs do seu harness.

## Skills relacionadas

- `agent-harness-construction` — construção de harness (fatores 1, 4, 8).
- `loop-design-check` / `continuous-agent-loop` — design de loop (fatores 8, 9, 12).
- `context-budget` / `iterative-retrieval` — dono do contexto (fator 3).
- `agent-guardrails` — humano no loop e proteção (fator 7).
- `routines` — trigger externo e pause/resume (fatores 6, 11).

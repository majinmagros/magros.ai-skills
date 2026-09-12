---
name: multi-perspective-convergence
description: Use when a question or task deserves multiple independent perspectives before answering — the agent decides if the question is simple (answer directly) or complex (run the full pipeline). In complex mode, spawns 5 isolated agents with different viewpoints (personas, professions, roles), each generates ideas without sharing context, ideas are scored 0-10, top 3 are deepened, and the final answer reports convergence and divergence. Triggers on "multi-perspective", "convergência de perspectivas", "múltiplos pontos de vista", "ADHD skill", "skill HD", "isolar agentes", "ranking de ideias". Use for high-stakes decisions, medical/legal/financial questions, or when a single perspective risks blind spots. Do NOT use for simple factual lookups or trivial questions.
---

# Skill: Multi-Perspective Convergence — isolamento de perspectivas com ranking e convergência

Framework de múltiplos agentes para respostas robustas: cada perspectiva trabalha
isolada (sem compartilhar contexto), ideias são ranqueadas, as melhores são
aprofundadas, e o resultado final destaca o que converge e o que diverge.

Inspirado na "skill ADHD" (vídeo "Opus 5 é Exaustivo. Anthropic Revelou a Solução",
canal Maestros da IA, 2026). A sigla ADHD remete ao TDH: a skill "acelera" o
raciocínio dividindo-o em múltiplos agentes focados, cada um sem distração do
contexto alheio.

## Quando usar

- A pergunta é complexa, ambígua ou de alto risco (medicina, jurídico, financeiro).
- Uma única perspectiva pode ter blind spots significativos.
- Você precisa de previsibilidade e confiança na resposta, não apenas velocidade.
- O usuário pede explicitamente múltiplos pontos de vista ou convergência.
- Decisões de arquitetura, estratégia de produto, ou go/no-go com impacto alto.

Não use para: perguntas factuais simples, lookups triviais, ou quando a velocidade
importa mais que a precisão. O pipeline custa 5×+ tokens e tempo vs. resposta direta.

## Pipeline

### 1. Triagem — responder direto ou rodar o framework?

O agente avalia a pergunta do usuário e decide:

- **Simples** (factual, trivial, já conhecida) → responde diretamente e encerra.
- **Complexa** (múltiplas variáveis, alto risco, ambígua) → segue para etapa 2.

Critérios para classificar como complexa:
- Múltiplas variáveis interdependentes.
- Consequências de erro são caras (saúde, dinheiro, legal).
- Não há uma única resposta consensual.
- O usuário pediu profundidade ou múltiplas perspectivas.

### 2. Seleção de perspectivas — 5 pontos de vista isolados

Escolha **5 perspectivas diferentes** da pergunta. As perspectivas podem ser:

- **Personas/profissões** (ex.: médico, paciente, gestor hospitalar, pesquisador, enfermeiro).
- **Funções técnicas** (ex.: arquiteto, DevOps, desenvolvedor sênior, QA, product manager).
- **Estilos de pensamento** (ex.: cético, pragmatista, visionário, analista, crítico).
- **Partes interessadas** (ex.: usuário final, investidor, regulador, engenheiro, designer).
- **Níveis de maturidade** (ex.: iniciante, intermediário, especialista, leigo, criança de 10 anos).

A escolha deve cobrir o espectro relevante para a pergunta. Se o domínio for
desconhecido, cubra ao menos: um especialista, um leigo, um cético, um pragmatista
e um criativo.

### 3. Geração isolada — cada perspectiva na sua sala

Cada uma das 5 perspectivas **gera suas ideias independentemente**, sem acesso ao
que as outras produziram. É como se cada uma estivesse numa sala totalmente
isolada, sem contato com as demais.

**Como implementar o isolamento:**

- Se o harness suporta subagentes (Claude Code Task, OpenCode agent): despache
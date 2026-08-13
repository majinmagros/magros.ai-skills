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
  5 subagentes em paralelo, cada um com **só** a pergunta original + sua persona.
  O subagente não recebe o histórico da conversa nem o output dos outros.
- Se o harness não suporta subagentes: simule isolamento rodando cada perspectiva
  numa chamada separada, sem incluir outputs anteriores no prompt. Cada chamada
  recebe apenas: a pergunta + a persona designada + "Gere suas ideias sobre este
  tema do seu ponto de vista."

Cada perspectiva retorna uma lista de ideias/considerações sobre a pergunta.

### 4. Ranking — nota 0-10 para cada ideia

Colete todas as ideias geradas pelas 5 perspectivas e atribua uma **nota de 0 a 10**
para cada uma, considerando:

- **Relevância** — a ideia endereça diretamente a pergunta?
- **Fundamentação** — a ideia é bem sustentada (lógica, evidência, experiência)?
- **Originalidade** — a ideia traz um ângulo não óbvio?
- **Aplicabilidade** — a ideia é acionável ou construtiva?

Apresente o ranking em tabela:

| Perspectiva | Ideia | Nota (0-10) |
|-------------|-------|-------------|

### 5. Aprofundamento — top 3

As **3 ideias com maior nota** passam por aprofundamento:

- Desenvolver cada ideia em detalhe (raciocínio completo, exemplos, riscos).
- Adicionar uma **provocação** a cada uma: contestar, colocar um "porém", pensar
  além do que foi gerado. A provocação testa se a ideia sobrevive a um desafio
  adversarial.

### 6. Convergência — o que sobrevive

Analise o conjunto das 3 ideias aprofundadas e identifique:

- **Convergência** — pontos onde múltiplas perspectivas concordam (mesmo tendo
  chegado por caminhos diferentes). Estes são os pontos de maior confiança.
- **Divergência** — pontos onde as perspectivas discordam. Estes requerem atenção
  e devem ser apresentados como trade-offs, não resolvidos arbitrariamente.

Métrica de convergência: se N das 3 ideias tocam no mesmo ponto, a convergência
desse ponto é N/3 (ex.: 2/3 = 67%). Pontos com convergência >= 2/3 são
"convergentes"; abaixo disso são "divergentes".

Você pode usar um limiar percentual (ex.: 80%) para decidir o que manter vs.
eliminar — mantém os pontos que convergem acima do limiar, elimina os que não
convergem. Não elimine boas ideias, mas não comprometa pontos importantes com
ideias que foram "fora da casinha".

### 7. Resposta final

Entregue a resposta em 3 partes:

1. **Briefing resumo** — a resposta direta, em linguagem simples, baseada nos
   pontos convergentes.
2. **Panorama geral** — contexto mais amplo, incluindo as 3 ideias aprofundadas
   e suas provocações.
3. **Convergência e divergência** — tabela ou lista explicitando o que convergiu
   (alta confiança) e o que divergiu (trade-offs em aberto).

Se o usuário pediu simplificação (ex.: `plain-language-response` ativa), entregue
só o briefing resumo e ofereça o panorama sob demanda.

## Exemplo de fluxo

**Pergunta:** "Devo migrar meu monolito Laravel para microserviços?"

1. **Triagem:** Complexa (múltiplas variáveis, alto risco, sem consenso único) → roda o framework.
2. **Perspectivas:** Arquiteto sênior, DevOps, Desenvolvedor Laravel, Product Manager, CTO de startup.
3. **Geração isolada:** Cada um responde independentemente.
4. **Ranking:** 25 ideias geradas, notas 0-10 atribuídas.
5. **Top 3 aprofundadas** com provocação adversarial.
6. **Convergência:** 2/3 concordam que "migrar só se houver problema de escala real" → convergente. 1/3 defende "migrar para modernizar" → divergente.
7. **Resposta:** Briefing direto + panorama + tabela convergência/divergência.

## Guardrails

- **Custo:** O pipeline gera 5×+ tokens vs. resposta direta. Sempre avise o
  usuário se o custo for uma preocupação.
- **Isolamento é essencial:** Se as perspectivas compartilham contexto, o viés
  de ancoragem contamina tudo. O valor está na independência.
- **Provocação é obrigatória:** Sem o desafio adversarial no top 3, ideias
  fracas podem sobreviver por consenso superficial.
- **Convergência != unanimidade:** O objetivo não é que todos concordem, mas
  identificar o que sobrevive a perspectivas genuinamente diferentes.
- **Domínios de alto risco:** Em medicina, jurídico, financeiro — quanto maior
  a responsabilidade, mais você precisa apostar em estratégias de convergência
  que aumentem a precisão das respostas, porque o erro custa muito caro.

## Skills relacionadas

- `council` — 4 voças fixas (Skeptic, Pragmatist, Critic, Claude) para decisões
  ambíguas. Esta skill é mais flexível: escolhe perspectivas relevantes ao domínio,
  gera mais ideias, e adiciona ranking + convergência formal.
- `score-loop` — loop gerador-avaliador com nota de corte. Esta skill não itera
  até passar, mas gera múltiplas perspectivas independentes e ranqueia.
- `gauntlet-loop` — segmentação + verificadores às cegas para resultado excepcional.
  Esta skill foca em convergência de perspectivas, não em julgamento cego por segmento.
- `plain-language-response` — simplifica a resposta final. Use junto se o usuário
  quer o briefing resumo em linguagem simples.
- `convergencia` — compara código vs. spec/plano/tarefas. Conceito de convergência
  similar, mas aplicado a gap de implementação, não a múltiplas perspectivas.

## Anti-padrões

- **Rodar o pipeline para tudo.** Perguntas simples não precisam de 5 agentes —
  a triagem existe para evitar desperdício.
- **Quebrar o isolamento.** Se você inclui o output de uma perspectiva no prompt
  da outra, o viés de ancoragem destrói o valor do framework.
- **Pular a provocação.** Sem o desafio adversarial, o top 3 é só "as ideias que
  mais gostamos" — não as que sobrevivem a crítica.
- **Forçar convergência.** Divergência real é informação valiosa. Apresente como
  trade-off, não elimine por maioria.
- **Sempre 5 perspectivas.** 5 é o padrão, mas 3 já dá valor para questões
  menores. Mais de 7 raramente adiciona perspectiva nova (lei dos retornos
  decrescentes).

---
name: n8n-agentic-flows
description: "Use when use para orquestrar agentes autônomos dentro do N8N 2.0 usando MCP, nós de IA (Gemini/Claude), guardrails, e automações visuais com triggers de webhooks/GitHub. Triggers em \"n8n\", \"automação visual\", \"nós de agentes\", \"guardrails n8n\", \"MCP no n8n\". Foca em... Triggers on \"n8n-agentic-flows\", \"n8n agentic flows\", \"flows\"."
---

# Skill: N8N 2.0 Agentic Flows — Orquestração Visual com MCP

Framework para construir automações robustas e visualmente gerenciáveis usando o N8N 2.0 integrado com agentes de IA via MCP.

## Quando usar

- Criar fluxos de trabalho autônomos no N8N que exigem raciocínio complexo.
- Integrar agentes de IA com ferramentas locais via MCP (Model Context Protocol).
- Implementar guardrails (validação, fallback) entre nós de automação e LLMs.
- Conectar triggers de automação (webhook, GitHub, Cron, WhatsApp) a agentes orquestrados.

## Princípios de Design (N8N + Agentes)

1. **Separação de responsabilidade:** O N8N cuida da orquestração visual, triggers e I/O. A IA (agente MCP) cuida da lógica de decisão, processamento e transformação.
2. **Nós de IA como caixas pretas:** Cada nó de IA (LLM) no N8N deve receber apenas o contexto necessário para aquela tarefa. Evite passar o "mundo inteiro" em cada nó.
3. **Guardrails antes e depois:** Sempre valide o output de um nó de IA antes de passar para o próximo nó de automação.
4. **MCP para extensibilidade:** Use servidores MCP para que o agente tenha acesso às ferramentas (scripts locais, DB, APIs) que o N8N nativamente não orquestra bem.

## Pipeline sugerido no N8N

### 1. Camada de Orquestração (Trigger)
Defina o trigger: Webhook (p/ APIs externas), GitHub (p/ eventos de código), ou Schedule/Cron (p/ tarefas periódicas).

### 2. Camada de Contexto (Prepare)
Use nós de manipulação de dados para preparar o payload. Extraia apenas o essencial.

### 3. Camada de Inteligência (Agente via MCP)
Use o nó de agente do N8N (conectado a um modelo via MCP). O agente recebe a tarefa, chama ferramentas via MCP para realizar o trabalho necessário.

### 4. Camada de Validação (Guardrail)
Nó de Code (JavaScript/Python) ou nós nativos para validar se o output do agente segue o formato esperado, contém segredos, ou cumpre os requisitos.

### 5. Camada de Saída/Finalização
Ação final: POST em API, salvar em DB, enviar mensagem.

## Exemplo de Estrutura

- **Trigger:** Webhook recebendo dados de uma lead.
- **Node "Agente MCP":** O agente consulta um banco de dados via MCP para verificar se a lead é qualificada.
- **Node "Guardrail":** Valida se o output do agente está no formato JSON exigido.
- **Saída:** Envia email de qualificação via Gmail node.

## Skills relacionadas
- `mcp-server-patterns` — Fundamental para conectar o agente a ferramentas locais.
- `automation-audit-ops` — Para auditar os fluxos de trabalho no N8N.
- `team-agent-orchestration` — Para gerenciar múltiplos agentes dentro de um fluxo maior no N8N.

## Anti-padrões

- **O "God Node":** Tentar colocar toda a lógica de um agente complexo dentro de um único nó de código no N8N.
- **Passar o mundo inteiro:** Enviar o payload gigantesco de um nó para o outro sem filtrar (estoura limite de token).
- **Sem validação:** Confiar cegamente no output do LLM sem nós de guardrail.
- **Ignorar MCP:** Tentar implementar lógica customizada de API em vez de usar servidores MCP (que já gerenciam autorização e contexto).

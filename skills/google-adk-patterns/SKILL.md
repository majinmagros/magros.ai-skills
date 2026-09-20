---
name: google-adk-patterns
description: Build agents with Google ADK (Agent Development Kit) in Python, TypeScript, Go, Java or Kotlin - adk run CLI, adk web tracing, tools with docstrings, subagents with shared state, LiteLLM multi-provider routing, free Flash models via AI Studio. Use quando construir agentes com Google ADK, debugar com adk web, ou rotear modelos via LiteLLM.
---

# Google ADK Patterns

Build agents as code with Google ADK (https://google.github.io/adk-docs, packages on GitHub per language): agent = system prompt + model + tools. LLM is only the brain - tools are plain functions the agent executes.

## Quando usar

Quando precisa criar agentes com o framework oficial do Google, inspecionar request/response/function-calls no `adk web`, rodar multi-agente com estado compartilhado, ou usar modelos free (Flash via AI Studio) e multi-provider via LiteLLM. NAO use para orquestracao generica sem ADK - isso e `agent-harness-construction`.

## Passos

1. **Instale por linguagem** - Python e o principal (mais atualizado); TypeScript, Go, Java e Kotlin tambem suportados. Exemplos e pacotes no ADK.dev + GitHub.
2. **Agente minimo** - importe a classe, de nome + modelo (default funciona). Pronto: ja responde.
3. **Rode no CLI** - `adk run <pasta-do-agente>`: prompt interativo, resposta do modelo, sem setup.
4. **Debug no web** - `adk web <pasta>`: porta 8000, multi-agente, sessoes, artefatos, evaluations, eventos com request/response (o que foi enviado a LLM: system prompt + tools + content), trace de function calls.
5. **Tools como funcoes** - recebem parametros tipados, retornam dict/JSON; docstring + nome + tipagem dos parametros VIRAM contexto para a LLM. Quanto melhor documentada, melhor o function-calling.
6. **Gate destrutivo** - operacao irreversivel (ex. cancelar assinatura) exige `tool confirmation`: pede senha + confirmacao do usuario, checa flag antes de executar. Mesmo padrao dos prompts de permissao do Claude Code.
7. **Subagentes + state** - coordenador delega (lista vs cancela); agentes conversam via estado compartilhado de sessao (vai parar no system prompt via notacao do ADK - variavel ausente sem `?` quebra; com `?` e opcional). Saida padronizada com schema (ex. Pydantic: feedback + sentimento).
8. **Escolha o modo** - chat (transfere controle ao subagente), task (subagente como tool, ainda interage), single-turn (sem interacao). Modo errado quebra o fluxo.
9. **Multi-modelo via LiteLLM** - qualquer provider: instancie LiteLLM com `anthropic/...`, `openai/...`. Modelos nao-Google passam por ela, sem friccao.
10. **Tier free para aprender** - conta Google + AI Studio: modelos Flash/Flash-Lite gratis com rate limit; gere API key e injecte no projeto. Acompanhe os limites - gratis nao e infinito.

## Regras

- NEVER deixar tool destrutiva sem confirmation gate.
- NEVER ler state sem `?` quando a chave pode nao existir.
- Docstring ruim = function-calling ruim; tipagem e documentacao sao o contrato.
- Single-turn NAO conversa; chat TRANSFERE o controle - escolha consciente.
- Valide contra adk.dev (ADK 2.0 tem graph workflows): API de framework novo muda.

## Related skills

- `agent-harness-construction` - harness generico (action space, observacao, recovery).
- `mcp-server-patterns` - expor tools via MCP em vez de funcoes locais.
- `roteamento-modelos-baratos` - executor barato + verificador forte.
- `cost-aware-llm-pipeline` - routing por complexidade + budget.

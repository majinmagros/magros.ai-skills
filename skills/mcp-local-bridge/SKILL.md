---
name: mcp-local-bridge
description: Connect local desktop tools via MCP STDIO without building a server. Use when wiring Claude Code to a local app, .mcp.json fails, Windows/WSL path mismatch, unverified extension warning. TRIGGER when: MCP local, STDIO bridge, .mcp.json, desktop app closed, path matrix Windows WSL Mac. Gatilhos PT: conectar MCP local, ponte MCP, app desktop MCP, erro de path MCP, extensão sem verificação.
---

# MCP Local Bridge

## Quando usar

- Conectar Claude Code a um app desktop local via MCP (não construir server novo).
- Erro de conexão, timeout, ou tool que não aparece.
- Projeto roda em Windows/WSL/Mac e paths quebram.
- Extensão/plugin pede instalação sem selo de verificação.
- Para CONSTRUIR um server MCP, use `mcp-server-patterns`. Este skill é só PONTE local.

## Passos

1. **Leia o skill antes das tools.** Regra mandatória: descubra comandos, limites e formato esperado antes de chamar qualquer tool do bridge.
2. **Confirme que o app desktop está aberto e logado.** Bridge local exige processo vivo. App fechado = MCP morto. Verifique versão do app e do conector.
3. **Confira o `.mcp.json` custom STDIO.** Valide: `command`, `args`, `env`, `cwd`. STDIO não tem retry de rede — erro de digitação derruba tudo. Teste o comando na mão no terminal primeiro.
4. **Aplique a matriz de paths.** Windows usa `C:\...`, WSL usa `/mnt/...`, Mac usa `/Users/...`. Converta explicitamente. Nunca chute path entre subsistemas — normalize antes.
5. **Avalie extensão sem selo.** Sem selo de verificação: instale em escopo mínimo, revise permissões (filesystem, rede, shell), prefira alternativa verificada. Registre o risco.
6. **Smoke-test ponta a ponta.** Liste tools → chame 1 leitura read-only → chame 1 escrita em sandbox. Só então libere para o fluxo real.

## Regras

- Nunca duplique `mcp-server-patterns`. Aqui não se cria server, só se conecta.
- App fechado, sem debug de JSON. Abra o app primeiro.
- Nunca misture sintaxe de path Windows/WSL/Mac no mesmo config.
- Extensão sem verificação nunca ganha acesso amplo na primeira instalação.
- Sem smoke-test verde, sem uso em tarefa real.

## Related skills

- `mcp-server-patterns` — construir server, não conectar.
- `terminal-ops` — prova de execução do smoke-test.

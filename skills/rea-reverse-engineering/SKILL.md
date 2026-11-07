---
name: rea-reverse-engineering
description: >
  Reverse engineer anything from binaries, applications, and runtime behavior
  using REA (Reverse Engineer Anything). A local-first MCP server + CLI that
  lets AI agents inspect native binaries, JavaScript/Electron apps, .NET
  assemblies, and websites — without source code — and produce evidence-backed
  explanations plus reproducible implementations. Works with any AI agent that
  supports MCP or CLI invocation. Triggers on "reverse engineer", "rea", "binary analysis", "decompile", "electron analysis", "dotnet assembly", "inspect app", "how does this feature work".
metadata:
  origin: ECC
  license: MIT
  platforms:
    - claude-code
    - opencode
    - codex
    - cursor
    - gemini-cli
    - hermes
    - openclaw
    - generic-mcp
---

# REA — Reverse Engineer Anything

Skill para engenharia reversa local com REA. Não depende de um agente específico:
funciona com qualquer IA que consiga invocar um servidor MCP ou rodar comandos de
terminal via CLI.

## O que o REA faz

Conecta sua IA a ferramentas de inspeção de:

- **Binários nativos** (executáveis, bibliotecas)
- **Aplicações JavaScript / Electron**
- **Assemblies .NET**
- **Sites / páginas web**

A análise roda localmente. Você não precisa do código-fonte do programa alvo.
O REA devolve evidências (prints, trechos de código, fluxos, chamadas) e limitações
de cada conclusão, permitindo que você entenda como uma feature funciona e reimplemente
ela no seu próprio projeto.

## Pré-requisitos

- Node.js 22.19+ ou 24.11+ ou >=26
- npm
- (Opcional, para análise nativa) Hopper, Ghidra ou IDA já instalados — o REA não instala essas ferramentas por você ("bring your own")

## Instalação

```bash
npx rea-agents setup
```

O setup registra o servidor MCP e as instruções de workflow no seu agente. Ele mostra
as mudanças propostas e pede aprovação antes de gravar arquivos ou instalar o Hopper.

Suporte a agentes: Claude Code, Codex, Cursor, Gemini CLI, Grok Build e outros
harneses que aceitem MCP ou execução de CLI.

## Como usar (exemplos de prompts)

Após a instalação, pergunte ao seu agente algo como:

> "Entenda como a busca funciona no app Notes, mostre as evidências e construa uma
> versão similar para o meu projeto."

O agente usará o REA para:

1. Inspecionar o app alvo sem código-fonte
2. Explicar como a feature funciona
3. Mostrar as evidências (arquivos, funções, chamadas de rede, etc.)
4. Gerar uma implementação para o seu projeto

## Segurança e escopo

- **Análise local:** nada sai do seu computador sem você enviar explicitamente
- **Traga sua própria ferramenta:** Ghidra e IDA não são instalados pelo REA
- **Fail-closed:** não integre capacidades enquanto questões de escopo, autoridade,
  efeitos colaterais ou verificação não estejam resolvidas
- **Credenciais:** nunca hardcode API keys, senhas ou tokens. Use variáveis de ambiente
- **Direitos autorais:** engenharia reversa de software alheio pode ter restrições legais.
  Verifique a licença e o escopo antes de analisar ou reimplementar

## Estrutura do repositório REA

Se quiser contribuir ou entender o código-fonte do REA, ele está em:

- `src/` — código fonte TypeScript
- `bridge/` — pontes para Hopper, Ghidra, IDA, LLDB, processos nativos
- `scripts/` — entry point da CLI (`rea.mjs`)
- `docs/` — documentação, guias, contratos MCP
- `website/` — site oficial (rea.tools)

## Exemplo de fluxo completo

1. Instalar: `npx rea-agents setup`
2. Aprovar as mudanças propostas pelo setup
3. Reiniciar o agente
4. Perguntar: "Como funciona o export de PDF neste app?"
5. O agente invoca o REA via MCP/CLI
6. O REA retorna evidências + limitações
7. O agente gera código de exemplo para você reusar

## Quando usar esta skill

- Precisa entender como um app/binário funciona sem ter o código-fonte
- Quer reimplementar uma feature vista em outro produto
- Precisa de evidências técnicas antes de decidir arquitetura
- Quer analisar comportamento de runtime de forma local e segura

## Quando NÃO usar

- Análise de malware ou software protegido sem autorização legal
- Substituição de auditoria de segurança profissional
- Quando você já tem o código-fonte e só precisa de refatoração (use code-reviewer em vez disso)

## Limites do REA e pipeline "espelho de apps" (captura 2026-11)

Fonte: Maestros da IA `_hO8HbdRO28` e `02ebTWFXqKE`.

O REA Ã© forte na **coleta de evidÃªncias** (o que o app faz, como a feature se
comporta). A parte de **desenvolvimento do clone** deixa a desejar: falta um
processo estruturado de especificaÃ§Ã£o e verificaÃ§Ã£o. NÃ£o trate "clonar qualquer
app" como um prompt Ãºnico.

Pipeline que funcionou melhor:

1. **Coletar** com REA: fluxos, telas, estados, chamadas, limitaÃ§Ãµes.
2. **Escrever um spec de clone** â€” escopo mÃ­nimo, telas, entidades, aÃ§Ãµes,
   critÃ©rios de aceite e o que fica de fora.
3. **Revisar o spec com goldfish** (`elephant-goldfish-review`).
4. **Implementar em fatias verticais**, uma tela/fluxo por vez.
5. **Verificar no app rodando** â€” comparaÃ§Ã£o lado a lado com o original.
6. SÃ³ entÃ£o generalizar e adicionar recursos.

Regra: "1 prompt" Ã© marketing. O ganho real vem de spec + fatias + verificaÃ§Ã£o.
---
name: claude-code-mods
description: "Escreve Mods do Claude Code: plugins JS/TS com hooks que observam, reescrevem ou respondem eventos da sessão (guardrails, painéis, troca de modelo). Use ao criar plugins/hooks do Claude Code ou intervenções em runtime. Triggers PT: mods do claude code, plugin claude code, hooks, blast radius. Triggers EN: claude code mods, plugin hooks, replay theater, tool guard."
metadata:
  origin: ECC
---

# Claude Code Mods — Plugins com Hooks

> Fonte: Maestros da IA `@maestrosdaia/IXuLJdR_zgk` ("Claude Code Just Released MODS: Master Them in 10 Minutes", 2026-10-10).

## Quando usar

- Criar um Mod (plugin) do Claude Code: Skill é doc markdown; Mod é código.
- Intervenção em runtime: bloquear comando perigoso, painel de contexto, troca de modelo no meio da sessão.
- UI própria dentro do terminal/sessão, com lógica determinística fora do modelo.

## Estrutura

- Pasta do mod = manifest + `hooks.json` + código que exporta `registrar`.
- Roda dentro do processo do Claude Code (não é subprocesso).
- Cada hook pode responder de 3 formas por evento:
  1. **Observar** — só lê/loga, segue o fluxo.
  2. **Reescrever** — devolve cópia modificada do evento.
  3. **Responder** — resolve o evento; o comportamento normal é pulado.

## Instalação e validação

- Sem instalar: clone + `--plugin-dir`.
- Terceiros: `/plug install` + `/reload-plugins`.
- `code-plugin-validate`: lista eventos e chamadas esperadas sem executar — rode antes de ligar.
- Mod vale só na sessão (pasta temporária); auto-reload por turno.
- UI: terminal + desktop (VS Code extension e cloud; cloud exige >= 2.1.287).

## Ideias de mods (exemplos do vídeo + próprias)

- **Tool guard determinístico** — nega com motivo sem passar pelo modelo (0 tokens).
- **Blast radius** — segura `rm -rf` / force push com approve/cancel.
- **Painel de contexto** — tokens usados + % da janela em tempo real.
- **Trocador de modelo mid-session** — read/summarize em modelo barato no meio da sessão.
- **Replay theater** — `/replay` reconstrói a sessão para debug/ensino.

## Prompt de colheita (aprende com o histórico)

"Read my last 20 sessions, find what I repeat or self-correct and propose 4 mods to automatize it."

## Custos

- Cache: leitura a 10% do input; TTL default 5 min (1h custa mais p/ escrever — só quando vale).
- Guard determinístico economiza mais que prompt: nega antes de chegar ao modelo.

## Segurança

- Mods têm as mesmas permissões da sessão — revise hooks que tocam arquivos/rede.
- `code-plugin-validate` primeiro; habilite por sessão, não global, enquanto testa.

## Related skills

- `hookify-rules` — regras declarativas de hooks (complementa o mod em código).
- `plankton-code-quality` — enforcement de qualidade em cada edição.
- `delivery-gate` — gate de qualidade no fim da entrega.

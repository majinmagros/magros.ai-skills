---
name: software-factory-orchestrator
description: Run a 24/7 AI software factory on a VPS with Archon YAML workflows - GitHub issue in, validated merged PR out. Triage, implement, holdout validate, auto-merge or escalate. Hostinger KVM2 reference, provider MCP, model routing per node. Use quando operar factory autonoma, deploy remoto 24/7, ou pipeline issue-to-PR com Archon.
---

# Software Factory Orchestrator

Issue entra, PR validado e mergeado sai (padrao ColeMedin dark-factory + Archon https://github.com/coleam00/Archon, experimento publico em https://github.com/coleam00/dark-factory-experiment). Motor: workflows YAML do Archon (`.archon/workflows/`: triage, fix-github-issue, validate-pr); orquestrador cron; coding agent (Claude Code/Codex) executa os nos.

## Quando usar

Quando precisa operar (nao so construir) uma factory: VPS 24/7 aceitando GitHub issues, com triagem, implementacao, validacao independente e merge automatico ou escalacao humana. NAO use para one-shot de codigo - isso e `orch-build-mvp`; NAO use para VPS generico sem factory - isso e `vps-guided-install`.

## Passos

1. **Interview (fixe o escopo)** - provider VPS (default Hostinger; qualquer Ubuntu serve), repo novo (PRD) vs existente, coding agent (Claude Code/Codex, testados), app funcional vs so PRD. O agente de setup pergunta e escreve os arquivos de contexto da factory.
2. **Provisione a VPS** - referencia KVM2 (suficiente); SSH + firewall. Crie a instancia VOCE (o plugin nao tem esse poder - de proposito).
3. **Plugins + auth manual** - instale o plugin do provider no coding agent, autentique; GitHub via device-code; Codex com `device-auth` habilitado no dashboard ChatGPT. Credenciais NUNCA vao para o agente - esses 2 logins sao manuais.
4. **Instale a factory** - Archon + workflows (`.archon/workflows/`), repo-alvo clonado, coding agent live na VPS. Escreva `MISSION.md` + `FACTORY_RULES.md`: o que a factory aceita/rejeita e por que.
5. **Teste end-to-end** - crie UMA issue simples (ou PRD fatiado em issues), acompanhe: triage classifica e prioriza (`archon ready`?) -> implementa -> PR draft -> `validate-pr` holdout (checks + review paralela: comportamento, code review, erros, seguranca) -> merge automatico OU escalacao humana. DNS via plugin se o dominio estiver no provider.
6. **Opere 24/7** - orquestrador cron despacha (ex. a cada 30min, paralelo limitado); cada ciclo: triage em lote -> implementacao por issue -> validacao independente com contexto fresco (segunda passada nao pode ser o mesmo contexto da primeira) -> merge ou fix-and-retry.
7. **Roteie modelo por no** - reasoning em modelo forte, extracao barata em modelo leve (ex. sonnet/haiku); provider trocavel sem mudar o design. Factory cara e factory morta.

## Regras

- EARLY ALPHA: nao prometa 100% de confiabilidade para qualquer codigo - experimente e refine (e o que o proprio autor diz).
- Triage REJEITA o que foge da missao; validate-pr e HOLDOUT (contexto independente) - validador que viu o build nao valida.
- Merge automatico SO com gate verde completo; duvida = escala para humano.
- Issues sao a UNICA entrada; PR mergeado e a UNICA saida. Nada fora desse contrato.
- Token efficiency e feature, nao otimizacao tardia: meça por workflow desde o dia 1.

## Related skills

- `autonomous-agent-harness` - loop autonomo generico com memoria e schedules.
- `agentic-os` - agentes persistentes multi-sessao.
- `vps-guided-install` - VPS bare-metal sem factory em cima.
- `fusion-harness` - multi-modelo como architect + builders.
- `eval-harness` - rigor do gate de validacao.

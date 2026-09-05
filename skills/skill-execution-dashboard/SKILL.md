---
name: skill-execution-dashboard
description: "Track skill and agent usage in real time with the execution dashboard. Use when need visibility into multi-agent orchestration, skill usage stats, or execution logs. Triggers on \"execution dashboard\", \"skill usage\", \"agent monitoring\", \"orchestration visibility\", \"dashboard tracker\""
---

# Skill: skill-execution-dashboard

Rastrear e monitorar o uso de skills e agentes em tempo real para orquestração visual.

## Quando usar

- Precisa ver quais skills/agentes rodaram e com que frequência
- Quer visibilidade da orquestração multi-agente em tempo real
- Vai auditar logs de execução do repositório
- Precisa consolidar uso em `docs/EXECUTION-DASHBOARD.md`

## Quando NÃO usar

- Para criar skill nova (use `criar-skill` / `skill-creator-methodology`)
- Para mapear skills disponíveis (use `skill-map`)
- Para auditar qualidade de skills (use `auditar-skills`)

## Funcionamento

1. Este dashboard lê logs de execução do repositório.
2. Consolida o uso de skills em `docs/EXECUTION-DASHBOARD.md`.
3. Oferece visibilidade sobre a orquestração multi-agente.

## Exemplo

```
node scripts/dashboard_tracker.js --since 7d
# → atualiza docs/EXECUTION-DASHBOARD.md com uso por skill/agente
```

## Implementação (planejada — arquivos ainda não existem no repo)

- **Script de Rastreio** (a criar): `scripts/dashboard_tracker.js`
- **Dashboard** (a criar): `docs/EXECUTION-DASHBOARD.md`

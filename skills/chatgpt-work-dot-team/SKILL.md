---
name: chatgpt-work-dot-team
description: "Estrutura o ChatGPT Work + Dot como equipe de entregas de negócio: Work (research, reports, sites), Codex (software) e Dot (assistente contínua) + agentes com persona e escopo. Use ao montar um time de marketing/ops multi-agente dentro do ChatGPT Work. Triggers PT: chatgpt work, dot, equipe de agentes de marketing, agents.md. Triggers EN: chatgpt work, dot agents, ai marketing team, agents.md."
metadata:
  origin: ECC
---

# ChatGPT Work + Dot — Equipe de Entregas de Negócio

> Fonte: Grace Leung `@graceleungyl/BzS93V2zFTg` ("ChatGPT Work + Dot: Build your AI Marketing Team (Agents + Skills)", 2026-10-04). Para skills vs agentes, ver `squad-builder` — não repita o desenho lá.

## Quando usar

- Montar um time de marketing/ops multi-agente dentro do ChatGPT Work (plano Pro, app desktop).
- Entregável de negócio (research, análise, report, apresentação, planilha, site) — isso é o Work.
- Quer uma assistente contínua (Dot) coordenando agentes por Slack, email e chamada.

## O que é cada peça

- **Work** → entregáveis de negócio: research, análise, reports, apresentações, planilhas, sites.
- **Codex** → software.
- **Dot** → assistente nomeada com responsabilidade contínua e computador próprio; usa Work, Codex e tools; coordena a equipe. Só no plano Pro, via app desktop com sidebar.

## Montar a equipe

- Time de referência: team lead + growth strategist, content creator, creative designer, website designer, analyst; Dot (executiva) acima.
- Setup: pasta de projeto local com o contexto do negócio + `agents.md` (manual de onboarding: como trabalhar, o que importa).
- Criar agente = persona + foco/escopo + papel. Cada agente em pasta própria ("Doc Codex").
- Skills são criadas dentro do Work (pasta `.agent`, painel), não fora.
- Marque o agente no projeto; ele puxa sozinho as skills relevantes.
- Registre a routing guidance: quando delegar a um especialista vs executar skill direto.

## Rotina operacional (exemplo do vídeo)

1. Pedido chega no Slack → Dot/executiva interpreta e invoca os agentes certos.
2. Agentes entregam em paralelo: review de PDF, zip com brief, agenda, pastas por post (calendário Notion via skills).
3. Dot atende por Slack, email e chamada; aba de subagents mostra o trabalho em andamento.
4. Campanha lead magnet sai multi-agente: guia PDF + landing page + formulário embedded + ChatGPT sites com DB embutido.

## Regras

- Agente = responsabilidade contínua com julgamento; tarefa repetível vira skill (ver `squad-builder`).
- `agents.md` é obrigatório: sem ele o time perde contexto e vira genérico.
- Toda delegação tem dono nomeado (persona), não "o time".
- Entregável de negócio no Work; código no Codex — não misture.

## Related skills

- `squad-builder` — desenho do squad com gates (skills vs agentes).
- `team-agent-orchestration` — work items, ownership e gates de merge.
- `agentic-os` — sistema operacional de agentes (camadas além do ChatGPT).
- `autonomous-agent-harness` — automação contínua multi-agente.

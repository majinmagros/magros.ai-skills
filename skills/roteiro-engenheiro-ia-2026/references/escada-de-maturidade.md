# Escada de maturidade — em que ordem praticar

Fonte: Maestros `Go5V8n021sw` (out/2026). As 7 fases dizem **o quê** estudar; esta
escada diz **em que sequência** praticar. A ordem importa mais que a ferramenta.

| # | Degrau | Sinal de que chegou a hora | Erro comum |
|---|---|---|---|
| 1 | **Skills** | existe tarefa que você repete e explica toda vez | escrever skill gigante antes de rodar uma vez |
| 2 | **Agentes** | 5–10 skills já funcionam sozinhas | criar 20 agentes e usar 2 |
| 3 | **Tarefas agendadas** | o agente já entrega bem quando chamado | agendar antes de a qualidade estabilizar |
| 4 | **Loops e grafos** | uma tarefa precisa de verificação independente ou dezenas de candidatos | loop sem critério de parada |
| 5 | **Calibração de custo** | o resultado ficou bom e caro | cortar token antes de ter qualidade |
| 6 | **Orquestração** | vários agentes bons que não conversam | orquestrar agente ruim (multiplica o problema) |
| 7 | **Sistemas, não ferramentas** | você quer rodar em qualquer harness | casar a arquitetura com um produto só |

## O que cada degrau resolve

1. **Skills** — conhecimento vira arquivo executável. Primeiro degrau porque o retorno
   aparece no mesmo dia e é o que ensina a escrever instrução que o modelo obedece.
2. **Agentes** — contexto + base de conhecimento + skills + memória do erro. É a noção de
   "IA como funcionário": escopo, instruções e aprendizado acumulado.
3. **Agendamento** — o agente passa a trabalhar sem ser chamado (diário, horário fixo, 24/7).
4. **Loops e grafos** — subagentes que verificam, dezenas em paralelo, convergindo para um
   resultado. É o degrau que transforma agente útil em performance muito acima da média.
5. **Custo** — só depois de o resultado estar bom: roteamento de modelo, cache, menos etapa,
   scripts determinísticos no lugar de raciocínio.
6. **Orquestração** — agente maestro delega a especialistas (designer, dev, segurança,
   e-mail) e mantém o contexto. Também vale agentes que abrem sessões uns para os outros
   via tmux.
7. **Model-agnostic** — a mesma arquitetura roda em Claude Code, Codex, Hermes ou
   Antigravity; o que se estuda é engenharia de IA, não um botão de fornecedor.

## Teste A/B do agente (antes de confiar nele)

Rode o mesmo prompt em duas condições:

- **A**: sessão limpa, pasta vazia, sem agente, sem harness.
- **B**: sua configuração completa (agente + skills + memória).

Se A e B entregam quase o mesmo, o agente não se paga: enxugar ou remover é ganho, não perda.
O teste é o mesmo do `skill-eval-runner`, aplicado a agentes e a `CLAUDE.md`.

## Regra de prática

Para cada conceito novo, implementar 10–20 vezes (50 se for central) até cobrir as
variações. Teoria sem repetição não vira competência — e o degrau seguinte só se
sustenta quando o anterior já roda sem você olhando.

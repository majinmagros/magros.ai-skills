---
name: goal
description: Use when the user runs /goal to set a durable objective with an acceptance check for a long-running session. Triggers on "meta", "objetivo", "goal", "critério de aceite". Pins the objective, keeps working toward it, and does NOT declare completion until the acceptance criteria actually pass (real test runs, not vibes).
---

# Skill: Goal — objetivo durável com auditoria de conclusão

Fixa um objetivo + critério de aceite para guiar a sessão inteira. Só encerra
após PROVAR o aceite com checros reais.

## 1. Capture o goal (objectivo específico)

Antes de começar, registre em disco (`.opencode/goals.md`, ou use o task list):

| Campo | O que escrever | Por que importa |
|---|---|---|
| **Outcome** | Uma mudança observável | Evita projeto de limpeza infinito |
| **Escopo** | Diretórios/serviços/pacotes restritos | Mantém o raio legível |
| **Constraints** | APIs, schemas, arquivos que NÃO podem mudar | Protege compatibilidade |
| **Proof** | Testes/checks/renderização EXATOS | Dá alvo real ao goal |
| **Stop rule** | Condições que exigem decisão sua | Não vira edição sem controle |

## 2. Trabalhe rumo ao goal

- A cada bloco (~10 model calls) sem progresso aparente, releia o goal e
  reporte o estado/continue — não deixe a sessão derivar.
- Não declare vitória com critério vago: "goals, non-goals, constraints, risks,
  validation criteria must be clear" antes de marcar como done.

## 3. Auditoria de conclusão

- Para fechar o goal, rode as checros/ORÁCULO exato do campo **Proof** (ex.:
  rodar o teste com os 6 checks passando).
- Se o oráculo não passou, NÃO está done — corriga até passar ou REPORTE o bloqueio.
- Ao final, reporte: o que passou, o que mudou no caminho, e o link do proof.

## 4. Salvaguaras

- Um objective mal escrito (sem oráculo) permite "positivamente inexistente".
  Se o goal vier vago, refine com /grilling ou pergunte até ficar mensurável.
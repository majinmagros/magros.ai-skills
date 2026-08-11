---
name: goal
description: Use when the user runs /goal to set a durable objective with an acceptance check for a long-running session. Triggers on "meta", "objetivo", "goal", "critÃ©rio de aceite". Pins the objective, keeps working toward it, and does NOT declare completion until the acceptance criteria actually pass (real test runs, not vibes).
---

# Skill: Goal â€” objetivo durÃ¡vel com auditoria de conclusÃ£o

Fixa um objetivo + critÃ©rio de aceite para guiar a sessÃ£o inteira. SÃ³ encerra
apÃ³s PROVAR o aceite com checros reais.

## 1. Capture o goal (objectivo especÃ­fico)

Antes de comeÃ§ar, registre em disco (`.opencode/goals.md`, ou use o task list):

| Campo | O que escrever | Por que importa |
|---|---|---|
| **Outcome** | Uma mudanÃ§a observÃ¡vel | Evita projeto de limpeza infinito |
| **Escopo** | DiretÃ³rios/serviÃ§os/pacotes restritos | MantÃ©m o raio legÃ­vel |
| **Constraints** | APIs, schemas, arquivos que NÃƒO podem mudar | Protege compatibilidade |
| **Proof** | Testes/checks/renderizaÃ§Ã£o EXATOS | DÃ¡ alvo real ao goal |
| **Stop rule** | CondiÃ§Ãµes que exigem decisÃ£o sua | NÃ£o vira ediÃ§Ã£o sem controle |

## 2. Trabalhe rumo ao goal

- A cada bloco (~10 model calls) sem progresso aparente, releia o goal e
  reporte o estado/continue â€” nÃ£o deixe a sessÃ£o derivar.
- NÃ£o declare vitÃ³ria com critÃ©rio vago: "goals, non-goals, constraints, risks,
  validation criteria must be clear" antes de marcar como done.

## 3. Auditoria de conclusÃ£o

- Para fechar o goal, rode as checros/ORÃCULO exato do campo **Proof** (ex.:
  rodar o teste com os 6 checks passando).
- Se o orÃ¡culo nÃ£o passou, NÃƒO estÃ¡ done â€” corriga atÃ© passar ou REPORTE o bloqueio.
- Ao final, reporte: o que passou, o que mudou no caminho, e o link do proof.

## 4. Salvaguaras

- Um objective mal escrito (sem orÃ¡culo) permite "positivamente inexistente".
  Se o goal vier vago, refine com /grilling ou pergunte atÃ© ficar mensurÃ¡vel.
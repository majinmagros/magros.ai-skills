---
name: rlm-recursive-agent
description: Use when implementing Prime Agent / Recursive Language Model (RLM) patterns — self-improving coding agent that beats human baseline on ARC-AGI3 (95.5% MIT), runs in terminal like Claude Code/Codex but with recursive sub-agents and Pluggable LLM backends (Claude, Codex, GLM). Triggers on "RLM", "Prime Agent", "recursive language model", "ARC-AGI", "self-improving agent", "agente recursivo".
metadata:
  origin: ECC
---

# RLM Recursive Agent — Prime Agent

Based on **Prime Intellect Prime Agent** (video `P6X037tssiE` 2026-08-13, ai-code-king): open-source MIT terminal agent built on **RLM (Recursive Language Model)** architecture that scores **95.5% on ARC-AGI 3** (human expert baseline 95.4%).

> Fonte: transcrição `P6X037tssiE.en.dedup.txt` (ai-code-king/RELATORIO.md 2026-08-26) — validado contra repo `prime-intellect/prime-agent` (MIT).

## Quando usar

- Agente que se auto-melhora entre runs (self-improvement) sem mudar modelo base
- ARC-AGI3 / tarefas de raciocínio recursivo onde decomposição plana falha
- Terminal harness que precisa plugar qualquer LLM (Claude, Codex, GLM-4.5, Kimi) via API key ou subscription existente
- Alternativa open-source a Claude Code / Codex para times que querem harness auditável

## Quando NÃO usar

- Tarefa single-file trivial (use `claude -p` direto)
- Já está em `agentic-os` / `gan-style-harness` e não precisa de loop recursivo
- Precisa de execução 100% local sem API (RLM ainda chama LLM externo)

## Arquitetura RLM (vs harness plano)

```
Harness plano:  prompt → LLM → tools → resposta
RLM:            prompt → LLM_root
                          ├─→ sub-problema_1 → LLM_leaf → tools → synthesis
                          ├─→ sub-problema_2 → LLM_leaf → ...
                          └─→ sub-problema_N → ...
                          ↺  root re-avalia síntese, gera nova decomposição (loop até convergência)
```

- **Root** decompõe e orquestra; **leaves** executam sub-tarefas com contexto isolado
- **Síntese recursiva**: folhas retornam solução parcial, root integra e decide se precisa recursar
- **Self-improvement**: traces de falha/sucesso viram prompt para próxima iteração (sem fine-tuning)

## Uso

### Instalação (MIT)

```bash
git clone https://github.com/prime-intellect/prime-agent
cd prime-agent && npm i  # ou cargo install se Rust
export ANTHROPIC_API_KEY=... # ou OPENAI_API_KEY / ZAI_API_KEY para GLM
prime-agent --model claude-sonnet-4 --task "refatore o auth para JWT"
```

### Com modelos plugáveis

```bash
# Via subscription existente (Claude/Codex)
prime-agent --provider claude --model claude-sonnet-4
prime-agent --provider openai --model gpt-4o

# Via API barata (GLM/Kimi)
prime-agent --provider zai --model glm-4.5 --api-key $ZAI_API_KEY
prime-agent --provider moonshot --model kimi-k2
```

### No harness ECC

Combine com `agent-harness-construction`:

```js
// ecc-harness com RLM leaf
import { RLM } from 'rlm-recursive-agent';
await RLM.run({ task, maxDepth: 3, leafModel: 'glm-4.5', rootModel: 'sonnet' });
```

## Configuração

| Var | Default | Descrição |
|---|---|---|
| `PRIME_PROVIDER` | `claude` | `claude`/`openai`/`zai`/`moonshot` |
| `PRIME_MODEL` | `claude-sonnet-4` | Modelo leaf |
| `PRIME_ROOT_MODEL` | igual leaf | Modelo root (pode ser mais forte) |
| `PRIME_MAX_DEPTH` | `3` | Profundidade recursiva |
| `PRIME_MAX_ITERS` | `5` | Iterações self-improvement |

## Relação com skills existentes

- `agentic-os` / `continuous-agent-loop` → loop plano; **RLM é recursivo**
- `gan-style-harness` → generator-evaluator adversarial; **RLM é decomposição recursiva + síntese**
- `agent-architecture-audit` → audita harness; use antes de migrar para RLM
- `cost-aware-llm-pipeline` → RLM leaf pode ser barato (GLM) + root caro (Opus) para economizar

## Validação

- Repo: https://github.com/prime-intellect/prime-agent (checar `LICENSE` MIT + `ARC-AGI3 95.5%` no README)
- Benchmark: ARC-AGI 3 public leaderboard
- Preço: use provider que já paga ($0 extra se via subscription)

## Erros comuns

- **Recursar demais** → limite `MAX_DEPTH=3`; mais que isso vira latência sem ganho
- **Misturar root/leaf mesmo modelo barato** → root deve ser forte (Sonnet/Opus), leaf pode ser barato (GLM Flash)
- **Esperar fine-tuning** → RLM melhora via prompt/trace, não peso

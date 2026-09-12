---
name: model-reflection-tuning
description: "Use when pipeline reflection-tuning (auto-crítica 2 estágios) com validação reproduzível via HashHop. Gera datasets CoT→crítica→correção, treina modelos abertos, detecta benchmarks não reproduzíveis (ex.: Reflection 70B). Triggers on \"model-reflection-tuning\", \"model reflection tuning\", \"tuning\"."
metadata:
  origin: ECC
  module: workflow-quality
  tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

# Model Reflection-Tuning Skill

Pipeline completo para aplicar **reflection-tuning** (fine-tuning com auto-crítica em 2 estágios) em modelos abertos, com validação reproduzível via **HashHop** e detecção de benchmarks fraudulentos.

## Quando Ativar

- Fine-tuning de modelos abertos (Llama, Qwen, Mistral) com reflection-tuning
- Gerar datasets sintéticos: CoT → auto-crítica → correção (reward shaping)
- Validar resultados via HashHop (não confiar em benchmarks do autor)
- Detectar weights/benchmarks não reproduzíveis (caso Reflection 70B)
- Auditorar claims de performance de modelos "reflection-tuned"

## Pipeline (4 Estágios)

```
┌─────────────────┐   ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│ 1. Dataset Gen  │→  │ 2. Reflection    │→  │ 3. Training      │→  │ 4. Validation    │
│    (CoT +       │   │    Tuning        │   │    (LoRA/Full)   │   │    (HashHop +    │
│     critique)   │   │    Trainer       │   │                  │   │     Reproducer)  │
└─────────────────┘   └──────────────────┘   └──────────────────┘   └──────────────────┘
```

### Estágio 1: Dataset Generation (`reflection_dataset_gen.py`)

Gera tarefas → modelo propõe+resolve → reward shaping (learnability + accuracy).

**Entradas:**
- `base_model`: modelo base (ex.: `meta-llama/Llama-3.1-8B-Instruct`)
- `task_specs`: lista de especificações de tarefas (JSON/YAML)
- `num_samples`: amostras por tarefa
- `critique_model`: modelo para auto-crítica (pode ser o próprio base_model)

**Saída:** `dataset/reflection_dataset.jsonl` com campos:
```json
{
  "task_id": "math_001",
  "prompt": "Solve: 2x + 5 = 15",
  "cot": "Step 1: Subtract 5... Step 2: Divide by 2... Answer: x=5",
  "critique": "The solution is correct but step 2 could show division explicitly",
  "corrected_cot": "Step 1: Subtract 5 from both sides... Step 2: Divide both sides by 2... Answer: x=5",
  "reward_learnability": 0.85,
  "reward_accuracy": 1.0
}
```

**Reward Shaping:**
- `learnability`: quão fácil o modelo aprende com a correção (0-1)
- `accuracy`: correção factual da resposta final (0-1)
- Combined: `0.6 * accuracy + 0.4 * learnability`

### Estágio 2: Reflection Tuning Trainer (`reflection_trainer.py`)

Treina com loss combinada: `L = L_ce + λ * L_reflection`

**Configuração:**
- `base_model`: HF model ID ou path local
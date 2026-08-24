---
name: model-reflection-tuning
description: Pipeline reflection-tuning (auto-crítica 2 estágios) com validação reproduzível via HashHop. Gera datasets CoT→crítica→correção, treina modelos abertos, detecta benchmarks não reproduzíveis (ex.: Reflection 70B).
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
- `dataset_path`: saída do Estágio 1
- `lora_r`, `lora_alpha`, `lora_dropout`: LoRA config
- `reflection_weight`: λ para loss de reflexão (default: 0.3)
- `learning_rate`, `num_epochs`, `batch_size`

**Outputs:**
- `checkpoints/` — adapters LoRA
- `merged_model/` — modelo mergeado (opcional)
- `training_logs.jsonl` — métricas por step

### Estágio 3: HashHop Validation (`hashhop_validator.py`)

Validação reproduzível — **não confiar em benchmarks do autor**.

**HashHop Protocol:**
1. Gera `N` hash challenges (SHA256 de prompts fixos)
2. Modelo resolve cada challenge
3. Verifica se output contém hash esperado
4. Métrica: `% de challenges resolvidos corretamente`

**Uso:**
```bash
python scripts/hashhop_validator.py \
  --model-path ./merged_model \
  --num-challenges 100 \
  --output results/hashhop_report.json
```

**Critério de aceite:** ≥ 85% pass rate em 100 challenges

### Estágio 4: Benchmark Reproducer (`benchmark_reproducer.py`)

Detecta benchmarks não reproduzíveis / weights questionados.

**Checks:**
1. **Weight verification**: Baixa weights do HF, compara hash com claim do autor
2. **Benchmark replication**: Roda benchmarks oficiais (MMLU, GSM8K, HumanEval) com mesmo prompt template
3. **Contamination check**: Verifica overlap treino/teste via n-gram matching
4. **Prompt sensitivity**: Varia templates, mede variância de score

**Saída:** `reports/benchmark_audit.json`
```json
{
  "model": "mattshumer/Reflection-70B-draft2",
  "claimed_mmlu": 0.89,
  "reproduced_mmlu": 0.72,
  "delta": -0.17,
  "weight_hash_match": false,
  "contamination_score": 0.34,
  "verdict": "UNREPRODUCIBLE",
  "evidence": [...]
}
```

## Referências Oficiais (Conferidas)

- Reflection 70B HF: https://huggingface.co/mattshumer/Reflection-70B-draft2
- OpenRouter Reflection: https://openrouter.ai/mattshumer/reflection-70b
- VentureBeat controversy: https://venturebeat.com/business/reflection-70b-model-maker-breaks-silence-amid-fraud-accusations
- HashHop benchmark: https://huggingface.co/blog/codelion/reverse-engineering-magic-hashhop

## Integração com Outras Skills

- `eval-harness` — define capability/regression evals para o modelo treinado
- `score-loop` — itera reflection-tuning até nota mínima (ex.: 85/100 HashHop)
- `graph-engineering` — paraleliza geração de dataset e validação
- `agent-architecture-audit` — audita o pipeline treinado em produção
- `anti-hallucination` — verifica claims de performance contra fontes oficiais

## Exemplo de Uso Completo

```bash
# 1. Gerar dataset
python skills/model-reflection-tuning/scripts/reflection_dataset_gen.py \
  --base-model meta-llama/Llama-3.1-8B-Instruct \
  --task-specs configs/math_tasks.yaml \
  --num-samples 50 \
  --output dataset/math_reflection.jsonl

# 2. Treinar
python skills/model-reflection-tuning/scripts/reflection_trainer.py \
  --base-model meta-llama/Llama-3.1-8B-Instruct \
  --dataset dataset/math_reflection.jsonl \
  --lora-r 32 --lora-alpha 64 \
  --output-dir checkpoints/llama31-8b-reflection

# 3. Validar (HashHop)
python skills/model-reflection-tuning/scripts/hashhop_validator.py \
  --model-path checkpoints/llama31-8b-reflection/merged_model \
  --num-challenges 200

# 4. Auditar benchmarks externos
python skills/model-reflection-tuning/scripts/benchmark_reproducer.py \
  --model-id mattshumer/Reflection-70B-draft2 \
  --benchmarks mmlu,gsm8k,humaneval
```

## Anti-Padrões (O que NÃO Fazer)

1. ❌ Confiar em benchmarks auto-reportados sem reprodução independente
2. ❌ Usar weights de HF sem verificar hash/sha256
3. ❌ Treinar só com CoT — precisa do loop crítica→correção
4. ❌ Ignorar contamination check (treino vazando para teste)
5. ❌ Pular HashHop — é a única validação reproduzível conhecida

## Troubleshooting

| Sintoma | Causa Provável | Fix |
|---|---|---|
| HashHop < 70% | Dataset com ruído / reward mal calibrado | Aumentar `learnability` weight, filtrar samples baixo reward |
| Treino diverge | LR alto / reflection_weight alto | Reduzir LR para 1e-5, λ para 0.1 |
| Benchmark delta > 0.1 | Contaminação ou weights errados | Rodar `benchmark_reproducer.py` com `--deep-check` |
| OOM em treino | Batch size / model size | Usar LoRA r=16, gradient accumulation, 4-bit quantization |

## Limitações Conhecidas

- Requer GPU com ≥ 24GB VRAM para 7B+ models (ou 4-bit + CPU offload)
- HashHop testa raciocínio sintético — não garante performance em tarefas reais
- Reflection-tuning pode degradar performance em tarefas não-vistas (negative transfer)
- Não substitui RLHF/RLAIF completo — é etapa intermediária de baixo custo
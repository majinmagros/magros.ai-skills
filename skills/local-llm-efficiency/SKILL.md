---
name: local-llm-efficiency
description: "Run huge models locally via quantization (GGUF/GPTQ/AWQ). Use when 740B in 25GB (Colibri) or need 1000x cheaper local inference with llama.cpp/Ollama. Triggers on \"Colibri\", \"quantizacao\", \"GGUF\", \"local llm\", \"ollama\", \"vLLM local\""
---

# Local LLM Efficiency — Colibri 740B@25GB

> Fonte: `Maestros da IA — 1p0HXLv_5wM` (PANIC, Colibri), transcript `1p0HXLv_5wM.pt.dedup.txt:40-120`

Cloud pay-to-play vs local 1000x cheaper, lento/experimental mas movimento open-source.

## Quando usar

- Rodar modelo gigante em consumer hardware (25-32GB RAM)
- Custo cloud inviável, precisa offline/grátis
- Validar claim 740B@25GB antes de comprar hardware

## Técnicas

| Método | Ferramenta | Trade-off |
|---|---|---|
| GGUF | llama.cpp, Ollama, LM Studio | CPU, lento, 100% offline |
| GPTQ/AWQ/EXL2 | AutoGPTQ, vLLM | GPU, mais rápido |
| Speculative decoding | vLLM | + velocidade |

## Workflow

1. Escolha modelo + quant (ex: `Q4_K_M` → 25GB)
2. `ollama run <model>:q4` ou `llama.cpp --model model.gguf`
3. Benchmark: tokens/s, RAM, qualidade vs cloud (use `agent-eval`)
4. Decida: cloud (veloz) vs local (barato) — veja `local-ai-hardware` para TCO

## Checklist

- [ ] Modelo + quant validados
- [ ] Benchmark local vs cloud
- [ ] Fonte primária Colibri verificada (anti-hallucination)

## Referências

- `references/quantization-matrix.md` — GGUF vs GPTQ vs AWQ

---
name: local-llm-efficiency
description: "Run huge models locally via quantization (GGUF/GPTQ/AWQ) — decide if a model fits your VRAM/RAM/SSD, pick the quant, budget the context, and avoid the high-reasoning loop. Use when 740B in 25GB (Colibri), Strata/offload, or need 1000x cheaper local inference with llama.cpp/Ollama. Triggers on \"Colibri\", \"quantizacao\", \"GGUF\", \"local llm\", \"ollama\", \"vLLM local\", \"cabe na minha maquina\", \"VRAM\", \"reasoning loop\""
metadata:
  origin: ECC
---

# Local LLM Efficiency

Rodar modelo grande em hardware de consumidor. Duas frentes: **compressão** (quantização, o caso Colibri 740B@25GB) e **offload** (usar VRAM + RAM + SSD como um pool, o caso Strata).

> Fontes: `Maestros da IA — 1p0HXLv_5wM` (Colibri 740B@25GB) e `Willian IA — VefUJLzxQWg` (Strata 0.2.8, Qwen3.8-FlashNext / DeepSeek V4.1 Flash local).

## Quando usar

- Decidir **se** um modelo cabe na máquina antes de baixar 70–100 GB.
- Escolher o quant certo (Q4_K_M vs IQ2XS vs Q2) para o hardware disponível.
- Rodar modelo gigante em consumer hardware (25–32 GB RAM).
- Custo cloud inviável, precisa offline/privacidade.
- Modelo local travando, lento ou "pensando" por horas sem produzir.

## Quando NÃO usar

- Escolher **qual comprar/montar** (use `local-ai-hardware` para TCO e piso de hardware).
- Servir modelo em produção multi-usuário (vLLM/TGI, não este fluxo).
- Comparar qualidade entre modelos (use `agent-eval`).

## 1. Cabe na minha máquina?

Três recursos, nesta ordem de velocidade: **VRAM > RAM > SSD**. O modelo pode viver parcialmente em cada um; cada nível abaixo custa velocidade.

| Recurso | Papel | Regra prática |
|---|---|---|
| VRAM | camadas quentes, atenção, KV cache | quanto mais, melhor; 12 GB é o piso confortável para agente local |
| RAM | camadas frias + offload | 32 GB para modelo de 100B+ quantizado |
| SSD | peso morto do modelo, mmap | 80 GB livres para um modelo de ~70 GB baixado |

**Piso realista para agente local (Strata 0.2.8):** RTX série 20–50, **12 GB VRAM**, **32 GB RAM**, **80 GB SSD livre** (NVMe). Há relatos de 8 GB VRAM rodando, com queda grande de velocidade.

Orçamento de disco: download **~68 GB** → instalado **~107 GB**. Reserve o dobro do download.

## 2. Escolher o quant

| Quant | Quando | Trade-off |
|---|---|---|
| `Q4_K_M` / `Q5_K_M` | padrão GGUF, melhor equilíbrio | referência de qualidade |
| `Q2` / `IQ2XS` / `Swift` | não cabe de outro jeito | perda visível em raciocínio e código |
| `Q8` / FP16 | cabe inteiro na VRAM | sem perda relevante, 2–4x o tamanho |
| GPTQ / AWQ / EXL2 | GPU dedicada, quer velocidade | exige calibração, menos portátil |
| Giro / formatos do app | quando o app (ex.: Strata) recomenda | específico da ferramenta |

Regra: **desça o quant antes de descer o modelo**. Um modelo maior em Q2 costuma perder para um menor em Q4 no que você realmente usa.

## 3. Contexto é memória, não é de graça

- Janelas comuns: **32k** (rápido) → **64k** → **128k** (meio-termo) → até **500k** em implementações com offload.
- KV cache cresce com contexto × camadas. 128k em modelo grande pode custar mais VRAM que os pesos.
- Implementações com offload fazem **sumarização automática** ao chegar perto do limite — o modelo "esquece" o começo da tarefa sem avisar. Em tarefa longa, resuma você mesmo nos pontos de decisão.
- Prefira contexto menor + retrieval (`graphify`, `codebase-mapa-indexado`) a 500k de uma vez.

## 4. A armadilha do reasoning alto

**Sintoma:** modelo local com esforço de raciocínio alto em tarefa grande pensa por horas, entra em loop e **não gera saída**.

**Causa:** o orçamento de "pensar" consome o contexto e o tempo sem produzir token útil; em hardware lento, o loop não termina dentro da janela.

**Correção:**

- Projeto/tarefa grande → reasoning **baixo ou desligado**.
- Tarefa pontual e difícil (um bug, uma decisão) → reasoning alto, com limite de tempo.
- Se travou: mate o processo, reduza o esforço, divida a tarefa. Não espere "terminar".
- Em loop de agente, defina **orçamento de tokens e de tempo por passo** — sem isso, o modo alto vira negação de serviço contra você mesmo.

## 5. Velocidade esperada (medido, não estimado)

Números de referência em RTX 5060 Ti 16 GB com Strata e modelo grande quantizado:

| Tarefa | Tempo | Contexto | Throughput |
|---|---|---|---|
| rascunho de jogo | 67 min | 97k tokens | 33 tok/s |
| integração ComfyUI via MCP | 77 min | 74k | 35 tok/s |
| site simples | ~40 min | — | — |

Leitura: **~35 tok/s** é o teto prático desse tier. Um agente que gera 20k tokens leva ~10 min. Planeje a tarefa nessa régua, não na régua do cloud.

## 6. Workflow

1. Meça o hardware: VRAM, RAM, SSD livre (`nvidia-smi`, `Get-CimInstance Win32_ComputerSystem`).
2. Escolha o modelo pelo **caso de uso**, não pelo leaderboard.
3. Calcule o tamanho: parâmetros × bits/8 + overhead (~10–20%) + KV cache do contexto alvo.
4. Escolha o quant que cabe com folga; se não couber, desça o quant.
5. Rode um benchmark curto: tokens/s, RAM pico, qualidade numa tarefa real sua.
6. Compare com o cloud no **custo por tarefa concluída**, não por token.
7. Deixe reasoning baixo/off no perfil padrão; alto só sob demanda.

## 7. Configuração do app (quando existir)

- **Uso de CPU/GPU**: 80% deixa 20% para o sistema e evita travamento de UI; 100% só em máquina dedicada.
- **Leitura de imagens**: consome memória; desligue se a tarefa é só texto.
- **Contexto**: comece em 32k; suba só quando a tarefa exigir.
- **Modelo**: deixe o app recomendar o quant para a máquina na primeira execução e não suba depois sem medir.

## Checklist

- [ ] VRAM, RAM e SSD livres medidos antes do download
- [ ] Tamanho do modelo calculado (pesos + overhead + KV cache)
- [ ] Quant escolhido pelo ajuste, não pelo hype
- [ ] Benchmark local: tok/s, RAM pico, qualidade em tarefa real
- [ ] Reasoning alto desligado no perfil padrão
- [ ] Orçamento de tokens/tempo por passo definido no loop
- [ ] Custo comparado por tarefa concluída vs cloud
- [ ] Fonte primária verificada (anti-hallucination)

## Tese independência (Batch 17a, #50 #53)

Nuvem = aluguel do modelo + entrega do seu IP (pay-twice); governo ou vendor pode cortar seu acesso (caso Fable/export-ban). Local open source = privacidade total, custo de eletricidade, controle e offline. Direção: velocidade, custo e memória — quando o local ficar bom o bastante, a vantagem da nuvem vira só conveniência.

## Exemplo

```text
Caso A — "740B em 25GB" (Colibri)
  Q4_K_M via Ollama/llama.cpp em 32 GB RAM → lento, 1000x mais barato
  Vale para lote offline, não para interativo.

Caso B — agente local em RTX 5060 Ti 16 GB (Strata)
  modelo ~100B em quant agressivo, contexto 64k, reasoning low
  medido: 35 tok/s → tarefa de 20k tokens ≈ 10 min
  reasoning high na mesma tarefa = loop de horas sem output → não usar
```

## Referências

- `Maestros da IA — 1p0HXLv_5wM` (Colibri 740B@25GB), transcript `1p0HXLv_5wM.pt.dedup.txt:40-120`
- `Willian IA — VefUJLzxQWg` (Strata 0.2.8, tiers de memória, reasoning loop)

## Skills relacionadas

- `local-ai-hardware` — comprar/montar, TCO, piso de hardware
- `roteamento-modelos-baratos` — quando o local não compensa e vale rotear barato
- `roteamento-modelos-gratuitos` — tiers gratuitos de provider
- `agent-cost-optimization-batch` — batch e alocação por custo
- `context-budget` — orçamento de contexto no agente

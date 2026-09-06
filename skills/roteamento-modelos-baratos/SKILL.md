---
name: roteamento-modelos-baratos
description: Use when choosing cheap models and routing them in agent loops — OpenRouter as provider in Claude Code, cost-per-task budgeting, using a low-cost model as executor while a strong model verifies, and when cheap+verifier loops become viable. Triggers on "rotear modelo barato", "OpenRouter no Claude Code", "custo por tarefa", "modelo barato pra loop", "DeepSeek", "huggingface barato".
metadata:
  origin: ECC
---

# Skill: Roteamento de Modelos Baratos (custo-por-tarefa)

Padrões para usar modelos de baixo custo sem perder qualidade: quem gera em
volume é barato, quem decide/valida é forte. A métrica que importa é
**custo por tarefa concluída**, não preço por token no papel.

## Quando usar

- Loop de geração/verificação que hoje usa modelo caro em todo lugar.
- Escolher provedor/modelo para um job de volume.
- Calcular se um projeto (ex: gerar 100 candidatos) cabe no orçamento.

## Padrões

### 1. Executor barato + verificador forte
- Modelo barato gera candidatos em massa (DeepSeek V4 Flash e similares).
- Modelo forte verifica/rankeia — o custo é por verificação, não por geração.
- Sempre meça nota/qualidade do executor antes de confiar no volume.

### 2. OpenRouter (ou DeepSeek direto) no Claude Code
- Configure OpenRouter como provider (3 env vars: `ANTHROPIC_BASE_URL`,
  `ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_MODEL`) e escolha modelos por custo/task.
- **Caveat oficial do OpenRouter**: o Claude Code "é garantido só com o
  provedor first-party da Anthropic" e "é otimizado para modelos Anthropic e
  pode não funcionar com outros provedores" (tool-use/parsing pode quebrar).
  Teste o loop antes de depender.
- Alternativa sem agregador: a DeepSeek expõe endpoint Anthropic-compatível
  direto (`https://api.deepseek.com/anthropic`) para o Claude Code.
- Para tarefas repetitivas e determinísticas, o barato resolve. Suba de modelo
  só quando o verificador reprovar de forma consistente.

### 3. Custo-por-tarefa como métrica
- Preço/token é enganoso: tarefa fácil = poucos tokens no barato.
- Calcule: `custo = (tokens de entrada × preço entrada) + (tokens de saída × preço saída)` por execução, vezes o número de execuções.
- Compare o total do loop barato vs rodar tudo no caro uma vez.

### 4. Quando barato+verificador vira opção
- DeepSeek V4 Flash: preço vigente (16/08/2026+) tem **peak/off-peak** —
  off-peak ~$0.22/M entrada e ~$0.66/M saída; peak ~$0.44/$1.32; cache-hit de
  entrada bem mais barato (~$0.007–$0.014/M). O "14¢/M entrada" do anúncio era
  o preço até 15/08/2026 — **sempre confira a página oficial de pricing**
  (preços mudam com frequência).
- Regra prática: se o custo atual do job em modelo forte é alto, divida entre
  geração barata + amostragem de verificação forte (20-30% do volume).

## Checklist
- [ ] Métrica definida é custo-por-tarefa, não preço/token.
- [ ] Verificador independente do gerador.
- [ ] Amostragem de verificação existe antes de escalar volume.
- [ ] OpenRouter configurado como provider (ou equivalente).
- [ ] Loop barato validado por nota antes de colocar em produção.

## Cursor Model Routing Nativo (enriquecimento 2026-08-20, video `7phrurXJwH8`)

O **Cursor** tem roteamento de modelos embutido (sem OpenRouter) no plano Pro/Max:

| Modo/Modelo | Característica | Quando usar |
|---|---|---|
| **Auto** | Gerencia custo/qualidade automaticamente | Maioria das tarefas simples/estudo |
| **Composer 2.5** | Modelo próprio do Cursor, barato, bom para implementação | Implementar código, escrever arquivos |
| **Opus / Sonnet / GPT-4.5** | Caros, raciocínio forte | Planejar, arquitetar, debug complexo |
| **High (quase ilimitado)** | Limite "High" do plano Pro (~quase ilimitado/mês) | Uso diário sem medo de quota |
| **API (cobra extra após 100%)** | Modelos selecionados manualmente → consome quota API | Tarefas específicas que precisam de modelo específico |

**Padrão recomendado (do vídeo)**:
```
1. Planejar com caro (Opus/Sonnet) → /plan mode, especificar arquitetura
2. Implementar com barato (Composer 2.5 / Auto) → "implementa o plano"
3. Se travar ou erro complexo → volta pro caro para debug
```

**Limites**: Plano Pro = limite "High" mensal (reset todo mês). API = cobra extra por token após 100% da quota. Monitorar em Settings → Usage.

## Modelos recentes validados (2026-08-23 — Inteligência Mil Grau)

Validados contra docs oficiais (não na voz do vídeo). **Sempre confira a página de pricing oficial antes de orçar — preços mudam com frequência.**

### Qwen 3.8 Max vs Qwen 3.8-27B (Alibaba)

| Modelo | Contexto | Pesos/Licença | VRAM (aprox.) | Preço API (verificar) | Quando usar |
|---|---|---|---|---|---|
| **Qwen 3.8 Max** (2.4T-A95B) | 1M (262K base + YaRN 1M) | Fechado (API: Alibaba Model Studio / OpenRouter `qwen/qwen3.8-max`) | N/A (API) | Ver https://huggingface.co/Qwen/Qwen3.8-27B + https://aireleasetracker.com/model/qwen/qwen3.8-max | Geração imagem+vídeo nativa, tasks long-horizon, `reasoning_effort: xhigh/medium/low` |
| **Qwen 3.8-27B** | 262K → 1M YaRN (64 layers) | Apache 2.0 (14 Aug 2026), https://huggingface.co/Qwen/Qwen3.8-27B | 18GB Ollama / 55.6GB BF16 (18 shards) | Grátis chat (qwen.ai) / OpenRouter `qwen/qwen3.8-27b` | Local com boa GPU, `preserve_thinking` on, verbosidade alta (160M tokens) — use `medium/low` para economizar |

Nota: vídeo mistura scores Max→27B. Oficial separa: Max 58 Intelligence vs 27B 52 (ArtificialAnalysis). Não transfira benchmark do gigante para o pequeno.

Fonte: HF Qwen3.8-27B (Apache 2.0, 14 Aug 2026), ArtificialAnalysis 52/53.8 tok/s.

### GLM 5.3 (Zhipu AI) — só pós-treino do 5.2

- **Base compartilhada**: "Scaling post-training is all we did for GLM-5.3. It uses the same base model as GLM-5.2 — every gain comes from post-training" → https://z.ai/blog/glm-5.3
- **Janela open-weights**: lançamento 2026-08-14 + 2 semanas → ~2026-08-28 em https://github.com/zai-org/GLM-5 (MIT, hoje só 5.2/5.1)
- **Cyber SOTA**: CyberGym 84.5% > Mythos 5 83.8% / GPT-5.6 Sol 83.6%; ExploitBench 54.4% (2× vs 5.2 24.4%); ExploitGym 105/130 tasks
- **Terminal-Bench 3.0**: 4.6→28.3, DeepSWE 46.2→66.9, ALE 23.8→28.5
- **Acesso atual**: só via **GLM Coding Plan + ZCode** (planos $18/$80/$168, -20% vs US $20/$100/$200), `api.z.ai/api/coding/paas/v4`, 1M ctx / 128K out; API aberta "coming soon" — orçe com `custo-por-tarefa` 0.16 vs Sol 0.32 / Opus 0.37 por tarefa do vídeo

Use `roteamento-modelos-baratos` pattern: gere com barato, valide com forte; GLM 5.3 é opção barata para coding/cyber até liberar pesos.

### Grok 4.6 (xAI) — pricing corrigido

- Vídeo diz "$1/M entrada" → **oficial `https://docs.x.ai/developers/models/grok-4.6`**: `$2.00 input / $0.50 cached / $6.00 output (<200k)`, `$4/$1/$12 (≥200k)`; Fast variant 2×; context 500k; `low/medium/high/xhigh`
- **Long-running agents** confirmado: "focus on long-running agents and more ambitious interactive and visual work" → https://x.ai/news/grok-4-6
- **Disponível**: Cursor + Grok Build com **2× uso 1ª semana** (https://cursor.com/blog/grok-4-6)
- **Treino**: longer supplemental run than 4.5, curated synthetic data

### Ox Alpha (stealth na OpenRouter) — warning

- **Free/Free 1M contexto** (1,048,576 in / 131,072 out, 20 Aug 2026) → https://openrouter.ai/stealth/ox-alpha — mas **stealth = provider anônimo, OpenRouter não é developer**, `https://openrouter.ai/terms/stealth` (retenção sem treino). **Não use com dados sensíveis/proprietários** (janela free ~1 semana, depois pode virar pago).
- Benchmark 80% vs Fable 65% citado no vídeo = **DeepSWE community 10-task (anecdotal)**, não oficial OpenRouter; identidade GLM/Mimo não confirmada (forense tokenizer aponta GLM-5.3, sem confirmação).

**Checklist adicional (2026-08-23):**
- [ ] Conferiu pricing oficial hoje (peak/off-peak, cached, long-context cliff)?
- [ ] Se usa stealth free, avaliou risco retenção + janela temporária?
- [ ] Para Qwen local, configurou `reasoning_effort` e `preserve_thinking` para controlar verbosidade/custo?
- [ ] Para GLM 5.3, planejou migração quando pesos MIT saírem (~28/08)?

### Enriquecimento 2026-08-24 — economia de cache, Fusion e família GPT-5.6

Fonte `wCSPgHpcxdc` + docs oficiais validadas:

- **Cached input custa ~10% do input novo** — o fator decisivo em loops não é o
  preço/token do papel, é quantas vezes o histórico é reenviado full-price.
  "Advisor" (modelo forte consultado a cada passo) reenvia tudo caro;
  "orchestrator + executor" com contextos próprios cacheados vence (ver
  `sessoes-orquestradas`, padrão sidekick persistente). Devin Fusion mediu
  **-35% custo** mantendo qualidade frontier (cognition.com/blog/devin-fusion,
  FrontierCode; nº "até 60%" em 07/07/2026; claim vendor benchmark).
- **Família GPT-5.6 (pricing oficial developers.openai.com/api/docs/pricing,
  conferido 24/08/2026):** Sol $4/$20 por MTok ($8/$30 long ctx) · Terra $2/$12 ·
  Luna $0.20/$1.20. Fast mode = ex-Priority processing (renomeado 30/07/2026),
  `service_tier: "fast"`. Sol promocional até pelo menos 21/11/2026.
- **Reportado por review (NÃO verificado em benchmark independente):** Terra High
  pontuaria menos que Luna Max custando 10x mais — se confirmar no seu caso,
  pule o Terra e use Sol p/ difícil + Luna p/ volume. Teste com seu workload
  antes (`agent-eval`); não confie no review.

### Enriquecimento 2026-08-24b — Gemini 3.7 Flash (preço promocional com prazo)

Fonte `zQBUC_8xWkY`; validado em blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-3-7-flash + deepmind.google/models/model-cards/gemini-3-7-flash (conferido 24/08/2026):

- **Intro $0.75 / $3.75 por MTok** (in/out, thinking incluído) — **expira 31/12/2026**; a partir de 01/01/2027 vira $1.50/$7.50. Cache $0.075/M/h.
- Posição no mapa de rotas: entre Luna ($0.20/$1.20) e Terra ($2/$12) — candidato forte a executor de loops agênticos enquanto o promo durar (model card compara direto: Sonnet 5 $2/$10, Terra $2/$12).
- Regra da skill vale em dobro aqui: preço promocional é janela, não piso — anote data de expiração em qualquer decisão de roteamento baseada nele.

### Enriquecimento 2026-09-06 — comparativo BR Cursor/Codex/Claude/OpenCode (Sujeito Programador `66JPboo8WeI`)

Opinião do autor do vídeo (não docs oficiais — preços/limites mudam, confira antes de orçar):

| Ferramenta | Plano citado | Veredito do autor |
|---|---|---|
| **Cursor** | Grátis generoso; pago ~R$90-100, Auto/Composer/Grok barato, high-mode quase-ilimitado | Melhor CxB p/ plano básico; aguenta semana de trabalho |
| **OpenCode** | Open-source, GO R$50, modelos low-cost | Melhor entrada grátis→pago mais barato |
| **Codex** | Plano $20 (~R$100-120), limite generoso | Empatado com Cursor no básico |
| **Claude Code** | Básico R$90-120 | Melhor harness (ferramentas/contexto), mas "chupacabra de token" em uso massivo — uso moderado ou API/plano maior |
| **Copilot / Antigravity** | — | Reprovados pelo autor (harness fraco, erros) |

Pattern: multi-harness sem lock-in (mesmo padrão de desenvolvimento em Cloud+Codex+Cursor).

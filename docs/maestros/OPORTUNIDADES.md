# Oportunidades de Skills — Coleta Semanal (2026-11-11 → 2026-11-15)

## Resumo
- **Canais monitorados:** 24
- **Vídeos na janela:** 29
- **Com filtro positivo (skills/automação):** 17
- **Transcrições baixadas:** 2 (rate limit YouTube bloqueou o restante)
- **Analisados nesta rodada:** 2

---

## 1. Fábrica de Skills via NotebookLM (Joaquín Barberá)
**Vídeo:** `H_1h8m1tXj8` — @maestrosdaia
**Skill criada:** `criar-skill` → referência `references/notebooklm-skill-factory.md`

### Oportunidades extraídas
| Tipo | Descrição | Status |
|------|-----------|--------|
| **Motor Centralizado** | Caderno Gemini Notebook com 5 guias oficiais (Gemini/ChatGPT/Claude) + System Prompt customizado travando formato de saída | ✅ Implementado em `criar-skill` |
| **Fast Research Contextual** | Busca nativa do NotebookLM importa docs do domínio antes de gerar skill | ✅ Documentado |
| **Template 3 Pilares** | Inputs padronizados: Modelo Alvo + Objetivo + Input Data Runtime → Saída completa | ✅ Documentado |
| **Export Multiplataforma** | Conteúdo direto para `skills/<nome>/SKILL.md` ou painel nativo | ✅ Documentado |

### Próximas automações sugeridas
- **Script `notebooklm-skill-factory.mjs`**: Automatizar criação de skills em lote via `notebooklm-py` SDK
- **Pipeline CI**: Validar skills geradas contra `auditar-skills` antes de commit

---

## 2. Fable 5.2 + Mythos 5.2 — Benchmarks e Capacidades (Maestros da IA)
**Vídeo:** `pOrmRItuNvk` — @maestrosdaia
**Transcrição:** `pOrmRItuNvk.pt.dedup.txt`

### Pontos-chave técnicos
| Capacidade | Métrica | Comparativo |
|------------|---------|-------------|
| **Frontier Code** | 49.1% | Opus 5.5: 45.5%, GPT-6 Astra: 42.8% |
| **Frontier SWE** | 69.9% | #1 geral |
| **OS World** (computer use) | 89.3% | |
| **Humanities Last Exam** | 74.2% | 2º lugar: 67.7% |
| **Chartography** (visão) | 73.4% | Era 44.8% |
| **Robo Dojo** (robótica) | 64.9% | Era 27.6% |
| **Formalização Lean** | 1000 agents, 100% em 30h | Opus 5.5: 26% |

### Diferença Fable vs Mythos
- **Fable 5.2**: Trava de segurança (Cyber/Bio), disponível geral
- **Mythos 5.2**: Mesmo modelo, sem travas, só orgs verificadas

### Preço/Eficiência
- Input: $8/M (era $10) | Output: $40/M (era $50)
- 30% mais rápido que 5.1 | Fast Mode 2.5x por $16.80/M
- 1M contexto | 128k output
- **Custo esforço máx**: ~$26.50/task (2.6x Opus 5.5)

### Oportunidades de Skills
| Skill | Descrição | Prioridade |
|-------|-----------|-----------|
| **fable52-benchmark-runner** | Automatiza bateria de benchmarks (Frontier Code/SWE, OS World, Chartography, Robo Dojo) com relatório comparativo | Alta |
| **mythos-access-checker** | Verifica elegibilidade org para Mythos 5.2 + fallback para Fable | Média |
| **computer-use-orchestrator** | Orquestra 1000+ sub-agentes Fable para tarefas massivas (formalização Lean, world-building 3D) | Alta |
| **voice-assistant-hub-generator** | Gera hub de assistente de voz funcional (demo da Anthropic) | Média |
| **cost-effort-calculator** | Calcula custo por task no esforço máx vs Opus 5.5 vs rotina diária | Baixa |
| **security-overrefusal-tracker** | Monitora redução de over-refusal (Cyber -60%, Bio -40%, geral -55%) | Média |

---

## Vídeos Pendentes (Rate Limit YouTube)
Não foi possível baixar transcrições devido a HTTP 429. Reprocessar quando cota resetar:

| ID | Canal | Título | Filtro |
|----|-------|--------|--------|
| 0vNyVMDFdkg | @matthew_berman | Anthropic can't be stopped (Fable 5.2) | ✅ |
| POZrGNzxroc | @airevolutionx_pt | Fable 5.2 atropela Opus 5.5 | ✅ |
| QtXv6vOH1QQ | @airevolutionx_pt | Robôs biônicos China pele artificial | ✅ |
| lfTtQGbh4uo | @inteligenciamilgrau | Gemini 4 Carbon vs Claude/ChatGPT | ✅ |
| 4fpxRkB6jBI | @inteligenciamilgrau | Fable 5.2 + Mythos: Robotics, Physics, Math | ✅ |
| vdYynH177h0 | @claude | Fable 5.2 voice-assistant hub | ✅ |
| FMbXUxn_nBw | @claude | Mythos 5.2 therapy capsid | ✅ |
| 6a1QSJlsYpU | @claude | Introducing Fable 5.2 | ✅ |
| XbcmOrffjmA | @gabrieladamuchi | Fable 5.2 DESTROYED OpenAI | ✅ |

---

## Ações Recomendadas
1. **Aguardar reset de cota YouTube** (ou usar API key própria) para baixar os 9 vídeos pendentes
2. **Implementar `fable52-benchmark-runner`** — maior impacto imediado (validação prática do modelo)
3. **Criar `computer-use-orchestrator`** — alinhado com demo de 1000 agentes / 450 mundos 3D
4. **Atualizar `criar-skill`** com automação via `notebooklm-py` quando SDK estiver estável

---

# Captura avulsa — 2026-11-22 — Willian IA (MiniMax H3 local)

> Fora da janela semanal. `sync-check` retornou **BLOQUEADO** (worktree com 15 arquivos do usuário modificados), então **não** rodei `solicitar`/`mark`/`reconcile`. Sem risco de duplicata: os 3 IDs não existem em `state/` e o canal não está em `manifests/canais-vigilados.json`.

## Fonte

| Campo | Valor |
|---|---|
| Vídeo principal | `8DALo_Y2Z4I` — "Não Gaste Dinheiro com IA: fiz um FILME 100% Grátis no PC (Passo a Passo)" |
| Canal | Willian IA (@willian.design) |
| Publicado | 2026-11-22 · 35min41s · ~4,8k views |
| Pré-requisitos | `SxQ6s02Nfs4` (instalação ComfyUI, 2026-10-16) · `VefUJLzxQWg` (Strata 125B local, 2026-10-31) |
| Referências | `williandesigner.com/seja-seu-chefe` · `/pack-tudo-em-um` · HF `Pika-Labs/Pika-H3-Flex` |

## Fatos técnicos verificados (fora do vídeo)

- **MiniMax-H3**: 33B dense, pesos abertos, 4–15s por clipe, 24fps, áudio estéreo 32kHz, 768p nativo. O 2K usa módulo **fechado** (só via API).
- **`H3-Context-IR`** (o módulo que transforma ideia em prompt estruturado) **não é open source** — é exatamente o buraco que a skill do vídeo tapa. Insight central e não explicado no vídeo.
- **Pika H3 Flex**: 2 adapters de ~1,96 GB (`fl2va` e `ref2va`), lançados há 24 dias.
- **Licença**: comunitária; EUA/UE/UK/Coreia do Sul exigem licença formal. Brasil segue a comunitária.
- **Hardware do autor**: RTX 5060 Ti 16 GB. **Nosso parque**: GTX 1650 4 GB + 8 GB RAM → não roda H3 nem Strata (ver seção Hardware).

## Oportunidades extraídas

| # | Skill | Tipo | Comparação com inventário | Decisão | Prioridade |
|---|-------|------|---------------------------|---------|------------|
| 1 | `h3-structured-video-prompt` | nova | Nenhuma cobre o schema do H3 (6 blocos + timecode). `pipeline-video-agente` é áudio-first cloud | criar | **P0** |
| 2 | `blender-previs-animatic` | nova | `blender-mcp-ops` opera Blender mas não faz previs; `manim-video` é animação técnica | criar | **P0** |
| 3 | `character-sheet-consistency` | nova | `manga-generator` tem ficha, mas para HQ; `pipeline-video-agente` só cita "referências" | criar | **P0** |
| 4 | `comfyui-ops` | nova | Apenas `voice-cloning-local` cita ComfyUI de passagem | criar | P1 |
| 5 | `minimax-h3-local-video` | nova | `pipeline-video-agente` é 100% cloud; `ai-media-generator`/`fal-ai-media` são API | criar | P1 |
| 6 | `local-video-benchmark` | nova | `local-llm-efficiency` mede LLM; `benchmark` é genérico | criar | P1 |
| 7 | `local-ai-hardware` | atualizar | **0 skills mencionam VRAM**; hoje só fala DGX Spark | atualizar (tiers 4/8/12/16/24/48 GB) | P2 |
| 8 | `pipeline-video-agente` | atualizar | Assume cloud; falta branch local H3/ComfyUI | atualizar | P2 |
| 9 | `ai-media-generator` | atualizar | Não lista H3 local como opção | atualizar | P2 |
| 10 | `copyright-compliance-tracking` | atualizar | Não cobre licença H3 nem restrição territorial | atualizar | P2 |

## Detalhe das P0

1. **`h3-structured-video-prompt`** — schema `subject_definitions` / `summary` / `retention_analysis` / `detailed_description` / `overall_soundscape` / `non_diegetic_music`, com regras de timecode (`[Shot N]` + `00:00–00:03`) e checklist de validação. Genérico para H3, Seedance, Kling e Veo.
2. **`blender-previs-animatic`** — rascunho 3D com formas geométricas antes de gastar GPU; iteração conversacional no rascunho; exportar câmera/duração para o prompt. Reutilizável em qualquer pipeline.
3. **`character-sheet-consistency`** — ficha com corpo inteiro de frente + objeto na mão + rosto close + perfil; cenário separado e paleta fixa (verde/laranja como exemplo).

## Hardware (gate)

| IA | Requisito real | GTX 1650 4 GB + 8 GB RAM |
|---|---|---|
| MiniMax H3 | 33B (~66 GB BF16) + encoder Qwen3-VL-32B | ❌ não cabe nem em Q4 (~35 GB) |
| Strata 125B | 12 GB VRAM + 32 GB RAM + ~80 GB SSD | ❌ |
| Qwen-Image-Edit / Krea local | 12–24 GB VRAM | ❌ |
| ComfyUI + SD 1.5 | 4 GB (lowvram) | ✅ lento |
| Blender previs | qualquer | ✅ |
| LLM 3–4B Q4 | 3–4 GB | ✅ |
| Krea / Seedance / Hailuo (nuvem) | navegador | ✅ |

Conclusão: dá para produzir **previs + prompts** localmente e renderizar na nuvem; testar as skills P0 exige máquina com **≥16 GB VRAM** (ou aluguel de GPU).

## Próximas automações sugeridas

- **`scripts/h3-prompt-lint.mjs`** — valida se o prompt tem as 6 seções e timecodes coerentes antes de gerar.
- **`scripts/vram-gate.mjs`** — lê specs da máquina e decide `local` vs `API` com número (VRAM, RAM, tempo estimado).
- **Radar**: incluir `@willian.design` como `tier: radar` se aparecer em outra captura; hoje é canal pontual.
- **Benchmark real**: rodar as P0 numa máquina ≥16 GB e registrar tempo/segmento no `local-video-benchmark`.

## Ações recomendadas

1. Criar as 3 P0 (`h3-structured-video-prompt`, `blender-previs-animatic`, `character-sheet-consistency`).
2. Atualizar `local-ai-hardware` com a tabela de tiers por VRAM (lacuna mais visível: 0 menções a VRAM em 516 skills).
3. Criar `comfyui-ops` + `minimax-h3-local-video` como par (instalação → workflow).
4. Registrar a licença H3 em `copyright-compliance-tracking` antes de qualquer uso comercial.

## Pendências de registro

`mark` não foi executado (worktree sujo + canal fora do radar). Quando o worktree estiver limpo:

```bash
node scripts/yt-oportunidades.mjs mark 8DALo_Y2Z4I SxQ6s02Nfs4 VefUJLzxQWg
```

Alternativa: adicionar `@willian.design` em `manifests/canais-vigilados.json` (tier `radar`) e deixar o próximo `catalog-all` capturar os próximos vídeos.

---

# Captura avulsa — 2026-11-22 — lote de 5 transcrições

> Segunda leva do dia. As 5 transcrições foram baixadas pelo `yt-oportunidades.mjs` e lidas **por conteúdo**, não por título. `sync-check` continua **BLOQUEADO** (worktree sujo), então nada foi marcado em `state/`.

## Fontes lidas

| Canal | ID | Título | Tema real | Status |
|---|---|---|---|---|
| Willian IA | `SxQ6s02Nfs4` | Instalação ComfyUI + workflow H3 | pré-requisito do filme | ✅ lido |
| Willian IA | `VefUJLzxQWg` | Strata + ComfyUI via MCP | pré-requisito do filme | ✅ lido |
| ColeMedin | `a90pZ1DSyls` | Skill de edição de vídeo | skill open source | ✅ lido |
| Maestros da IA | `iSGK7Tb4GPE` | Agentes escondem erros | skill Vagalume | ✅ lido |
| aicodeking | `VpYEFW5Yn7k` | "100-File Skill Library" da Meta | **Astryx** (design system) | ✅ lido |
| Gabriel Adamuchi | `-bPHYQemyHw` | Trailer GTA VI no Seedance 2.5 | — | ❌ sem legenda (auto ou manual) |

## 1. Willian — ComfyUI + MiniMax H3 (`SxQ6s02Nfs4`)

**Fatos verificados no vídeo:**

- Requisitos: RTX 3060 12 GB (mínimo), **32 GB RAM** recomendado (16 GB só com memória virtual do Windows), RTX 5060 Ti 16 GB como "mínimo confortável", 5090/5070 como ideal. AMD = ROCm, melhor no Linux, não testado pelo autor.
- Pré-requisitos Windows: driver NVIDIA, Git for Windows, Visual C++, FFmpeg (PowerShell admin) e **ComfyUI Portable** (não a versão desktop).
- O guia do autor pede o caminho da pasta raiz do Portable e **reescreve todos os comandos** com esse caminho — resolve o erro clássico de `custom_nodes` no lugar errado.
- Atualização: `update/update_comfyui.bat`. Reiniciar o **motor** (janela do CMD), não só o navegador.
- Custom nodes sem Manager: `git clone` de **ComfyUI Easy Media** + **KJ Nodes** em `ComfyUI/custom_nodes`; dependências do KJ instaladas por comando separado.
- Opcional NVIDIA: **SageAttention + Triton** para acelerar. Se não instalar, os dois nós de attention **precisam** ser bypassados (`Ctrl+B`) ou a geração dá erro.
- Modelos: difusão `MiniMax H3 Singularidade` (fix comunitário para rosto distorcido a distância, movimento rápido e nitidez), text encoder, VAE de áudio `minimax h3 audio vae`, LoRAs. Total ~**55 GB**; variante 2K oficial de 34 GB vs 21 GB padrão.
- Workflow: `Easy H3 Project with MultiTrack Editor` (JSON) + `refresh node definitions`.
- Uso: cada track roxa = 1 segmento de até **8 s**; prompt por segmento; imagens de referência via `@`; modo `ref2va`; arquivo `multitrack project` mantém continuidade. 4×8 s = 32 s contínuos.
- Saída: `ComfyUI/output/easy_media/project/long_take_demo/out`.
- System prompt do H3 é baixado do guia do autor (não vem no workflow).

**O que vira skill:** `comfyui-ops` (instalação, nodes, pastas de modelo, gate de attention, restart, output) e `minimax-h3-local-video` (multitrack, segmento de 8 s, `@ref`, `ref2va`, system prompt).

## 2. Willian — Strata (`VefUJLzxQWg`)

**Fatos verificados no vídeo:**

- App **Strata 0.2.8** (Windows `.exe`), versão CLI separada. Unifica **VRAM + RAM + SSD**; hierarquia de velocidade VRAM > RAM > SSD.
- Requisitos: RTX série 20–50, **12 GB VRAM** (há relatos com 8 GB, mais lento), **32 GB RAM**, **80 GB SSD livre**, NVMe recomendado. Mac usa solução equivalente ("Splash" na legenda, nome não confirmado).
- Modelos: Qwen3.8-FlashNext, Qwen3.6 e DeepSeek V4.1 Flash (o mais pesado). Quantizações Q2 / Swift IQ2XS / Giro / GGUF; o app recomenda a versão conforme a máquina.
- Download ~**68 GB**; modelo instalado chega a **107 GB** em disco.
- Contexto: 32k (rápido) / 64k / 128k (meio-termo) / até 500k. Faz **sumarização automática no meio da tarefa** ao chegar perto do limite.
- **Armadilha central**: esforço de raciocínio alto em tarefa grande → o modelo pensa por horas e entra em loop sem gerar. Para projeto grande, usar **baixo ou desligado**.
- Uso de CPU/GPU: 80% (deixa 20% para o sistema) ou 100%. Ler imagens consome memória e pode ser desligado.
- Medições do autor (RTX 5060 Ti): rascunho do jogo 67 min / 97k tokens / 33 tok/s; integração ComfyUI via MCP 77 min / 74k contexto / 35 tok/s; site ~40 min.
- ComfyUI via **MCP**: qualquer agente controla a ComfyUI. Ferramentas usadas: Qwen-Image (legenda corrompida como "Craiyon/Crea/Krita 2"), **Stable Audio 3.0** (SFX + trilha), **Pixal3D + Trellis 2** (imagem → 3D), textura refeita no Qwen-Image-Edit.
- Limitações declaradas: velocidade e queda de qualidade por quantização; **não substitui** modelo pago.

**O que vira skill:** atualizar `local-llm-efficiency` (tiers de memória, nomenclatura de quant, orçamento de contexto, armadilha do reasoning alto) e `local-ai-hardware` (piso 12 GB VRAM / 32 GB RAM / 80 GB SSD). Novo: `comfyui-mcp-agent-bridge` (agente dirigindo ComfyUI para gerar assets).

## 3. ColeMedin — skill de edição de vídeo (`a90pZ1DSyls`)

**Arquitetura da skill (o insight reaproveitável):**

- O `SKILL.md` é **fino**: tabela "tipo de conteúdo → etapas" + regras rígidas. O trabalho pesado está em **scripts determinísticos** que devolvem dados ao agente orquestrador.
- Pipeline base (sempre 1–5): transcrição com timestamps → remoção de refilmagens → corte de silêncios/respirações/repetições → montagem → polimento (transições/animações) → exportação com verificação.
- Validação: **re-transcrever o output** e comparar palavra por palavra com a transcrição de origem para provar que os cortes caíram nos timestamps certos.
- Personalização: `lessons.md` (regras em linguagem natural que não merecem script) + `brand.json` (cores/marca). Recomenda pedir ao agente para guiar a personalização na primeira uso.
- Pipeline completo opcional via **OpenRouter**: STT (ElevenLabs), revisão multimodal de vídeo (Claude), geração de imagem para thumbnail e clonagem de voz. Custo citado: **US$ 2,71** para um vídeo longo completo.
- Tipos de conteúdo embutidos: talking head, tela + bolha de rosto, inserções animadas, shorts, curso/palestra.

**O que vira skill:** novo `script-backed-skill` (o meta-padrão: decisão no SKILL.md, execução em scripts, `lessons.md` como memória) e atualizar `video-editing`/`video-cut-pipeline` com o pipeline de 5 etapas + validação por re-transcrição.

## 4. Maestros da IA — skill Vagalume (`iSGK7Tb4GPE`)

**Arquitetura (auditoria noturna de sessões passadas):**

1. **Coleta**: varre todas as sessões do dia (ex.: 100–200), incluindo cada passo, não só o output. Script Python enxuga sem perder sinal.
2. **Análise**: Sonnet dá nota **0–4** por execução em quatro eixos — resultado, **fidelidade do relato** (o agente disse que deu certo?), eficiência (foi direto ou bateu cabeça?) e aderência às instruções.
3. **Confirmação**: Opus/Fable valida se o erro é real (evita falso positivo), olha **7/14/30 dias** para não reagir a um caso isolado e propõe a modificação **no arquivo exato**.
4. **Ação**: conserta sozinho o que é de baixo risco; escala para humano (WhatsApp) o que exige decisão. Faz commit/backup antes de alterar.
5. **Relatório matinal** com o que foi otimizado.

**Caso real citado:** loop noturno com executor Haiku + crítico; o executor ignorava metade da lista por pressão de contexto e o crítico dava sempre a mesma nota. A skill detectou, criou a regra "ler o relatório inteiro antes de compactar" e destravou o loop.

**O que vira skill:** novo `nightly-agent-audit` (varredura + score 0–4 + confirmação + escalação). Cross-link com `self-improvement-ladder`, `eval-harness` e `agent-introspection-debugging` — nenhum deles cobre o ciclo noturno em lote.

## 5. aicodeking — Astryx da Meta (`VpYEFW5Yn7k`)

> O título fala em "100-File Skill Library"; o conteúdo é um **design system**, não uma biblioteca de skills. Título é clickbait.

**Fatos verificados (fora do vídeo também):**

- **Astryx** (`meta/astryx`), MIT, beta ~v0.7, React 19 + StyleX, Node ≥ 22.13 para a CLI.
- 150+ componentes acessíveis com tipos TS (a CLI lista **174**), templates de página e de bloco (dashboard, login, settings, chat de IA).
- 7 temas (só `neutral` marcado como mantido) + dark mode. Tema = variáveis CSS; customização por className (Tailwind/CSS modules/CSS puro), sem fork.
- **CLI é a documentação**: o site lê da CLI, não o contrário. `init` grava bloco gerenciado no `CLAUDE.md`/`AGENTS.md` do agente escolhido; `build` descreve em inglês e devolve template + blocos + componentes (não gera código); `template`, `theme add`, `search`, `props`, `doctor`, `manifest`, saída JSON + modo denso.
- `swizzle` copia o source do componente (estilo shadcn), mas exige compilador StyleX no build.
- MCP hospedado com 2 tools (`search`, `get`); `llms.txt`; `init user` instala uma skill global.
- **Vibe tests** noturnos: mesmo prompt em 4 stacks, juiz separado. Noite boa: Astryx 98, shadcn 95, HTML cru 82. Noite ruim publicada: Astryx 77 (imports/props inventados). A Meta admite que **shadcn ganha na maioria das noites**.
- Downsides: beta, React 19 obrigatório, bundle ~600 KB antes de gzip, temas fora do neutral são pacotes separados, charts só no Canary.

**O que vira skill:** novo `astryx-design-system` (init/build/template/search/props/swizzle/doctor + regras "sem div crua, sem hex"). E o método dos vibe tests entra em `eval-harness` como grader de UI.

## Oportunidades consolidadas deste lote

| # | Skill | Tipo | Comparação com inventário | Prioridade |
|---|---|---|---|---|
| 11 | `comfyui-ops` | nova (já P1) | detalhada agora: install, nodes, pastas, attention gate, output | **P1** |
| 12 | `minimax-h3-local-video` | nova (já P1) | workflow multitrack + segmento 8 s + `@ref` | **P1** |
| 13 | `script-backed-skill` | nova | `criar-skill` ensina autoria, não a arquitetura "SKILL fino + scripts + lessons.md" | **P0** |
| 14 | `nightly-agent-audit` | nova | `self-improvement-ladder`/`eval-harness` não fazem varredura noturna em lote | **P1** |
| 15 | `astryx-design-system` | nova | `design-system` é genérico; não há skill de Astryx | **P1** |
| 16 | `comfyui-mcp-agent-bridge` | nova | nenhuma cobre agente dirigindo ComfyUI por MCP | P2 |
| 17 | `local-llm-efficiency` | atualizar | falta tiers VRAM/RAM/SSD, quant IQ2XS/Giro, contexto 32k–512k, reasoning alto = loop | **P0** |
| 18 | `local-ai-hardware` | atualizar | falta piso 12 GB VRAM / 32 GB RAM / 80 GB SSD para agente local | **P1** |
| 19 | `video-editing` / `video-cut-pipeline` | atualizar | falta pipeline de 5 etapas + validação por re-transcrição + OpenRouter | P2 |
| 20 | `eval-harness` | atualizar | falta grader de UI estilo vibe tests (4 stacks + juiz) | P2 |
| 21 | `context-budget` | atualizar | falta caso real do worker Haiku ignorando metade da lista | P2 |

**Mudança de prioridade vs. captura anterior:** `script-backed-skill` e `local-llm-efficiency` sobem para **P0** porque são padrões reutilizáveis em qualquer projeto, não conteúdo de um vídeo só.

## Triagem dos 64 candidatos (`diff-all --since-last`)

> Triagem **por título** — suficiente para decidir o que baixar, **não** para afirmar conteúdo. Lista completa em `%TEMP%\opencode\yt-8DALo\diff-all.json`.

### Por canal (novos / filtro+)

| Canal | Novos | Filtro+ | Canal | Novos | Filtro+ |
|---|---|---|---|---|---|
| maestros | 18 | 9 | ColeMedin | 4 | 2 |
| aicodeking | 15 | 8 | attekitadev | 4 | 2 |
| nateherk | 12 | 5 | gucampelo | 4 | 2 |
| Sujeitoprogramador | 12 | 3 | ratosdeia | 4 | 2 |
| airevolutionx | 11 | 9 | SimonScrapes | 3 | 3 |
| inteligenciamilgrau | 8 | 2 | gabrieladamuchi | 3 | 3 |
| claude | 8 | 6 | anwarhermuche | 3 | 1 |
| matthew_berman | 7 | 2 | ai-foundations | 2 | 2 |
| celinexu | 7 | 1 | AIJasonZ | 2 | 1 |
| anthropic | 5 | 0 | IndyDevDan | 1 | 0 |
| | | | graceleungyl | 1 | 1 |

### Baixar primeiro (12)

| ID | Canal | Título | Por quê |
|---|---|---|---|
| `aFmu4rLgH8U` | aicodeking | repo que economiza até 98% de usage | custo/tokens, alto impacto |
| `zgL8UusZYV0` | Sujeitoprogramador | jeito certo de gastar menos tokens | idem, ângulo diferente |
| `0RF9ml43ups` | nateherk | engenheiro da Anthropic sobre limite de tokens | idem, fonte primária |
| `hADqyWY8Oqo` | gucampelo | skill que clona animação de site | `site-clone-migration` + motion |
| `3dJ3AOjEv0E` | gucampelo | skills + libs contra design genérico | `taste`/`frontend-design-direction` |
| `2cI77Vk3Ibg` | gabrieladamuchi | 3 melhores design skills | deduplicar com o de cima |
| `k87Iqft91j8` | ColeMedin | agente "ajudador demais" é perigoso | `agent-guardrails`/`agent-safety-guards` |
| `_N6daCW1FFk` | aicodeking | skill usada todo dia | skill concreta, alto sinal |
| `8sV6rsGFCS8` | maestros | guia definitivo do Hermes | `autonomous-agent-harness` |
| `JqPjDPlPfvs` | maestros | como o melhor engenheiro de IA usa Claude Code | workflow |
| `gXkRog4tAT0` | attekitadev | MCP que muda o que dá para construir | MCP patterns |
| `6VjeXzvpoJo` | SimonScrapes | conceitos de Claude que todo mundo ignora | fundamentos |

### Buckets

- **News/benchmark (não viram skill):** Fable 5.2, GPT-6.2 Astra, Gemini 4 Carbon, Qwen4 Max, HydrOGen, "bolha da IA", robôs biónicos. Servem de insumo para atualizar `model-migration-strategy` e `llm-leaderboard-tracker` numa tacada só.
- **Já cobertos por skill existente:** VPS (`DMdqpLr2DlQ` → `cloud-code-vps-deploy`), segurança (`wQoedgH8Bt4` → `security-bounty-hunter`/`sast-gate-pr`), social autopilot (`S-C6Ip1BFKE` → `social-publisher`), GUI de agentes (`Ij49xfO1iuo`, `8GtOKXm1meU` → `harness-arena-comparison`).
- **Descartar:** `XSehihyKFqw` (renda online), `W92p3Zm1CTY` (carreira), `o4Vi5uBZYH0` (Jev/Treg, já temos `typesafe-ai`).

## Ações recomendadas (revisadas)

1. Criar `script-backed-skill` (P0) — é o padrão que explica ColeMedin, Vagalume e metade das skills boas do repo.
2. Atualizar `local-llm-efficiency` (P0) com a tabela de tiers e a armadilha do reasoning alto.
3. Manter as 3 P0 da captura anterior (`h3-structured-video-prompt`, `blender-previs-animatic`, `character-sheet-consistency`).
4. Criar `comfyui-ops` + `minimax-h3-local-video` como par (P1).
5. Criar `nightly-agent-audit` e `astryx-design-system` (P1).
6. Baixar os 12 da lista acima em uma próxima rodada; news vira 1 update agregado.

## Pendências

- `mark` dos 6 IDs continua bloqueado pelo worktree sujo (5 lidos + 1 descartado).
- `@willian.design` e `@andre_lug` seguem em captura pontual, fora de `canais-vigilados.json`.
- `-bPHYQemyHw` e `vjqJmMIsiR0` exigem correção no script (`--` antes do ID) para não ser lido como flag pelo yt-dlp.

---

# Canal Completo — Willian IA (@willian.design)

> Captura pontual integral realizada em 2026-11-22. **266 vídeos** mapeados (`docs/maestros/willian-ia-inventario.md`), 73 com sinal de skill no título. Foco em MiniMax H3, ComfyUI, Seedance 2.5, Kling, Qwen Image, Strata, Blender Previs, 3D e agentes locais.

## Resumo por Ano
- 2023: 1 vídeo
- 2024: 7 vídeos
- 2025: 108 vídeos
- 2026: 150 vídeos
- **Com sinal de skill no título:** 73 vídeos

## Mapa Temático (16 Eixos)
1. **MiniMax H3 & Vídeo Local (H3 / Seedance):** `8DALo_Y2Z4I`, `aetuL154-pE`, `x_1BNaqt16I` → `h3-structured-video-prompt`, `pipeline-video-agente`
2. **ComfyUI Avançado:** `SxQ6s02Nfs4`, `ByY4LOcs_1Q` → `comfyui-ops` (pendente)
3. **LLM Local & Strata / Offload:** `VefUJLzxQWg`, `1p0HXLv_5wM` → `local-llm-efficiency` (atualizada P0)
4. **Blender & Previs 3D:** `Ilpwa9vqZ7s`, `TPeQqiEWtV4` → `blender-previs-animatic` (criada P0)
5. **Character Consistency & Face:** Modelos Rodin, ChatAvatar → `character-sheet-consistency` (criada P0)
6. **Agentes Locais & Autonomia:** Pipelines de automação sem nuvem.
7. **Design UI / UX com IA:** Interfaces e componentização.
8. **Edição de Vídeo / CapCut:** Automações de corte longo/curto.
9. **Ferramentas Open-Source:** Alternativas self-hosted.

## Shortlist de Download Prioritário (Próxima Rodada)
- `aetuL154-pE` (H3 deep dive / ajustes finos)
- `x_1BNaqt16I` (H3 workflow avançado)
- `ByY4LOcs_1Q` (ComfyUI nodes para H3)
- `Ilpwa9vqZ7s` (Blender previs pipeline)
- `TPeQqiEWtV4` (Animação 3D assistida por IA)

---

# Captura avulsa — 2026-11-22 — Andre Lug (@andre_lug)

> Terceira captura do dia. Canal com 135 vídeos, 89 com sinal de skill — foco prático em IA, open-source, MCP, agentes, Claude Code, design, custo/tokens. Muito alinhado ao catálogo ECC.

## Fonte lida

| ID | Título | Tema real | Status |
|---|---|---|---|
| `vjqJmMIsiR0` | 20 Free GitHub Apps That Replace Paid Subscriptions (Open Source) | alternativa open-source a assinaturas | ✅ lido |

## 1. Andre Lug — `vjqJmMIsiR0`

**Fatos verificados (transcrição):**

Lista de 20 ferramentas open-source que substituem SaaS pagos:

1. **Agents Chat** — alternativa ao Slack com agentes de IA nos canais, cada agente tem função, dono e orçamento.
2. **Podcast AI** — open-source NotebookLM (site/PDF/imagem/YouTube → áudio conversacional em vários idiomas).
3. **Analog** — alternativa ao Granola, anota reuniões sem bot entrar na chamada, transcrição local, banco local.
4. **Cocoro** — modelo TTS pequeno que roda no PC, vozes pt-BR, sem limite de caracteres, alternativa ElevenLabs.
5. **Inbox Zero** — assistente de e-mail IA (Gmail/Outlook) + app alternativo ao Superhuman.
6. **Documensa** — open-source DocuSign para assinar documento por link (celular).
7. **Libre Translate** — API tradução no seu servidor, offline, motor Ardos Translate.
8. **Buzz** — transcreve e traduz áudio sem internet no PC (Whisper), Mac só Apple Silicon.
9. **Cap** — open-source Loom, grava tela/camera/microfone, modo instantâneo (link na hora) + modo estúdio.
10. **Vein** — buscador IA focado em privacidade (local via Ollama ou OpenAI/Claude/Gemini, 3 modos: rápido/equilibrado/qualidade).
11. **Rend** — ditado por voz offline, atalho → fala → texto em qualquer campo.
12. **ChatUt** — central atendimento open-source (Intercom/Zendesk), agente IA "Captain".
13. **Postes** — agendar/automatizar posts sociais (Buffer/HootSuite), nuvem paga ou open-source.
14. **Si Yuan** — caderno notas privado (Notion), blocos citáveis, Markdown, agentes IA, grátis comercial.
15. **Cal DIY** — comunitário cal.com (Calendly), uso pessoal, pede quem saiba cuidar servidor.
16. **Upscayl** — upscale/melhora imagens com IA grátis (Windows/Mac/Linux), precisa Vulkan.
17. **Cherry Studio** — estação trabalho IA (desktop + Android/iPhone), vários modelos, agentes, bases conhecimento, imagens.
18. **Twenty** — CRM open-source (Salesforce) pensado em IA, campos/telas viram código, skills oficiais Claude Code/Codex/Cursor.
19. **Pluvio (Penpot?)** — plataforma design open-source (Figma), roda no navegador ou servidor, SVG/CSS.
20. **Plane** — gestão projetos open-source (Jira/Linear/Monday/ClickUp), tarefas/ciclos/mapa produto, nuvem grátis ou instale, 62k+ estrelas.

**O que vira skill:**
- `open-source-saas-replacements` (nova) — tabela "SaaS pago → alternativa open-source" + critérios de quando self-host compensa vs assinar.
- Atualizar `script-backed-skill` com o caso Twenty (skills oficiais em Claude Code/Codex/Cursor).
- `local-llm-efficiency` — atualizar com Vein/Cocoro (modelos locais pequenos, offline-first).

## 2. Canal @andre_lug — inventário completo

**Visão geral:**

- 135 vídeos (2020–2026), 89 com sinal de skill.
- Temas quentes: open-source, MCP, Claude Code, design IA, second brain/Obsidian, custo/tokens, agentes/autonomia, REA, Google AI Studio, ElevenLabs, plugins/skills.
- Datas de 2025 são aproximadas (`youtubetab:approximate_date`), só o ano é confiável.
- Canal candidato a `radar` tier — entra no `catalog-all`, sem prioridade alta.

**Onde encosta no catálogo ECC:**

| Tema | Vídeos representativos | Skill ECC |
|---|---|---|
| Alternativas open-source pagas | `vjqJmMIsiR0`, `A-3crV39-Qg`, `X_TnXgmEXNI`, `ywmiH9KzcvY` | `script-backed-skill`, `local-llm-efficiency`, `mcp-server-patterns` |
| MCP connectors / Claude Code | `2YUKLi6kin0`, `OUqQPD8PGJ4`, `lnNtwW7R00c` | `mcp-server-patterns`, `mcp-local-bridge` |
| Design com IA / Claude Code | `Zuj6whVyjNE`, `ytkoL0i2_iY` | `taste`, `frontend-design-direction`, `frontend-slides` |
| Second brain / Obsidian + IA | `AjD4JCS8kio`, `SDpSGlU_zLk` | `obsidian-cli`, `context-ledger`, `knowledge-ops` |
| Custo / tokens / pricing | `L4-z6XFxMyY`, `k4YRl6RckhY`, `G3nbB61F__s`, `OPoEICRuiXI` | `cost-tracking`, `roteamento-modelos-baratos`, `subscription-tier-routing` |
| Agentes / autonomia / segurança | `rAsjX94cYFs`, `ywmiH9KzcvY`, `Khrdg-aU6Nk` | `agent-safety-guards`, `agent-guardrails`, `autonomous-agent-harness` |
| REA / engenharia reversa | `aXZQdXGGkjc` | `rea-reverse-engineering` |
| Specs / prompt engineering | `xKWapKyg1U4` | `intent-driven-development`, `prompt-builder` |
| Google AI Studio / Maps / Gemini | `zVPUvUo61NE`, `QsKnewpO4HM`, `SSsE2nybR8A` | `google-adk-patterns`, `gemini-cli-agent-skills` |
| ElevenLabs / vídeo por IA | `0QBQ1TyTIxQ` | `pipeline-video-agente`, `fal-ai-media` |
| Habilidades / plugins para Claude Code | `lnNtwW7R00c` | `criar-skill`, skill marketplace |

## Ações recomendadas (revisadas — incluindo Andre Lug)

1. Criar `script-backed-skill` (P0) — já criado.
2. Atualizar `local-llm-efficiency` (P0) — já atualizado.
3. Criar `comfyui-ops` + `minimax-h3-local-video` (P1) — do Willian.
4. Criar `nightly-agent-audit` e `astryx-design-system` (P1) — do lote anterior.
5. **Novo: criar `open-source-saas-replacements`** — a tabela SaaS pago → open-source do Andre Lug é reaproveitável para qualquer projeto que quer cortar custo.
6. Adicionar `@andre_lug` a `canais-vigilados.json` (tier `radar`) — 135 vídeos, 89 com sinal, frequência alta.
7. Baixar os 12 da lista do Willian + top 10 do Andre Lug numa próxima rodada.

## Pendências

- `mark` dos 6 IDs do Willian + 1 ID do Andre continua bloqueado pelo worktree sujo.
- `@willian.design` e `@andre_lug` segem fora de `canais-vigilados.json`; decisão em aberto.
- `-bPHYQemyHw` e `vjqJmMIsiR0` exigem correção no script (`--` antes do ID) para não ser lido como flag pelo yt-dlp.
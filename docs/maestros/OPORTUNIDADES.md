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
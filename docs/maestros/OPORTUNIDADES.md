# Relatório de Oportunidades: Maestros da IA (2026)

Condensa os aprendizados dos vídeos processados e as skills materializadas a
partir deles. Transcrições ficam em pastas locais (nunca no repo público).

---

## 1. Fontes Analisadas

| Vídeo | Tema | Decisão |
|---|---|---|
| `j3AV7xsCepI` | Sessões do Claude Code conversando entre si + supervisor loop com nota | **Skill nova**: `sessoes-orquestradas` |
| `ut2YqOMRkeo` | Gemini Spark agentic (skills, MCP, @tool, tarefas agendadas, AI Studio) | **Skill nova**: `gemini-cli-agent-skills` |
| `ltmH3Oo49fE` | DeepSeek V4 Flash barato, custo-por-tarefa, OpenRouter no Claude Code | **Skill nova**: `roteamento-modelos-baratos` |
| `fTok7Z-Bz40` | Pipeline claymation: áudio-first, imagem-depois-anima, ledger de custos | **Skill nova**: `pipeline-video-agente` |
| `ZeD44y55t6I` | Skills "simplificar resposta" e "ADHD/multi-perspectiva" (Opus 5 slop) | **Já coberto**: `plain-language-response` + `multi-perspective-convergence` |
| `Hdn1BXqGeTE` | Anthropic cortou 80% do system prompt (`/doctor`) | **Já coberto**: `doctor` |
| `M4euu8xqO-k` | IA resolve conjectura jacobiana (87 anos em aberto) com Fable 5 + verificação LEAN | **Informativo**: sem workflow concreto, sem skill |
| `ZQIbgHsf_iE` | Conselhos do Boris Cherny (criador do Claude Code): instruções envelhecem rápido, framework fiável (prompt desafiante + verificação + não parar até 100%), gap modelo-produto | **Coberto com enriquecimento**: 2.1 "instruções envelhecem" → `doctor` (falta a estratégia radical de rodar com prompt enxuto a cada ~6 meses); framework fiável → `score-loop` (já cobre, nota 85/100); gap modelo-produto → insight de negócio, sem skill |

---

## 2. Skills Materializadas Neste Lote

| Skill | Módulo | Gatilho |
|---|---|---|
| `coletar-oportunidades-youtube` | workflow-quality | pipeline deste próprio relatório (catalog/diff/download/dedup/mark) |
| `sessoes-orquestradas` | agentic-patterns | sessões nomeadas que se falam + supervisor loop 0-100 + roteamento de modelo |
| `gemini-cli-agent-skills` | agentic-patterns | Gemini Spark, MCP, @tool, tarefas agendadas, AI Studio |
| `roteamento-modelos-baratos` | agentic-patterns | OpenRouter, custo-por-tarefa, executor barato + verificador forte |
| `pipeline-video-agente` | media-generation | áudio-first, imagem→anima, consistência via referências, ledger de custos |

## 3. Já Cobertos (não duplicar)

- Vídeo das skills anti-slop → `plain-language-response` (texto) e
  `multi-perspective-convergence` (multi-perspectiva) já existiam.
- Vídeo do `/doctor` → a skill `doctor` foi materializada na leva anterior.

### 3.1 Canal Attekita Dev (terceiro canal)

| Vídeo | Tema | Decisão |
|---|---|---|
| `6GcfKpfA2kM` | Graph Engineering: orquestração de agentes em paralelo com verificadores independentes, sem contexto compartilhado | **Coberto com enriquecimento**: conceito central já em `engenharia-de-grafos`; absorver anti-overengineering (artefatos ruins = queima de tokens), os 3 níveis de implementação (delegar à IA / especificar manual / ferramenta dedicada) e "loop como nó de grafo" na skill canônica |

Transcrições do canal ficam em `C:\projetos\attekitadev\` (fora do repo; via `YT_DIR`).

## 4. Próximos Passos

1. Rodar o pipeline em novos vídeos: `node scripts/yt-oportunidades.mjs diff --since <data>`
2. Analisar vídeos novos → materializar via `criar-skill`.
3. Rodar validators (`validate-no-personal-paths.js`, testes CI) antes de qualquer commit.
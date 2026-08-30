# Guia de Portabilidade Universal (Universal Portability Guide)

**Versão:** 1.0  
**Gerado em:** 2026-08-29  
**Repositório:** magros.ai-skills (ECC-based)  
**Total de skills:** 371  
**Plataformas suportadas:** 12  

---

## Visão Geral

Este guia documenta **como cada comando, hook, MCP, agente, skill e integração** do repositório magros.ai-skills funciona em **12 plataformas/agentes diferentes**. O objetivo é tornar explícita a portabilidade (ou falta dela) para que qualquer desenvolvedor possa migrar ou usar as skills em sua plataforma preferida.

### Princípios de Design Portável

1. **Core = Markdown + Scripts determinísticos** — O conteúdo dos SKILL.md, eferences/, scripts/ é 100% portável (texto, Python, JS, YAML)
2. **Integrações = Específicas por plataforma** — Hooks, slash commands, MCP config, agents loading, permissions, memory, cost tracking variam por plataforma
3. **Adapters = Camada de tradução** — Para cada skill com integração nativa, fornecemos dapters/<plataforma>/ com arquivos prontos
4. **Progressive Disclosure** — Frontmatter (sempre) → SKILL.md (ativado) → references/scripts (sob demanda)

---

## Registro Canônico de Comandos

Fonte única da verdade: docs/command-registry.json (gerado por scripts/generate-command-registry.mjs)

| Categoria | Quantidade | Descrição |
|---|---|---|
| **Skills** | 371 | Cada uma com SKILL.md + eferences/ + scripts/ |
| **Root Commands** | 94 | Slash commands em commands/ (core ECC) |
| **Skill Commands** | 5 | Slash commands em skills/*/references/claude-commands/ (fusion-harness) |
| **Hooks** | 3 | Scripts em hooks/ + skills/*/hooks/ |
| **MCP Configs** | 1 | mcp-configs/mcp-servers.json |
| **Settings Hooks** | 1 | skills/fusion-harness/references/settings-hooks.json |

---

## Matriz de Capacidades por Plataforma

| Capacidade | claude-code | claude-project | opencode | cursor | codex | gemini-cli | zed | qwen | kimi | hermes | openclaw | antigravity |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Slash Commands** | ✅ Native | ✅ Native | ✅ Native | ✅ Native | ✅ Native | ❌ Adapter | ❌ Adapter | ❌ Adapter | ❌ Adapter | ✅ Native | ✅ Native | ❌ Adapter |
| **Hooks** | ✅ Native | ✅ Native | ✅ Native | ✅ Native | ✅ Native | ❌ Adapter | ❌ Adapter | ❌ | ❌ | ✅ Native | ✅ Native | ❌ |
| **MCP** | ✅ Native | ✅ Native | ✅ Native | ✅ Native | ✅ Native | ✅ Native | ✅ Native | ❌ | ❌ | ✅ Native | ✅ Native | ❌ |
| **Skills Loading** | ✅ Native | ✅ Native | ✅ Native | ✅ Native | ✅ Native | ✅ Native | ❌ | ✅ Native | ✅ Native | ✅ Native | ✅ Native | ❌ |
| **Cost Tracking** | ✅ Native | ✅ Native | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Memory** | ✅ Native | ✅ Native | ✅ Native | ❌ | ❌ | ✅ Native | ❌ | ❌ | ❌ | ✅ Native | ✅ Native | ❌ |
| **Permissions** | ✅ Native | ✅ Native | ✅ Native | ✅ Native | ✅ Native | ⚠️ Per-skill | ❌ | ❌ | ❌ | ✅ Native | ✅ Native | ❌ |

**Legenda:** ✅ Native = suportado nativamente | ❌ = não suportado | ⚠️ Parcial | Adapter = requer adapter/customização

---

## Mapeamentos Detalhados (8 Tabelas)

Os arquivos CSV completos estão em docs/portability-mappings/:

| Arquivo | Descrição | Colunas Principais |
|---|---|---|
| hooks-mapping.csv | Eventos de hook → plataforma | evento, claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw |
| slash-commands-mapping.csv | Slash command → plataforma | comando, claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw |
| mcp-config-mapping.csv | Config MCP → plataforma | config, claude-code, opencode, cursor, codex, gemini-cli, zed, hermes, openclaw |
| gents-mapping.csv | Definição de agente → plataforma | agente, claude-code, opencode, cursor, codex, hermes, openclaw |
| skills-loading-mapping.csv | Como skills carregam → plataforma | skill, claude-code, opencode, cursor, codex, gemini-cli, qwen, kimi, hermes, openclaw |
| cost-tracking-mapping.csv | Rastreamento de custo → plataforma | método, claude-code, opencode, cursor, codex, gemini-cli |
| memory-mapping.csv | Persistência de memória → plataforma | tipo, claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw |
| permissions-mapping.csv | Modelo de permissão → plataforma | modelo, claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw |

---

## Skills com Integrações Nativas (Requerem Adapters)

As seguintes skills têm arquivos de integração específicos (hooks, commands, MCP, settings-hooks) e **precisam de adapters** para funcionar em outras plataformas:

| Skill | Integrações | Adapters Necessários |
|---|---|---|
| **fusion-harness** | 5 slash commands, settings-hooks.json | opencode, cursor, codex, gemini-cli, zed, qwen, kimi |
| **rules-to-hooks-auditor** | 6 hook templates, settings-patch | opencode, cursor, codex, gemini-cli |
| **gsap-skills** | (nenhuma nativa - core portável) | — |
| **img2threejs** | (nenhuma nativa - core portável) | — |
| **motion-design-skill** | (nenhuma nativa - core portável) | — |
| **buzz-workspace-teaming** | (verificar) | opencode, cursor, codex |
| **autonomous-agent-harness** | (verificar) | opencode, cursor, codex |
| **mcp-server-patterns** | (core portável) | — |
| **agent-harness-construction** | (core portável) | — |
| **agent-guardrails** | (core portável) | — |

> **Nota:** Skills sem integrações nativas (apenas SKILL.md + eferences/ + scripts/) funcionam **em qualquer plataforma** que suporte carregar skills via Markdown.

---

## Estrutura de Adapters

Para cada skill com integração nativa, a estrutura padrão é:

`
skills/<skill-name>/
├── adapters/
│   ├── opencode/
│   │   ├── hooks/           # .opencode/hooks.json + scripts
│   │   ├── commands/        # .opencode/commands/*.md
│   │   ├── mcp/             # .opencode/mcp.json
│   │   ├── agents/          # .opencode/agents/
│   │   └── README.md        # Instruções de instalação
│   ├── cursor/
│   │   ├── hooks/           # .cursor/rules/ + scripts
│   │   ├── commands/        # .cursor/commands/*.md
│   │   ├── mcp/             # .cursor/mcp.json
│   │   └── README.md
│   ├── codex/
│   │   ├── hooks/           # codex-hooks.json + scripts
│   │   ├── commands/        # CODEX_COMMANDS.md
│   │   └── README.md
│   ├── gemini-cli/
│   │   ├── skills/          # Agent Skills format
│   │   ├── mcp/             # .gemini/mcp.json
│   │   └── README.md
│   └── ...
`

---

## Como Usar Este Guia

### Para Desenvolvedores (Migrando Skills)

1. **Identifique a skill** que quer usar
2. **Verifique se tem integrações nativas** na tabela acima
3. **Se não tem** → use direto: coloque a pasta da skill no diretório de skills da sua plataforma
4. **Se tem** → vá em skills/<skill>/adapters/<sua-plataforma>/ e siga o README.md

### Para Autores de Skills (Criando Skills Portáteis)

Siga as regras em skills/universal-portability/references/portable-patterns.md:

1. **Core portável primeiro** — Todo logic em SKILL.md, eferences/, scripts/
2. **Integrações isoladas** — Coloque hooks/commands/MCP em dapters/
3. **Frontmatter universal** — 
ame, description com gatilhos claros
4. **Scripts determinísticos** — Python/JS/Shell que rodam igual em qualquer lugar
5. **Sem paths hardcoded** — Use variáveis de ambiente ou paths relativos

---

## Validação Automatizada

Script: scripts/ci/validate-portability.js

Verifica:
- [ ] Skills com integrações nativas têm dapters/ para plataformas declaradas no manifest
- [ ] SKILL.md não usa sintaxe claude-specific sem fallback documentado
- [ ] eferences/ tem portable-patterns.md linkado (para skills autorais)
- [ ] dapters/ seguem estrutura padrão
- [ ] settings-hooks.json tem equivalentes documentados para outras plataformas

Rodar:
`ash
node scripts/ci/validate-portability.js
`

---

## Próximos Passos (Roadmap)

- [ ] **Fase 2:** Gerar 8 CSVs de mapeamento em docs/portability-mappings/
- [ ] **Fase 3:** Criar adapters para 5 skills críticas (fusion-harness, rules-to-hooks-auditor, buzz-workspace-teaming, autonomous-agent-harness, mcp-server-patterns)
- [ ] **Fase 4:** Gerar matriz de portabilidade completa (371 × 12) em docs/portability-matrix.csv
- [ ] **Fase 5:** Criar skill universal-portability com guia de autoria + validação
- [ ] **Fase 6:** Dashboard HTML interativo em docs/portability-dashboard.html

---

## Referências

- docs/command-registry.json — Registro canônico completo (JSON)
- docs/portability-mappings/*.csv — 8 tabelas de mapeamento
- docs/portability-matrix.csv — Matriz skill × plataforma (futuro)
- skills/universal-portability/ — Skill de autoria portável (futuro)
- scripts/ci/validate-portability.js — Validação CI (futuro)
- manifests/install-modules.json — Módulos de instalação por plataforma
---
name: universal-portability
description: Use when authoring portable cross-platform skills or validating portability — core Markdown plus deterministic scripts plus isolated adapters, CI validation. Triggers on "criar skill portável", "validar portabilidade", "portar skill para outra plataforma", "adapter pattern", "cross-platform skill".
metadata:
  origin: ECC
  source_docs:
    - docs/PORTABILITY.md
    - docs/command-registry.json
    - docs/portability-mappings/
---

# Universal Portability — Autoria de Skills Portáveis + Validação

Este skill ensina a **criar skills que funcionam em qualquer plataforma** (Claude Code, OpenCode, Cursor, Codex, Gemini CLI, Zed, Qwen, Kimi, Hermes, OpenClaw, antigravity) e a **validar** se uma skill existente é portável.

## Quando usar (gatilhos concretos)

- "Crie uma skill que funcione no OpenCode e Cursor também"
- "Valide se minha skill é portável"
- "Como faço um adapter para o Cursor?"
- "Minha skill usa hooks — como portar para Codex?"
- "Qual a estrutura padrão de adapters?"

## Quando NÃO usar

- Skill que **só** será usada no Claude Code (sem planos de portar)
- Skill **sem integrações nativas** (apenas SKILL.md + references/ + scripts/) — essas já são portáveis por padrão
- Skill que depende de APIs privadas do Claude Code

---

## Regras de Ouro da Autoria Portável (Obrigatórias)

### 1. Core Portável Primeiro (Regra #1)

**Toda lógica em SKILL.md + references/ + scripts/** — texto, Python, JS, YAML, Bash.
- SKILL.md: workflow, regras, anti-patterns, exemplos — **Markdown puro**
- references/: cheatsheets, templates, configs, exemplos — **arquivos estáticos**
- scripts/: Python, Node.js, Bash, PowerShell — **determinísticos, sem estado**

> **Teste:** copie a pasta da skill para outro projeto e rode `python3 scripts/foo.py` — funciona sem modificação.

### 2. Integrações Isoladas em adapters/ (Regra #2)

**Nada de hooks, slash commands, MCP configs ou agents no core da skill.**

```
skills/<skill-name>/
├── SKILL.md                    # Core portável (sempre)
├── references/                 # Core portável (sob demanda)
├── scripts/                    # Core portável (determinísticos)
└── adapters/                   # Isolamento por plataforma
    ├── opencode/               # hooks/ + commands/ + mcp/ + README
    ├── cursor/                 # rules/ + commands/ + mcp/ + README
    ├── codex/                  # codex-hooks.json + CODEX_COMMANDS.md
    ├── gemini-cli/             # Agent Skills format + mcp/
    └── ...
```

### 3. Frontmatter Universal (Regra #3)

```yaml
---
name: kebab-case-name
description: Gatilhos concretos (quando usar) + não-gatilhos + outcome.
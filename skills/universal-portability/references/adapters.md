# Adapters — Checklist por Plataforma + Matriz de Portabilidade

Use `references/adapter-checklist.md` ao criar adapters (se existir no repo; abaixo o conteúdo consolidado).

## Por Plataforma

#### OpenCode
- [ ] .opencode/hooks.json com eventos pre_tool, post_tool, stop, start_session
- [ ] .opencode/commands/*.md (frontmatter compatível)
- [ ] .opencode/mcp.json se skill usa MCP
- [ ] .opencode/agents/ se skill define agentes
- [ ] README.md com opencode install <skill>

#### Cursor
- [ ] .cursor/rules/ para hooks (event-based)
- [ ] .cursor/commands/*.md (frontmatter compatível)
- [ ] .cursor/mcp.json se skill usa MCP
- [ ] README.md com instruções Cursor

#### Codex
- [ ] codex-hooks.json com eventos pre_exec, post_exec
- [ ] CODEX_COMMANDS.md (formato single-file)
- [ ] README.md com instruções Codex

#### Gemini CLI
- [ ] Agent Skills format (JSON com name, description, triggers)
- [ ] .gemini/mcp.json se skill usa MCP
- [ ] README.md com instruções Gemini

#### Hermes / OpenClaw
- [ ] .hermes/hooks.json / .openclaw/hooks.json
- [ ] .hermes/commands/ / .openclaw/commands/
- [ ] README.md com instruções

## Matriz de Portabilidade (Referência Rápida)

| Skill | Core Portável | Hooks | Commands | MCP | Settings | Adapters Prontos |
|---|---|---|---|---|---|---|
| fusion-harness | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | opencode, cursor, codex (parcial) |
| rules-to-hooks-auditor | ✅ | ⚠️ | — | — | ⚠️ | opencode, cursor (parcial) |
| gsap-skills | ✅ | — | — | — | — | — (core only) |
| img2threejs | ✅ | — | — | — | — | — (core only) |
| motion-design-skill | ✅ | — | — | — | — | — (core only) |
| buzz-workspace-teaming | ✅ | ⚠️ | ⚠️ | ⚠️ | — | pendente |
| autonomous-agent-harness | ✅ | ⚠️ | ⚠️ | ⚠️ | — | pendente |
| mcp-server-patterns | ✅ | — | — | ⚠️ | — | pendente |
| agent-guardrails | ✅ | — | — | — | — | — (core only) |

**Legenda:** ✅ = pronto | ⚠️ = tem integração nativa, precisa adapter | — = não se aplica

# Relatório de Vigilância — Repositórios (2026-08-18)

Vigilância automatizada via `scripts/repo-oportunidades.mjs` (gh api).
7 repositórios monitorados. Gap analysis vs inventário local (337 skills).

---

## 1. Status da Catalogação

| Repo | Status | Skills | Observação |
|---|---|---|---|
| `VoltAgent/awesome-agent-skills` | OK | 0 | Repo de curadoria, skills em subfolders ou links |
| `alirezarezvani/claude-skills` | OK | 0 | Estrutura de diretórios a validar (contents/skills vazia?) |
| `artubss/SKILLS-CLAUDE-CODE` | OK | 1 | Detectada root `skills` |
| `secondsky/claude-skills` | OK | 0 | A validar tree |
| `seb1n/awesome-ai-agent-skills` | OK | 0 | A validar tree |
| `anthropics/skills` | OK | 19 | Skills oficiais (Skill Creator, Docx, PDF, etc.) |
| `microsoft/SkillOpt` | OK | 0 | Tree diferente do padrão `/skills` |

## 2. Gaps Detectados (Top Oportunidades)

Total de **20 gaps** encontrados na 1ª varredura.

### Skills Oficiais Anthropic (Prioridade Alta)
- `skill-creator`: Gerador oficial de skills.
- `pdf`, `docx`, `xlsx`, `pptx`: Manipulação de arquivos Office/PDF.
- `claude-api`: Integração direta com a API do Claude.
- `mcp-builder`: Criação de servidores MCP.

## 3. Próximos Passos

1. **Ajustar Tree**: Melhorar o `repo-oportunidades.mjs` para buscar SKILL.md recursivamente quando a pasta `/skills` não existir na raiz (ex: microsoft/SkillOpt).
2. **Materializar**: Importar as skills oficiais da Anthropic que ainda não temos (PDF, Docx, Skill Creator).
3. **Vetting**: Antes de importar qualquer skill de repo terceiro, rodar `avaliar-ferramenta-ia` ou auditoria manual.

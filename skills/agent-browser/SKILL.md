---
name: agent-browser
description: Use quando precisar de automação web em ALTO NÍVEL (objetivo em linguagem natural → navegação autônoma) — Vercel Agent Browser. Diferente do Playwright MCP (baixo nível, determinístico: click, type, navigate, screenshot), o Agent Browser raciocina sobre o objetivo, navega sozinho, lida com variação de layout/responsividade. Triggers: "agent browser", "vercel agent browser", "automação web linguagem natural", "responsividade auto", "navegação autônoma". Use Playwright MCP (`e2e-testing`, `browser-qa`) para testes determinísticos/ações precisas.
metadata:
  origin: ecc
  module: workflow-quality
  cost: medium
  stability: stable
  defaultInstall: false
---

# Skill: agent-browser — Automação Web Alto Nível (Vercel Agent Browser)

**Agent Browser** (Vercel) é um CLI de automação browser **alto nível**: você passa um **objetivo em linguagem natural** ("teste a responsividade do header", "encontre o preço do produto X no site Y") e ele **navega autonomamente** — decide clicks, scrolls, waits, extrai dados. É uma camada de abstração sobre Chrome (headful/headless).

## Quando usar Agent Browser vs Playwright MCP

| Critério | **Playwright MCP** (baixo nível) | **Agent Browser** (alto nível) |
|---|---|---|
| **Interface** | Tools determinísticas: `click`, `type`, `navigate`, `screenshot`, `wait_for` | Objetivo em linguagem natural → navegação autônoma |
| **Controle** | Você dita cada ação passo a passo | Você dá o objetivo; ele decide o como |
| **Robustez a layout changes** | ❌ Frágil (seletores quebram) | ✅ Raciocina sobre objetivo; adapta-se a variações |
| **Responsividade** | ❌ Manual (set viewport, verifica) | ✅ Nativo ("teste responsividade do header") |
| **Tokens/consumo** | Baixo (ações diretas) | Mais alto (raciocínio + navegação) |
| **Casos ideais** | Testes E2E precisos, preencher formulário, screenshot exato, click específico | Automações com objetivo vago, responsividade, variação UI, scraping semântico, "vá até X e me traga Y" |

## Instalação

```bash
# Global (recomendado — binário Rust nativo, sub-ms overhead)
npm install -g agent-browser
# ou macOS:
brew install agent-browser

# Primeira vez: baixa Chrome
agent-browser install
# Linux: com dependências do sistema
agent-browser install --with-deps

# Sem instalar (npx)
npx agent-browser open example.com
```

## Skill para agentes (Cursor, Claude Code, Copilot, etc.)

O Agent Browser fornece uma **skill** que instala no seu agente:

```bash
# No projeto do agente (Cursor/Claude Code/etc.)
# A skill ensina o agente a invocar o CLI agent-browser corretamente
```

Após instalar a skill, o agente sabe usar comandos como:
```
"Use o agent browser para testar a responsividade do header: diminua a tela, veja se o hamburger menu abre."
"Use o agent browser para buscar as 5 últimas notícias do site X e me traga títulos + links."
"Use o agent browser para preencher o formulário de contato e submeter."
```

## Comandos CLI principais

| Comando | Descrição |
|---|---|
| `agent-browser open <url>` | Abre URL no Chrome |
| `agent-browser snapshot [-i]` | Captura accessibility tree + refs (`-i` = interativo) |
| `agent-browser click @<ref>` | Clica no elemento (ref do snapshot) |
| `agent-browser fill @<ref> "texto"` | Preenche input |
| `agent-browser press <key>` | Pressiona tecla (Enter, Tab, Escape...) |
| `agent-browser wait --load <state>` | Espera carregamento (`networkidle`, `domcontentloaded`) |
| `agent-browser screenshot <arquivo.png>` | Screenshot |
| `agent-browser close` | Fecha browser |

## Workflow típico (via agente com skill)

```
Usuário: "Teste a responsividade do header do meu projeto local (localhost:3000)"

Agente (com skill agent-browser):
1. agent-browser open http://localhost:3000
2. agent-browser snapshot -i          # descobre refs do header
3. agent-browser click @hamburger     # clica no hamburger (mobile)
4. agent-browser wait --load networkidle
5. agent-browser screenshot header-mobile.png
6. agent-browser open http://localhost:3000
7. [redimensiona via CDP ou novo snapshot mobile]
8. Verifica se menu abre/fecha corretamente
9. Retorna resultado + screenshots
```

## Exemplo do vídeo `texoSrIvWRQ`

**Playwright MCP** (determinístico):
```
"Use o playwright para testar o clique no botão agendar e ver se o dialogue abre com formulário, digite 'Maria Silva' no input nome"
```
→ Agente controla cada ação: click → wait → fill → verify.

**Agent Browser** (autônomo):
```
"Use o agent browser para testar a responsividade do header: diminua o tamanho da tela, ver se o botão hambúrguer abre o menu"
```
→ Agente: abre → snapshot → redimensiona → detecta breakpoint → clica hamburger → verifica menu → screenshot → relatório.

## Integração com skills ECC

| Skill ECC | Relação |
|---|---|
| `e2e-testing` / `browser-qa` | **Complementar**: Playwright MCP para testes determinísticos/regressão; Agent Browser para responsividade, variação UI, automações exploratórias. |
| `browser-qa` | Adiciona Agent Browser como ferramenta de "visual QA" automatizado. |
| `ui-demo` | Agent Browser pode gravar demos de fluxos complexos (navegação autônoma). |
| `video-editing` | Screenshots/videos do Agent Browser → material para edição. |

## Validação oficial (2026-08-20)

| Claim | Fonte oficial |
|---|---|
| Instalação: `npm i -g agent-browser` + `agent-browser install` | https://github.com/vercel-labs/agent-browser/blob/main/docs/src/app/page.mdx |
| Binário Rust nativo (7 MB), sub-ms overhead | https://github.com/vercel-labs/agent-browser/blob/main/docs/src/app/installation/page.mdx |
| Comandos: open, snapshot, click, fill, press, wait, screenshot, close | https://github.com/vercel-labs/agent-browser/blob/main/skill-data/core/SKILL.md |
| Auto-update detecta método original (npm/brew/cargo) | https://github.com/vercel-labs/agent-browser/blob/main/docs/src/app/installation/page.mdx |
| Skill para agentes (Cursor, Claude Code, Copilot) | Repo `vercel-labs/agent-browser` → `skill-data/` |
| Linux `--with-deps` para bibliotecas do Chrome | https://github.com/vercel-labs/agent-browser/blob/main/docs/src/app/page.mdx |

## Referências

- **Repo oficial**: https://github.com/vercel-labs/agent-browser
- **Documentação**: https://agent-browser.dev
- **Skill data**: https://github.com/vercel-labs/agent-browser/tree/main/skill-data
- **Playwright MCP** (baixo nível): https://playwright.dev/docs/mcp
- **Vídeo origem**: `texoSrIvWRQ` — @Sujeitoprogramador (2026-08-20)
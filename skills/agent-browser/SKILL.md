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

## Terceira opção: browser-use/browser-harness (CDP direto, enriquecimento 2026-08-24)

Fonte `-EX9I2iYNkU` (Attekita Dev); validado em github.com/browser-use/browser-harness + PyPI `browser-harness`:

- **O que é**: skill que conecta o LLM ao **seu Chrome já aberto** via um websocket CDP editável; o agente lê a **accessibility tree** (`Accessibility.getFullAXTree`) em vez de seletores CSS → imune a mudança de classes/renomeação; escreve helpers reutilizáveis em `agent_helpers.py` no workspace (o harness melhora a cada tarefa).
- **Diferencial vs Playwright MCP**: usa o navegador real com a sua **sessão autenticada** (logins, cookies) — resolve casos tipo "tirar print do YouTube Studio para relatório" onde API não serve e login é obrigatório.
- **Quando usar cada um**: Playwright MCP = teste determinístico/CI · Agent Browser = objetivo em linguagem natural sem sessão · browser-harness = sessão autenticada real + páginas hostis (classes randomizadas, popups z-index).
- ⚠️ Segurança: agente age COM seu usuário logado — use conta com permissão mínima/read-only quando possível; modelo fraco pode escrever script ruim que quebra a página (visto em stress test do vídeo).

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
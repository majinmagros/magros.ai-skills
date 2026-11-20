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
```

## Decision-plane barato (leva YouTube rodada 9)

Para browser-use com custo sob controle: lista numerada de controles, refresh de contexto a cada step, 1 request = 1 escolha (op + target), texto gerado por modelo barato, timer excluindo startup, custo medido sem infra. Se o decision custar mais que a acao, simplifique a pagina primeiro (ver defuddle-leitura-limpa).

## Jev: decision model de 1 pergunta (leva YouTube 2026-10-15)

Fonte: SimonScrapes `@SimonScrapes/zac3kEUwIlg` ("You Should Be Using Jev's Browser Agent, Here's Why", 2026-10-09). Complementa a seção "Decision-plane barato" acima.

- **O que é**: Jev é um modelo de julgamento (não conversa): input = state (texto) + pergunta, output = resposta entre as opções + confidence. ~4¢/milhão de tokens de input (output geralmente grátis), ~1/3s por decisão, milhares/segundo.
- **Loop no browser**: (1) agente numera os elementos visíveis; (2) Jev responde 2 perguntas (o que fazer? qual target?) → ação + confidence; (3) confidence ≥ 0.7 segue local; abaixo disso escala para o Claude.
- **Pitfalls**: cookie banners, iframes/upload invisíveis na árvore de acessibilidade, falso "ready" → verificação via Claude; memória das últimas 5 ações para encadear metas curtas.
- **Setup**: <15 min; open source (browserless.com); a browser-use refez o agente em Jev → voo Google em 7s (1092 → 101 requests). Habilidade-chave da skill: formular as perguntas certas e agrupar elementos.

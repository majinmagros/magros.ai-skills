---
name: claude-code-mods
description: "Use when customizing Claude Code itself with Mods — middleware event handlers ($, e, next) that observe, rewrite, or take over tool calls, prompts, and UI rendering. Triggers on \"claude mod\", \"mods\", \"ui.render\", \"tool.call hook\", \"custom pane\", \"plugin modules\"."
metadata:
  origin: ECC
  source_docs:
    - https://code.claude.com/docs/en/plugins/mods/overview
    - https://code.claude.com/docs/en/plugins/mods/reference
    - https://code.claude.com/docs/en/plugins/mods/events
    - https://claude.dev/blog/getting-started-with-claude-code-mods/
  video_source: "yUuFvL1lK4k - Mods in Claude Code (official Claude channel)"
---

# Skill: claude-code-mods — Middleware Dentro do Claude Code

Um **Mod** e um plugin cujo codigo registra handlers de eventos (hooks) que
rodam **dentro** do Claude Code — nao como shell command via settings, mas
como funcoes carregadas uma vez e mantidas na sessao. Cada hook ve um evento
(tool call, permission check, prompt submetido, parte da UI sendo desenhada)
e pode **observar**, **reescrever** ou **assumir** o evento. Codigo copy-paste
em `references/mods-api.md`.

Requisito: Claude Code 2.1.287+. Mods vêm ligados por padrao. A API pode mudar
entre releases — os types que o Claude Code gera em `.claude-plugin/types/`
a cada load sao a autoridade para a sua versao, nao esta skill.

## Quando usar

- Voce quer mudar como o Claude Code se comporta: o que renderiza, o que entra
  no prompt, que tool calls ele faz, UI propria, skills e commands novos
- Voce quer um pane customizado (ex.: nivel de contexto ao vivo acima do
  prompt, lista de agentes com start em 1 clique, contador de tool calls)
- Voce quer reescrever um evento antes de seguir (ex.: mascarar e-mails na tela)
- Voce quer auditar ou policiar eventos (ex.: hook curinga como log duravel)
- Duvida de sintaxe: `plugin.json`, `hooks.json` com `modules`, `register(on)`

## Quando NAO usar

- Hook simples que roda um shell command por evento → settings hooks resolvem;
  use `hookify-rules` para warn/block por regex
- Regra probabilistica que deveria ser deterministica → `rules-to-hooks-auditor`
- Agente gerenciado via API Anthropic (sem rodar dentro do Claude Code) →
  use `claude-managed-agents-patterns`
- Auditoria de SaaS vibe-coded → use `vibe-security-scanner`

## Validacao Oficial

| Claim | Status | Fonte |
|---|---|---|
| Mod = plugin + `modules` em `hooks.json` + modulo que exporta `register(on, options)` | OK | docs overview + reference + video yUuFvL1lK4k |
| Hook recebe `($, e, next)`; `e` e dado congelado, mudar = passar copia a `next` | OK | docs events + reference |
| 3 movimentos: observar (`next(e)`), reescrever (`next(copia)`), assumir (retorna sem `next`) | OK | docs events + video |
| Chain em ordem de origem (prepend/user/append/builtin, engine por ultimo); primeiro registrado envolve os demais (onion) | OK | docs events + issue anthropics/claude-code#91870 |
| Settings hooks `PreToolUse` (managed) rodam antes do primeiro `tool.call`; `tool.check` dispara depois | OK | docs events |
| Estado sobrevive a hot reload so em `$.state`, nao em variaveis do modulo | OK | blog claude.dev (cada save re-roda `register` + `session.start`) |
| `claude plugin validate` lista eventos e chamadas; `--strict`/`--json` disponiveis; `claude plugin test` roda `*.test.ts` | OK | docs reference + blog claude.dev |
| Desligar: aba Installed em `/plugin`, `--safe-mode`, `"disableAllHooks": true`; built-ins nao desinstalam | OK | docs overview |
| Mod pode ir no mesmo plugin que skill e MCP server | OK | docs overview |
| Render-only nao chega ao modelo (mascarar na tela nao muda o que o modelo viu) | OK | video yUuFvL1lK4k |

## Os 3 Movimentos (resumo — codigo em `references/`)

```js
export function register(on) {
  // 1. OBSERVAR: conta e deixa passar
  on('tool.call', async ($, e, next) => next(e));
  // 2. REESCREVER: passa copia modificada (nunca mute `e` — e congelado)
  on('prompt.submit', async ($, e, next) => next({ ...e, text: e.text.trim() }));
  // 3. ASSUMIR: responde voce, o Claude Code nao faz a parte dele
  // on('command.run', { command: 'hello' }, async () => ({ text: 'Hello' }));
}
```

- `$` e a mods API: todo efeito fora do seu codigo passa por ela (`$.fs`,
  `$.ui`, `$.session`, `$.state`, `$.command`, `$.process`, `$.http`).
  Sem chamada ambiente — por isso `claude plugin validate` consegue listar
  tudo que o mod faz antes de instalar.
- `on(evento, matcher?, hook)`: matcher filtra pelos campos do evento
  (ex.: `{ tool: 'Bash' }`, `{ command: 'hello' }`).
- Props do evento vivem em `e.props`, nao direto em `e`.

## Estrutura Minima

```text
meu-mod/
├── .claude-plugin/
│   ├── plugin.json        # manifest normal de plugin (+ "types" se usar $.state)
│   └── types/             # gerado pelo Claude Code a cada load (autoridade local)
├── hooks/
│   ├── hooks.json         # { "modules": ["./register.js"] } — EXATAMENTE um modulo
│   └── register.js        # exporta register(on, options) — .js/.mjs/.ts/.tsx etc.
└── types/
    └── index.d.ts         # contrato de estado (PluginState), se usar $.state
```

Carregar: `claude --plugin-dir ./meu-mod` (CLI) ou pasta no settings global
(app desktop, que nao aceita flags). A pasta e observada: cada save recarrega
na sessao atual. Compartilhar: mesmo fluxo de plugin (marketplace repo).

## Seguranca (leia antes de instalar mod de terceiro)

1. Rode `claude plugin validate ./pasta` e leia as linhas `hooks:` e `calls:` —
   elas dizem que eventos o mod ve e o que ele pode fazer.
2. Um mod acima de voce na chain ve o evento antes e pode engolir `next`;
   admins fazem prepend para controle, auditoria e allowlist.
3. Um mod que responde `tool.call` sem chamar `next` impede os settings hooks
   comuns de rodarem — entenda quem e o ultimo a decidir.
4. Para debugar: `/plugin` (aba Installed) mostra os mods; `--safe-mode`
   desliga tudo por uma sessao.

## Anti-Patterns

- Mutar `e` direto (e congelado — nada acontece ou quebra; passe copia a `next`)
- Guardar estado em variavel do modulo (some no hot reload; use `$.state`)
- Fazer trabalho pesado/bloqueante no hook (ele segura o evento; respeite
  `next.budget` e `next.signal`)
- Confundir tela com modelo (mascarar no render nao limpa o que o modelo ja viu)
- Esperar eventos que o Claude Code nao expoe (o mod so ve o que a versao expoe;
  confira nos types gerados)

## Related Skills

- `hookify-rules` — settings hooks por regex (warn/block, sem codigo dentro do engine)
- `rules-to-hooks-auditor` — migrar regra probabilistica para hook deterministico
- `claude-managed-agents-patterns` — agentes gerenciados via SDK (fora do Code)
- `claude-md-auditor`, `doctor` — limpar contexto/instrucoes em vez de mascarar via mod
- `sast-gate-pr` — gate deterministico de seguranca no workflow ate o PR

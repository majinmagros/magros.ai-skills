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
  video_source_update: "4Jp0CtfXjz0 - Stop Using Claude Code Without These 14 Mods (@maestrosdaia, 2026-10-26)"
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

## Criacao Rapida (fluxo do video, 2026-10-26)

1. `claude update` — mods exigem **2.1.287+** (o video roda em 2.1.305).
2. Descreva o mod em linguagem natural ("cria um mod que mostra X acima da
   caixa de mensagem"), no app desktop ou no VS Code.
3. O Claude Code ja traz a skill embutida **`plugin authoring`**, que sabe
   montar `plugin.json` + `hooks.json` + modulo. Aceite o hot reload quando
   ele oferecer: o mod aparece na sessao atual assim que fica pronto.
4. Ajuste por conversa ("muda a cor, move para a direita") — nao precisa
   editar o codigo na mao.
5. **Mod criado numa sessao e temporario por padrao.** Se gostou, peca
   explicitamente para salvar como plugin; so assim ele carrega em toda
   sessao. Revisar antes de instalar faz parte do passo.
6. Ligar/desligar sem desinstalar: `/plugin enable <nome>`.

## Catalogo: 14 Mods que Valem a Pena

Oficiais (Anthropic):

| Mod | O que faz |
|---|---|
| **Token Weather** | "Previsao do tempo" da janela de contexto acima da caixa de mensagem: quanto da memoria da conversa ja foi ocupado. |
| **Blast Radius** | Intercepta operacao arriscada (apagar arquivo/pasta) e mostra exatamente o que sera deletado, com botoes continuar/cancelar. |
| **Replay Theater** | Comando `/replay`: reve cada edicao da rodada, arquivo por arquivo, antes/depois — serve para revisao de texto tambem. |
| **You Should Know** | Um segundo agente le a resposta e puxa para cima o ponto que voce nao pode esquecer (ex.: custo escondido). Gasta token extra. |
| **Next Steps** | Ao fim de cada rodada sugere 3 proximos passos (corrigir bug, juntar mudancas, rodar teste) ou descartar. |

Comunidade:

| Mod | O que faz |
|---|---|
| **Progresso + subagentes** | Quanto falta para o Code terminar; com subagentes, barra lateral por ajudante (modelo, andamento, custo) — da para dar mascote. |
| **Temas visuais** | Troca cores/icones sem mexer no fluxo (Dracula, Tokyo Night); aceita a paleta da sua marca. O mais seguro para comecar. |
| **Painel de arquivos** | Arquivo em edicao brilha, fica verde quando salvo; util ate em pasta de documentos (imposto de renda). |
| **Cronometro de cache** | Avisa 5 min antes do cache esfriar e estima o custo da proxima mensagem; opcao de mensagem minima para manter quente ou passar a sessao para conversa nova. |
| **Modo gravacao** | Troca dados sensiveis por tags na tela; o modelo continua trabalhando com o dado real, so a gravacao fica protegida. |
| **Painel do `/goal`** | Meta, tempo decorrido, lista de tarefas e % concluido; varias sessoes num lugar so. |
| **Anti-colisao** | Antes de editar, checa se o arquivo mudou nos ultimos 30 min; pergunta continuar / copia de trabalho / cancelar. |
| **Aprende com correcoes** | Quando voce corrige o Claude, um banner pergunta se salva como regra no `CLAUDE.md` ou na skill. |
| **Navegador lateral** | Navegador real ao lado do chat para revisar a pagina criada ou PR do GitHub sem trocar de janela. |

**Custo:** mod que chama modelo ou segundo agente (You Should Know) consome
limite; mod so de codigo roda fora do modelo e **nao gasta token**. Os cinco
mods sugeridos no video eram todos code-only. **Seguranca:** mod de terceiro
roda com o mesmo acesso do Claude Code (arquivos, chaves, rede) — `claude
plugin validate` + leitura das linhas `hooks:`/`calls:` antes de instalar.

## Prompt: 5 Mods a Partir do Seu Historico

O melhor ponto de partida quando voce nao sabe o que quer:

```text
Leia os meus históricos de sessão do Claude Code, os mais recentes que você
conseguir acessar, identifique o que eu repito com mais frequência, quais
tarefas faço toda semana, onde perco tempo e onde já tive erros caros.
Com base nisso, sugira os cinco mods do Claude Code que mais me ajudariam a
economizar dinheiro, andar mais rápido e me manter organizado.
Para cada um: nome, o que ele mostra na tela, qual evento ele escuta, se
gasta tokens ou é só código, e um prompt pronto para eu pedir a criação.
Não crie nada ainda, só lista.
```

No exemplo do video, a leitura de ~70 sessoes em 50 dias (6 pastas) achou um
loop repetido 22-23x ("abrir o ultimo teleprompter") em que uma sessao leu
725 mil tokens de cache so para achar um arquivo. Escolha um mod da lista,
peca para criar e, se aprovar, peca para salvar como plugin.

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

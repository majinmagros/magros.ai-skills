# Mods API — Referencia Pratica

Esqueletos ilustrativos baseados na doc oficial e no video yUuFvL1lK4k.
Nomes exatos de eventos, matchers e metodos: confira nos types gerados em
`.claude-plugin/types/` da SUA versao — eles sao a autoridade, nao este arquivo.

## 1. Arquivos base

`.claude-plugin/plugin.json` (manifest normal de plugin):

```json
{
  "name": "meu-mod",
  "version": "0.1.0",
  "description": "Meu primeiro mod",
  "types": "./types/index.d.ts"
}
```

`hooks/hooks.json` (um mod tem EXATAMENTE um modulo):

```json
{
  "modules": ["./register.js"]
}
```

Pode dividir settings hooks comuns (`hooks`) e o modulo (`modules`) no mesmo
`hooks.json`. `options` do `register` recebe os `userConfig` do manifest.

`types/index.d.ts` (obrigatorio se escrever em `$.state`):

```ts
interface PluginState {
  'meu-mod.contador': number;
}
```

## 2. Exemplo A — observar: contador de tool calls no spinner

Dois hooks cooperando via `$.state` (nao via variavel do modulo):

```js
export function register(on) {
  on('tool.call', async ($, e, next) => {
    const n = ((await $.state.get('meu-mod.contador')) ?? 0) + 1;
    await $.state.set('meu-mod.contador', n);
    await $.ui.rerender(); // pede novo desenho; nomes exatos nos types locais
    return next(e);
  });

  on('ui.render', async ($, e, next) => {
    const n = (await $.state.get('meu-mod.contador')) ?? 0;
    // adiciona a contagem ao spinner mantendo o desenho original
    return next({ ...e, props: { ...e.props, suffix: ` · ${n} tool calls` } });
  });
}
```

## 3. Exemplo B — reescrever so na tela: mascarar e-mails ate o hover

Evento de render; o modelo nunca ve a versao mascarada (separacao
tela-vs-modelo, conforme o video oficial):

```js
export function register(on) {
  on('ui.render', async ($, e, next) => {
    const text = e.props?.text ?? '';
    if (!text.includes('@')) return next(e);
    // constroi bloco que so revela o texto no hover e responde sem next():
    // o Claude Code renderiza a sua versao em vez da dele
    return { text, masked: true };
  });
}
```

Regra de bolso: mascarar na tela NAO limpa segredo do contexto do modelo.
Para segredo de verdade, use policy no `tool.call`/`tool.check` (bloquear ou
reescrever o evento), nao cosmetico no render.

## 4. Exemplo C — assumir: slash command proprio

```js
export function register(on) {
  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'hello', description: 'Say hello' });
    return next(e);
  });

  on('command.run', { command: 'hello' }, async () => ({ text: 'Hello' }));
}
```

## 5. Ordem da chain (onion) — o que importa na pratica

- Ordem: `prepend` > `user` > `append` > `builtin` > engine (`core`).
  O primeiro mod ve o evento antes e o resultado depois; ele decide se os
  demais rodam. Mod posterior nao impede mod anterior de ver o evento.
- Dentro de um modulo, hooks rodam na ordem das chamadas a `on()`.
- `next.to(e, tier)` pula para tier posterior (`append`/`builtin`/`core`);
  so quem esta em `prependPlugins`/`appendPlugins` pode chamar.
- Erros: `.catch(handler)` no registro; la, `next.error.kind` e
  `throw`/`timeout`/`re-entry`, com `next.error.message`/`cause`.
- `next.budget.ms` / `next.budget.remainingMs`: limite de tempo do hook.
- `next.signal`: aborta quando o evento e abandonado.
- `next.origin`: `{ plugin, tier }` de quem disparou (`engine`/`core` = o
  proprio Claude Code).

## 6. Validar, testar, desligar

```bash
claude plugin validate ./meu-mod          # eventos (hooks:) + chamadas (calls:)
claude plugin validate ./meu-mod --strict # warnings viram erro
claude plugin validate ./meu-mod --json   # relatorio legivel por maquina
claude plugin test ./meu-mod              # roda *.test.ts contra o runtime real
```

- Testes `*.test.ts` registram hooks com `on` DEPOIS do mod na chain e
  stubam o que o engine responderia (ex.: controlar `$.session.usage()`).
- `/plugin` (aba Installed): ver mods, desabilitar um, ver built-ins
  (nao desinstalam; a tabela diz como desligar cada um).
- `--safe-mode`: sessao sem nenhum mod instalado. `"disableAllHooks": true`
  no settings desliga mods + settings hooks + status line custom.

## 7. Troubleshooting rapido

| Sintoma | Causa provavel |
|---|---|
| Nada acontece, sem erro | Evento nao existe nessa versao; modulo fora do(s) caminho(s) de `modules`; `register` nao exportado |
| `claude plugin validate` reclama de estado | `types/index.d.ts` ausente ou sem `"types"` no manifest |
| Estado zera ao salvar | Variavel de modulo em vez de `$.state` (cada save re-roda tudo) |
| Settings hook parou de rodar | Um mod respondeu `tool.call` sem `next` (comuns rodam depois do ultimo `next`) |
| UI nao atualiza | Faltou pedir re-desenho apos mudar estado; ler props em `e.props` |
| Plugin antigo quebrou | `modules` desconhecido em versao velha pode derrubar o `hooks.json` inteiro — versao minima 2.1.287 |

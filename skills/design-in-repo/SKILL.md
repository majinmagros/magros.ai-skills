---
name: design-in-repo
description: Version design files inside the repo as source of truth. Use when saving .pen JSON to design/, avoiding cloud-only design, binary merge conflicts, splitting tokens lib vs pages. TRIGGER when: design in repo, .pen JSON, gitattributes binary, design tokens lib, design conflict. Gatilhos PT: design versionado no repo, salvar .pen, conflito de design, biblioteca de tokens, nunca editar JSON na mão.
---

# Design in Repo

## Quando usar

- Design precisa ser versionado junto do código, não só na nuvem.
- Arquivos `.pen` (JSON) vivem em `design/`.
- Time sofre com merge de design ou design desatualizado vs. código.
- Precisa ler design localmente sem depender de app/nuvem.

## Passos

1. **Salve o `.pen` JSON em `design/`.** Estrutura sugerida: `design/lib/` (tokens, componentes) + `design/pages/<area-ou-time>/`. Commit junto da PR que implementa.
2. **Leia local, não na nuvem.** Use `cat` / `JQ` / `grep` local para inspecionar tokens, telas e diffs. Nuvem é espelho, repo é oráculo.
3. **Trave o merge como binário.** Em `.gitattributes`: `*.pen merge=binary diff off`. Nunca faça merge textual de `.pen`.
4. **Separe lib de pages.** `lib` = tokens e componentes compartilhados (dono: design system). `pages` = uma pasta por área/time. Isso reduz conflito e deixa ownership claro.
5. **Resolva conflito regenerando, nunca editando.** Conflito em `.pen`? Descarte um lado e regenere pelo app a partir da versão canônica. Nunca edite JSON na mão para mudança semântica (cor, layout, hierarquia).
6. **Edição manual só para metadado trivial.** Renomear arquivo, mover pasta, bump de versão: ok via texto. Mudança visual/semântica: sempre pelo app, depois exporte para `design/`.

## Regras

- `*.pen` é binário para o git. Sem exceção.
- JSON editado na mão nunca representa decisão de design.
- `lib` compartilhada tem dono único. Time não edita token global sem review.
- Design fora de `design/` não existe para CI nem para review.
- Nuvem divergiu do repo? O repo vence até reconciliação explícita.

## Related skills

- `design-system` — pilares e contrato do design system.
- `cloud-design-prototyping` — prototipação na nuvem antes de versionar.

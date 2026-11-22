---
name: script-backed-skill
description: "Use when authoring a skill whose work is deterministic — keep SKILL.md thin (decision table + hard rules), push exact work into scripts, and accumulate fixes in lessons.md. Triggers on \"script-backed skill\", \"skill com scripts\", \"SKILL fino\", \"lessons.md\", \"skill determinística\", \"skill que edita vídeo\", \"skill confiável\"."
metadata:
  origin: ECC
---

# Script-Backed Skill

Arquitetura de skill em que o modelo **decide** e os scripts **executam**. O `SKILL.md` fica fino; a parte exata (timestamps, contagens, conversões, validações) mora em scripts determinísticos.

> Fonte: ColeMedin `a90pZ1DSyls` (skill de edição de vídeo) e Maestros `iSGK7Tb4GPE` (skill Vagalume). O padrão aparece nos dois: o agente orquestra, o script faz o trabalho que não pode variar.

## Quando usar

- A skill repete o mesmo cálculo/formatação em toda execução (cortes, timecodes, renomear, validar schema).
- O resultado precisa ser **verificável** (recontar, re-transcrever, comparar com a fonte).
- A skill é longa e o modelo se perde no meio (sintoma: pula etapa, ignora metade da lista).
- Você já corrigiu o mesmo erro duas vezes em linguagem natural.

## Quando NÃO usar

- Tarefa puramente criativa/julgamento (copy, design direction) — script não ajuda.
- Uma execução única que não vai repetir.
- O script precisaria de credencial ou rede instável para funcionar.

## As 3 camadas

| Camada | O que contém | Tamanho-alvo |
|---|---|---|
| `SKILL.md` | tabela "tipo de tarefa → etapas", regras rígidas, quando parar | 100–250 linhas |
| `scripts/` | helpers determinísticos com contrato fixo | 1 script por etapa |
| `references/` | `lessons.md` (regras em prosa), `brand.json`/config, exemplos | cresce com o uso |

O `SKILL.md` **não** repete o que o script já garante. Se o script valida timecode, o SKILL.md só diz "rode o validador e pare se falhar".

## Tabela de decisão (o coração do SKILL.md)

```markdown
| Tipo de tarefa | Etapas |
|---|---|
| talking head | 1,2,3,4,5 |
| tela + bolha | 1,2,3,4,5,6 |
| short | 1,2,3,5,7 |
| curso longo | 1,2,3,4,5 |
```

Regra: cada linha é uma **composição** de etapas, nunca uma cópia das etapas. Isso evita contexto redundante.

## Contrato dos scripts

Todo script da skill deve:

1. Aceitar entrada por argumento ou `--input arquivo.json`.
2. Devolver **JSON no stdout** (`{ ok, data, warnings, errors }`), log humano no stderr.
3. Sair com código `0` (ok), `1` (falha recuperável), `2` (entrada inválida).
4. Ser idempotente: rodar duas vezes não duplica efeito.
5. Ter `--dry-run` quando altera arquivo.
6. **Nunca** engolir exceção: erro vira `errors[]` com caminho e linha.

## `lessons.md`

Regras que não merecem script, escritas em linguagem natural, uma por linha, com data:

```markdown
- 2026-11-20 — não cortar respiração no meio de palavra; o detector confunde "hh" aspirado.
- 2026-11-21 — transição padrão é 12 frames, não 6; 6 fica brusca em corte seco.
- 2026-11-22 — se o clipe tem menos de 2 s, não aplicar zoom.
```

O agente lê `lessons.md` antes de executar e **anexa** uma linha quando o usuário corrigir algo que não virou script.

## Verificação (o passo que separa skill boa de skill bonita)

Sempre que a skill transforma um arquivo, rode um **verificador independente** no output:

| Skill | Verificador |
|---|---|
| edição de vídeo | re-transcrever o output e comparar palavra por palavra com a fonte |
| geração de prompt | lint do schema (campos obrigatórios + timecodes crescentes) |
| refactor | testes + diff de comportamento |
| planilha/relatório | reabrir o arquivo e conferir colunas/tipos |

Se o verificador não existir, crie antes de considerar a skill pronta.

## Receita

1. Escreva a tabela de decisão com 3–5 tipos de tarefa reais.
2. Liste as etapas e marque quais são **determinísticas**.
3. Para cada etapa determinística, escreva o script e o contrato JSON.
4. No `SKILL.md`, deixe só: quando usar, tabela, ordem, regras rígidas, verificador.
5. Rode uma tarefa real de ponta a ponta.
6. Toda correção que não virar script → `lessons.md`.
7. Repita até o usuário não precisar corrigir nada duas vezes.

## Anti-padrões

- **SKILL.md gigante** com pseudocódigo que o modelo reinterpreta a cada run.
- **Script que decide** (esconde regra de negócio) — decisão tem que ficar visível no SKILL.md.
- **Script sem `--dry-run`** alterando arquivo do usuário.
- **Verificador que confia no próprio output** (ex.: contar cortes com a mesma função que os fez).
- **`lessons.md` virando diário** — só entra regra acionável.

## Exemplo

```text
skill: video-edit
SKILL.md  → tabela tipo→etapas + regras + "rode verify.mjs no final"
scripts/transcribe.mjs  → { words: [{w, start, end}] }
scripts/cut.mjs         → recebe cutlist.json, aplica, devolve timeline
scripts/verify.mjs      → re-transcreve e compara com a fonte
references/lessons.md   → regras acumuladas
references/brand.json   → cores/fonte/transição padrão
```

## Checklist

- [ ] Tabela de decisão cobre os tipos reais de tarefa
- [ ] Cada etapa determinística tem script com contrato JSON
- [ ] Scripts têm `--dry-run` e código de saída definido
- [ ] Existe verificador independente do output
- [ ] `lessons.md` é lido antes e anexado depois
- [ ] SKILL.md < 250 linhas e sem pseudocódigo redundante

## Skills relacionadas

- `criar-skill` — autoragem e estrutura geral
- `eval-harness` — medir se a skill melhora o resultado
- `verification-loop` — provar o output no app/arquivo real
- `video-editing` — caso concreto que originou o padrão

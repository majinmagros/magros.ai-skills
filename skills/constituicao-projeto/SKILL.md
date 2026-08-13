---
name: constituicao-projeto
description: Use to create or amend a project constitution — the non-negotiable principles that govern all future work. Triggers on "/constituicao-projeto", "constituição do projeto", "princípios inegociáveis do projeto", "regras de governança", "atualizar a constituição". Cria/atualiza o documento de princípios com versionamento semântico, Scope Guard e Sync Impact Report. Só escreve o arquivo da constituição — nada mais.
---

# Skill: /constituicao-projeto — Princípios inegociáveis do projeto

Crie ou atualize a **constituição do projeto** — o documento de princípios
inegociáveis que todas as demais fases (especificar, planejar, auditar,
implementar) leem e respeitam. Arquivo padrão: `.specify/memory/constitution.md`
ou `docs/constituicao.md` (use o que já existir no projeto; sem preferência,
crie `docs/constituicao.md`).

## Scope Guard

O trabalho desta skill limita-se à própria constituição. Templates e fases
dependentes leem a constituição em tempo de execução e não são modificados aqui.

- Classifique cada parte do input do usuário como conteúdo de constituição ou
  intenção separada (não-governança).
- Input contendo implementação de feature, geração de código, refatoração,
  build ou deploy: **NÃO execute**. Extraia como intenção adiada.
- Proibido criar/modificar/deletar código, rotas, componentes, testes ou
  artefatos não relacionados à constituição.
- Na dúvida se algo é conteúdo de constituição: pergunte antes de mudar.
- Ao final, inclua seção `Próximas Ações` para cada intenção adiada, citando a
  intenção original e a fase adequada (ex.: especificar) — sem invocá-la.
  Sem intenções adiadas → omita a seção.

## Passos

### 1. Carregue ou inicialize

- Constituição existente: leia como fonte dos valores e emendas atuais;
  preserve o que ainda se aplica ao aplicar a nova estrutura.
- Inexistente: use a estrutura base abaixo como documento inicial.
- Identifique todo placeholder `[IDENTIFICADOR_EM_CAIXA_ALTA]`.
- O usuário pode querer menos ou mais princípios que o template — se um número
  for especificado, respeite.

**Estrutura base** (adapte, não burocratize):

```markdown
# Constituição do Projeto — <nome>
Versão: <X.Y.Z> | Ratificada: <AAAA-MM-DD> | Última emenda: <AAAA-MM-DD>

## Princípios
### I. <Nome sucinto>
<Regras inegociáveis em frases declarativas e testáveis.
 Racional explícito quando não óbvio.>

### II. ...

## Governança
<Procedimento de emenda, política de versionamento,
 expectativas de revisão de compliance.>
```

### 2. Preencha placeholders

- Input do usuário supre o valor → use. Senão, infira do contexto do repo
  (README, docs, versões anteriores).
- `DATA_RATIFICACAO`: data de adoção original (desconhecida → pergunte ou TODO).
- `DATA_ULTIMA_EMENDA`: hoje se houve mudanças, senão mantenha a anterior.
- `VERSAO_CONSTITUICAO` segue semver:
  - **MAJOR**: remoção ou redefinição incompatível de princípio/governança.
  - **MINOR**: princípio/seção nova ou expansão material de orientação.
  - **PATCH**: clarificações, redação, typos, refinamentos não-semânticos.
- Tipo de bump ambíguo → proponha o raciocínio antes de finalizar.

### 3. Redija a atualização

- Todo placeholder substituído por texto concreto; placeholder mantido de
  propósito exige justificativa explícita.
- Cada princípio: linha de nome sucinta, regras inegociáveis (bullets ou
  parágrafo), racional explícito se não óbvio.
- Seção Governança lista: procedimento de emenda, política de versionamento,
  revisão de compliance.

### 4. Sync Impact Report

Preponha como comentário HTML no topo do arquivo após a atualização:

```html
<!--
Sync Impact Report
- Versão: 1.2.0 → 1.3.0 (MINOR)
- Princípios modificados: III. Testes (antigo "Qualidade")
- Seções adicionadas: Governança > Revisão de compliance
- Seções removidas: nenhuma
- TODOs adiados: nenhum
-->
```

### 5. Valide antes de gravar

- Nenhum token entre colchetes sem explicação.
- Linha de versão confere com o report; datas em ISO `AAAA-MM-DD`.
- Princípios declarativos, testáveis, sem linguagem vaga — "deveria" vira
  MUST/SHOULD com racional.

### 6. Grave e resuma

Sobrescreva o arquivo da constituição. Resumo final: nova versão + motivo do
bump, placeholders/TODOs adiados, mensagem de commit sugerida (ex.:
`docs: emenda da constituição para vX.Y.Z (adiciona princípio de testes)`),
e `Próximas Ações` para intenções adiadas.

## Estilo

Headings exatamente como na estrutura; uma linha em branco entre seções; sem
whitespace no fim de linha; linhas de racional legíveis (<100 chars ideal).

Update parcial (ex.: revisão de um princípio só) também passa por validação e
decisão de versão. Informação crítica faltando → `TODO(<CAMPO>): explicação`
+ registro no Sync Impact Report.

Escreva **apenas** o arquivo da constituição.

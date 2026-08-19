---
name: criar-skill
description: Use when creating, authoring, or refining Claude Code skills. Triggers on "cria uma skill", "skill nova", "gravar skill", "record a skill", "como criar skill", "melhora a skill", "4 regras de skill". Encodes the 4-step authoring process, Skill Creator / Record a Skill, the 3-layer structure, the DBS framework, the EADA filter, skill systems, and the Anthropic engineers' 4 rules.
---

# Skill: Criar-skill — autoragem de skills (do zero ou por refinamento)

Ensina a criar skills boas, seguindo o processo dos engenheiros da Anthropic
e os fluxos oficiais (Skill Creator / Record a Skill).

## 0. Antes de criar: o filtro EADA

Nem tudo vira skill. Antes de mapear pipeline, filtre a tarefa na ordem:

1. **Eliminate** — a tarefa pode sumir (não é necessária)?
2. **Automate** — é previsível (A+B=C)? Vira script/skill.
3. **Delegate** — outra pessoa/agente já resolve? Não duplique.
4. **Accelerate** — só agora melhora a forma de fazer.

Só prossiga quando a resposta for **Automate**. Se a tarefa é rara, subjetiva
ou muda a cada uso, ela provavelmente não é uma skill — é conversa.
(Teste de 3 perguntas para decidir criar uma skill: é repetitivo? é
previsível? você faz isso todo dia? Se sim pra todas, crie.)

## 1. Processo de criação (4 etapas — evita skill "teórica")

1. **Mapear o pipeline**: identifique EXATAMENTE o que a skill deve fazer, do
   início ao fim (etapa A → B → C → D). Não pule essa etapa.
2. **Caminhar com o agente**: execute o fluxo etapa por etapa em uma sessão,
   revisando e corrigindo cada resultado (não jogue tudo de uma vez).
3. **Iterar até funcionar**: só considera pronto quando o resultado final fica
   bom. Corrigir depois é caro; corrigir agora é barato.
4. **Materializar**: "revise todo o contexto desta conversa e crie uma skill
   baseada no que fizemos" — assim a skill nasce de experiência real, não de palpite.

> Erro mais comum: pedir "crie uma skill que faz X, Y e Z" do zero, sem contexto.
> É como dar um manual de 50 páginas a um funcionário novo e dizer "se vira".

### 1.1 Reverse engineering (atalho poderoso)

Em vez de descrever a skill, **crie o resultado final primeiro** (o artefato,
o relatório, o dashboard com dados reais) e depois peça: "crie uma skill que
reproduz este resultado". O resultado pronto vira o critério de aceite e o
exemplo nos `references/` — muito mais preciso do que especificar no vácuo.

## 2. Formas de autoragem

- **Skill Creator** (oficial): descreva a tarefa → ele pergunta até entender →
  formata e salva seguindo as convenções (frontmatter YAML + Markdown). Testa
  2–3 casos reais e gera um **eval reviewer** para aprovar/revisar.
- **Record a Skill** (Claude Cowork, Mac): grave tela + cliques + voz narrando →
  ele transcreve e gera a skill. Use SÓ quando não houver conector oficial —
  navegação por browser quebra quando o layout do site muda.
- **Manual**: você mesmo estrutura o arquivo (útil para refinar/editar).

## 3. Estrutura de uma skill (DBS + 3 camadas)

### Anatomia de pasta (framework DBS)

| Pasta/arquivo | D | Conteúdo |
|---|---|---|
| `SKILL.md` | **D**irection | Frontmatter (name+description) + workflow passo a passo + regras |
| `references/` | **B**lueprints | Arquivos estáticos: voz, marca, exemplos, templates, ICP |
| `scripts/` | **S**olutions | Código pro que LLM não faz bem: APIs, cálculos, formatação |

### Progressive disclosure (3 níveis)

| Nível | Carregado | Custo de contexto |
|---|---|---|
| Frontmatter (name + description) | **Sempre** | mínimo (é o que decide a ativação) |
| Corpo do `SKILL.md` | Só quando ativada | médio |
| `references/`, `scripts/`, assets | Sob demanda | zero até precisar |

Regras de ouro (medidas reais):
- **`SKILL.md` ≤ 200 linhas** — é sumário/TOC; o detalhe vai para `references/`.
- **Description ≤ 15k caracteres** (limite do formato); descrição em 3 partes:
  gatilho (quando usar) + não-gatilho (quando NÃO usar) + outcome.
- Ativação média de skills de marketplace é ~20% — descrição fraca é o
  principal motivo de skill que nunca dispara.

### As 3 camadas de qualidade

| Camada | O que é | Impacto |
|---|---|---|
| **Descrição/frontmatter** (`name` + `description`) | Decide QUANDO o agente usa a skill | Descrição ruim = skill nunca dispara. Use frases gatilho concretas. |
| **Passo a passo** | Instruções detalhadas, checklist, error handlers (o que NÃO fazer) | Quanto mais específico, mais previsível o resultado |
| **Ferramentas/referências** | Conectores, arquivos de referência, scripts determinísticos | Script (A+B=C) roda igual sempre; texto varia. Use script para o previsível. |

## 4. As 4 regras dos engenheiros da Anthropic

1. Tudo que se repete vira skill — "se o Claude é o celular, as skills são os apps".
2. Descrição é o gatilho de ativação (veja seção 3).
3. **Não crie skill gigante**: quebre em skills pequenas interligadas; valide cada
   uma antes da próxima; reutilize entre pipelines.
4. **Skill melhora a cada uso**: erro estrutural → atualize a SKILL, não
   contorne. Peça "revise o histórico e sugira mudanças, uma por uma pra eu aprovar".

## 5. Sistemas de skills (composição, não monólito)

Uma "skill system" é um **orquestrador + skills filhas modulares**. Anti-padrões:
skills isoladas sem orquestração e mega-skills que tentam fazer tudo.

- **Taxonomia útil** para organizar a biblioteca:
  - *brand skills* — padrão da casa (voz, design system, tom);
  - *function skills* — tarefas do dia a dia (gerar post, montar relatório);
  - *specialty skills* — regras do domínio (compliance, normas técnicas).
- **Chaining**: encadeie skills em sequência (ex.: gerar copy → passar pelo
  filtro de voz → publicar). Uma skill pode chamar/esperar a saída da outra.
- **Versionamento**: evolua por versões (não sobreescreva a história); num
  time, mantenha uma biblioteca central (ex.: Notion/Git) com routine
  agendada de sync.
- **Contexto de negócio** (voz, ICP, positioning) vive nas `references/`, não
  no corpo da skill — assim a skill é portável entre clientes/projetos.

## 6. Salvaguardas

- Skills de terceiros: >1/3 têm falhas (algumas maliciosas). Leia todo o
  `SKILL.md` antes de instalar; use fontes oficiais.
- Ideal: 3–5 skills ativas por contexto, não 12.
- Não precisa citar a skill no CLAUDE.md — o agente lê a descrição automaticamente.

## 7. Verificação (evals, não vibes)

- Teste a skill em um caso real. Se errou, atualize a SKILL (regra 4), não dê
  contorno pontual. Repita até o resultado esperado sair sem intervenção.
- **Evals/A-B**: defina 3–5 critérios mensuráveis (qualidade do output, pass
  rate, tokens/tempo) e compare versões da skill — qual melhora resultado de
  verdade vs só queima tokens? Um *eval reviewer* independente (como no Skill
  Creator) pontua cada caso de teste.
- **Learnings file**: a skill pode manter um `learnings.md`/`rules.md` que
  registra o que deu certo e errado em cada uso, e um *wrap-up* que propõe
  ajustes — a skill aprende com o próprio histórico (pode o `rules-distill`).
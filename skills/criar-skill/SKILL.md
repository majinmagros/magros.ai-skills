---
name: criar-skill
description: Use when creating, authoring, or refining Claude Code skills. Triggers on "cria uma skill", "skill nova", "gravar skill", "record a skill", "como criar skill", "melhora a skill", "degrees of freedom", "reference file over 100 lines", "head-100", "skill audit". Encodes the 4-step authoring process, Skill Creator / Record a Skill, the 3-layer structure, the DBS framework, the EADA filter, skill systems, and the Anthropic 9-rule update (Oct 2026: contents-list, degrees of freedom, per-model testing, 1-level refs, checklists, self-validation, portability).
---

# Skill: Criar-skill — autoragem de skills (do zero ou por refinamento)

Ensina a criar skills boas, seguindo o processo dos engenheiros da Anthropic
e os fluxos oficiais (Skill Creator / Record a Skill).

## Quando usar (gatilhos)

- "Cria uma skill pra essa tarefa repetitiva"
- "Grava como eu faço isso numa skill"
- "Essa rotina vira skill?"
- "Melhora essa skill existente"
- "Como estruturar uma skill nova?"

## Exemplo

```text
Tarefa: transcrever briefing de voz todo dia (repetitiva? sim; previsível? sim)
→ passa no filtro EADA (Automate) → mapear pipeline A→B→C→D
```

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

Regra skills-as-apps (Batch 17g, #80): nao reconstrua um agente por job —
o agente generalista ja le/escreve/chama tools; a skill e o app
(processo + contexto + scripts + exemplos). E nunca deixe o modelo
resolver 2x o mesmo problema tecnico — vire script dentro da skill
(scripts/ e para o que LLM faz mal).

Regra dial-density (Fase 2, 26/09/2026): cada escolha que a skill deve
impor vira valor duro (número, hex, threshold, lista fechada) ou never
duro — alvo ~1 dial por 100 palavras. Sem dial, o modelo devolve a
mediana do treino. Vale para qualquer domínio, não só design (ver
teste dial em `auditar-skills` § 4c).

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
- **Record a Skill** (gravação de tela + cliques + voz → gera a skill). Nota:
  não confirmado nas docs oficiais da Anthropic na validação de 2026-08 —
  confirme a disponibilidade atual antes de usar. Use SÓ quando não houver
  conector oficial — navegação por browser quebra quando o layout muda.
- **Manual**: você mesmo estrutura o arquivo (útil para refinar/editar).

## 3. Estrutura de uma skill (DBS + 3 camadas)

### Anatomia de pasta (framework DBS)

| Pasta/arquivo | D | Conteúdo |
|---|---|---|
| `SKILL.md` | **D**irection | Frontmatter (name+description) + workflow passo a passo + regras |
| `references/` | **B**lueprints | Arquivos estáticos: voz, marca, exemplos, templates, ICP |
| `scripts/` | **S**olutions | Código pro que LLM não faz bem: APIs, cálculos, formatação |

## 4. Seletor de template por grau de liberdade (leva YouTube rodada 7)

Escolha o template antes de escrever:

- **strict-API** — tarefa rígida, passos fixos, zero julgamento (ex.: validar PR contra checklist). SKILL.md curto, comandos literais, falha = parar.
- **flexible-guidance** — tarefa com variação, princípios + exemplos (ex.: revisar copy). Diretrizes + 2-3 exemplos bom/ruim, modelo preenche o resto.
- **conditional-workflow** — tarefa com ramificações (ex.: triagem). Árvore se/então explícita + critério de cada ramo + saída de cada folha.

Template errado = skill que nunca dispara (rígida demais) ou alucina (solta demais).

## 5. Validação em sessão limpa (leva YouTube rodada 7)

- **Teste em sessão sem contexto** — abra sessão nova (sem a memória do chat de criação) e rode 2-3 casos reais. A sessão de construção sempre parece melhor do que é.
- **Otimização > criação** — antes de criar, verifique se um ajuste na skill existente resolve (etapas determinísticas viram `scripts/`, decisões do modelo ficam no texto). Só crie quando o ajuste não couber.

## 6. As 9 regras novas da Anthropic (leva YouTube 2026-10-03)

Fonte: SimonScrapes `e7TY56-yIvM` ("Everything You Know About Skills IS OUTDATED", 2026-10-03) — resume o guia atualizado de best practices da Anthropic. Aplique em skills novas E audite as existentes (uma skill pode misturar níveis):

1. **Contents-list em refs >100 linhas (problema `head-100`)** — ao abrir um reference longo, o Claude roda `head -100` e decide se o resto importa; regra após a linha 100 "não existe". Todo arquivo de referência com mais de 100 linhas ganha um índice no topo espelhando os headings (ex.: API ref → authentication, core methods, advanced, error handling, examples).
2. **Degrees of freedom por passo** — o detalhe depende da fragilidade/variação: **high** = objetivo em texto (ex.: code review, draft de post — modelo decide o como); **medium** = template com settings (ex.: relatório semanal — charts true/false, markdown/HTML); **low** = comando exato, sem flags extras (ex.: migration de banco, invoice, delete — qualquer desvio tem consequência). Pergunta-guia: "o que acontece se o Claude fizer diferente?" Se nada muda, solte; se é consequente, trave. Low freedom quase sempre = `scripts/`, não mais texto.
3. **Teste por modelo** — o resultado depende do modelo; teste a skill em cada modelo que vai usá-la (Haiku/Sonnet/Opus/Fable). Modelos antigos pulavam passos (exigiam listas numeradas + ênfase); modelos reasoning novos pioram com excesso de prescrição (guia Fable 5: remova instrução se o modelo for melhor sem ela).
4. **Frontmatter declara o modelo-alvo** — no YAML da skill, registre com quais modelos ela foi testada. Perguntas por modelo: Haiku tem guidance suficiente? Sonnet está clara e eficiente? Opus não está over-explained?
5. **Corpo do `SKILL.md` <500 linhas** — trate o corpo como sumário; ao se aproximar do limite, quebre em arquivos separados. Scripts executam (não entram no contexto), então não custam janela.
6. **Refs a 1 nível do `SKILL.md`** — `skill.md → advance.md → details.md` faz o último elo ser lido só parcialmente. Liste tudo que a skill aponta e garanta link direto do `SKILL.md`; nada alcançável só via outro arquivo. Por área quando a skill cobre vários domínios (ex.: `finance.md`, `sales.md` — pergunta de revenue nunca carrega `marketing.md`).
7. **Checklist p/ processos ordenados** — o Claude copia p/ a resposta e dá tick; use SÓ quando a ordem importa (ex.: checar dados antes de montar o report). Passos curtos orientados a objetivo, não prescritivos; ex.: research synthesis em 5 linhas com o último passo "verify citations — se incompleto, volte ao passo 3".
8. **Self-validation loop** — draft → checa contra o guia (voz, brand, checklist) listando cada infração com a seção quebrada → revisa → repete até passar. Se o draft falhar por motivo fora do guia, sugira a regra nova no fim do run; aprovada, ela entra no doc e o próximo run já checa contra ela.
9. **Portabilidade (day-one)** — nunca assuma ferramenta instalada (a skill funciona na sua máquina porque você instalou a lib há 6 meses e esqueceu). Coloque a linha de install ao lado de cada script — se já instalado, o modelo pula.

**Auditoria rápida:** percorra `.claude/skills`, ache refs >100 linhas sem índice, refs aninhadas, checklists ausentes em fluxo ordenado, scripts sem install line, frontmatter sem modelo-alvo — corrija antes de criar skill nova.
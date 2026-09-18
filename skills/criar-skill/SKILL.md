---
name: criar-skill
description: Use when creating, authoring, or refining Claude Code skills. Triggers on "cria uma skill", "skill nova", "gravar skill", "record a skill", "como criar skill", "melhora a skill", "4 regras de skill". Encodes the 4-step authoring process, Skill Creator / Record a Skill, the 3-layer structure, the DBS framework, the EADA filter, skill systems, and the Anthropic engineers' 4 rules.
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
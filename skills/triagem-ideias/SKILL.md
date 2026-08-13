---
name: triagem-ideias
description: Use when the user pitches a raw idea and wants a go/kill decision before investing effort. Triggers on "/triagem-ideias", "vale a pena essa ideia?", "triagem de ideia", "go/kill", "devo investir nisso?". Pipeline intake→pesquisa→definição→formato→decisão: transforma ideia crua em decisão fundamentada (avançar, arquivar ou pivotar) com esforço mínimo de análise — antes de especificar ou codar.
---

# Skill: /triagem-ideias — Go/kill antes de investir

Ideia crua entra, **decisão fundamentada** sai. O objetivo não é construir —
é decidir com o mínimo de esforço se vale investir. Rode ANTES de especificar
ou planejar qualquer coisa.

## Pipeline (5 fases, cada uma com saída explícita)

### 1. Intake — capture a ideia como dita

- Registre a ideia nas palavras do usuário (1–3 frases).
- Anote: quem quer, que dor resolve, por que agora.
- NÃO melhore a ideia nesta fase — capture fielmente.

**Saída**: ficha da ideia (problema, público, resultado desejado).

### 2. Pesquisa — evidência rápida (timebox: ~15 min)

- A dor é real? Busque evidência: usuários reclamando, concorrentes
  resolvendo, alternativas existentes (skills do próprio repositório contam).
- Já existe algo que faz isso aqui? (duplicado = forte sinal de kill).
- Qual o custo estimado de construir vs. de NÃO ter?

**Saída**: 3–5 bullets de evidência, cada um com fonte.

### 3. Definição — afie o escopo mínimo

- Reescreva a ideia como UMA frase observável: "Com isso, [pessoa] consegue
  [resultado] sem [dor atual]."
- Liste o que está explicitamente FORA nesta primeira versão.
- Identifique a suposição mais arriscada ("se isso for falso, a ideia morre").

**Saída**: frase-escopo + fora-de-escopo + suposição crítica.

### 4. Formato — como seria a menor entrega

- Escolha o veículo mais barato que testa a suposição crítica: script, skill,
  documento, protótipo, experimento manual.
- Estime em unidades brutas: horas/dias, tokens/créditos, dependências.
- Defina o critério de sucesso do experimento (observável, binário).

**Saída**: veículo + estimativa + critério de sucesso.

### 5. Decisão — go / kill / pivot

Apresente um veredito único com justificativa:

- **GO** — evidência suficiente, custo aceitável → mão no próximo passo
  concreto (ex.: rodar `/plan` ou `clarificar` sobre a ficha).
- **KILL** — dor não comprovada, duplicado, ou custo > valor → arquive com
  motivo registrado (evita re-triagem futura da mesma ideia).
- **PIVOT** — a dor é real mas o formato está errado → redefina a
  frase-escopo e volte à fase 4 uma única vez.

Formato do veredito:

```markdown
## Veredito: GO | KILL | PIVOT
- Ideia: <frase do intake>
- Evidência-chave: <mais forte dos bullets>
- Suposição crítica: <qual é e como o formato a testa>
- Custo estimado: <bruto>
- Próximo passo: <ação concreta única>
```

## Regras

- Uma ideia por execução; fila de ideias → processe uma de cada vez e
  registre as demais como backlog.
- Sem evidência alguma na fase 2: o veredito padrão é PIVOT para um
  experimento de descoberta, não GO às cegas.
- Decisão é do usuário — a skill recomenda e entrega o veredito fundamentado;
  não comece a construir sem aprovação.
- Ideia aprovada segue para o fluxo de especificação (skill `clarificar` /
  `plan`); a triagem não gera implementação.

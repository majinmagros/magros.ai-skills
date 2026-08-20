---
name: humanizar-texto
description: Use when the user wants text that does not sound AI-generated — emails, posts, WhatsApp, e-commerce copy, replies. Triggers on "humanizar", "texto com cara de IA", "escrita parece IA", "texto robotizado", "AI slop", "reescreve pra não parecer IA". Detects and removes AI-typical writing patterns, keeps meaning and brand tone. Para UI/interface, use taste.
---

# Skill: Humanizar-texto — reescrita sem cara de IA

Reescreve textos para não serem identificados como gerados por IA. Identifica
os vícios, elimina, mantém a informação e o tom do contexto.

## 1. Padrões de AI-slop textual a CAÇAR

- **Travessão (—)** abusivo: em português informal não é comum.
- Adjetivos genéricos de hype: "inovador", "revolucionário", "vibrante",
  "dinâmico", "de ponta", "sem precedentes".
- Trios perfeitos ("X, Y e Z") e estruturas excessivamente simétricas.
- Conectivos padrão: "não se trata apenas de X, mas de Y", "além disso",
  "em suma", "é importante ressaltar".
- Generalizações vazias: "seu potencial é ilimitado", "resultados reais".
- Abertura/fechamento genérico de IA: "Neste artigo vamos explorar...",
  "Em conclusão, podemos afirmar que...".
- Hedging em excesso e listas com emojis de seta (→, ✅) onde não há lista.

## 2. Em vez disso

- Frases curtas, voz ativa, palavras concretas do dia a dia.
- Tom do canal: WhatsApp ≠ blog ≠ e-mail formal ≠ proposta de cliente.
- Deixe "imperfeições" humanas leves (contração, ordem de ideias natural).
- Fatos e números no lugar de adjetivos.

## 3. Processo (4 passos)

1. **Identificar** os vícios da lista na versão original (liste os encontrados).
2. **Reescrever** de forma natural, sem pedir permissão — já entregue a versão.
3. **Revisar** mantendo 100% da informação/marca (não inventar dado).
4. **Entregar** o texto final + nota curta: quais padrões foram removidos.

## 4. Regras

- Manter o tom, argumentos e fatos originais — humanizar não é mudar conteúdo.
- Se a marca tem voz própria, use exemplos anteriores (se fornecidos).
- Não enfeitar: humanizado ≠ mais floreado. Pelo contrário.

## 5. Modo watermark-bypass (EU AI Act art.50, Synth ID) — enriquecimento 2026-08-20

Quando o texto precisa passar em detectores de marca d'água (Anthropic/Google/OpenAI, EU art.50 deadline 2026-12-02, Synth ID):
1. **Paráfrase com variação lexical** — troque sinônimos de forma não-determinística (evite o padrão pi-like de escolha sequencial descrito em `lhaPanvj2Vg`).
2. **Quebra de padrão sintático** — altere ordem de orações, use voz ativa/passiva alternada, insira contrações leves.
3. **Loop de validação** — teste o output em 2-3 detectores públicos até `clean` (regra: não entregue sem teste se o caso for TCC/avaliação stricta).
4. **Aviso** — se o usuário pedir bypass para fraude acadêmica, alerte risco de falso-positivo ao pedir só correção gramatical (professor pode detectar). Fonte: `lhaPanvj2Vg.pt.dedup.txt`.

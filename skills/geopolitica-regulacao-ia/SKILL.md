---
name: geopolitica-regulacao-ia
description: Monitora desenvolvimentos de regulação de IA (leis, decretos, atos, registros oficiais) e traduz impacto prático para uso de IA. Gatilho: usuário pergunta "tem nova lei de IA", "como a regulação X afeta meu uso", "o que mudou no AI Act", ou precisa acompanhar cenário regulatório de IA de forma recorrente. Não-gatilho: não é consultoria jurídica (encaminhe ao oficial/advogado); não é análise de política geral sem ligação com IA. Outcome: delta regulatório (o que entrou em vigor / mudou) + classificação de impacto (proibição, obrigação de alto risco, transparência, penalidade) + quais casos de uso são afetados.
---

# Geopolítica e Regulação de IA

Acompanha o cenário regulatório oficial de IA como **monitoramento de fontes
primárias**, não como commentary.

> ✅ **VERIFICADO (2026-08-26):** fontes oficiais confirmadas nesta sessão.

## Pipeline

### 1. Manter registro de fontes oficiais (verificadas)
- **UE:** AI Act = Regulation (EU) 2024/1689, texto consolidado em
  `eur-lex.europa.eu` (ex.: `eli/reg/2024/1689`); suporte/registros em
  `ai-act-service-desk.ec.europa.eu` (Art. 49 — registro de sistemas de alto risco).
- **EUA:** Federal Register `federalregister.gov` e eCFR `ecfr.gov` (ambos têm
  API oficial para acesso programático). Nota: **EO 14110 (Oct/2023) foi
  rescindida em 2025** e substituída por framework mais desregulatório; em 2026
  vigora a EO "Promoting Advanced Artificial Intelligence Innovation and Security"
  (Federal Register 2026-11415, Jun/2026). Acompanhe o Federal Register.
- Adicione órgãos nacionais de IA por jurisdição de interesse (versionar URLs).

### 2. Poll de atualizações
- Para cada fonte, verifique novidades desde o último `state/regulacao.json`.
- Prefira feeds oficiais/API quando existirem; scraping só como fallback.

### 3. Classificar impacto
Para cada mudança, rotule:
- `PROIBIÇÃO` — uso vetado.
- `ALTO RISCO` — obrigações (avaliação, documentação, humano-no-loop).
- `TRANSparÊNCIA` — rotulagem/divulgação obrigatória.
- `PENALIDADE` — multas/execução.

### 4. Mapear para casos de uso
- Cruze a mudança com a lista de usos de IA do usuário.
- Sinalize: afetado / não afetado / afetado condicionalmente.

### 5. Relatório
- Delta (entrou em vigor / alterou) + impacto + casos de uso afetados.
- Salve `state/regulacao.json` com data da última verificação.

## Regras
- Só fonte oficial conta como evidência; notícia secundária é alerta, não fato.
- Marque explicitamente o que é "em vigor" vs "proposto/em tramitação".
- Recomende revisão jurídica humana para decisão vinculante.

## Exemplo real validado (2026-08-26)
- UE: texto consolidado do AI Act atualizado em 27/07/2026 (`eur-lex.europa.eu`,
  CELEX 02024R1689-20260727). Impacto: obrigações de alto risco (Art. 49 registro).
- EUA: EO 14110 (Oct/2023) **rescindida em 2025**; vigente em 2026 =
  "Promoting Advanced AI Innovation and Security" (Federal Register 2026-11415).
- output: delta + impacto (ALTO RISCO) + casos de uso afetados.

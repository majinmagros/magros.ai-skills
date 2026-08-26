---
name: search-hallucination-detection
description: Detecta quando uma resposta de busca gerada por IA (Google AI Overviews, respostas de ChatGPT/Perplexity/Claude com "busca", resumos automáticos) alucina ou confabula fatos. Gatilho: usuário pede para checar/validar/confirmar uma resposta de IA, desconfia de "AI Overview", quer saber se um resumo automático está correto, ou precisa auditar claims de um agente de busca antes de confiar/publicar. Não-gatilho: não é revisão de texto próprio do usuário (use clareza); não é aconselhamento jurídico/médico (encaminhe a fonte primária oficial); não é fact-checking de opinião. Outcome: um veredito por claim (suportado / contradito / não verificável / confabulado) com lista de fontes primárias consultadas e nível de confiança.
---

# Search Hallucination Detection

Audita respostas de busca geradas por IA para separar o que é respaldado por fonte
primária do que é confabulação. O pipeline é **determinístico** (não depende de
memória do modelo sobre o assunto).

> ✅ **VERIFICADO (2026-08-26):** exemplos de fonte primária confirmados.
> Por domínio: técnico/CLI/flag → documentação oficial do fabricante; legal →
> diário oficial (ex.: `eur-lex.europa.eu`, `federalregister.gov`); científico →
> artigo primário/DOI (arXiv quando preprint); estatístico → órgão emissor.
> Nunca aceite outra IA ou blog não oficial como prova.

## Pipeline (4 etapas)

### 1. Extração de claims atômicos
- Force a resposta em **claims únicos e verificáveis** (sujeito + predicado + objeto + data/escopo).
- Marque cada claim como `CHECKÁVEL` (tem fonte primária possível) ou `NÃO-CHECKÁVEL`
  (opinião, predição, preferência — fora de escopo de verificação factual).

### 2. Classificação de fonte-alvo
Para cada claim CHECKÁVEL, defina a **fonte primária legítima**:
- Dado técnico/CLI/flag → documentação oficial do fabricante `[VERIFICAR fonte]`.
- Dado legal/regulatório → registro oficial/diário oficial `[VERIFICAR fonte]`.
- Dado científico → artigo primário / DOI.
- Dado estatístico → órgão emissor original.
- Nunca aceite como prova outra IA, blog não oficial, ou a própria resposta.

### 3. Cross-check
- Recupere a fonte primária (websearch/webfetch na fonte oficial).
- Compare claim × fonte:
  - `SUPORTADO`: fonte confirma exatamente.
  - `CONTRADITO`: fonte diz o oposto.
  - `NÃO VERIFICÁVEL`: não há fonte primária acessível → trate como não confiável.
  - `CONFABULADO`: fonte inexistente / citação inventada (hallucination clássica).

### 4. Relatório
- Tabela: claim | veredito | fonte | confiança (alta/média/baixa).
- Veredito geral: % de claims SUPPORTADOS vs o resto.
- Destaque em negrito qualquer `CONFABULADO` ou `CONTRADITO` — esses invalidam a resposta.

## Regras de ouro
- **Uma fonte primária por claim.** Sem fonte → claim não é confiável.
- **Citação inventada = confabulação**, independente do tom confiante da IA.
- Nunca "confirmar" usando a própria IA que gerou a resposta.
- Se o domínio exige precisão crítica (medicina, direito, finanças), exija fonte
  primária oficial e recomende revisão humana especializada.

## Checkpoint de parada
- ⛔ Antes de publicar/repostar uma resposta de IA auditada → mostre o veredito.
- ⛔ Claim CONFABULADO/CONTRADITO encontrado → não repita a resposta sem correção.

---
name: knowledge-work-proxy-eval
description: Evaluate agents on hard knowledge-work task packs (banking, consulting, legal) as a proxy for your domain. Use when testing agents on vague prompts plus document workspaces. Use quando avaliar agentes com pacotes banking/consulting/legal, prompts vagos realistas e workspace de documentos.
---

# Knowledge Work Proxy Eval

Se o agente resolve banking/consulting/legal duro, provavelmente resolve o seu domínio. Avalie por proxy, não por demo.

## Quando usar

Quando precisa saber se um modelo/harness aguenta trabalho de conhecimento real (documentos + ambiguidade + deliverable), antes de confiar no seu domínio. NÃO é execução de pesquisa — é avaliação.

## Passos

1. **Escolha o proxy duro** — banking (investment analysis), consulting (market sizing, segmentação), legal (regulatory, M&A, compliance). Duro de propósito: se passar aqui, transfere para domínios mais fáceis.
2. **Monte o pacote de task** — cada task tem 4 partes:
   - Prompt curto e vago como usuário real escreveria.
   - Workspace de documentos (planilhas, charts, PDFs, estrutura de pastas real).
   - Ferramentas permitidas e formato do deliverable esperado.
   - Trajectory esperada: quais arquivos ler, quais contas fazer, em que ordem.
3. **Exija trajetória, não só resposta** — o agente deve ler o workspace, cruzar fontes e mostrar o caminho (arquivos lidos, tool calls, cálculos). Resposta certa com trajetória errada = fail.
4. **Grade com régua de expert** — gabarito criado/validado por experts do domínio. Score por acurácia do deliverable + fidelidade da trajetória. Acompanhe saturação: ~85-90%+ = benchmark saturado, troque de pacote.
5. **Construa o proxy do SEU domínio** — clone a anatomia: 5-10 tasks reais, prompts vagos coletados de usuários, workspace anonimizado, gabarito com tolerância numérica explícita. Comece com 3 tasks piloto antes de escalar para 50.
6. **Decida a stack** — reporte por modelo: acurácia no proxy + custo + tempo. SOTA para tasks críticas, workhorse para volume, leve só com supervisão. Um benchmark isolado nunca decide.

## Regras

- NEVER avaliar knowledge work só com pergunta-resposta sem workspace: sem documentos não há proxy.
- NEVER aceitar número sem memória de cálculo e fonte.
- NEVER confundir com execução: `deep-research`/`market-research` EXECUTAM pesquisa; este skill AVALIA o executor.
- Prompts do pacote ficam vagos de propósito; não "ajude" o agente no enunciado.
- Tasks impossíveis ou ambíguas sem saída "não sei" medem honestidade, não acurácia — grade separado.

## Related skills

- `agent-eval` — harness de avaliação first-party.
- `deep-research` — execução de pesquisa profunda (objeto da avaliação, não o juiz).
- `agentic-benchmark-top5` — o índice pessoal onde este proxy mora.

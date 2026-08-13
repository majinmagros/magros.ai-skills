---
name: clarificar
description: Use when a spec/requirements doc exists but is underspecified, before planning or coding. Triggers on "/clarificar", "especificação vaga", "requisitos incompletos", "falta decisão no spec", "ambiguidade nos requisitos", "clarifica o spec". Detecta ambiguidades e pontos de decisão faltando, faz até 5 perguntas dirigidas (uma por vez, com recomendação justificada) e grava as respostas de volta no documento de requisitos.
---

# Skill: /clarificar — Interrogatório de ambiguidade do spec

Detecte e reduza ambiguidade na especificação/requisitos do projeto atual,
**antes** de planejar ou implementar. As respostas voltam para o documento —
não ficam só na conversa.

## 1. Localize os artefatos

- Procure o documento de requisitos do projeto (spec.md, REQUIREMENTS.md,
  docs/requisitos.md, ou o que o usuário indicar).
- Se não existir: pare e sugira escrever os requisitos primeiro — esta skill
  não cria spec do zero.
- Se existir uma constituição de projeto (skill `constituicao-projeto`),
  leia-a para conhecer as restrições de governança.

## 2. Varredura de cobertura (taxonomia de 11 categorias)

Para cada categoria, marque **Clear / Partial / Missing**:

1. **Escopo funcional**: objetivos do usuário, critérios de sucesso,
   declarações explícitas de fora-de-escopo, diferenciação de papéis/personas.
2. **Domínio e dados**: entidades, atributos, relações, identidade/unicidade,
   transições de estado, volume/escala esperada.
3. **Fluxo de interação/UX**: jornadas críticas, estados de erro/vazio/loading,
   acessibilidade, localização.
4. **Atributos não-funcionais**: performance (latência/throughput), escalabilidade,
   confiabilidade/disponibilidade, observabilidade, segurança/privacidade, compliance.
5. **Integrações**: serviços externos e modos de falha, formatos de import/export,
   versionamento de protocolo.
6. **Casos extremos**: cenários negativos, rate limiting, resolução de conflitos
   (ex.: edições concorrentes).
7. **Restrições e tradeoffs**: linguagem/storage/hosting, alternativas rejeitadas e por quê.
8. **Terminologia**: glossário canônico, sinônimos a evitar.
9. **Sinais de conclusão**: critérios de aceite testáveis, Definition of Done mensurável.
10. **Placeholders**: TODOs, decisões em aberto.
11. **Adjetivos vagos**: "robusto", "intuitivo", "rápido" sem quantificação.

Cada categoria Partial/Missing gera uma pergunta candidata — exceto se a
resposta não mudar implementação ou validação, ou se for melhor adiar para o
plano técnico.

## 3. Fila priorizada (máximo 5 perguntas)

- Máximo de **5 perguntas** na sessão inteira.
- Cada pergunta deve impactar materialmente arquitetura, dados, decomposição de
  tarefas, testes, UX, operação ou compliance.
- Se mais de 5 áreas abertas: selecione as top 5 por (Impacto × Incerteza).
- Exclua: já respondidas, preferências estilísticas triviais, detalhes de
  execução do plano (exceto se bloqueiam correção).
- Nunca revele as perguntas futuras.

## 4. Loop de perguntas (uma por vez)

Formato obrigatório de cada pergunta:

1. `**Pergunta:**` + interrogativa completa que termina com `?` — faz sentido
   sozinha, sem rótulo de seção. Depois do `?`, só é permitido um id entre
   parênteses, ex.: `(RQ-012)`.
2. Uma frase **"Por que importa"** (o risco para aceite/entrega).
3. Para múltipla escolha (2–5 opções mutuamente exclusivas):
   - Analise todas as opções e determine a mais adequada (boas práticas,
     padrões do tipo de projeto, redução de risco, alinhamento com o spec).
   - `**Recomendada:** Opção [X] — <raciocínio em 1–2 frases>` em destaque.
   - Tabela `| Opção | Descrição |` + linha final: "Responda com a letra
     (ex.: 'A'), aceite com 'sim'/'recomendada', ou dê resposta curta própria."
4. Para resposta curta (sem opções discretas): `**Sugerido:** <resposta> —
   <motivo>` + "Formato: resposta curta (<=5 palavras)."

Após cada resposta: valide que mapeia a uma opção ou cabe em ≤5 palavras; se
ambíguo, peça desambiguação (não conta como nova pergunta). Só então registre
em memória e passe à próxima.

Pare quando: ambiguidades críticas resolvidas, usuário sinalizar término
("pronto", "chega", "pode parar"), ou 5 perguntas atingidas.

## 5. Integração no documento (após CADA resposta aceita)

- Na primeira resposta integrada: crie seção `## Clarificações` logo após a
  seção de visão geral, com subseção `### Sessão AAAA-MM-DD`.
- Acrescente bullet: `- Q: <pergunta> → A: <resposta final>`.
- Aplique a resposta na seção apropriada: funcional → requisitos funcionais;
  dados → modelo de dados; não-funcional → critério mensurável (adjetivo vago
  vira métrica); caso extremo → seção de erros/edge cases; termo conflituoso →
  normalize em todo o doc.
- Se invalidar afirmação anterior ambígua, **substitua** — não deixe texto
  contraditório obsoleto.
- **Salve o arquivo após cada integração** (perda de contexto custa caro).
- Preserve formatação: não reordene seções não relacionadas.

## 6. Validação e relatório

Após cada escrita + passe final: uma bullet por resposta, ≤5 perguntas aceitas,
sem placeholders vagos que a resposta resolvia, sem contradições restantes.

Se existir checklist de requisitos (skill `checklist-requisitos`), reavalie os
itens contra o spec atualizado e reporte "antes → depois" (ex.: 12/16 → 15/16).

Relatório final: perguntas feitas/respondidas, caminho do doc, seções tocadas,
tabela de cobertura por categoria (Resolvido / Adiado / Claro / Pendente de
baixo impacto) e próximo passo sugerido.

## Regras

- Sem ambiguidades relevantes: diga "Nenhuma ambiguidade crítica detectada"
  e sugira avançar.
- Respeite sinais de término antecipado.
- Evite perguntas especulativas de stack técnica salvo se bloqueiam clareza.
- Cota cheia com categorias abertas: liste-as como "Adiadas" com justificativa.

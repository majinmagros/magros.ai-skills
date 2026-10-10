---
name: enterprise-ai-readiness
description: Use when preparing a company for AI agents before launch — mapping how work really happens, redesigning processes around AI, and setting decision rights. Triggers on "empresa pronta para agentes", "readiness de IA", "mapear processo real", "decision rights", "governança de agentes", "enterprise AI rollout", "agent readiness audit", "tribal knowledge".
---

# Enterprise AI Readiness

Enterprise AI is no longer a model-selection problem — it is an operating-model
problem. Models keep getting better; that was never the hard part. Agents fail
in production not from weak capability but from missing context, missing rules
and missing bridges. This skill runs the readiness audit **before** launch.

## Quando usar

- "Vamos colocar um agente nesse processo" — antes de integrar, auditar.
- Agente passou na demo e quebrou no processo real (ex.: invoice reconciliation).
- Mapear como o trabalho realmente acontece vs fluxograma oficial.
- Definir o que o agente pode decidir sozinho vs escalar para humano.
- Redesenhar workflow para humano + agente em vez de colar chatbot no legado.

## Quando NAO usar

- Operação de agentes já em produção (observabilidade, kill switch, rollout) — use `enterprise-agent-ops`.
- Hardening técnico de um stack específico — use `django-security`, `laravel-security`, etc.
- Auditoria de SaaS vibe-coded com scanners — use `vibe-security-scanner`.
- Conformidade PHI/HIPAA — use `hipaa-compliance`, `healthcare-phi-compliance`.

## Os 4 gaps (diagnóstico)

1. **Undocumented knowledge gap** — a empresa não é um conjunto de tarefas
   genéricas; é uma teia de permissões, exceções e conchavos nunca
   documentados. O agente sabe como invoice reconciliation funciona em teoria,
   mas não sabe quem realmente aprova, qual aprovação é política, o que
   acontece quando o processo padrão quebra. Conhecimento tribal vive em
   e-mails, planilhas, Slack e na cabeça de funcionários — às vezes nem a
   empresa sabe explicar como o trabalho é feito.
2. **Patching mindset** — colar chatbot num processo lento/quebrado parece
   modernização mas não é. Automatizar processo quebrado só o faz parecer
   mais rápido.
3. **Legacy system gap** — ERPs/CRMs foram feitos para humano clicar, não
   para agente navegar com segurança. O trabalho real é construir a ponte
   (APIs, orquestração, conectores, access control, audit logs).
4. **Control gap** — "handle the workflow" é vago: pode aprovar? rejeitar?
   mudar vendor? escalar quando? Falta de decision rights explícitos.

## Os 3 jobs (antes do launch)

### Job 1 — Mapear como o trabalho realmente acontece (não o fluxograma)

Sentar com o time e extrair: quem realmente aprova? O que acontece quando
invoice ≠ PO? Quais exceções batem todo mês? De quem é o julgamento em que
todos confiam silenciosamente? Qual regra é oficial e qual só existe porque
alguém aprendeu do jeito difícil? Transformar tribal knowledge em algo que
o agente entende e reusa. Se a empresa não explica o workflow com clareza,
o agente não o executa com confiabilidade. Achar o "Chris" de cada
departamento — a pessoa que resolve exceções de cabeça — é o trabalho real.

### Job 2 — Redesenhar o processo em torno da IA (first principles)

Não substituir 11 passos humanos por uma caixa-preta (ninguém confia), nem
manter tudo igual e somar um agente (gastou fortuna para não mudar nada).
Perguntar: qual outcome? Quais passos são necessários? O que o agente faz
sozinho, o que prepara para humano aprovar, onde julgamento humano importa
mais? Cada parte faz o que é boa — agente e humano — com foco no outcome.

### Job 3 — Construir a ponte + governança com visibilidade

Integrações, permissões, monitoramento e escalation dentro do sistema real,
com as rachaduras do legado. Proof threshold, rotas de escalation, audit
trail e human-in-the-loop onde julgamento/risco importam. O agente anda
rápido onde velocidade é segura e devagar onde julgamento é exigido —
confiança por design, não por promessa.

## Decision-rights matrix (template)

| Ação do agente | Autônomo | Recomenda | Pede aprovação | Para sempre |
|---|---|---|---|---|
| Ex.: ler invoice + PO | x | | | |
| Ex.: aprovar < $X | | | x | |
| Ex.: mudar vendor | | | | x |

Preencher por processo antes do launch. "O modelo fez" não é framework de
controle — definir quem responde quando o agente erra.

## Anti-patterns

- Demo impressionante = pronto para produção (demo não toca processo real).
- "Adicionar IA ao processo atual" em vez de redesenhar do outcome.
- Confiar que SOP oficial = processo real (quase nunca é).
- Um consultor entende a org mas não constrói; um engenheiro constrói mas
  não extrai 20 anos de tribal knowledge — o combo raro é o valioso.

## Output

- Mapa do processo real (oficial vs real, donos, exceções, escalations).
- Processo redesenhado (autônomo vs prepara-para-humano vs humano).
- Decision-rights matrix preenchida + ponte técnica + plano de monitoramento.
- Done = agente com contexto, regras, acessos e accountability antes do go-live.

## Related skills

- `enterprise-agent-ops` — operação pós-launch (observabilidade, kill switch).
- `rag-corporativo-seguro` — RAG com ACL como parte da ponte de contexto.
- `ai-governance-monitor` — acompanhamento regulatório contínuo.
- `system-one-judgment-triage` — camada de decisão barata dentro do workflow.
- `security-review` — revisão manual de auth/pagamentos antes do commit.

Fonte: Celine Xu `@celinexu6598/ebIHQjbVT8w` ("Is Your Company Actually Ready
for AI Agents", 03/10/2026, transcricao local fora do repo).

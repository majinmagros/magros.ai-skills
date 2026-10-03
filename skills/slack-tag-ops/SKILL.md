---
name: slack-tag-ops
description: "Use when running a native Slack agent via Tag with decoupled UI, fan-out code review, agent-written MapReduce harness, HTML artifacts, and daily loops. Triggers on \"Slack Tag\", \"Slack agent\", \"fan-out review\", \"MapReduce harness\". Non-triggers: file-only async work with no Slack surface (use claude-cowork-patterns). Outcome: a Slack-native Tag operator with mock-to-monitor funnel and adversarial review."
metadata:
  origin: ECC
---

# Slack Tag Ops

Run a native Slack agent via Tag: the chat UI is decoupled from the transcript through a messaging tool, delegation is by objective (not per tool-call supervision), and heavy work runs as fan-out with adversarial review.

## When To Activate

- The user says Slack Tag, Claude in Slack, native Slack agent, or tag-the-agent.
- Code review or triage needs massive fan-out instead of one reviewer reading linearly.
- The agent should produce HTML artifacts instead of blocking on ask-user questions.
- A daily loop is needed (triage feedback, auto-fix high-confidence items, post summary).

## Workflow

### 1. Discovery

- Capture the objective in Slack: goal, scope, repos, channels, done-criteria.
- Confirm inputs/outputs and approval policy (what auto-runs, what needs human OK).
- Do not supervise tool calls; supervise the objective and the acceptance check.

### 2. Mock

- Post a small mock first: message shape, artifact outline, review rubric.
- Validate the interface (where results land, who approves) before building the harness.
- Kill or reshape here; mocks are cheap, harnesses are not.

### 3. Implement with agent-written harness

- Apply the MapReduce pattern: the agent writes its own orchestrator code (for-loop + LLM calls), then runs it.
- Map: fan-out workers per item (PR, file, ticket, thread) with a fixed rubric.
- Reduce: one converger merges verdicts, dedups, and attaches evidence links.
- Keep the harness in the repo so the run is reproducible, not chat-only.

### 4. Fan-out review with adversarial pass

- Run massive fan-out review: many reviewers in parallel, each with a narrow lens (correctness, security, perf, style).
- Add one adversarial reviewer with an explicit job: reject weak approvals and prove failures with tests or screenshots.
- Originate follow-up workflows from test-time compute: what the adversarial pass finds becomes the next work item.

### 5. Ship HTML artifacts, not questions

- Replace ask-user blocks with HTML artifacts (report, diff summary, dashboard) posted back to Slack.
- Each artifact carries: verdict, evidence, next action, owner.
- Human approves the artifact; the agent executes after approval.

### 6. Monitor with daily loops

- Install loops/routines: daily triage, high-confidence auto-fix, summary post.
- Track shelf-life: harnesses rot fast (treat ~2 months as a review point), then re-mock.
- Log every run: items in, verdicts out, overrides, cost.

## Memória e acesso por canal (Tag oficial, leva YouTube 2026-10-03)

Fonte: Claude `@claude/_f_rtbW_uFM` ("Getting started with Claude Tag", 2026-10-01). Regras do produto oficial que valem para qualquer deploy Tag:

- **Memória por canal, não global**: "Remember for this channel: ..." (ex.: incluir links diretos p/ a fonte na planilha de eventos). Qualquer pessoa do canal lê/atualiza marcando o Claude; ele aprende estilos e preferências do time ao longo do tempo.
- **Aponte para docs vivos**: style guides e checklists como referência cruzada — se o checklist for atualizado depois, o Claude acompanha por padrão.
- **Contas próprias + log de quem pediu**: age com identidade própria, registra cada mudança e quem solicitou; ao usar tool individual em seu nome, pede permissão toda vez.
- **Acesso por canal**: decida por canal o que ele trabalha, frequência de intervenção e autonomia; dados de canais públicos podem ser compartilhados, DMs e privados ficam privados.
- **Progresso visível**: quebra em passos acompanháveis, avisa quando termina ou quando precisa de decisão; follow-up de qualquer dispositivo.

## Anti-Patterns

- Supervising tool calls instead of delegating by objective.
- One reviewer reading 50 PRs linearly instead of fan-out + reduce.
- Blocking on ask-user when an HTML artifact with a verdict would unblock.
- Chat-only harness: orchestration that lives only in the transcript and cannot rerun.
- No adversarial pass: every reviewer approves, nothing is stress-tested.
- Permanent harness with no review date: rots silently as repos and APIs drift.

## Exemplo

```text
"Revisa esses 30 PRs": mock (forma da mensagem + rubrica) → harness MapReduce no repo
Fan-out: N reviewers por lente + 1 adversarial que reprova aprovação fraca com prova
Artefato HTML (veredito+evidência+owner) no Slack; loop diário com data de revisão
```
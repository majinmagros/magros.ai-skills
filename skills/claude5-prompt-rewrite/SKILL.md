---
name: claude5-prompt-rewrite
description: Rewrite pre-Claude-5 prompts and skills for Fable 5 / Opus 5 (plus GPT-6 Astra appendix): goal-over-steps, why plus definition of done, answer-vs-action boundaries, strip over-triggers and rituals, global managed-prose line, diff-for-approval rewrite with regex anti-pattern scanner. Use when modernizing prompts, auditing CLAUDE.md or skills, fixing over-verbose or over-acting model behavior. Gatilhos PT: reescrever prompts, modernizar skills, modelo verboso demais, age sem pedir, rituais think carefully. Gatilhos EN: rewrite prompts, Fable 5 prompting, Opus 5 guide, definition of done, strip never always must.
---

# Claude 5 Prompt Rewrite

Prompts written before Fable 5 / Opus 5 actively degrade output: prescriptive steps narrow a model trained to run end-to-end, and old emphatics now over-trigger. Rewrite to goal + why + done — then show a diff for approval.

## Quando usar

Auditing `CLAUDE.md`, project instructions, skills, or saved prompts that predate Claude 5; model is verbose, over-acts (edits/sends/creates unasked), ignores intent on edge calls, or costs more than it should. Run on `CLAUDE.md` + top-3 most-used skills first.

## The 7 rules

1. **Goal, not steps** — replace step lists with the complete task spec and let the model run. Steps narrow it to your (worse) version of the job. For genuinely small tasks, drop effort to low/medium instead of adding instructions.
2. **Why + definition of done** — add the reason, not just the request: `I'm working on [larger task] for [who]. This enables [outcome]. With that in mind: [task + exact done criteria]`. Intent resolves the ~50 unspecified micro-decisions the way you'd brief a colleague.
3. **State done + length; interview for big builds** — Opus 5 expands scope (dashboards, backups, extra research). Constrain explicitly: deliverable, shape, max length. When done is unknowable upfront, don't write a longer prompt — have the model interview you (goal, who for, done, edge cases, trade-offs) and emit the brief itself.
4. **Remove over-triggers** — delete `never / always / must / critical / IMPORTANT` and negative rules; they over-fire on Claude 5 and fight the system prompt. Rewrite as positive behavior + reason: `Use this tool when [case], because [reason]`.
5. **Remove rituals** — `think carefully / walk me through your reasoning` duplicates built-in thinking (control cost via effort setting; reasoning-extraction phrasing can trigger Fable 5 refusal safeguards). `double-check every number / verify via subagent` re-buys a pass Opus 5 already does. Delete; keep only checks the model cannot do itself.
6. **Boundaries: answer × action** — Fable 5 acts unasked (edits sheets, drafts emails, creates backups). Add once to global instructions: `When the user asks, questions, or thinks aloud, the deliverable is your assessment — report findings and stop. Before any state-changing command, check the evidence supports that specific action.` Exception: scheduled/autonomous tasks get the inverse (proceed on reversible actions).
7. **Managed prose goes global** — Fable 5.1 writes dense (long sentences, few breaks); Opus 5 writes long. Fix once in `CLAUDE.md` / project instructions (`Remove managed prose: short sentences, one idea each, cut stock phrases`), then delete per-prompt voice paragraphs.

## Steps

1. **Scan** — run the anti-pattern regexes below over `CLAUDE.md`, skills, and saved prompts; list every hit with file:line.
2. **Rewrite** — apply rules 1–7: steps → goal, add why + done, positives + reasons, delete rituals, move voice/boundaries to global instructions.
3. **Diff for approval** — show before/after per file; change nothing without approval. Keep goal, audience, and done criteria; strip only dead constraints.
4. **Colleague test** — show the new prompt to a colleague with zero context: if they'd be confused, the model will be too. Fix, then adopt.

## Anti-pattern scanner (regex)

```text
\b(never|always|must|critical|IMPORTANT)\b        → rule 4: positive + reason
\bthink (carefully|step by step)\b               → rule 5: delete, use effort
\bwalk me through your reasoning\b               → rule 5: delete (refusal risk)
\bdouble-?check\b|\bverify (with|via|using) a sub-?agent\b → rule 5: delete
^Step \d+|^\d+\.\s+[A-Z].*(then|next)\b          → rule 1: steps → goal
\bdon't use (bullets|bold|tables|jargon)\b       → rule 7: move global / delete
```

## Appendix: GPT-6 Astra (agrees / differs)

- **Agrees**: goal + why over steps; redundant re-checks waste tokens — same cleanup applies.
- **Differs**: no action bias — add explicit `bias toward action` when autonomy is wanted; ships a word blocklist (`delve`, `leverage`, …) in its system prompt, so humanizer-style word bans are redundant there too.

## Rules

- NEVER add a constraint the system prompt already enforces — it fights the model and wastes tokens.
- NEVER extract reasoning (`show your thinking`) on Fable 5 — refusal risk.
- NEVER rewrite silently — diff + approval every file; intent and done criteria are preserved verbatim unless the owner agrees.
- Colleague-confused = model-confused: fail the rewrite, don't ship it.

## Related skills

- `prompt-optimizer` — general prompt improvement; this skill is the Claude-5-specific rule set.
- `prompt-builder` — constructing new prompts; apply these 7 rules during construction.
- `claude-md-auditor` — auditing `CLAUDE.md`; pair it with this rewrite pass.

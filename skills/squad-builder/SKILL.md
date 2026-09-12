---
name: squad-builder
description: "Use when building an AI agent squad from scratch through owner interviews, external research, role design, and gated rollout. Triggers on \"squad builder\", \"agent team from scratch\", \"open squad\", \"discover interview agents\", \"five roles squad\". Non-triggers: picking ready-made agents from a list (use team-builder). Outcome: a five-role squad with researched briefs, image and publish skills wired, and human sign-off recorded at every gate."
metadata:
  origin: ECC
---

# Squad Builder

Interviewer-led squad construction in four gated stages: discover the
owner, investigate the outside world, design the squad, then run it.
`team-builder` composes ready-made agents from a menu; this skill
creates the squad from zero and refuses to skip the human gates.

## When To Activate

- The user says agent team from scratch, open squad, build my squad,
  interview me, or five agent roles.
- No agent roster exists yet and the squad must match a real owner,
  niche, and channel mix.
- A previous auto-generated team felt generic and missed the voice,
  offers, and constraints of the business.
- Image and publishing steps (screenshots, carousels, posting) must be
  part of the squad from day one.

## Stage Gates

```text
discover -> GATE 1 -> investigate -> GATE 2 -> design -> GATE 3 -> run
```

- Every arrow is a mandatory human gate. No gate is implied, batched,
  or auto-approved.
- Each gate records: approved, approved-with-changes, or rejected with
  reason. Rejected stages restart, they never slide forward.
- No agent is spawned before GATE 3 passes.

## Workflow

### 1. Discover - interview the owner

- Run a short interview, one decision-forcing question at a time in
  the style of `grilling`: niche, offers, audience, voice, channels,
  constraints, weekly capacity, approval appetite.
- Capture answers verbatim first, then compress into a one-page owner
  brief: goals, non-goals, risks, done criteria.
- End with GATE 1: the owner signs the brief or corrects it. No
  research starts on an unsigned brief.

### 2. Investigate - research outside the room

- Assign one researcher role (call it Sherlock): profile the niche on
  public IG and YT channels, video download helpers where allowed,
  plus repo and docs search for comparable squads.
- Deliver an evidence pack per claim: source, date, what was observed,
  what it implies for the squad. Unsourced claims are marked as such.
- Cover at minimum: top formats in the niche, posting cadence that
  sustains, hooks that repeat, and failure shapes to avoid.
- End with GATE 2: the owner keeps, cuts, or redirects each finding.
  Cut findings leave the pack, they do not linger as context.

### 3. Design - five roles plus wiring

- Draft exactly five roles by default: strategist, researcher,
  writer, visual builder, publisher. Rename to the niche, keep the
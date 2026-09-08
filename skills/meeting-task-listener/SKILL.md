---
name: meeting-task-listener
description: "Use when an operator wants two closed pipelines, meeting recordings turned into assigned tracker tasks, and social listening turned into an MVP plus landing page. Triggers on \"meeting to task\", \"listening to MVP\", \"Jira from meeting\", \"Reddit pain\", \"landing from pain\". Non-triggers: generic project coordination with no meeting capture (use project-flow-ops), one-off web research with no MVP output (use pesquisa-social). Outcome: assigned tracker tasks from meetings plus a pain-backed MVP scope with landing draft."
metadata:
  origin: ECC
---

# Meeting Task Listener

Two closed pipelines in one skill. Pipeline A turns meetings into assigned
work: record -> extract tasks -> create them in Jira or Asana with an owner.
Pipeline B turns listening into product: listen on Reddit and X/Twitter ->
synthesize the pain -> scope an MVP -> draft the landing page. Pieces exist;
the closed loops do not.

## When To Activate

- The user says meeting to task, meeting notes to Jira, Asana from call,
  assign owners, or action items with deadlines.
- The user says listening to MVP, Reddit pain, Twitter pain, synthesize
  complaints, scope MVP, or landing from pain.
- A meeting recording or transcript must become tracker items, not a
  summary doc nobody opens.
- Social threads must become a buildable MVP plus a landing draft, not
  a vibe report.

## Workflow

### Pipeline A - meeting to assigned task

#### A1. Capture and normalize

- Record the meeting (audio or transcript) with date, attendees, and
  agenda link stored alongside the file.
- Normalize to a timestamped transcript before any extraction step.

#### A2. Extract candidate tasks

- Extract each commitment as: title, context quote, proposed owner,
  due date or explicit TBD, and source timestamp.
- Drop non-commitments (status updates, ideas without an owner).
- Flag items with missing owner or date for the confirmation pass.

#### A3. Confirm and create

- Confirm owner and due date per task; never invent an owner.
- Create one tracker item per task with title, description, owner,
  due date, and a link back to the transcript timestamp.
- Reply in the meeting thread with the created item ids. No silent drops:
  every candidate ends as CREATED, MERGED, or DECLINED with a reason.

### Pipeline B - listening to MVP

#### B1. Listen with a query contract

- Define the query contract first: keywords, communities, time window,
  language, and exclusion rules (ads, memes, bots).
- Collect threads with permalinks, dates, and engagement counts.
- Store raw evidence; never summarize before quoting.

#### B2. Synthesize the pain

- Cluster threads into pains with: pain statement, who feels it,
  frequency count, strongest verbatim quotes, current workarounds,
  and willingness-to-pay signals if present.
- Rank pains by frequency x intensity x workaround cost.
- Discard clusters with fewer than three independent voices.

#### B3. Scope the MVP and draft the landing

- Turn the top pain into an MVP scope: user, job to be done,
  three must-have behaviors, explicit non-goals, and a fake-door
  test (checkout or signup intent, not a waitlist vote).
- Draft the landing page from the same evidence: headline in the
  users words, three pain bullets with quotes, offer, risk reversal,
  and one call to action.
- Ship scope plus landing as one reviewable unit.

## Anti-Patterns

- Summary without tracker items -> meeting value leaks; always end
  pipeline A with item ids or explicit declines.
- Inventing owners or dates -> unowned tasks rot; park as TBD.
- One quote per pain -> anecdote, not signal; require three voices.
- Waitlist as validation -> measures curiosity; test buying intent.
- Landing copy in vendor words -> reuse verbatim user phrasing.
- Mixing pipelines -> meeting tasks need owners, listening needs
  evidence; run A and B with separate logs.

## Relations

- `project-flow-ops`: GitHub and Linear triage and backlog control;
  use it for tracker hygiene around pipeline A output.
- `jira-integration`: Jira read, transition, and comment patterns;
  use it for the create step of pipeline A.
- `data-scraper-agent`: scheduled collection with storage in
  Notion, Sheets, or Supabase; use it for pipeline B harvesting.
- `pesquisa-social`: sentiment and complaint research across social
  platforms; use it for pipeline B query design.
- `conversa`: role-play and objection rehearsal; use it to pressure
  test the landing draft before shipping.
- `content-engine`: platform-native copy systems; use it to adapt
  the landing draft per channel.

## Sources

- Closed-pipeline pattern (meeting to Jira/Asana task with owner,
  Reddit and X listening to MVP plus landing):
  https://www.youtube.com/watch?v=UKSN9DjyAvI
- Atlassian developer home for tracker API reference: https://developer.atlassian.com
- Asana developer home for task API reference: https://developers.asana.com
- Any counts, multiples, or timing statements in the video above are
  author measurements, not benchmarks. Do not quote them as facts.

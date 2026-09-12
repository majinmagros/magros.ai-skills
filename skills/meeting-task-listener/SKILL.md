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
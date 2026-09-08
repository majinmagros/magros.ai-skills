---
name: word-revision-workflow
description: "Use when an agent must perform editorial revision of .docx files with reviewer comments, Track Changes, claim checks against a source, restricted edits, and selective accept. Triggers on \"word revision\", \"docx review\", \"track changes\", \"claim check\", \"brand guidelines\". Non-triggers: Google Docs Sheets or Slides editing (use google-workspace-ops), format conversion without editorial review (use nutrient-document-processing). Outcome: reviewed .docx with triaged comments, verified claims, restricted Track Changes edits, and selective accept log."
metadata:
  origin: ECC
---

# Word Revision Workflow

Editorial revision of .docx files with an agent, end to end: triage reviewer
comments -> edit with Track Changes -> check each claim against its source ->
apply restricted edits -> run a brand-guidelines pass -> accept selectively.

This skill covers the Office gap: `google-workspace-ops` is Google-only and
`nutrient-document-processing` is conversion, not editorial review.

## When To Activate

- The user says Word revision, docx review, Track Changes, reviewer comments,
  accept or reject changes, or brand-guidelines pass on a document.
- A .docx file has open comments or pending tracked changes that need triage
  before any edit.
- Factual claims in the document must be verified against a stated source
  (for example a shared drive folder or content repository) before acceptance.
- The revision must keep an audit trail of what was accepted, rejected, or
  left pending.

## Workflow

### 1. Collect inputs and freeze scope

- Gather the .docx file, the list of reviewers, the source of truth for
  claims, and the brand or style guide to enforce.
- Record document name, revision date, and reviewer list in a short header
  at the top of the working log (`output/revision-log.md`).
- Do not start editing until inputs are complete. Missing source = stop.

### 2. Triage comments

- Extract every comment with author, page or paragraph anchor, and status.
- Classify each comment as [x] actionable, [ ] question for the author,
  or [ ] out of scope.
- Order actionable comments by document order, not by reviewer.
- Questions for the author go to a pending list; never guess the answer.

### 3. Enable Track Changes and draft edits

- Turn Track Changes on before any edit so every insertion and deletion
  is visible to the reviewer.
- Make one edit per comment where possible so accept can stay selective.
- Keep formatting edits separate from content edits.

### 4. Check each claim against the source

- For every factual claim touched by an edit, locate the matching passage
  in the declared source and quote it in the working log.
- Mark each claim as OK (source supports it), MISMATCH (source
  contradicts it), or UNVERIFIED (no source found).
- MISMATCH and UNVERIFIED block acceptance of that edit until resolved.

### 5. Apply restricted edits

- Allowed: grammar, spelling, punctuation, consistent terminology,
  formatting required by the style guide, and claim corrections backed
  by a quoted source.
- Forbidden: changing the meaning of a claim, deleting a reviewer
  comment without a log entry, editing outside the agreed scope,
  accepting all changes in bulk.
- Every forbidden case found during review must be reverted.

### 6. Brand-guidelines pass

- Run one dedicated pass for tone, terminology, headings, captions,
  and forbidden phrases from the style guide.
- Log each brand fix with rule name and location (for example
  "rule: heading-case -> section 2.3").

### 7. Selective accept and handoff

- Accept only edits whose claims are OK and whose comments are resolved.
- Leave questions and UNVERIFIED items as pending tracked changes.
- Deliver the revised .docx plus the working log with counts:
  comments triaged, claims OK / MISMATCH / UNVERIFIED, edits
  accepted / rejected / pending.

## Anti-Patterns

- Accept-all in bulk to "finish fast" -> destroys the audit trail.
- Editing with Track Changes off -> invisible changes, no selective accept.
- Guessing an answer to a reviewer question -> always park as pending.
- Rewording a claim without quoting the source -> unverified edit.
- Mixing formatting churn with content edits -> reviewer cannot review.
- Treating conversion as revision -> conversion changes format, this
  skill changes content under control.

## Relations

- `google-workspace-ops`: Google Docs/Sheets/Slides operations; use it
  for Google files, this skill for Office .docx editorial review.
- `nutrient-document-processing`: conversion, OCR, extraction, and
  signing; use it to convert, this skill to revise.
- `clareza`: microscope mode for clause-level risk reading; use it to
  phrase reviewer questions precisely.
- `verification-loop`: post-edit verification gate before handoff.
- `unified-memory`: persist the style decisions for the next revision.

## Sources

- Review workflow pattern (triage comments -> Track Changes -> claim
  check against source -> restricted edits -> brand-guidelines skill ->
  selective accept): https://www.youtube.com/watch?v=x80HVKbZrno
- Microsoft Support home for Word help topics: https://support.microsoft.com
- Box home for source-of-truth storage reference: https://www.box.com
- Any run counts or timing statements in the video above are author
  measurements, not benchmarks. Do not quote them as facts.

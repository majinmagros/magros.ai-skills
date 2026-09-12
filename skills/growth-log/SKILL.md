---
name: growth-log
description: "Use when use after a complex task, failure, or when reviewing what was learned. Teaches how to write growth logs that extract reusable patterns — not diary entries. Triggers on \"growth-log\", \"growth log\"."
version: 1.1.0
metadata:
  origin: ECC
---

# Growth Log Skill

> **The problem:** Most people write "fixed a bug in X" as a learning log. That's a diary entry, not a learning artifact. A real growth log extracts the *pattern* so you recognize it next time.
>
> **This skill teaches:** How to write learning entries that compound across sessions. Works with any note-taking system — Markdown files, Notion, Obsidian, plain text. Templates are generic; adapt to your setup.

## When to Activate

- After completing a complex task (multi-file, new feature, architecture change)
- After a failure, mistake, or "that was harder than expected" moment
- When you want to review what you've learned over a period

**When NOT to activate:** Trivial changes (typo fixes, single-line tweaks, config value changes with no debugging). The threshold: *did this task involve debugging, redoing, rollback, or a non-obvious decision?* If yes → write an entry. If no → skip.

## The Three Rules

### Rule 1: Failures > Achievements

A failure is nutritionally denser than a success. One bug that took 2 hours to find teaches more than 3 features that worked first try.

**Bad:** "Successfully implemented the login flow."
**Good (web dev):** "Login flow: session token wasn't persisting because the cookie `SameSite` defaulted to `Lax` in Chrome 128+. Pattern: always explicitly set `SameSite=None; Secure` when cross-origin. Signal to recognize: auth breaks after browser upgrade or when crossing origin boundaries."
**Good (data pipeline):** "CSV import failed silently on empty rows because `pandas.read_csv(dropna=False)` keeps zero-width rows that `len()` counts as valid. Pattern: always `df.dropna(how='all', inplace=True)` before row-count validation."

### Rule 2: The Bole Principle (伯乐原则)

Before writing a new entry, ask: *"Is this fundamentally the same as something I already recorded?"*

Same root cause, different symptom → **merge**, don't duplicate. New root cause → new entry.

**How to check:** Search existing entries for keywords from your root cause before writing. If you find a match, add your new symptom as an additional example under the existing entry rather than creating a duplicate.

**Example:** "Forgot to update the output index after creating a file" and "Forgot to update skill ratings after a task" — same root cause (no automatic capture trigger). Merge into one entry about "post-task capture gaps."

### Rule 3: Must Be Transferable

Every entry must answer: *"Next time I face a similar situation, what do I do differently?"*

If you can't write that sentence, you haven't extracted the pattern yet.

**How to extract a pattern from a concrete event:**
1. State what happened in one sentence
2. Ask "why?" iteratively until you reach root cause (usually 3-5 whys)
3. Generalize: "What class of problem is this?" (not "Chrome 128 bug" but "browser default change breaking existing behavior")
4. Formulate as: "Next time I see [signal], I will [action]."
5. Name the signal: what specific observable tells you this pattern is active?

## Entry Template

**Scope:** One entry per distinct root cause. Typical length: 4-8 sentences. If it takes >2 minutes to write, you're narrating events. If <30 seconds, you haven't gone deep enough.

```markdown
## [Title: the pattern, not the event]

### Context
- What was I trying to do?
- What went wrong / what worked surprisingly well?
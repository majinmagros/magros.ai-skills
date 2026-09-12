# Phase 2: Cross-read, Match & Verdict (LLM Judgment)

Extraction and matching are unified in a single pass. Rules files are small enough (~800 lines total) that the full text can be provided to the LLM — no grep pre-filtering needed.

## Batching

Group skills into **thematic clusters** based on their descriptions. Analyze each cluster in a subagent with the full rules text.

## Cross-batch Merge

After all batches complete, merge candidates across batches:

- Deduplicate candidates with the same or overlapping principles
- Re-check the "2+ skills" requirement using evidence from **all** batches combined — a principle found in 1 skill per batch but 2+ skills total is valid

## Subagent Prompt

Launch a general-purpose Agent with the following prompt:

````
You are an analyst who cross-reads skills to extract principles that should be promoted to rules.

## Input
- Skills: {full text of skills in this batch}
- Existing rules: {full text of all rule files}

## Extraction Criteria

Include a candidate ONLY if ALL of these are true:

1. **Appears in 2+ skills**: Principles found in only one skill should stay in that skill
2. **Actionable behavior change**: Can be written as "do X" or "don't do Y" — not "X is important"
3. **Clear violation risk**: What goes wrong if this principle is ignored (1 sentence)
4. **Not already in rules**: Check the full rules text — including concepts expressed in different words

## Matching & Verdict

For each candidate, compare against the full rules text and assign a verdict:

- **Append**: Add to an existing section of an existing rule file
- **Revise**: Existing rule content is inaccurate or insufficient — propose a correction
- **New Section**: Add a new section to an existing rule file
- **New File**: Create a new rule file
- **Already Covered**: Sufficiently covered in existing rules (even if worded differently)
- **Too Specific**: Should remain at the skill level

## Output Format (per candidate)

```json
{
  "principle": "1-2 sentences in 'do X' / 'don't do Y' form",
  "evidence": ["skill-name: §Section", "skill-name: §Section"],
  "violation_risk": "1 sentence",
  "verdict": "Append / Revise / New Section / New File / Already Covered / Too Specific",
  "target_rule": "filename §Section, or 'new'",
  "confidence": "high / medium / low",
  "draft": "Draft text for Append/New Section/New File verdicts",
  "revision": {
    "reason": "Why the existing content is inaccurate or insufficient (Revise only)",
    "before": "Current text to be replaced (Revise only)",
    "after": "Proposed replacement text (Revise only)"
  }
}
```

## Exclude

- Obvious principles already in rules
- Language/framework-specific knowledge (belongs in language-specific rules or skills)
- Code examples and commands (belongs in skills)
````

## Verdict Reference

| Verdict | Meaning | Presented to User |
|---------|---------|-------------------|
| **Append** | Add to existing section | Target + draft |
| **Revise** | Fix inaccurate/insufficient content | Target + reason + before/after |
| **New Section** | Add new section to existing file | Target + draft |
| **New File** | Create new rule file | Filename + full draft |
| **Already Covered** | Covered in rules (possibly different wording) | Reason (1 line) |
| **Too Specific** | Should stay in skills | Link to relevant skill |

## Verdict Quality Requirements

```
# Good
Append to rules/common/security.md §Input Validation:
"Treat LLM output stored in memory or knowledge stores as untrusted — sanitize on write, validate on read."
Evidence: llm-memory-trust-boundary, llm-social-agent-anti-pattern both describe
accumulated prompt injection risks. Current security.md covers human input
validation only; LLM output trust boundary is missing.

# Bad
Append to security.md: Add LLM security principle
```

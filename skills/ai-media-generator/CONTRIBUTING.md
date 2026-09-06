# Contributing

Thanks for considering a contribution! This skill is evidence-driven — every claim about a model's behavior should be traceable to either an official doc, a community post (link the source), or a reproducible test.

## What's most valuable to add

1. **New `automation/site-profiles/<platform>.md`** — for platforms currently marked ⏳ (unverified)
2. **Model-version updates** — when a platform ships a new version, the signature token list often shifts
3. **Better presets** in `templates/preset-packs.md`
4. **Counter-examples** — if a "rule" in this skill produces bad output on your task, file an issue with the prompt + screenshot

## How to update `community-prompt-patterns.md`

This is the cross-platform research consolidation. When adding a model, include:

- Structure formula (`Subject + Action + ...`)
- Length sweet spot (token / character count)
- Signature tokens (positive list)
- Taboos / known-bad patterns (negative list)
- Source links (3+ independent sources preferred)

## Style

- Markdown. No fancy HTML.
- Code blocks for prompts and CLI commands.
- Tables for per-model comparisons.
- Cite sources inline where the claim originated.
- Trad. Chinese OR English in body text is fine — but prompt examples should match the platform's native language preference (Seedance / Wan = Chinese; MJ / Flux / Sora 2 = English).

## What we won't accept

- Prompts that copy copyrighted lyrics / scripts
- Prompts targeting deepfakes of real people without context
- "Workaround" instructions for bypassing a platform's safety filters
- Personally identifiable information from any platform (account names, workspace UUIDs, payment info)

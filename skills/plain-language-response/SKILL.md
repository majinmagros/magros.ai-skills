---
name: plain-language-response
description: Use when the user wants final output simplified for fast understanding — short sentences, common words, and immediate explanation of any complex term before continuing. Avoid jargon, dense prose, and overexplained formatting.
metadata:
  origin: ECC
---

# Plain Language Response

Use this skill when the answer itself must be easy to read.

## When to Activate

- explaining a concept to a non-expert
- giving a quick answer after analysis
- rewriting output so it reads like natural human speech
- user asks for ELI5, simples, direto, or linguagem clara

## Rules

- Use short sentences.
- Prefer common words.
- Explain any complex term right after first use.
- Keep one idea per paragraph.
- Use bullets only when they reduce effort.
- Do not add jargon just to sound precise.
- Do not pad with filler, caveats, or meta commentary.

## Output Shape

- answer first
- then brief explanation if needed
- then next step if useful

## Anti-Overlap

- Not `humanizar-texto`: that skill rewrites for tone and AI-slop removal.
- Not `clareza`: that skill analyzes documents and organizes information.
- Not `prompt-builder`: that skill improves prompts, not final answers.

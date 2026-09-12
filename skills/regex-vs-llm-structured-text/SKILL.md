---
name: regex-vs-llm-structured-text
description: "Use when choosing between regex and LLM for parsing structured text with repeating patterns. Triggers on \"regex-vs-llm-structured-text\", \"regex vs llm structured text\", \"text\"."
metadata:
  origin: ECC
---

# Regex vs LLM for Structured Text Parsing

A practical decision framework for parsing structured text: regex first, LLM only for edge cases. Detalhes em `references/`.

## When to Activate

- Parsing structured text with repeating patterns (questions, forms, tables)
- Deciding between regex and LLM for text extraction
- Building hybrid pipelines that combine both approaches
- Optimizing cost/accuracy tradeoffs in text processing

## Core Principles

1. **Regex first** — handles 95-98% cheaply and deterministically
2. **Confidence gate at 0.95** — only low-confidence items go to LLM
3. **Cheapest LLM** for validation (Haiku-class is enough)
4. **Never mutate** — return new instances from cleaning/validation
5. **Log metrics** — regex rate and LLM call count track health

## Example

```python
items = parse_structured_text(content)
low = identify_low_confidence(items, 0.95)
result = process_document(content, llm_client=client)
```

## References

- `references/decision-architecture.md` — decision tree, pipeline diagram, use cases
- `references/regex-parser.md` — regex parser code with ParsedItem
- `references/confidence-llm.md` — confidence scoring and LLM validator
- `references/pipeline-practices.md` — hybrid pipeline, metrics, best/anti-patterns

## Checklist

- [ ] Format is consistent/repeating (>90%) before choosing regex
- [ ] Confidence threshold set (default 0.95) with flagged reasons
- [ ] LLM only on low-confidence items, cheapest model
- [ ] No mutation of parsed objects; edge cases tested

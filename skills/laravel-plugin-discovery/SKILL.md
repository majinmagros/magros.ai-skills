---
name: laravel-plugin-discovery
description: "Use when finding, evaluating, or compatibility-checking Laravel packages via LaraPlugins MCP. Triggers on \"laravel-plugin-discovery\", \"laravel plugin\", \"laraplugins\"."
metadata:
  origin: ECC
---

# Laravel Plugin Discovery

Find and vet healthy Laravel packages via LaraPlugins.io MCP. Detalhes em `references/`.

## When to Activate

- Finding Laravel packages for a feature ("auth", "admin panel")
- Asking "what package should I use for..." or "is there a package for..."
- Checking if a package is actively maintained
- Verifying Laravel/PHP version compatibility
- Assessing package health before adding to a project

## Core Principles

1. **Search first** — `SearchPluginTool` with keyword + health filter
2. **Healthy for prod** — `Medium` needs attention, `Unhealthy` is out
3. **Match versions** — filter by project's Laravel + PHP versions
4. **Details before recommending** — `GetPluginDetailsTool` for health, activity, risk
5. **Free, no key** — `https://laraplugins.io/mcp/plugins` in `~/.claude.json`

## Example

```
SearchPluginTool({ text_search: "permission",
  health_score: "Healthy", laravel_compatibility: "12" })
```

## References

- `references/mcp-setup.md` — MCP config, SearchPluginTool/GetPluginDetailsTool params
- `references/workflows-examples.md` — find/evaluate/compatibility flows plus 4 examples
- `references/filtering.md` — health bands, Laravel versions, combining filters
- `references/interpretation.md` — result fields, use-case table, practices, related skills

## Checklist

- [ ] MCP server configured; no API key expected
- [ ] `Healthy` filter applied for production picks
- [ ] Laravel + PHP compatibility matches project
- [ ] Details + vendor risk reviewed before recommending
- [ ] Version history shows recent maintenance

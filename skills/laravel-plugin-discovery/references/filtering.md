# Filtering Best Practices

## By Health Score

| Health Band | Meaning |
|-------------|---------|
| `Healthy` | Active maintenance, recent updates |
| `Medium` | Occasional updates, may need attention |
| `Unhealthy` | Abandoned or infrequently maintained |
| `Unrated` | Not yet assessed |

Prefer `Healthy` for production.

## By Laravel Version

| Version | Notes |
|---------|-------|
| `13` | Latest Laravel |
| `12` | Current stable |
| `11` | Still widely used |
| `10` | Legacy but common |
| `5`-`9` | Deprecated |

Match the target project's Laravel version.

## Combining Filters

```typescript
// Find healthy, Laravel 12 compatible packages for permissions
SearchPluginTool({
  text_search: "permission",
  health_score: "Healthy",
  laravel_compatibility: "12"
})
```

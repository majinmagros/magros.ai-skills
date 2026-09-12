# MCP Setup and Tool Parameters

LaraPlugins MCP server must be configured. Add to your `~/.claude.json` mcpServers:

```json
"laraplugins": {
  "type": "http",
  "url": "https://laraplugins.io/mcp/plugins"
}
```

No API key required — free for the Laravel community.

## SearchPluginTool

Search by keyword, health, vendor, compatibility.

- `text_search` (string, optional): e.g. "permission", "admin", "api"
- `health_score` (string, optional): `Healthy`, `Medium`, `Unhealthy`, `Unrated`
- `laravel_compatibility` (string, optional): `"5"`–`"13"`
- `php_compatibility` (string, optional): `"7.4"`, `"8.0"`, `"8.1"`, `"8.2"`, `"8.3"`, `"8.4"`, `"8.5"`
- `vendor_filter` (string, optional): e.g. "spatie", "laravel"
- `page` (number, optional): pagination

## GetPluginDetailsTool

Detailed metrics, readme, version history.

- `package` (string, required): full Composer name (e.g. "spatie/laravel-permission")
- `include_versions` (boolean, optional): include version history

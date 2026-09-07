# Google Ads — leitura via MCP, escrita via API

Fonte: https://developers.google.com/google-ads/api/docs/developer-toolkit/mcp-server
Repo: https://github.com/googleads/google-ads-mcp

## Leitura (MCP oficial — read-only no release atual)

Instalação via `pipx` (Python, transporte `stdio`):

```json
{
  "mcpServers": {
    "google-ads-mcp": {
      "command": "pipx",
      "args": ["run", "--spec", "git+https://github.com/googleads/google-ads-mcp.git", "google-ads-mcp"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "PATH_DO_JSON",
        "GOOGLE_PROJECT_ID": "SEU_PROJECT_ID",
        "GOOGLE_ADS_DEVELOPER_TOKEN": "SEU_DEV_TOKEN_22_CHARS"
      }
    }
  }
}
```

Tools (confirmar com `tools/list` na sessão — rollout muda):

| Tool | Uso |
|---|---|
| `list_accessible_customers` | ids + nomes das contas acessíveis |
| `search` | queries GAQL (métricas, budgets, status) |
| `get_resource_metadata` | metadados de um resource (ex.: `campaign`) |

Exemplo GAQL (auditoria de termos caros sem conversão):

```sql
SELECT campaign.name, ad_group.name, search_term_view.search_term,
       metrics.cost_micros, metrics.conversions
FROM search_term_view
WHERE segments.date DURING LAST_7_DAYS
ORDER BY metrics.cost_micros DESC LIMIT 50
```

## Escrita (Google Ads API direta)

- Client libraries oficiais (Python/Java/PHP/.NET/Ruby); operações `mutate`
  em campaign / ad group / criterion / budget.
- Developer token: https://developers.google.com/google-ads/api/docs/get-started/dev-token
- Conta de teste (test account) p/ validar fluxo sem gastar: console do Google Ads API.
- Fluxo da skill: GAQL primeiro (dry-run de leitura) → `APROVADO` → mutate →
  confirmar `resource_name` retornado → logar.

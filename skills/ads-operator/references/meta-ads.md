# Meta Ads — leitura via MCP, escrita via Marketing API

Fontes:
- https://developers.facebook.com/documentation/ads-commerce/ads-ai-connectors/ads-mcp-server/ads-mcp-server-overview
- Setup: https://developers.facebook.com/documentation/ads-commerce/ads-ai-connectors/ads-mcp-server/ads-mcp-server-get-started
- API: https://developers.facebook.com/docs/marketing-api
- Anúncio: https://developers.facebook.com/blog/post/2026/07/16/meta-ads-mcp-server/

## Leitura (MCP oficial — remoto, gerenciado pela Meta)

- URL: `https://mcp.facebook.com/ads` (qualquer client MCP-compatível).
- Setup: app em developers.facebook.com/apps → use case "Create & manage ads
  with ads MCP server" → Advanced Access em `ads_mcp_management`.
- Auth: OAuth via Facebook Login for Business (sem token manual) ou
  `Authorization: Bearer <USER_ACCESS_TOKEN>` p/ setup programático.
- CLI: `claude mcp add --transport http --client-id <META_APP_ID> meta-ads https://mcp.facebook.com/ads`
- **Sempre rodar `tools/list` na sessão**: rollout gradual por conta
  (visto em vídeo: 3–4 de 40 contas); faltas conhecidas em rollout parcial:
  attribution window, interests, reach/estimativa, lookalike/custom parcial,
  preview p/ cliente, duplicação com UTM — confirmar antes de prometer.

## Escrita (Marketing API direta — token-lean)

- Estrutura: campaign → adset → ad; endpoints Graph p/ criar/gerenciar +
  insights (gasto, CPA/ROAS, frequência).
- Prefira API direta p/ escrita repetida/rotinas: sessões MCP longas custam
  10–25× mais tokens (claim de vídeo — medir no seu uso).
- Fluxo da skill: insights primeiro → plano + hipótese → `APROVADO` →
  POST na API → confirmar id retornado → logar por conta/cliente.
- Multi-conta: iterar `act_<ID>` explicitamente; nunca reusar plano entre contas.

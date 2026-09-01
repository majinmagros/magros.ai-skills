# Artifact Sharing Reference (Anthropic Cloud Design)

## Cloud Design Artifact Sharing

### O que é
Quando você cria um protótipo no Cloud Design (`/design` command), pode gerar um **link compartilhável** (artifact link) que permite a qualquer pessoa visualizar o protótipo no browser, sem precisar de conta Claude.

### Como funciona (Video Gustavo Campelo)
1. Cria protótipo no `/design`
2. Clica em "Share" ou "Artifact link"
3. Gera URL: `https://claude.ai/artifact/...` ou similar
4. Compartilha link → abre no browser com preview interativo

### Anthropic Artifacts API (Analytics)

#### Endpoint
```http
GET https://api.anthropic.com/v1/organizations/analytics/artifacts
Headers:
  anthropic-version: 2023-06-01
  Authorization: Bearer $ANTHROPIC_OAUTH_TOKEN
  Content-Type: application/json
```

#### Query Parameters
| Param | Tipo | Descrição |
|---|---|---|
| `start_date` | string | ISO 8601 (ex: 2026-08-01) |
| `end_date` | string | ISO 8601 |
| `artifact_type` | string | `code`, `document`, `image`, `svg`, `mermaid`, `react`, `html` |
| `group_by` | string | `day`, `week`, `month`, `artifact_type`, `is_shared` |
| `limit` | int | Max resultados (default 100) |

#### Response
```json
{
  "data": [
    {
      "artifact_type": "html",
      "artifacts_created_count": 42,
      "distinct_user_count": 5,
      "is_shared": true,
      "published_artifacts_created_count": 12,
      "product": "claude",
      "rbac_group_id": "grp_...",
      "rbac_group_name": "Design Team",
      "user_id": "usr_..."
    }
  ],
  "next_page": "eyJvZmZzZXQiOjEwMH0="
}
```

#### Fields
| Field | Tipo | Descrição |
|---|---|---|
| `artifact_type` | string | Tipo do artifact (code, document, image, svg, mermaid, react, html) |
| `artifacts_created_count` | int | Total criado no período |
| `distinct_user_count` | int | Usuários únicos que criaram |
| `is_shared` | boolean | Se já foi compartilhado alguma vez |
| `published_artifacts_created_count` | int | Quantos foram publicados |
| `product` | string | `claude` |
| `rbac_group_id` | string | ID do grupo RBAC |
| `rbac_group_name` | string | Nome do grupo |
| `user_id` | string | ID do usuário criador |

---

## Artifact Sharing Events (Compliance API)

### Event Type: `artifact_sharing_updated`

```json
{
  "event_type": "artifact_sharing_updated",
  "event_id": "evt_...",
  "timestamp": "2026-08-26T14:30:00Z",
  "actor": {
    "user_id": "usr_...",
    "email": "designer@empresa.com",
    "name": "João Designer"
  },
  "artifact": {
    "id": "art_...",
    "type": "html",
    "title": "Landing Page - Máquina de Conteúdo",
    "created_at": "2026-08-26T10:00:00Z",
    "updated_at": "2026-08-26T14:30:00Z"
  },
  "changes": {
    "is_shared": {
      "from": false,
      "to": true
    },
    "published": {
      "from": false,
      "to": true
    },
    "sharing_settings": {
      "from": { "access": "private" },
      "to": { "access": "anyone_with_link" }
    }
  }
}
```

### Outras Events Relacionadas

| Event | Descrição |
|---|---|
| `artifact_created` | Novo artifact criado |
| `artifact_updated` | Conteúdo modificado |
| `artifact_deleted` | Artifact removido |
| `artifact_published` | Publicado (público) |
| `artifact_sharing_updated` | Config de compartilhamento alterada |

---

## Open Design — Export & Sharing (Local-First)

### Export Formats
```bash
# HTML/CSS (engenharia)
open-design export --format html --output ./handoff

# PPTX (apresentação)
open-design export --format pptx --output ./pitch.pptx

# PDF (documentação)
open-design export --format pdf --output ./spec.pdf

# MP4 (walkthrough animado)
open-design export --format mp4 --output ./walkthrough.mp4
```

### Local Preview Server
```bash
open-design preview
# → Inicia servidor em http://localhost:3000
# Canvas interativo com hot reload
```

### Sharing Local (Open Design)
- **Não há cloud sharing nativo** (local-first)
- Workarounds:
  1. Export HTML → hospedar em Netlify/Vercel/GitHub Pages
  2. Export PPTX/PDF → enviar arquivo
  3. Screen record MP4 → enviar vídeo
  3. Compartilhar pasta `handoff/` via Git/sync

### Artifact Structure (HTML Export)
```
handoff/
├── index.html          # Entry point
├── styles.css          # Design tokens + componentes
├── design-tokens.css   # :root { --color-primary: ... }
├── DESIGN.md           # Design system doc
├── components/
│   ├── Button.html
│   ├── Card.html
│   ├── Input.html
│   └── ...
├── assets/
│   ├── fonts/
│   ├── images/
│   └── icons/
└── preview.html        # Preview standalone
```

---

## Comparison: Cloud Design vs Open Design Sharing

| Aspect | Cloud Design | Open Design |
|---|---|---|
| **Sharing** | Link artifact (Anthropic cloud) | Export files → self-host |
| **Access Control** | RBAC, groups, audit log | File permissions |
| **Analytics** | Built-in (API) | Manual |
| **Collaboration** | Real-time (cloud) | Async (Git/sync) |
| **Privacy** | Dados na Anthropic | 100% local |
| **Cost** | Incluso na assinatura | Grátis (BYOK) / pay-per-artifact (Cloud) |
| **Compliance** | SOC2, audit logs | Self-managed |

---

## Referências Oficiais

- Anthropic Artifacts API: `platform.claude.com/docs/en/api/admin/analytics/artifacts`
- Compliance Events: `platform.claude.com/docs/en/api/compliance/activities`
- Open Design GitHub: https://github.com/nexu-io/open-design
- Context7: `/nexu-io/open-design`
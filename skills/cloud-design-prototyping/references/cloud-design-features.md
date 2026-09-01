# Cloud Design Features (Validado via Video + Anthropic Docs)

## `/design` Command — Cloud Code Desktop App

### Fluxo do Vídeo (Gustavo Campelo - M7ie0MRsmsk)

1. **Abrir Cloud Desktop** → New Session
2. **Digitar `/design`** → prompt "O que você quer construir?"
3. **Input:** Descrição do produto + especificações
4. **Output:** Canvas com **3 propostas de estilo** (esboços)
5. **Escolher estilo** → gera página completa
6. **Edição dual:**
   - **Manual:** Clique no texto → edite direto (sem tokens)
   - **Prompt:** "mude o hero para fundo escuro", "aumente o CTA"
7. **Preview Mobile/Desktop:** Toggle no próprio canvas
8. **Artifact Sharing:** Link compartilhável (Anthropic Artifacts)
9. **Integração Skills:** Adicionar `frontend-design` skill para qualidade superior

### Características Principais

| Feature | Descrição |
|---|---|
| **3 Style Options** | Tech, Clássico, Moderno (exemplo do vídeo) |
| **Interactive Canvas** | Zoom in/out, pan, click-to-edit |
| **Manual Edit** | Click any text → inline edit, bold, italic, underline |
| **Prompt Edit** | Natural language → regenera seção |
| **Mobile/Desktop Toggle** | Preview responsivo no canvas |
| **Artifact Link** | Shareable URL, abre no browser |
| **Skill Integration** | Plugins skills (ex: frontend-design) melhoram output |

### Limitações Notadas no Vídeo

- Repositório vazio = resultado "decente" mas genérico
- Skills transformam "básico" → "produção"
- Open Design (162 skills) produz resultado superior
- Melhor combinação: `/design` + skill `frontend-design`

---

## Artifact Sharing — Anthropic API

### Endpoint (Analytics)
```http
GET https://api.anthropic.com/v1/organizations/analytics/artifacts
Headers:
  anthropic-version: 2023-06-01
  Authorization: Bearer $ANTHROPIC_OAUTH_TOKEN
```

### Response Structure
```json
{
  "data": [
    {
      "artifact_type": "code|document|image|...",
      "artifacts_created_count": 15,
      "distinct_user_count": 3,
      "is_shared": true,
      "published_artifacts_created_count": 5,
      "product": "claude",
      "rbac_group_id": "...",
      "rbac_group_name": "Design Team",
      "user_id": "..."
    }
  ],
  "next_page": "..."
}
```

### Sharing Events (Compliance API)
```json
{
  "event_type": "artifact_sharing_updated",
  "actor": { "user_id": "...", "email": "..." },
  "artifact": { "id": "...", "type": "code", "title": "Landing Page" },
  "changes": {
    "is_shared": { "from": false, "to": true },
    "published": { "from": false, "to": true }
  },
  "timestamp": "2026-08-26T..."
}
```

---

## Cloud Design vs Open Design

| Aspecto | Cloud Design (Anthropic) | Open Design (nexu-io) |
|---|---|---|
| **Acesso** | Cloud Desktop app (closed) | Local-first, open source |
| **Modelo** | Anthropic models (Sonnet/Opus) | BYOK — sua API key |
| **Direções** | 3 styles fixos | 5 curated + brand extract |
| **Edição** | Canvas web (manual + prompt) | CLI + canvas web |
| **Artifact** | Anthropic Artifacts (cloud) | Local filesystem + export |
| **Handoff** | Link artifact | HTML/CSS + PPTX/PDF/MP4 |
| **Design System** | Implícito | DESIGN.md explícito |
| **Memória** | Sessão | Acumula (screenshots, fonts, palettes) |
| **Custo** | Assinatura Claude | BYOK / Open Design Cloud ($/artifact) |
| **Privacidade** | Dados na Anthropic | Local-only (loopback, SSRF guard) |

---

## Referências Oficiais

- Video: Gustavo Campelo "O comando /design do Cloud Code" (M7ie0MRsmsk)
- Anthropic Artifacts API: `platform.claude.com/docs/en/api/admin/analytics/artifacts`
- Open Design: https://github.com/nexu-io/open-design (Context7 `/nexu-io/open-design`)
- Benchmark Open Design: 74.82, High reputation
# Anki-Connect API Reference (Validado via Context7)

## Library: Anki-Connect (`/websites/git_sr_ht_foosoft_anki-connect`)

### Endpoint
```
POST http://localhost:8765/
Content-Type: application/json
```

### Actions Principais

#### addNotes — Criar múltiplos cards
```json
{
  "action": "addNotes",
  "version": 6,
  "params": {
    "notes": [
      {
        "deckName": "AI-Tutor::cybersecurity::fundamentos",
        "modelName": "Basic (and reversed)",
        "fields": {
          "Front": "O que é TLS?",
          "Back": "Transport Layer Security - protocolo de criptografia para comunicações seguras na internet.\n\nAnalogia: Como um envelope selado que só o destinatário pode abrir."
        },
        "tags": ["ai-tutor", "cybersecurity", "fundamentos", "tls"],
        "audio": [
          {
            "url": "file:///lessons/cybersec/fundamentos/tls_podcast.m4a",
            "filename": "tls_explanation.m4a",
            "fields": ["Back"]
          }
        ]
      }
    ]
  }
}
```

#### createDeck — Criar deck
```json
{
  "action": "createDeck",
  "version": 6,
  "params": { "deck": "AI-Tutor::cybersecurity::fundamentos" }
}
```

#### getDecks — Listar decks
```json
{ "action": "getDecks", "version": 6 }
```

#### findNotes — Buscar cards
```json
{
  "action": "findNotes",
  "version": 6,
  "params": { "query": "deck:AI-Tutor::cybersecurity tag:tls" }
}
```

---

## Modelo Recomendado: "Basic (and reversed)"

Cria 2 cards por nota:
1. Front → Back (pergunta → resposta)
2. Back → Front (resposta → pergunta)

**Vantagem:** Reforço bidirecional da memória

---

## Media Embedding

### Áudio (podcast segment)
```json
"audio": [{
  "url": "https://example.com/podcast_segment.m4a",
  "filename": "tls_podcast.m4a",
  "fields": ["Back"],
  "skipHash": "md5_hash_opcional"
}]
```

### Imagem (diagrama)
```json
"picture": [{
  "url": "https://example.com/tls_diagram.png",
  "filename": "tls_handshake.png",
  "fields": ["Back"]
}]
```

### Video (opcional)
```json
"video": [{
  "url": "https://example.com/tls_animation.mp4",
  "filename": "tls_handshake.mp4",
  "fields": ["Back"]
}]
```

---

## Integração TypeScript

```typescript
interface AnkiNote {
  deckName: string;
  modelName: "Basic" | "Basic (and reversed)" | "Cloze";
  fields: Record<string, string>;
  tags?: string[];
  audio?: AnkiMedia[];
  picture?: AnkiMedia[];
  video?: AnkiMedia[];
}

interface AnkiMedia {
  url: string;
  filename: string;
  fields: string[];  // quais fields tocam/exibem
  skipHash?: string;
}

async function addNotes(notes: AnkiNote[]): Promise<(number | null)[]> {
  const res = await fetch('http://localhost:8765/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'addNotes',
      version: 6,
      params: { notes }
    })
  });
  const data = await res.json();
  return data.result;  // array de note IDs (null = falhou)
}
```

---

## Setup Anki-Connect

1. Instalar Anki Desktop
2. Tools → Add-ons → Get Add-ons → Código: `2055492159`
3. Reiniciar Anki
4. Verificar: `curl http://localhost:8765/ -d '{"action": "version", "version": 6}'`

---

## Referências Oficiais

- GitHub: https://git.sr.ht/~foosoft/anki-connect
- Context7 ID: `/websites/git_sr_ht_foosoft_anki-connect`
- Benchmark Score: 82.57
- Source Reputation: High
- README: https://git.sr.ht/~foosoft/anki-connect/blob/main/README.md
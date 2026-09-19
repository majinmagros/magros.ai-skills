---
name: whatsapp-link-collector
description: Coleta links de um grupo WhatsApp específico via Evolution API/GO, normaliza URLs e salva em arquivo JSON semanal. Trigger: "coleta links whatsapp", "inbox links semana", "grupo whatsapp só links".
metadata:
  origin: ECC
  depends_on:
    - whatsapp-evolution-go
---

# Skill: WhatsApp Link Collector

Coleta links de grupo WhatsApp (só links, sem conversa) e gera `inbox/links-semana-NN.json` para o pipeline de conteúdo.

## Quando usar

- "coleta os links do grupo whatsapp dessa semana"
- "preciso do inbox da semana pro pesquisador"
- Execução agendada: quintas-feiras à noite (schedule)

## Pré-requisitos

- Evolution API/GO rodando com instância conectada
- `EVO_API_KEY`, `EVO_BASE_URL` (ex: `http://localhost:8080`), `EVO_INSTANCE` no ambiente
- Grupo alvo: nome ou JID conhecido (`GRUPO_LINKS_JID`)

## Fluxo

1. **Busca mensagens** do grupo via `GET /chat/findMessages/{instance}?where={"key.remoteJid":"GRUPO_JID"}` (últimos 7 dias)
2. **Filtra**: só mensagens com `messageType === "conversation"` ou `extendedTextMessage` que contenham URL (`https?://`)
3. **Normaliza**: remove tracking params (`utm_*`, `fbclid`, `gclid`), deduplica por URL base
4. **Salva**: `inbox/links-semana-<ano>-<semana>.json`
   ```json
   {
     "semana": "2026-W38",
     "coletado_em": "2026-09-19T22:30:00Z",
     "links": [
       {"url": "https://exemplo.com/artigo", "origem_msg_id": "abc123", "timestamp": "2026-09-15T14:22:00Z"},
       ...
     ]
   }
   ```

## Variáveis de ambiente

| Variável | Obrigatório | Exemplo |
|---|---|---|
| `EVO_BASE_URL` | sim | `http://localhost:8080` |
| `EVO_API_KEY` | sim | `sua-chave-api` |
| `EVO_INSTANCE` | sim | `ratos-content` |
| `GRUPO_LINKS_JID` | sim | `5511999999999-123456@g.us` |
| `INBOX_DIR` | não (default `./inbox`) | `/caminho/inbox` |

## Script sugerido (Node/TS)

```ts
// scripts/collect-links.ts
import fetch from 'node-fetch';
import { writeFileSync, mkdirSync } from 'fs';
import { URL } from 'url';

const BASE = process.env.EVO_BASE_URL!;
const KEY = process.env.EVO_API_KEY!;
const INST = process.env.EVO_INSTANCE!;
const JID = process.env.GRUPO_LINKS_JID!;
const OUT = process.env.INBOX_DIR || './inbox';

async function main() {
  const since = new Date(Date.now() - 7*24*60*60*1000).toISOString();
  const res = await fetch(`${BASE}/chat/findMessages/${INST}?where=${encodeURIComponent(JSON.stringify({
    "key.remoteJid": JID,
    "messageTimestamp": { "$gte": Math.floor(Date.now()/1000) - 7*86400 }
  }))}`, { headers: { apikey: KEY } });
  const data = await res.json();
  
  const urls = new Map<string, {url:string, origem_msg_id:string, timestamp:string}>();
  for (const msg of data.messages || []) {
    const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
    for (const m of text.matchAll(/https?:\/\/[^\s]+/g)) {
      try {
        const u = new URL(m[0]);
        u.searchParams.forEach((_, k) => { if (k.startsWith('utm_') || ['fbclid','gclid'].includes(k)) u.searchParams.delete(k); });
        const clean = u.toString();
        if (!urls.has(clean)) urls.set(clean, { url: clean, origem_msg_id: msg.key.id, timestamp: new Date(msg.messageTimestamp*1000).toISOString() });
      } catch {}
    }
  }
  
  const semana = new Date().toISOString().split('T')[0].replace(/-/g, '-W');
  mkdirSync(OUT, { recursive: true });
  writeFileSync(`${OUT}/links-semana-${semana}.json`, JSON.stringify({
    semana, coletado_em: new Date().toISOString(), links: [...urls.values()]
  }, null, 2));
  console.log(`OK: ${urls.size} links únicos salvos em ${OUT}/links-semana-${semana}.json`);
}
main().catch(console.error);
```

## Como rodar

```bash
node scripts/collect-links.ts
# ou via cron/schedule: 0 22 * * 4  (quintas 22h)
```

## Gate de aceite

- Arquivo JSON gerado com `links.length > 0`
- Todas URLs válidas (parse `new URL()` não lança)
- Zero duplicatas por URL base limpa
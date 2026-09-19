---
name: context-ledger-sync
description: Arquiva roteiro final, metadados e transcrição no Memory Vault / Context Ledger local, atualizando índice de busca para consultas futuras ("em qual episódio falei de X?"). Trigger: "sincroniza contexto", "atualiza ledger episódio", "memória episódica".
metadata:
  origin: ECC
  depends_on:
    - post-production-pipeline
    - context-ledger
    - unified-memory
---

# Skill: Context Ledger Sync

Sincroniza os ativos finais do episódio no Ledger de Contexto local (SQLite + FTS5), permitindo busca semântica/literal sobre todo o histórico.

## Quando usar

- "atualiza o ledger com o episódio 33"
- "indexa o episódio pro agente buscar depois"
- Roda ao final do `post-production-pipeline`

## Entradas (de `episodes/eps-NN-output/`)

- `metadata.json`
- `transcricao.txt`
- `eps-NN-roteiro.md` (original)

## Ação

1. **Lê** os 3 arquivos
2. **Insere/Atualiza** no Ledger (tabela `episodes` + FTS5 virtual table `episodes_fts`):
   ```sql
   CREATE TABLE episodes (
     id INTEGER PRIMARY KEY,
     numero INTEGER UNIQUE,
     titulo TEXT,
     data_gravacao TEXT,
     data_publicacao TEXT,
     youtube_id TEXT,
     metadata_json TEXT,
     roteiro_md TEXT,
     transcricao_txt TEXT,
     created_at INTEGER
   );
   CREATE VIRTUAL TABLE episodes_fts USING fts5(
     numero, titulo, roteiro_md, transcricao_txt,
     content='episodes', content_rowid='id'
   );
   ```
3. **Atualiza triggers** FTS5 para sincronismo automático
4. **Loga** sucesso/erro em `state/ledger-sync.log`

## Consulta de teste (validação automática)

Após sync, roda:
```sql
SELECT numero, titulo FROM episodes_fts 
WHERE episodes_fts MATCH 'Cloud Code' 
ORDER BY bm25(episodes_fts) LIMIT 5;
```
Deve retornar o episódio recém-adicionado no topo.

## Variáveis de ambiente

| Variável | Obrigatório | Exemplo |
|---|---|---|
| `LEDGER_DB` | não (default `./state/context-ledger.db`) | `/caminho/context-ledger.db` |
| `EPISODES_DIR` | não | `./episodes` |

## Script sugerido (Node)

```ts
// scripts/sync-ledger.ts
import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';

const EPS = process.argv[2];
const DB = process.env.LEDGER_DB || './state/context-ledger.db';
const DIR = join(process.env.EPISODES_DIR || './episodes', `eps-${EPS}-output`);

const db = new Database(DB);
db.pragma('journal_mode = WAL');

const meta = JSON.parse(readFileSync(join(DIR, 'metadata.json'), 'utf8'));
const roteiro = readFileSync(join(DIR, `../eps-${EPS}-roteiro.md`), 'utf8');
const transcricao = readFileSync(join(DIR, 'transcricao.txt'), 'utf8');

const info = db.prepare(`
  INSERT OR REPLACE INTO episodes 
  (numero, titulo, data_gravacao, youtube_id, metadata_json, roteiro_md, transcricao_txt, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  parseInt(EPS),
  meta.title,
  meta.recorded_at || new Date().toISOString(),
  meta.youtube_id || null,
  JSON.stringify(meta),
  roteiro,
  transcricao,
  Date.now()
);

console.log(`Ledger sincronizado: episódio ${EPS} (rowid ${info.lastInsertRowid})`);
db.close();
```

## Gate de aceite

- Episódio inserido no SQLite sem erro
- Consulta FTS5 por termo-chave do episódio retorna o episódio novo
- `state/ledger-sync.log` registra sucesso com timestamp
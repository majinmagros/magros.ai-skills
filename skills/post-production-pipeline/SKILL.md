---
name: post-production-pipeline
description: Pipeline paralelo pós-gravação: transcrição + metadados YouTube (título, descrição, capítulos, tags) + carrosséis Instagram/TikTok (3-5 slides) + newsletter. Trigger: "pós-produção", "metadados youtube carrossel newsletter", "pipeline pós-gravação".
metadata:
  origin: ECC
  depends_on:
    - episode-planner-and-script
    - video-cut-pipeline
    - content-engine
    - social-publisher
    - brand-voice
---

# Skill: Post-Production Pipeline (Grafo Paralelo)

Após a gravação do vídeo pelo humano, processa o arquivo bruto em 3 ramos independentes.

## Quando usar

- "pós-produção do episódio 33"
- "gera metadados, carrosséis e newsletter do episódio"
- Roda após gravação (sexta à noite / sábado)

## Entrada

- Vídeo/áudio bruto: `episodes/raw/eps-33.mp4` (ou `.mp3`/`.wav`)
- Roteiro original: `episodes/eps-33-roteiro.md`

## Saída (pasta `episodes/eps-33-output/`)

```
episodes/eps-33-output/
├── metadata.json          # título, descrição, capítulos, tags
├── transcricao.txt        # texto completo
├── carrossel/
│   ├── slide-1.md         # capa
│   ├── slide-2.md         # destaque 1
│   ├── slide-3.md         # destaque 2
│   ├── slide-4.md         # destaque 3
│   └── slide-5.md         # CTA / call to action
└── newsletter.md          # formato pronto pra enviar
```

## Ramos Paralelos

### 4a. `youtube-metadata-generator`
- **Input**: áudio + roteiro
- **Transcrição**: local (Whisper.cpp) ou API
- **Gera**:
  - Título otimizado (compara com episódios anteriores via `context-ledger-sync`)
  - Descrição SEO (200-300 chars, timestamps, links fontes)
  - Capítulos (extraídos do roteiro + timestamps aproximados)
  - Tags (15-20: IA, dev, ferramentas, Cloud Code, Codex, etc.)
- **Output**: `metadata.json` + `transcricao.txt`

### 4b. `social-carousels-generator`
- **Input**: roteiro + transcrição
- **Gera** 5 slides em Markdown/HTML (pronto pro editor/Canva):
  1. Capa: título do episódio + "Ep 33"
  2-4. Um slide por destaque (título + 2-3 bullets + fonte)
  5. CTA: "Assista completo no YouTube" + QR code/link curto
- **Output**: `carrossel/slide-{1..5}.md`

### 4c. `newsletter-generator`
- **Input**: roteiro + transcrição + metadados
- **Formato**: assunto curto + intro pessoal + 4 blocos (1 por destaque) + link episódio + CTA comunidade
- **Output**: `newsletter.md`

## Variáveis de ambiente

| Variável | Obrigatório | Exemplo |
|---|---|---|
| `EPISODES_DIR` | não | `./episodes` |
| `WHISPER_MODEL` | não | `base` ou `small` |
| `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` | opcional (se não usar Whisper local) | — |

## Orquestração (Node/TS)

```ts
// scripts/post-production.ts
import { spawn } from 'child_process';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const EPS = process.argv[2]; // ex: "33"
const DIR = `episodes/eps-${EPS}-output`;
mkdirSync(DIR, { recursive: true });
mkdirSync(join(DIR, 'carrossel'), { recursive: true });

// roda os 3 em paralelo
const tasks = [
  spawn('node', ['scripts/youtube-metadata.ts', EPS], { stdio: 'inherit' }),
  spawn('node', ['scripts/carrossel-generator.ts', EPS], { stdio: 'inherit' }),
  spawn('node', ['scripts/newsletter-generator.ts', EPS], { stdio: 'inherit' }),
];

Promise.all(tasks.map(t => new Promise(r => t.on('close', r)))).then(() => {
  console.log(`Pós-produção Ep ${EPS} concluída em ${DIR}`);
}).catch(console.error);
```

## Gate de aceite

- Pasta `eps-NN-output/` criada com 4 arquivos obrigatórios
- `metadata.json` válido (campos: title, description, chapters, tags)
- 5 slides de carrossel gerados
- `newsletter.md` com estrutura completa
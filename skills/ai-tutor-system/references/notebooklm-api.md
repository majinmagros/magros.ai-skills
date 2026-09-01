# NotebookLM API Reference (Validado via Context7)

## Library: notebooklm-py (`/teng-lin/notebooklm-py`)

### Audio Artifact Generation

```python
from notebooklm import NotebookLMClient

client = NotebookLMClient(token="YOUR_TOKEN")

# 1. Create notebook
notebook = client.notebooks.create(title="Cybersec Aula 1")

# 2. Add sources (PDF, URL, text)
client.sources.upload(notebook_id=notebook.id, file_path="cybersec_notes.pdf")

# 3. Wait for sources to be READY
client.sources.wait_for_ready(notebook_id=notebook.id)

# 4. Generate audio artifact (podcast)
task = client.artifacts.generate_audio(notebook_id=notebook.id)

# 5. Poll until complete
artifact = client.artifacts.wait_for_completion(notebook_id=notebook.id, task_id=task.task_id)

# 6. Download
client.artifacts.download_audio(notebook_id=notebook.id, artifact_id=artifact.id, path="aula_podcast.m4a")
```

### REST API (cURL)

```bash
# Generate artifact
curl -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
     -d '{"type":"audio"}' $BASE/v1/notebooks/<id>/artifacts

# Poll status
curl -H "Authorization: Bearer $TOKEN" $BASE/v1/notebooks/<id>/artifacts/<task_id>

# Download
curl -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
     -d '{"type":"audio"}' $BASE/v1/notebooks/<id>/artifacts/download -o out.m4a
```

### Supported Artifact Types
- `audio` — podcast (m4a)
- `quiz` — questionário
- `mindmap` — mapa mental
- `video` — vídeo (custom styling via `style_prompt`)

### Rate Limits
- Wait 5 min between retries on 429
- Max concurrent generations per notebook: 1

---

## Library: NotebookLM SDK (`/agmmnn/notebooklm-sdk`)

### TypeScript/Node.js

```typescript
import { NotebookLM } from 'notebooklm-sdk';

const nblm = new NotebookLM({ apiKey: process.env.NOTEBOOKLM_API_KEY });

const notebook = await nblm.notebooks.create({ title: "Aula X" });
await nblm.sources.addFile(notebook.id, "./notes.pdf");

const audioTask = await nblm.artifacts.generateAudio(notebook.id);
const audioFile = await nblm.artifacts.downloadAudio(notebook.id, audioTask.id);
```

---

## Integração no Pipeline

```typescript
async function generateLessonPodcast(lesson: Lesson, notebookId: string): Promise<string> {
  const task = await client.artifacts.generate_audio({
    notebook_id: notebookId,
    type: "audio",
    // opcional: instruções de estilo
  });
  
  const artifact = await client.artifacts.wait_for_completion({
    notebook_id: notebookId,
    task_id: task.task_id
  });
  
  const audioPath = `lessons/${lesson.id}/podcast.m4a`;
  await client.artifacts.download_audio({
    notebook_id: notebookId,
    artifact_id: artifact.id,
    path: audioPath
  });
  
  return audioPath;
}
```

---

## Referências Oficiais

- GitHub: https://github.com/teng-lin/notebooklm-py
- Context7 ID: `/teng-lin/notebooklm-py`
- Benchmark Score: 82.14
- Source Reputation: High
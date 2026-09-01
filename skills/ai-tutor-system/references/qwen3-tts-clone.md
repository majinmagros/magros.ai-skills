# Qwen3-TTS Voice Cloning Reference (Validado via Context7)

## Library: Qwen3-TTS (`/qwenlm/qwen3-tts`)

### Modelos Disponíveis
| Modelo | Params | VRAM | Licença |
|---|---|---|---|
| Qwen3-TTS-12Hz-0.6B-Base | 0.6B | ~1.8 GB | Apache 2.0 |
| Qwen3-TTS-12Hz-1.7B-Base | 1.7B | ~3.9 GB | Apache 2.0 |

### Installation
```bash
pip install qwen-tts
# ou via HuggingFace
pip install -U "huggingface_hub[cli]"
huggingface-cli download Qwen/Qwen3-TTS-12Hz-1.7B-Base --local-dir ./Qwen3-TTS-1.7B
huggingface-cli download Qwen/Qwen3-TTS-Tokenizer-12Hz --local-dir ./Qwen3-TTS-Tokenizer
```

### Voice Cloning API (Python)

```python
import torch
import soundfile as sf
from qwen_tts import Qwen3TTSModel

# Carregar modelo (GPU recomendada)
model = Qwen3TTSModel.from_pretrained(
    "Qwen/Qwen3-TTS-12Hz-1.7B-Base",
    device_map="cuda:0",
    dtype=torch.bfloat16,
    attn_implementation="flash_attention_2",
)

# Referência: 3 segundos de áudio + transcrição
ref_audio = "https://qianwen-res.oss-cn-beijing.aliyuncs.com/Qwen3-TTS-Repo/clone.wav"
ref_text = "Okay. Yeah. I resent you. I love you. I respect you. But you know what? You blew it!"

# Gerar voz clonada (ICL mode - melhor qualidade)
wavs, sr = model.generate_voice_clone(
    text="Bem-vindo à sua aula de cybersecurity. Hoje vamos falar sobre TLS.",
    language="Portuguese",
    ref_audio=ref_audio,
    ref_text=ref_text,
    x_vector_only_mode=False,  # ICL mode (usa ref_text)
)

sf.write("aula_tls_podcast.wav", wavs[0], sr)
```

### Parâmetros Principais

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `text` | string/list | Sim | Texto a sintetizar |
| `language` | string/list | Sim | Idioma (10 suportados) |
| `ref_audio` | string | Sim | URL, path, base64 ou (array, sr) |
| `ref_text` | string | ICL mode | Transcrição do ref_audio |
| `x_vector_only_mode` | boolean | Não | True = só speaker embedding (sem ref_text) |
| `voice_clone_prompt` | object | Não | Prompt reutilizável (otimização) |
| `max_new_tokens` | int | Não | Limite tokens gerados |

### Modos de Clonagem

#### ICL Mode (Recomendado - Melhor Qualidade)
```python
wavs, sr = model.generate_voice_clone(
    text="Sua aula aqui...",
    language="Portuguese",
    ref_audio=ref_audio,
    ref_text=ref_text,           # Obrigatório
    x_vector_only_mode=False,    # ICL mode
)
```

#### X-Vector Only Mode (Sem ref_text)
```python
wavs, sr = model.generate_voice_clone(
    text="Sua aula aqui...",
    language="Portuguese",
    ref_audio=ref_audio,
    x_vector_only_mode=True,     # Só speaker embedding
)
```

### Batch Generation (Múltiplas frases)

```python
sentences = [
    "Bem-vindo ao módulo de redes.",
    "Vamos entender o modelo OSI.",
    "A camada física é a base."
]

wavs, sr = model.generate_voice_clone(
    text=sentences,
    language=["Portuguese", "Portuguese", "Portuguese"],
    ref_audio=ref_audio,
    ref_text=ref_text,
    max_new_tokens=2048,
)

for i, wav in enumerate(wavs):
    sf.write(f"aula_segment_{i}.wav", wav, sr)
```

### Reusable Voice Clone Prompt (Otimização)

```python
# Extrair features uma vez
prompt_items = model.create_voice_clone_prompt(
    ref_audio=ref_audio,
    ref_text=ref_text,
    x_vector_only_mode=False,
)

# Gerar múltiplas frases sem re-extrair
for sentence in sentences:
    wavs, sr = model.generate_voice_clone(
        text=sentence,
        language="Portuguese",
        voice_clone_prompt=prompt_items,  # Reutiliza features
    )
    sf.write(f"segment_{i}.wav", wavs[0], sr)
```

### Supported Languages (10)
- Chinese, English, Japanese, Korean, German, French, Russian, **Portuguese**, Spanish, Italian

### Audio Output
- Sample rate: 24kHz (padrão)
- Format: numpy array (float32, -1 a 1)
- Save: `soundfile.write("output.wav", wav, sr)`

---

## Integração Node.js/TypeScript (via Python bridge)

```typescript
// scripts/qwen-tts-bridge.py
import sys, json
from qwen_tts import Qwen3TTSModel
import soundfile as sf

model = Qwen3TTSModel.from_pretrained(...)

input_data = json.load(sys.stdin)
wavs, sr = model.generate_voice_clone(**input_data)

for i, wav in enumerate(wavs):
    sf.write(f"{input_data['output_prefix']}_{i}.wav", wav, sr)

print(json.dumps({"files": [f"{input_data['output_prefix']}_{i}.wav" for i in range(len(wavs))]}))
```

```typescript
// TypeScript caller
import { spawn } from 'child_process';

async function cloneVoice(params: {
  text: string | string[];
  language: string | string[];
  ref_audio: string;
  ref_text?: string;
  output_prefix: string;
}) {
  const py = spawn('python', ['scripts/qwen-tts-bridge.py'], { stdio: ['pipe', 'pipe', 'inherit'] });
  py.stdin.write(JSON.stringify(params));
  py.stdin.end();
  
  const output = await new Promise<string>(resolve => {
    let data = '';
    py.stdout.on('data', chunk => data += chunk);
    py.on('close', () => resolve(data));
  });
  
  return JSON.parse(output).files;
}
```

---

## Hardware Requirements

| Modelo | GPU VRAM | RAM | Tempo (10s audio) |
|---|---|---|---|
| 0.6B | 2-4 GB | 8 GB | ~3-5s |
| 1.7B | 6-8 GB | 16 GB | ~5-10s |

**Recomendação:** 1.7B para melhor qualidade, 0.6B para máquinas limitadas

---

## Referências Oficiais

- GitHub: https://github.com/qwenlm/qwen3-tts
- Context7 ID: `/qwenlm/qwen3-tts`
- Benchmark Score: 79.19
- Source Reputation: High
- HuggingFace: https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base
- Demo: https://huggingface.co/spaces/Qwen/Qwen3-TTS
- License: Apache 2.0
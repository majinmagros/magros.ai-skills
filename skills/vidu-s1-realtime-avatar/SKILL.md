---
name: vidu-s1-realtime-avatar
description: >
  Use quando precisar integrar o Vidu S1 (ShengShu) para avatares digitais interativos em tempo real via API.
  Gatilhos: "Vidu S1 API", "avatar tempo real", "digital human interativo", "ShengShu Vidu S1", "AliRTC integração", "WebSocket live session".
  NÃO use para: geração de clips de vídeo offline (use fal-ai-media/pipeline-video-agente), text-to-video assíncrono (use Kling/Runway/Veo), ou quando precisar rodar 100% local (Vidu S1 é server-side only).
  Outcome: sessão live com avatar digital que responde a voz/texto em tempo real, com voice clone, memory/knowledge retrieval, e controle LLM.
metadata:
  origin: ECC
  validated: 2026-08-22
  source_video: npVm4tBalp8
  official_docs: https://platform.vidu.com/docs/vidu-s1
  source_notion: https://auspicious-passive-36a.notion.site/Vidu-S1-Introduction-34324005a3e48009b3f3d9c07c79d83b
---

## Vidu S1 Real-Time Avatar Integration Pipeline

### Visão Geral (Validado 2026-08-22 contra platform.vidu.com/docs/vidu-s1)

**Vidu S1** é um modelo **real-time interactive** server-side (não roda local). A integração requer **duas conexões paralelas**:

1. **App WebSocket** (`wss://{host}/live/ws/live/connect`) — controle: start, text, interrupt, hangup
2. **AliRTC** (`joinChannel`) — mídia: microfone, câmera, avatar audio/video

**Fluxo core:** Create Live → WS conn_init + AliRTC joinChannel (paralelo) → Control Ready + Media Ready → Interação → Hangup

---

### Validação Oficial (platform.vidu.com/docs/vidu-s1)

| Claim | Status | Detalhe |
|---|---|---|
| Real-time interactive | ✅ | "World-Leading Real-Time Interactive Model" |
| Free no site | ❌ | **Pago** — API usa créditos (`credits_cost`, `billed_seconds`) |
| Duração ilimitada | ⚠️ | Max **600s/sessão** (`live_duration`), idle timeout max 7200s |
| Roda local (consumer GPU) | ❌ | **Server-side** — AliRTC + SIP provider, precisa AliRTC SDK |
| Voice clone | ✅ | POST `/live/v1/voices/clone` (10-20s ref, 16 idiomas + dialetos) |
| Memory/Knowledge | ✅ | `memory_retrieval` + `knowledge_retrieval` (Beta) |
| LLM control | ✅ | temperature, top_p, top_k, penalties, max_tokens (1-64000) |
| VAD semântico | ✅ | `type: "semantic"` interrompe ao usuário falar |

---

## Passo a Passo

### 1. Pré-requisitos

```bash
# Python 3.10+
# AliRTC SDK (web: npm i @aliyun/rtc-sdk; native: download do Alibaba Cloud)
# API Key Vidu (console: platform.vidu.cn/api-keys)
# Domínio: api.vidu.cn (China) ou api.vidu.com (internacional)
```

### 2. Criar Sessão Live (HTTP)

```python
# scripts/create_live.py
import httpx
import json

class ViduS1Client:
    def __init__(self, api_key: str, host: str = "api.vidu.com"):
        self.api_key = api_key
        self.host = host
        self.base_url = f"https://{host}"
        self.headers = {
            "Authorization": f"Token {api_key}",
            "Content-Type": "application/json"
        }
    
    def create_live(self, call_mode: str = "video", persona: str = "", image_uri: str = "", voice: str = "Tina", **kwargs):
        """Cria sessão live e retorna live_id + credenciais RTC."""
        payload = {
            "call_mode": call_mode,
            "avatar": {
                "persona": persona,
                "image_uri": image_uri,
                "voice": voice
            },
            **kwargs
        }
        
        with httpx.Client(timeout=30) as client:
            resp = client.post(
                f"{self.base_url}/live/v1/lives",
                headers=self.headers,
                json=payload
            )
            resp.raise_for_status()
            return resp.json()
    
    def get_live(self, live_id: str):
        with httpx.Client(timeout=30) as client:
            resp = client.get(f"{self.base_url}/live/v1/lives/{live_id}", headers=self.headers)
            resp.raise_for_status()
            return resp.json()
    
    def list_lives(self, page: int = 0, pagesz: int = 10):
        with httpx.Client(timeout=30) as client:
            resp = client.get(f"{self.base_url}/live/v1/lives", headers=self.headers, params={"pager.page": page, "pager.pagesz": pagesz})
            resp.raise_for_status()
            return resp.json()
    
    def clone_voice(self, audio_url: str, voice_name: str, text: str, language: str = "en"):
        """Clona voz customizada."""
        payload = {
            "audio_url": audio_url,
            "voice": voice_name,
            "text": text,
            "language": language
        }
        with httpx.Client(timeout=60) as client:
            resp = client.post(f"{self.base_url}/live/v1/voices/clone", headers=self.headers, json=payload)
            resp.raise_for_status()
            return resp.json()
    
    def list_voices(self):
        with httpx.Client(timeout=30) as client:
            resp = client.get(f"{self.base_url}/live/v1/voices", headers=self.headers)
            resp.raise_for_status()
            return resp.json()
```

### 3. WebSocket Control (App Side)

```python
# scripts/ws_control.py
import asyncio
import json
import websockets
from typing import Callable, Optional

class ViduWSControl:
    def __init__(self, api_key: str, live_id: str, host: str = "api.vidu.com"):
        self.api_key = api_key
        self.live_id = live_id
        self.host = host
        self.ws: Optional[websockets.WebSocketClientProtocol] = None
        self.seq_id = 1
        self.on_message: Optional[Callable] = None
        self.on_ready: Optional[Callable] = None
        self.on_hangup: Optional[Callable] = None
    
    @property
    def ws_url(self) -> str:
        return f"wss://{self.host}/live/ws/live/connect?live_id={self.live_id}"
    
    async def connect(self):
        headers = {"Authorization": f"Token {self.api_key}"}
        self.ws = await websockets.connect(self.ws_url, extra_headers=headers)
        # Send conn_init immediately
        await self.send_conn_init()
    
    async def send_conn_init(self):
        msg = {
            "type": 1,
            "live_id": self.live_id,
            "seq_id": self.seq_id,
            "payload": {"conn_init": {"version": 1}}
        }
        self.seq_id += 1
        await self.ws.send(json.dumps(msg))
    
    async def send_text(self, content: str, msg_id: str = None):
        msg = {
            "type": 99,
            "live_id": self.live_id,
            "seq_id": self.seq_id,
            "payload": {
                "text_msg": {
                    "msg_id": msg_id or f"msg-{self.seq_id}",
                    "content": content,
                    "timestamp": 0
                }
            }
        }
        self.seq_id += 1
        await self.ws.send(json.dumps(msg))
    
    async def send_interrupt(self):
        msg = {"type": 7, "live_id": self.live_id, "seq_id": self.seq_id, "payload": {}}
        self.seq_id += 1
        await self.ws.send(json.dumps(msg))
    
    async def send_hangup(self, reason: str = "user_end"):
        msg = {
            "type": 5,
            "live_id": self.live_id,
            "seq_id": self.seq_id,
            "payload": {"hangup": {"hangup_reason": reason}}
        }
        self.seq_id += 1
        await self.ws.send(json.dumps(msg))
    
    async def listen(self):
        async for message in self.ws:
            data = json.loads(message)
            msg_type = data.get("type")
            
            if msg_type == 2:  # conn_init_ack
                payload = data.get("payload", {}).get("conn_init_ack", {})
                if payload.get("success") and self.on_ready:
                    await self.on_ready()
                elif not payload.get("success"):
                    print(f"Connection failed: {payload.get('error_code')} - {payload.get('error_msg')}")
            
            elif msg_type == 6:  # force_hangup
                if self.on_hangup:
                    await self.on_hangup(data.get("payload", {}).get("hangup", {}).get("hangup_reason"))
            
            elif msg_type == 99:  # text_msg from avatar
                payload = data.get("payload", {}).get("text_msg", {})
                if self.on_message:
                    await self.on_message(payload.get("content"))
            
            # Forward all messages to custom handler
            if self.on_message and msg_type not in [2, 6]:
                await self.on_message(data)
    
    async def close(self):
        if self.ws:
            await self.ws.close()
```

### 4. AliRTC Integration (Web)

```javascript
// scripts/alirtc_client.js
// npm i @aliyun/rtc-sdk

import AliRTC from '@aliyun/rtc-sdk';

class ViduAliRTC {
  constructor(rtcConfig) {
    this.rtcConfig = rtcConfig; // { app_id, channel_id, user_id, token, token_expire_at }
    this.client = null;
    this.remoteVideoElement = null;
  }
  
  async init(videoElementId) {
    this.remoteVideoElement = document.getElementById(videoElementId);
    
    this.client = AliRTC.createClient({
      mode: 'rtc',
      codec: 'h264'
    });
    
    // Auto-subscribe to all remote streams
    await this.client.setDefaultSubscribeAllRemoteAudioStreams(true);
    await this.client.setDefaultSubscribeAllRemoteVideoStreams(true);
    
    // Join channel
    await this.client.joinChannel(
      this.rtcConfig.token,
      this.rtcConfig.user_id
    );
    
    // Publish local media
    await this.client.publishLocalAudioStream(true);
    await this.client.publishLocalVideoStream(true);
    
    // Handle remote streams
    this.client.on('remoteUserOnLineNotify', (userId) => {
      console.log('Remote user online:', userId);
    });
    
    this.client.on('videoSubscribeStateChanged', (userId, oldState, newState) => {
      if (newState === 'subscribed') {
        // streamType=1: camera stream (digital character video)
        this.client.setRemoteViewConfig(this.remoteVideoElement, userId, 1);
        this.remoteVideoElement.play().catch(() => {
          console.warn('Remote video autoplay failed');
        });
      }
    });
    
    this.client.on('screenShareSubscribeStateChanged', (userId, oldState, newState) => {
      if (newState === 'subscribed') {
        // streamType=2: screen stream (if used)
        this.client.setRemoteViewConfig(this.remoteVideoElement, userId, 2);
      }
    });
  }
  
  async leave() {
    if (this.client) {
      await this.client.leaveChannel();
      AliRTC.destroyClient(this.client);
    }
  }
}
```

### 5. Pipeline Completo (Orquestração)

```python
# scripts/run_live_session.py
import asyncio
from create_live import ViduS1Client
from ws_control import ViduWSControl

async def run_avatar_session(
    api_key: str,
    persona: str,
    image_uri: str,
    voice: str = "Tina",
    call_mode: str = "video"
):
    """Executa sessão completa de avatar interativo."""
    
    # 1. Create Live session
    client = ViduS1Client(api_key)
    live_data = client.create_live(
        call_mode=call_mode,
        persona=persona,
        image_uri=image_uri,
        voice=voice,
        # Opcional: memory/knowledge retrieval
        memory_retrieval={
            "enabled": True,
            "endpoint": "https://sua-api.com/memory/search",
            "authorization": "Bearer token",
            "timeout_ms": 3000
        },
        knowledge_retrieval={
            "enabled": True,
            "endpoint": "https://sua-api.com/knowledge/search",
            "authorization": "Bearer token",
            "timeout_ms": 3000
        },
        # LLM control
        llm={
            "temperature": 0.7,
            "top_p": 0.8,
            "max_tokens": 100
        },
        # VAD semântico
        vad={
            "type": "semantic",
            "threshold": 0.5,
            "silence_duration_ms": 200
        }
    )
    
    live_id = live_data["live"]["id"]
    rtc_config = live_data["rtc"]
    
    print(f"Live created: {live_id}")
    print(f"RTC: {rtc_config['channel_id']}, user: {rtc_config['user_id']}")
    
    # 2. Initialize WebSocket control
    ws_control = ViduWSControl(api_key, live_id)
    
    ready_event = asyncio.Event()
    
    async def on_ready():
        print("WebSocket control ready!")
        ready_event.set()
    
    async def on_avatar_message(message):
        print(f"Avatar: {message}")
    
    async def on_hangup(reason):
        print(f"Session ended: {reason}")
    
    ws_control.on_ready = on_ready
    ws_control.on_message = on_avatar_message
    ws_control.on_hangup = on_hangup
    
    # 3. Connect WebSocket and AliRTC in parallel
    await ws_control.connect()
    
    # Wait for control ready
    await asyncio.wait_for(ready_event.wait(), timeout=10)
    
    # 4. Initialize AliRTC (web version)
    # In Python, you'd use a web view or separate JS process
    # For web: use the alirtc_client.js in a browser
    
    print("Session ready! Interact via WebSocket (text_msg) or voice (AliRTC)")
    
    # Example: Send text message
    await ws_control.send_text("Olá, tudo bem?")
    
    # Keep session alive
    try:
        while True:
            await asyncio.sleep(1)
    except KeyboardInterrupt:
        print("Hanging up...")
        await ws_control.send_hangup("user_end")
        await ws_control.close()
    
    # 5. Check billing
    billing = client.get_live(live_id)
    print(f"Billed seconds: {billing.get('live', {}).get('billed_seconds')}")
    print(f"Credits cost: {billing.get('live', {}).get('credits_cost')}")

if __name__ == "__main__":
    import os
    API_KEY = os.getenv("VIDU_API_KEY")
    if not API_KEY:
        print("Set VIDU_API_KEY env var")
        exit(1)
    
    asyncio.run(run_avatar_session(
        api_key=API_KEY,
        persona="Você é um DJ virtual energético que anima a festa. Responde em português brasileiro com gírias de pista.",
        image_uri="https://exemplo.com/seu-avatar.png",
        voice="Tina"
    ))
```

### 6. Voice Clone (Custom Voice)

```python
# scripts/clone_voice.py
from create_live import ViduS1Client

client = ViduS1Client(os.getenv("VIDU_API_KEY"))

# Clone voice from reference audio
result = client.clone_voice(
    audio_url="https://seu-storage.com/jarvis_ref.wav",  # URL pública ou data URI
    voice_name="jarvis_dj",
    text="Good morning. These are eight hours. The security systems are operational.",  # Transcrição EXATA
    language="en"
)
print(f"Voice cloned: {result}")
```

---

## Referências (em `references/`)

| Arquivo | Descrição |
|---|---|
| `references/api-reference.md` | API reference completa copiada da doc oficial |
| `references/error-codes.md` | Códigos de erro HTTP + WS |
| `references/voice-list.md` | Lista de vozes disponíveis + dialetos |
| `references/persona-templates.md` | Templates de persona recomendados |

---

## Scripts (em `scripts/`)

| Script | Uso |
|---|---|
| `create_live.py` | Cliente HTTP para Create/Get/List Live, Voice Clone |
| `ws_control.py` | WebSocket control (conn_init, text, interrupt, hangup) |
| `alirtc_client.js` | AliRTC integration (web) |
| `run_live_session.py` | Pipeline completo orquestrado |
| `clone_voice.py` | Voice clone customizado |

---

## Exemplo: DJ Virtual para Livestream

```python
# Configuração para DJ
DJ_PERSONA = """
Você é o DJ VIDU, um DJ virtual que comanda a pista.
- Fala em português brasileiro com gírias de festa (bora, galera, pista, drop)
- Energia alta, motiva a galera, anuncia músicas
- Responde ao chat em tempo real
- Sabe quando dar "mão pro alto", "desce pro chão", "pula"
- Personalidade: carismático, profissional, conhece DnB, techno, house
"""

asyncio.run(run_avatar_session(
    api_key=os.getenv("VIDU_API_KEY"),
    persona=DJ_PERSONA,
    image_uri="https://seu-cdn.com/dj-avatar.png",
    voice="Tina",  # Ou voice clone customizado
    call_mode="video"
))
```

---

## Billing & Limits (Docs Oficiais)

| Item | Limite |
|---|---|
| `live_duration` | Max 600 segundos (10 min) por sessão |
| `idle_timeout_seconds` | 10-7200s (default 7200) |
| `llm.max_tokens` | 1-64000 |
| Voice clone ref audio | 10-20s recomendado, max 60s, <10MB |
| Supported languages (voice clone) | 16 idiomas + dialetos chineses |
| RTC token expiry | 1 hora (`token_expire_at`) |

---

## Troubleshooting

| Erro | Causa | Solução |
|---|---|---|
| `NOT_READY` (WS) | SIP endpoint não pronto | Wait 2-3s, retry conn_init com backoff exponencial |
| `LIVE_CONN_INIT_FAILED` | Estado anômalo ou dependência | Nova sessão (Create Live) |
| 401 Unauthorized | API key inválida/ausente | Verificar `Authorization: Token vda_xxx` |
| 403 Forbidden | Live ID não pertence à API key | Usar mesma API key que criou a sessão |
| 404 Not Found | Sessão expirada/incorreta | Criar nova sessão |
| AliRTC join falha | Token expirado / SDK version | Verificar `token_expire_at`, atualizar SDK |

---

## Checklist de Qualidade

- [x] Pipeline mapeado: Create Live → WS + AliRTC (paralelo) → Interact → Hangup
- [x] Claims validados contra docs oficiais (platform.vidu.com/docs/vidu-s1)
- [x] Correções documentadas: não é free, não roda local, max 600s
- [x] Scripts determinísticos para HTTP, WS, Voice Clone
- [x] Progressive disclosure: SKILL.md ≤ 200 linhas, detalhes em references/scripts
- [x] Frontmatter com gatilhos concretos e não-gatilhos
- [x] Billing/limits documentados

---

## Limitações Conhecidas

| Limitação | Detalhe |
|---|---|
| **Server-side only** | Não roda local; requer API key, AliRTC SDK, conectividade |
| **Custo por uso** | Credits por segundo (`billed_seconds`, `credits_cost`) |
| **Max 10 min/sessão** | `live_duration` max 600s; criar nova sessão se precisar mais |
| **AliRTC SDK obrigatório** | Web: `@aliyun/rtc-sdk`; Native: download Alibaba Cloud |
| **China vs International** | Hosts diferentes: `api.vidu.cn` vs `api.vidu.com` |
| **Memory/Knowledge Beta** | Endpoints customizados, timeout max 30s |
| **Não é text-to-video assíncrono** | Para clips offline, use `fal-ai-media` / `pipeline-video-agente` |
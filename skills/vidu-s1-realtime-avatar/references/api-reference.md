# Vidu S1 API Reference (Copiado de platform.vidu.com/docs/vidu-s1)

Data de acesso: 2026-08-22

---

## Base URLs

| Ambiente | Host | HTTP | WebSocket |
|---|---|---|---|
| China | `api.vidu.cn` | `https://api.vidu.cn` | `wss://api.vidu.cn` |
| Internacional | `api.vidu.com` | `https://api.vidu.com` | `wss://api.vidu.com` |

---

## Autenticação

Todas as requisições HTTP e WebSocket requerem:
```
Authorization: Token vda_xxx
```
API Key obtida no [Console](https://platform.vidu.cn/api-keys)

---

## Endpoints HTTP

### Create Live Session
```
POST /live/v1/lives
```
**Request Body:**
```json
{
  "call_mode": "video",
  "character_id": "1",
  "avatar": {
    "persona": "string",
    "image_uri": "string",
    "voice": "string",
    "greeting_instruction": "string"
  },
  "moderation": "disabled",
  "extra_motion": true,
  "audio": { "enable_transcription": true },
  "vad": {
    "type": "semantic",
    "threshold": 0.5,
    "silence_duration_ms": 200,
    "idle_timeout_ms": 500
  },
  "llm": {
    "temperature": 0.7,
    "top_p": 0.8,
    "top_k": 20,
    "frequency_penalty": 1.0,
    "presence_penalty": 0.3,
    "seed": -1,
    "max_tokens": 50
  },
  "idle_timeout_seconds": 7200,
  "memory_retrieval": {
    "enabled": true,
    "endpoint": "string",
    "authorization": "string",
    "timeout_ms": 3000
  },
  "knowledge_retrieval": {
    "enabled": true,
    "endpoint": "string",
    "authorization": "string",
    "timeout_ms": 3000
  }
}
```

**Response:**
```json
{
  "live": {
    "id": "string",
    "status": "waiting",
    "live_duration": 600,
    "call_mode": "video"
  },
  "rtc": {
    "app_id": "string",
    "channel_id": "string",
    "user_id": "string",
    "token": "string",
    "token_expire_at": "string"
  }
}
```

---

### Query Live Session
```
GET /live/v1/lives/{live_id}
```
**Response:** status, created_at, start_time, end_time, trace_id, billed_seconds, credits_cost

---

### List Live Sessions
```
GET /live/v1/lives?pager.page=0&pager.pagesz=10
```

---

### Voice Clone
```
POST /live/v1/voices/clone
```
```json
{
  "audio_url": "string",
  "voice": "string",
  "text": "string",
  "language": "string"
}
```

**Languages suportados:** zh, en, de, it, pt, es, ja, ko, fr, ru, th, id, ar, cs, da, nl, fi, he, hi, is, ms, no, fa, pl, sv, tl, tr, ur, vi + dialetos chineses (Dongbei, Shaanxi, Sichuan, Henan, Changsha, Tianjin, Hangzhou, Liaoning, Shenyang, Anshan)

---

### List Voices
```
GET /live/v1/voices
```

---

### Image Upload
```
POST /tools/v2/files/uploads  (get upload URL)
PUT {put_url}  (upload image)
POST /tools/v2/files/uploads/finish  (complete upload)
```

---

### External Memory API
```
POST {memory_retrieval.endpoint}
Authorization: {memory_retrieval.authorization}
```
**Request:**
```json
{
  "live_id": "string",
  "query": "string",
  "reason": "string",
  "memory_types": ["preference", "style", "profile", "history", "project", "constraint", "relationship", "other"],
  "time_hint": "string",
  "max_results": 5
}
```

**Response:**
```json
{
  "memories": [
    {
      "id": "string",
      "summary": "string",
      "type": "string",
      "confidence": 0.94,
      "updated_at": "ISO8601",
      "source": "string"
    }
  ]
}
```

---

### External Knowledge API
```
POST {knowledge_retrieval.endpoint}
Authorization: {knowledge_retrieval.authorization}
```
**Request:**
```json
{
  "live_id": "string",
  "query": "string",
  "reason": "string",
  "knowledge_types": ["faq", "document", "policy", "procedure", "troubleshooting", "product", "other"],
  "time_hint": "string",
  "max_results": 5
}
```

---

## WebSocket Protocol

### Connection
```
wss://{host}/live/ws/live/connect?live_id={live_id}&conn_id={conn_id}
Authorization: Token vda_xxx
```

### Message Types

| Type | Name | Direction | Description |
|---|---|---|---|
| 1 | conn_init | App → Live | Connection initialization |
| 2 | conn_init_ack | Live → App | Initialization result |
| 5 | call_hangup | App → Live | Active Hang-Up |
| 6 | force_hangup | Live → App | Server-Forced Hang-Up |
| 7 | audio_interrupted | App → Live | User interrupts |
| 99 | text_msg | App → Live | Send Text Message |

---

### conn_init
```json
{
  "type": 1,
  "live_id": "1234567890",
  "conn_id": "app-conn-1",
  "seq_id": 1,
  "payload": { "conn_init": { "version": 1 } }
}
```

### conn_init_ack (success)
```json
{
  "type": 2,
  "live_id": "1234567890",
  "conn_id": "app-conn-1",
  "seq_id": 2,
  "payload": {
    "conn_init_ack": {
      "success": true,
      "error_code": "",
      "error_msg": "",
      "server_timestamp": 1710000000
    }
  }
}
```

### conn_init_ack (failure)
```json
{
  "type": 2,
  "live_id": "1234567890",
  "conn_id": "app-conn-1",
  "seq_id": 2,
  "payload": {
    "conn_init_ack": {
      "success": false,
      "error_code": "NOT_READY",
      "error_msg": "live sip endpoint not ready",
      "server_timestamp": 1710000000
    }
  }
}
```

### text_msg
```json
{
  "type": 99,
  "live_id": "1234567890",
  "conn_id": "app-conn-1",
  "seq_id": 10,
  "payload": {
    "text_msg": {
      "msg_id": "client-msg-1",
      "content": "Hello",
      "timestamp": 1710000000000
    }
  }
}
```

### audio_interrupted
```json
{
  "type": 7,
  "live_id": "1234567890",
  "conn_id": "app-conn-1",
  "seq_id": 11,
  "payload": {}
}
```

### call_hangup
```json
{
  "type": 5,
  "live_id": "1234567890",
  "conn_id": "app-conn-1",
  "seq_id": 12,
  "payload": {
    "hangup": { "hangup_reason": "user_end" }
  }
}
```

**hangup_reason values:** user_end, timeout, audit_violation, credit_insufficient, sip_closed, provider_closed, sip_reconnect_timeout, client_reconnect_timeout, external

---

## AliRTC Integration

### Channel IDs
| Mode | channel_id | App Responsibilities |
|---|---|---|
| audio | `live-audio-{live_id}` | Publish mic, subscribe bot audio |
| video | `live-user-{live_id}` | Publish mic+cam, subscribe bot audio+video |

### Role ID Rules
| Role | User ID Format |
|---|---|
| User | `live-user-{creatorID}-{liveID}` |
| Bot Audio | `live-bot-{creatorID}-{liveID}` |
| Bot Video | `live-video-push-{creatorID}-{liveID}` |

### Web SDK (JavaScript)
```javascript
import AliRTC from '@aliyun/rtc-sdk';

await aliRtc.setDefaultSubscribeAllRemoteAudioStreams(true);
await aliRtc.setDefaultSubscribeAllRemoteVideoStreams(true);
await aliRtc.joinChannel(rtc.token, rtc.user_id);
await aliRtc.publishLocalAudioStream(true);
if (callMode === 'video') {
  await aliRtc.publishLocalVideoStream(true);
}

aliRtc.on('videoSubscribeStateChanged', (userId, oldState, newState) => {
  if (newState === 'subscribed') {
    aliRtc.setRemoteViewConfig(remoteVideoElement, userId, 1); // streamType=1
    remoteVideoElement.play();
  }
});
```

---

## Error Responses

### HTTP Errors
| Status | Reason | Handling |
|---|---|---|
| 400 | BAD_REQUEST | Corrigir parâmetros |
| 401 | Unauthorized | Verificar API key |
| 403 | Forbidden | Live ID não pertence à conta |
| 404 | Not Found | Sessão não existe |
| 500 | Internal Error | Retry com backoff |

### WebSocket Business Errors
| Error Code | Cause | Handling |
|---|---|---|
| NOT_READY | SIP endpoint não pronto | Wait 2-3s, retry conn_init |
| LIVE_CONN_INIT_FAILED | Estado anômalo | Nova sessão (Create Live) |
---
name: claude-video
description: "Give Claude vision for video — transcript + keyframes (Cloud Video by Brad Bonano). Use when need Claude to watch YouTube/IG/TikTok/local video and summarize. Triggers on \"claude video\", \"cloud video\", \"transcript video\", \"keyframes\", \"Brad Bonano\""
---

# Claude Video — Vision for Video

> Fonte: `Maestros da IA — K__4uua27u8` (5 Hacks, Cloud Video, 44★), transcript `K__4uua27u8.pt.dedup.txt:40-120`

Gives Claude eyes. Not generation — **watching**.

## Quando usar

- Claude precisa assistir YouTube/IG/TikTok/local e resumir
- Precisa transcript + frames sem queimar tokens

## 4 Modos

| Modo | O que faz | Custo |
|---|---|---|
| `transcript` | só texto | menor |
| `efficient` | 50 keyframes | baixo |
| `balance` | 100 scene-change frames | médio |
| `token-burner` | ilimitado | alto |

Whisper fallback se sem captions.

## Workflow

```
video URL/path → /cloud-video <url> --mode efficient → transcript + frames → Claude resume
```

Fontes: YouTube, Instagram, TikTok, local.

## Checklist

- [ ] Modo escolhido por custo
- [ ] Whisper fallback ok
- [ ] Frames limit respeitado

## Referências

- `references/modes.md` — 4 modos + custo

# YT Control State Schema

## File Location
`C:\projetos\Oportunidades\state\yt-control.json`

## Schema (v1)

```json
{
  "version": 1,
  "updated_at": "2026-08-31T...",
  "channels": [
    {
      "handle": "@gucampelo",
      "name": "Gustavo Campelo",
      "raw_dir": "C:\\projetos\\Oportunidades\\gustavo-campelo\\raw",
      "videos": [
        {
          "id": "M7ie0MRsmsk",
          "title": "O comando /design do Cloud Code",
          "url": "https://youtube.com/watch?v=M7ie0MRsmsk",
          "published_at": "2026-08-26",
          "status": "analyzed",
          "matches_filtro": true,
          "analyzed_at": "2026-08-31T...",
          "transcription_path": null,
          "dedup_path": null,
          "opportunities": [
            { "concept": "Cloud Design /design command", "skill": "cloud-design-prototyping", "status": "covered" },
            { "concept": "Frontend design skill comparison", "skill": "frontend-design-direction", "status": "covered" }
          ],
          "notes": "Barra design + frontend design skill"
        }
      ]
    }
  ]
}
```

## Status Values
- `pending` - Novo do catálogo, matches_filtro=true, precisa baixar
- `downloading` - Download em andamento
- `transcribed` - .vtt baixado, precisa dedup
- `deduped` - .dedup.txt gerado, pronto para análise
- `analyzed` - Análise completa, opportunities preenchido, transcrições purgadas
- `skipped` - matches_filtro=false ou decisão manual

## Fluxo de Transição
```
pending → downloading → transcribed → deduped → analyzed
                ↘ skipped
```

## Migração (One-time)
Ler todas as fontes legadas:
1. `manifests/canais-vigilados.json` → channels[].handle, name
2. `manifests/canais-vigilados.local.json` → channels[].raw_dir
3. `<raw_dir>/CATALOGO.json` → videos (id, title, published_at, matches_filtro)
4. `<raw_dir>/ANALISADOS.json` → videos analisados
5. `<raw_dir>/raw/*.vtt` → transcription_path
6. `<raw_dir>/*.dedup.txt` → dedup_path

Resultado: `state/yt-control.json` consolidado.
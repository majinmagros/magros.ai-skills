---
name: youtube-channel-autopilot
description: "Use when running an adjacent YouTube channel on autopilot from existing long-form footage — keyword-first mids, transcript-driven cut selection, 5 uploads/day with >=30 min spacing, and a ramp to 10-20/day. Triggers PT: \"canal automático no youtube\", \"canal adjacente\", \"youtube autopilot\", \"5 vídeos por dia\", \"canal de cortes\", \"mids\", \"ranquear por palavra-chave\". Triggers EN: \"youtube channel autopilot\", \"adjacent channel\", \"upload cadence\", \"keyword-first youtube\". Non-triggers: per-video packaging (use youtube-packaging), DM lead funnel (use repurpose-shorts-dm-funnel), raw-footage cutting (use video-cut-pipeline). Outcome: a scheduled upload queue fed by the archive, with keyword-validated packaging and a cadence the channel can sustain."
metadata:
  origin: ECC
  validated: 2026-10-31
  source_video: ___J8OOGAh8
  official_sources:
    - https://support.google.com/youtube/answer/1311392
    - https://support.google.com/youtube/answer/9528076
---

# YouTube Channel Autopilot — canal adjacente movido a repurpose

Fonte: `___J8OOGAh8` (@maestrosdaia). Case `maestros.mp4`: canal adjacente ao
principal (4,5M inscritos), inspirado no canal adjacente do Hormozi — 30x menor e,
segundo ele, vendendo mais. Rodou com 5 vídeos/dia, uma pessoa + IA.

## Quando usar

- Canal novo/adjacente para capturar busca sem depender do canal principal.
- Existe acervo (vídeos longos, lives, treinamentos) para fatiar.
- A meta é **ranquear por palavra-chave**, não viralizar.

## Quando NÃO usar

- Vídeo original único, sem acervo → `video-editing` + `youtube-packaging`.
- Funil de DM por keyword → `repurpose-shorts-dm-funnel`.
- Conteúdo reutilizado sem transformação real → risco de política de conteúdo reutilizado; não escale.

## Modelo: o produto é o "mid"

- **3–8 min horizontal**, uma tese extraída do vídeo longo. Retenção maior que short.
- 1 vídeo de 22 min → ~3 mids + ~4 vídeos de avatar.
- Shorts/reels são subproduto, não o centro da estratégia.

## Pipeline (7 estágios)

| # | Estágio | Regra |
|---|---|---|
| 1 | Seleção do acervo | excluir vídeo curto ou de tema único; precisa render vários trechos |
| 2 | Transcrição | download + transcript local; guardar timestamps |
| 3 | Seleção de trechos | 1 tese por trecho; nunca réplica do vídeo original |
| 4 | Produção | corte/render em fila; avatar só fora do escopo dos cortes |
| 5 | Keyword-first | validar termo, título, descrição, CTA e thumbnail (delegar a `youtube-packaging`) |
| 6 | Agendamento | ≥5/dia, intervalo mínimo 30 min, sem rajada |
| 7 | Medição | views, retenção, inscritos, CTR; matar tema/trecho sem tração |

## Dials

- intervalo mínimo entre uploads: **30 min**
- cadência inicial: **5/dia**
- rampa: 10 → 15 → 20/dia, só depois de tração real
- duração do mid: **3–8 min**
- trechos por vídeo longo: **≥3**
- gate: revisão humana no primeiro lote antes de liberar o agendador

## Riscos

- **Conteúdo reutilizado**: cada mid precisa de transformação (contexto, edição, narração/avatar próprio). Confirme as regras vigentes do YouTube antes de escalar.
- **RAM/CPU**: transcrição + render competem; rodar 1 job por vez, em fila.
- **Canibalização**: medir sobreposição de audiência com o canal principal; linha editorial distinta.

## Arquivos de apoio

- `references/operacao.md` — critérios de seleção, protocolo de keyword, agenda, métricas e modos de falha.

## Related skills

- `video-cut-pipeline` — corte e legenda antes do agendamento.
- `youtube-packaging` — 3 títulos + 3 thumbs e descrição por vídeo.
- `repurpose-shorts-dm-funnel` — quando o objetivo é lead por DM, não busca.
- `social-publisher` — publicação e distribuição multi-plataforma.

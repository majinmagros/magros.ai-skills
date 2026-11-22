---
name: h3-structured-video-prompt
description: "Use when writing a video-generation prompt for MiniMax H3 (local or API), Seedance, Kling or Veo — structured blocks with subject definitions, shot timecodes, soundscape and music. Triggers on \"prompt H3\", \"MiniMax H3 prompt\", \"prompt de vídeo\", \"timecode de shot\", \"ref2va\", \"fl2va\", \"prompt estruturado de vídeo\"."
metadata:
  origin: ECC
---

# H3 Structured Video Prompt

Schema de prompt em blocos para o MiniMax H3. O modelo foi treinado num formato específico; prompt em prosa livre perde aderência. O mesmo esqueleto é portável para Seedance, Kling e Veo com pequenos ajustes.

> Fonte: Willian IA `8DALo_Y2Z4I` e `aetuL154-pE`. O módulo oficial que gera esse formato (`H3-Context-IR`) **não é open source** — daí a necessidade desta skill.

## Quando usar

- Gerar clipe no H3 local (ComfyUI) ou via API.
- Adaptar um roteiro/ideia para o formato que o modelo entende.
- Corrigir clipe que "ignora" parte do pedido (personagem troca, ação some, áudio não bate).
- Reaproveitar o mesmo prompt em outra família (Seedance/Kling/Veo).

## Quando NÃO usar

- Imagem estática (use prompt de imagem).
- Edição de vídeo existente (use `video-editing`).
- Planejamento de cena 3D/previs (use `blender-previs-animatic` antes).

## Os 6 blocos

| Bloco | O que vai dentro | Regra |
|---|---|---|
| `subject_definitions` | cada personagem/objeto nomeado, com 2–4 traços visuais fixos | usar os **mesmos** nomes no resto do prompt |
| `summary` | 1–2 frases com objetivo dramático da cena | sem detalhe técnico |
| `retention_analysis` | o que **precisa** permanecer igual entre shots (roupa, cicatriz, objeto na mão) | liste só o que o modelo tende a perder |
| `detailed_description` | shots com timecode, ação, câmera, luz | é o corpo do prompt |
| `overall_soundscape` | ambiente, SFX, diálogo (se houver) | descrever por shot quando muda |
| `non_diegetic_music` | trilha que não vem da cena | opcional; `none` é válido |

## Gramática de timecode

```text
[Shot 1] 00:00–00:03
[Shot 2] 00:03–00:06
[Shot 3] 00:06–00:08
```

Regras:

- Timecodes **contínuos**, sem buraco e sem sobreposição.
- Último timecode = duração pedida (8 s no workflow local, 4–15 s no H3).
- Um shot por ação principal. Duas ações no mesmo shot = o modelo escolhe uma.
- Câmera explícita: `static`, `slow push-in`, `handheld follow`, `whip pan`, `crane up`.
- Luz explícita: `low-key practical`, `soft window light`, `harsh noon sun`.

## Segmentos e continuidade (H3 local)

- Gerar no máximo **8 s por segmento**; juntar depois. Acima disso a qualidade cai.
- O último frame do segmento N é a referência de continuidade do N+1.
- `ref2va` (referência → vídeo+áudio) preserva personagem melhor que `fl2va` (primeiro/último frame).
- `max` vs `match` na referência: `max` usa a resolução máxima da imagem; `match` capa na resolução do vídeo. Para ficha de personagem, `max`; para economizar VRAM, `match`.
- Mencionar referência no texto com `@image1`, `@image2` — o modelo liga o token à imagem anexada.

## Template

```text
subject_definitions:
  - "ANA": mulher, 30 anos, cabelo preto curto, jaqueta jeans, cicatriz na sobrancelha direita.
  - "CHAVE": chave de latão grande, dente torto.

summary:
Ana tenta abrir a porta do necrotério antes que a luz de emergência apague.

retention_analysis:
- jaqueta jeans e cicatriz permanecem iguais em todos os shots.
- a chave fica na mão direita até o shot 3.

detailed_description:
[Shot 1] 00:00–00:03
Plano médio, Ana de frente para a porta, mão direita segurando @image1. Câmera lenta push-in. Luz fria de corredor, uma lâmpada piscando.

[Shot 2] 00:03–00:06
Close na mão girando a chave na fechadura. Câmera estática, profundidade rasa. Suor no metal.

[Shot 3] 00:06–00:08
Plano aberto por trás de Ana; a porta abre 10 cm e a luz de emergência apaga. Câmera handheld, leve tremor.

overall_soundscape:
[Shot 1] zumbido de lâmpada, passos distantes.
[Shot 2] metal raspando, respiração curta.
[Shot 3] clique do interruptor, silêncio, porta rangendo.

non_diegetic_music:
Drone grave crescendo até o corte final.
```

## Validação antes de gerar

- [ ] Todos os nomes de `subject_definitions` aparecem no `detailed_description` com a mesma grafia
- [ ] Timecodes contínuos e iguais à duração pedida
- [ ] Cada shot tem 1 ação + 1 movimento de câmera + 1 condição de luz
- [ ] `retention_analysis` cobre só o que costuma mudar (roupa, cabelo, objeto)
- [ ] Áudio descreve o que a cena mostra (não inventa fonte sonora ausente)
- [ ] Referência citada com `@imageN` e anexada de fato

## Portabilidade

| Família | Ajuste |
|---|---|
| Seedance | aceita bloco único em prosa; mantenha os timecodes e a ordem dos shots |
| Kling | prefere descrição contínua; junte `detailed_description` num parágrafo |
| Veo | aceita diálogo entre aspas e `audio:` explícito; mantenha `subject_definitions` |

## Anti-padrões

- Prompt em prosa única de 500 palavras sem timecode.
- Renomear personagem no meio (`Ana` → `a mulher` → `ela`) — o modelo trata como outra pessoa.
- Pedir 3 ações no mesmo shot.
- Descrever trilha em `overall_soundscape` (é `non_diegetic_music`).
- Ignorar `retention_analysis` e reclamar que a roupa mudou.

## Skills relacionadas

- `character-sheet-consistency` — produz a referência que entra no `@image1`
- `blender-previs-animatic` — define câmera/duração antes do prompt
- `minimax-h3-local-video` — workflow ComfyUI que consome este prompt
- `pipeline-video-agente` — pipeline completo (áudio-first)

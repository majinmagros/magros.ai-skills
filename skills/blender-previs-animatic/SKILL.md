---
name: blender-previs-animatic
description: "Use when planning a video shot in 3D before spending GPU — blockout with primitives in Blender, lock camera and timing, export a shot list that feeds the video prompt. Triggers on \"previs\", \"animatic\", \"blockout 3D\", \"rascunho de cena\", \"câmera do shot\", \"blender previs\"."
metadata:
  origin: ECC
---

# Blender Previs / Animatic

Rascunho 3D barato para decidir **câmera, escala e ritmo** antes de gastar GPU em vídeo. O previs não é arte final: é a planta do shot.

> Fonte: Willian IA `8DALo_Y2Z4I` (rascunho 3D antes de liberar o modelo) + `blender-mcp-ops` (operação via MCP).

## Quando usar

- Cena com mais de um personagem ou movimento de câmera complexo.
- Antes de gerar 8 s no H3/Seedance e descobrir que o enquadramento não funciona.
- Precisa alinhar com cliente/equipe sem render final.
- Quer definir duração de shot e número de segmentos.

## Quando NÃO usar

- Plano único, estático, sem movimento — prompt resolve.
- Estilo 2D/anime sem noção de volume.
- Você já tem o shot definido por referência de vídeo.

## Fluxo

```text
roteiro → shot list → blockout (primitivas) → câmera → timing → export → prompt
```

### 1. Shot list antes de abrir o Blender

| Campo | Exemplo |
|---|---|
| `shot` | 1 |
| `duration_s` | 3 |
| `lens_mm` | 35 |
| `height_m` | 1.6 |
| `move` | slow push-in |
| `action` | Ana gira a chave |
| `notes` | porta à direita, luz fria |

### 2. Blockout

- Só primitivas: cubo, cilindro, esfera, plano.
- **Escala real**: 1 unidade Blender = 1 metro. Porta 2,10 m; olho 1,60 m.
- Um material cinza para tudo; nada de textura.
- Silhueta primeiro: se não dá para entender a cena em preto, o enquadramento está errado.
- Personagem = cápsula + esfera na altura da cabeça; nada de rig.

### 3. Câmera

- Lente define sensação: 18–24 mm (ambiente, distorção), 35 mm (natural), 50 mm (retrato), 85 mm (compressão, close).
- Altura: 1,60 m (olho), 0,3 m (baixo), 2,5 m (alto).
- Movimento: `static`, `push-in`, `pull-out`, `track left/right`, `crane up/down`, `handheld`.
- Marque o **início e o fim** do movimento com keyframes; o meio é interpolação.

### 4. Timing

- Coloque a duração do shot na timeline e assista em tempo real.
- Se o movimento não termina dentro do shot, ou encurta a ação ou aumenta a duração.
- Regra prática: 8 s é o teto confortável do H3 local; 3–5 s para ação simples.

### 5. Export

Gere `shots.json` (o prompt consome este arquivo):

```json
{
  "project": "necrotério",
  "fps": 24,
  "shots": [
    { "shot": 1, "duration_s": 3, "lens_mm": 35, "height_m": 1.6, "move": "slow push-in", "action": "Ana gira a chave", "notes": "porta à direita, luz fria" },
    { "shot": 2, "duration_s": 3, "lens_mm": 85, "height_m": 1.4, "move": "static", "action": "close na mão", "notes": "profundidade rasa" }
  ]
}
```

### 6. Ponte para o prompt

Converta cada shot em `[Shot N] 00:00–00:0X` no `h3-structured-video-prompt`. A lente e a altura viram texto (`35 mm, eye level`); o movimento vira `slow push-in`.

## Loop conversacional (MCP)

Com `blender-mcp-ops`:

1. Peça o blockout com medidas explícitas.
2. Tire screenshot do viewport.
3. Ajuste em linguagem natural ("sobe a câmera 20 cm", "aproxima 1 m").
4. Repita até a silhueta ler.
5. Só então exporte `shots.json`.

Nunca peça "deixa bonito" — peça número (metros, graus, segundos).

## Checklist

- [ ] Escala real (1 unidade = 1 m)
- [ ] Silhueta legível sem material
- [ ] Cada shot tem lente, altura, movimento e duração
- [ ] Movimento começa e termina dentro do shot
- [ ] `shots.json` exportado e validado
- [ ] Nenhum detalhe de modelagem/textura antes do OK do enquadramento

## Anti-padrões

- Modelar detalhe antes de fechar a câmera (retrabalho garantido).
- Usar lente 18 mm em close de rosto (distorce).
- Shot de 8 s com ação de 2 s (o modelo inventa o resto).
- Previs com física/iluminação final — caro e irrelevante para decidir o shot.
- Exportar sem `fps` e `duration_s` (o prompt não fecha a conta).

## Skills relacionadas

- `blender-mcp-ops` — operação do Blender via MCP
- `h3-structured-video-prompt` — consome o `shots.json`
- `character-sheet-consistency` — referência de personagem para o shot
- `manim-video` — animação técnica/explicativa (outro caso)

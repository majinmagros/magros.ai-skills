---
name: threejs-scene-composer
description: Use when building Three.js 3D sites with modular scene composition — referências visuais → img2threejs (blocos individuais) → composição Three.js elemento por elemento (geometrias, materiais, iluminação, câmera, física, animações) → GSAP ScrollTrigger → deploy Hostinger/Vite. Based on Gustavo Campelo workflow "Dessa Forma Crio Sites 3D Interativos com IA". Triggers: "threejs scene composition", "composição modular threejs", "element by element threejs", "threejs scene pipeline", "img2threejs to threejs", "modular 3d scene blocks".
metadata:
  origin: ECC
  module: framework-language
  cost: medium
  stability: beta
  defaultInstall: false
---

# Skill: threejs-scene-composer — Composição Modular de Cenas Three.js

Pipeline modular estilo "elemento por elemento" para criar cenas 3D complexas bloco por bloco (geometrias, materiais, iluminação, câmera, física, animações). Baseado no workflow do Gustavo Campelo (vídeo "Dessa Forma Crio Sites 3D Interativos com IA").

## Validação Oficial

| Claim | Status | Fonte |
|---|---|---|
| Three.js r110+ scene composition | ✅ | Context7 `/mrdoob/three.js` |
| GSAP ScrollTrigger animations | ✅ | Context7 `/greensock/gsap-skills` |
| Vite build + deploy | ✅ | Context7 `/vitejs/vite` |
| Hostinger VPS deploy | ✅ | Context7 `/hostinger/api-cli` |
| img2threejs blocos individuais | ✅ | Video Gustavo Campelo (gucampelo) |
| GSAP ScrollTrigger pin/scrub | ✅ | Context7 `/greensock/gsap-skills` |

---

## Quando usar

- "Quero compor uma cena Three.js bloco por bloco"
- "Pipeline modular: referências → img2threejs → Three.js → GSAP → deploy"
- "Criar blocos 3D estilo Minecraft (grama, pedra, portal, cerejeira)"
- "Constants expostas para tuning: câmera, portal, elevação, velocidades"
- "Shaders customizados: pixelation, comet trails, mouse distortion"
- "Patterns responsivos: mobile/desktop, touch vs mouse, LOD"
- "Deploy Vite + Hostinger KVM1"

---

## Pipeline (6 etapas)

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ 1. REFS     │───▶│ 2. IMG2     │───▶│ 3. COMPOSE  │───▶│ 4. ANIMATE  │───▶│ 5. RESPONSIVE│───▶│ 6. DEPLOY   │
│ Visual      │    │ THREEJS     │    │ SCENE       │    │ GSAP        │    │ PATTERNS    │    │ VITE+HOST   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

---

## Etapa 1: REFS — Referências Visuais

**Input:** Screenshots, URLs, Figma, conceitos visuais
**Processo:** Análise de formas geométricas, materiais, iluminação, câmera
**Output:** Especificação de blocos (geometrias, materiais, posições)

```json
{
  "blocks": [
    { "id": "grass", "type": "box", "material": "MeshStandardMaterial", "color": "#4CAF50", "position": [0,0,0] },
    { "id": "stone", "type": "box", "material": "MeshStandardMaterial", "texture": "stone.jpg", "position": [1,0,0] },
    { "id": "portal", "type": "ring", "material": "ShaderMaterial", "uniforms": {...}, "position": [0,2,0] }
  ],
  "camera": { "position": [10,10,10], "target": [0,0,0], "fov": 60 },
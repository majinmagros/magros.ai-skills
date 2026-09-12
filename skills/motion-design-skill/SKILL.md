---
name: motion-design-skill
description: Use when implementing Lottie/SVG microinteractions and smooth transitions — fade-ins, button effects, playback control, performance optimization. Triggers on "lottie", "lottiefiles", "microinteractions", "fade in animation", "button hover effect", "card entrance animation", "svg animation", "lottie json", "bodymovin", "polish ui".
metadata:
  origin: ECC
  source_docs:
    - https://github.com/airbnb/lottie-web
    - https://context7.com/airbnb/lottie-web
    - https://lottiefiles.com/
    - https://github.com/gamote/lottie-react
---

# Motion Design Skill — Official LottieFiles AI Agent Skill

Microinterações e transições suaves com **lottie-web** (best practices LottieFiles): renderer SVG, cleanup, performance (quality/subframe), eventos, presets por componente. API completa em `references/lottie-web-cheatsheet.md`, componentes React em `references/lottie-react-patterns.tsx`.

## Quando usar (gatilhos concretos)

- Adicionar animações Lottie (JSON Bodymovin do After Effects) em React/Vue/vanilla
- Microinterações: fade-in de cards, hover/tap em botões, entrada de modais/toasts, loading, skeletons
- Animações SVG vetoriais leves (renderer SVG do lottie-web)
- Controlar playback (play, pause, seek, loop, speed, direction)
- Otimizar performance Lottie (quality, subframe, freeze/unfreeze, cleanup)
- Integrar Lottie em React com `lottie-react` (wrapper oficial)

## Quando NÃO usar

- Animações GSAP/ScrollTrigger (use `gsap-skills`)
- Animações Framer Motion (use `motion-foundations`/`motion-patterns`)
- Three.js/WebGL 3D (use `img2threejs` ou `motion-advanced`)
- Animações CSS puras (keyframes, transitions) — não precisa de skill
- Edição de vídeo / Remotion (use `remotion-video-creation`)

## Pipeline (resumo — código em `references/`)

```javascript
import lottie from 'lottie-web';   // npm i lottie-web (ou CDN 5.12.2)
const animation = lottie.loadAnimation({
  container, renderer: 'svg', loop: true, autoplay: true, path: 'animation.json'
});
animation.addEventListener('complete', handler);  // complete|loopComplete|enterFrame|data_ready|DOMLoaded|destroy
animation.destroy();                              // cleanup obrigatório no unmount
lottie.setQuality('low'); animation.setSubframe(false);
lottie.freeze(); lottie.unfreeze();               // tabs ocultas / modais fechados
```

```jsx
// React (lottie-react) — ver componentes prontos em references/lottie-react-patterns.tsx
import Lottie from 'lottie-react';
<Lottie animationData={data} loop={hover} autoplay={hover} renderer="svg" />
```

**Microinterações** (`references/microinteraction-patterns.json`): card fade+slide 200-300ms · button scale 0.95/1.02 · modal fade+spring · loading loop · icon morph 150-250ms · list stagger 50ms/item · page slide+fade 300ms.

**Performance** (`references/performance-checklist.md`): SVG default · destroy sempre · quality low/divisor · subframe off · freeze/unfreeze · JSON <500KB · loop false + complete em feedbacks.

**Export AE** (`references/aftereffects-bodymovin-tips.md`): limpar layers, vetorial > raster, efeitos suportados, JSON <500KB, versionar `.aep`.

## Regras de ouro (anti-patterns a evitar)

| ❌ Erro comum | ✅ Padrão correto |
|---|---|
| `renderer: 'canvas'` sem necessidade | `renderer: 'svg'` (vetorial, acessível, escalável) |
| Sem `animation.destroy()` no unmount | Cleanup obrigatório no `useEffect` return / `beforeunload` |
| `loop: true` em animação de feedback (success/error) | `loop: false` + `autoplay: true` + event `complete` |
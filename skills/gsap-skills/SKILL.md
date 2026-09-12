---
name: gsap-skills
description: Use when applying GSAP/ScrollTrigger best practices — scroll-linked animations, interactive effects, buggy GSAP logic fixes. Triggers on "gsap", "scrolltrigger", "scroll animation", "pinning", "scrub", "greensock", "animation performance", "timeline sequencing".
metadata:
  origin: ECC
  source_docs:
    - https://github.com/greensock/gsap-skills
    - https://context7.com/greensock/gsap-skills
    - https://greensock.com/docs/
---

# GSAP Skills — Official GreenSock AI Agent Skill

Ensina a IA a aplicar **best practices oficiais do GSAP** (GreenSock Animation Platform) para animações performáticas, ScrollTrigger, timelines e integração com React/Vue/Svelte.

## Quando usar (gatilhos concretos)

- Criar animações ligadas ao scroll (ScrollTrigger: pin, scrub, trigger, start/end)
- Otimizar animações GSAP existentes (transforms vs layout props, will-change, batching)
- Sequenciar animações complexas com timelines (evitar chained delays)
- Integrar GSAP em React com `useGSAP` / `gsap.context` + cleanup correto
- Corrigir código GSAP gerado por IA que usa padrões anti-patterns (seletores globais, sem cleanup, refresh excessivo)
- Registrar plugins corretamente (`gsap.registerPlugin(ScrollTrigger)`)

## Quando NÃO usar

- Animações CSS puras, Framer Motion, Lottie, Three.js, ou outras libs não-GSAP
- Animações simples de uma linha que não precisam de ScrollTrigger
- Projetos que não usam GSAP

## Pipeline oficial (fonte: GreenSock/gsap-skills)

### 1. Core Concepts & Patterns
- Importar e registrar plugins **uma vez** por app: `gsap.registerPlugin(ScrollTrigger)`
- **Single tween**: preferir transform aliases (`x`, `y`, `scale`) + `autoAlpha` ao invés de `opacity` + `visibility`
- **Timelines** para sequenciamento (preferir sobre `delay` encadeado)
- **ScrollTrigger**: anexar a timeline ou tween top-level; chamar `ScrollTrigger.refresh()` após mudanças de DOM/layout
- **React**: usar `useGSAP` + `scope` + cleanup (não usar seletores sem scope)

```javascript
// Padrão oficial
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

gsap.to(".box", { x: 100, autoAlpha: 1, duration: 0.6, ease: "power2.inOut" });

const tl = gsap.timeline({ defaults: { duration: 0.5, ease: "power2" } });
tl.to(".a", { x: 100 })
  .to(".b", { y: 50 }, "+=0.2")
  .to(".c", { opacity: 0 }, "-=0.1");

// ScrollTrigger com debounce no resize
window.addEventListener("resize", gsap.utils.debounce(() => ScrollTrigger.refresh(), 200));
```

### 2. ScrollTrigger Skill
- Animações ligadas ao scroll: pinning, scrub, triggers, refresh & cleanup
- `scrub: true` para sincronizar animação com posição do scroll
- `start` / `end` definem quando a animação inicia/termina
- Sempre chamar `ScrollTrigger.refresh()` após mudanças de layout (debounced 200ms no resize)

### 3. Performance Skill
- **Transforms over layout properties**: animar `x`, `y`, `scale`, `rotation` — **nunca** `width`, `height`, `top`, `left`, `margin`
- `will-change: transform` para elementos animados
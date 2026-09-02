---
name: gsap-skills
description: >-
  Official GreenSock GSAP AI Skills — teaches AI to apply GSAP/ScrollTrigger best practices, performance optimizations, and official patterns from the GSAP documentation. Use when creating scroll-linked animations, interactive effects, or when AI generates buggy/complex GSAP logic. Triggers: "gsap", "scrolltrigger", "scroll animation", "pinning", "scrub", "greensock", "animation performance", "timeline sequencing". Non-triggers: generic CSS animations, Framer Motion, Lottie, non-GSAP animation libraries. Outcome: AI produces optimized, bug-free GSAP code following official patterns (transforms over layout props, proper plugin registration, debounced ScrollTrigger.refresh, scoped React cleanup).
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
- **Batching**: agrupar animações similares
- ScrollTrigger: evitar triggers desnecessários, usar `fastScrollEnd` quando aplicável
- `gsap.utils.debounce` para `ScrollTrigger.refresh()` no resize (200ms)

## Regras de ouro (anti-patterns a evitar)

| ❌ Erro comum | ✅ Padrão correto |
|---|---|
| `gsap.to(".box", { left: 100 })` | `gsap.to(".box", { x: 100 })` |
| `opacity: 0` + `visibility: hidden` | `autoAlpha: 0` |
| Seletores globais no React | `gsap.context(() => {...}, containerRef)` + cleanup |
| `ScrollTrigger.refresh()` a cada resize | `gsap.utils.debounce(() => ScrollTrigger.refresh(), 200)` |
| Múltiplos `gsap.registerPlugin` | Registrar **uma vez** no bootstrap da app |
| Chained `.to().delay()` | `gsap.timeline()` com position parameter |

## Validação contra docs oficiais (conferido 2026-08-29)

- [GSAP ScrollTrigger Skill](https://github.com/greensock/gsap-skills/blob/main/skills/gsap-scrolltrigger/SKILL.md)
- [GSAP Core Concepts](https://context7.com/greensock/gsap-skills/llms.txt)
- [Performance Best Practices](https://greensock.com/docs/v3/GSAP/Performance)

## Referências

- `references/gsap-official-patterns.md` — patterns completos extraídos da documentação
- `references/gsap-react-integration.md` — integração React oficial (`@gsap/react`)
- `references/scrolltrigger-cheatsheet.md` — configurações comuns de ScrollTrigger

## Outcome esperado

Ao ativar esta skill, a IA deve:
1. Registrar plugins GSAP uma única vez
2. Usar transforms (`x`, `y`, `scale`, `rotation`) + `autoAlpha`
3. Sequenciar com `gsap.timeline()` + position parameters
4. Configurar ScrollTrigger com `scrub`, `pin`, `start`/`end` apropriados
5. Chamar `ScrollTrigger.refresh()` debounced após layout changes
6. No React: usar `useGSAP` ou `gsap.context` com scope e cleanup automático
7. Evitar propriedades de layout (`width`, `height`, `top`, `left`, `margin`) em animações
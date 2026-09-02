---
name: motion-design-skill
description: >-
  Official LottieFiles Motion Design Skill — teaches AI to implement microinteractions and smooth transitions (fade-ins, button effects, SVG/Lottie animations) automatically using Lottie-web best practices. Use when: "lottie", "lottiefiles", "microinteractions", "fade in animation", "button hover effect", "card entrance animation", "svg animation", "lottie json", "bodymovin", "ux motion", "polish ui". Non-triggers: GSAP/ScrollTrigger, Framer Motion, Three.js, CSS animations only, video editing. Outcome: AI produces Lottie-web code with SVG renderer, proper cleanup, performance optimization (quality/subframe), event handling, and automatic microinteraction patterns for cards, buttons, modals, loading states.
metadata:
  origin: ECC
  source_docs:
    - https://github.com/airbnb/lottie-web
    - https://context7.com/airbnb/lottie-web
    - https://lottiefiles.com/
    - https://github.com/gamote/lottie-react
---

# Motion Design Skill — Official LottieFiles AI Agent Skill

Orienta a IA a implementar **microinterações e transições suaves** (fade-ins em cards, efeitos em botões, animações em vetores SVG/Lottie) automaticamente usando **Lottie-web** com best practices oficiais da LottieFiles.

## Quando usar (gatilhos concretos)

- Adicionar animações Lottie (JSON exportado do After Effects via Bodymovin) em React/Vue/vanilla
- Microinterações: fade-in de cards, hover/tap em botões, entrada de modais/toasts, loading states, skeleton screens
- Animações SVG vetoriais leves (renderer SVG do lottie-web)
- Controlar playback Lottie programaticamente (play, pause, seek, loop, speed, direction)
- Otimizar performance Lottie (quality, subframe, freeze/unfreeze, cleanup)
- Integrar Lottie em React com `lottie-react` (wrapper oficial)

## Quando NÃO usar

- Animações GSAP/ScrollTrigger (use `gsap-skills`)
- Animações Framer Motion (use `motion-foundations`/`motion-patterns`)
- Three.js/WebGL 3D (use `img2threejs` ou `motion-advanced`)
- Animações CSS puras (keyframes, transitions) — não precisa de skill
- Edição de vídeo / Remotion (use `remotion-video-creation`)

## Pipeline oficial (fonte: airbnb/lottie-web + LottieFiles)

### 1. Setup básico (vanilla JS)

```javascript
// Incluir library
// <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>
// ou: npm i lottie-web

import lottie from 'lottie-web';

const container = document.getElementById('animation-container');

const animation = lottie.loadAnimation({
  container: container,           // DOM element
  renderer: 'svg',                // 'svg' | 'canvas' | 'html' — SVG = vetorial, escalável, acessível
  loop: true,                     // true | false | number
  autoplay: true,                 // iniciar automaticamente
  path: 'animation.json'          // caminho do JSON (Bodymovin export)
});

// Retorna AnimationItem para controle
```

### 2. Event listeners (feedback de estado)

```javascript
animation.addEventListener('complete', (e) => {
  console.log('Animação completou', e.direction);
});

animation.addEventListener('loopComplete', (e) => {
  console.log('Loop', e.currentLoop, 'de', e.totalLoops);
});

animation.addEventListener('enterFrame', (e) => {
  // frame atual — útil para sincronizar com outra lógica
});

animation.addEventListener('data_ready', () => {
  // JSON carregado, safe to call methods
});

animation.addEventListener('DOMLoaded', () => {
  // SVG injetado no DOM (renderer SVG)
});

animation.addEventListener('destroy', () => {
  // Cleanup completo
});
```

### 3. Cleanup & Memory Management (obrigatório)

```javascript
// Destruir animação específica
animation.destroy();

// Ou por nome
lottie.destroy('my-animation-name');

// Ou todas
lottie.destroy();

// Listener de destroy para cleanup extra
animation.addEventListener('destroy', () => {
  // Limpar referências, timers, etc.
});
```

### 4. Performance Optimization

```javascript
// Qualidade de render (afeta performance)
lottie.setQuality('low');      // 'high' | 'medium' | 'low' | number (>1 = divisor)
lottie.setQuality(2);          // number = quality divider

// Subframe rendering
animation.setSubframe(false);  // respeita FPS do After Effects
animation.setSubframe(true);   // interpolação suave (default)

// Freeze/unfreeze todas animações (útil para tabs ocultas, modais fechados)
lottie.freeze();               // para todo rendering
lottie.unfreeze();             // retoma

// Resize manual (se container mudar de tamanho)
window.addEventListener('resize', () => lottie.resize());

// Verificar ambiente
if (lottie.inBrowser()) { /* browser-only code */ }
```

### 5. React Integration (lottie-react — wrapper oficial)

```bash
npm i lottie-react lottie-web
```

```jsx
import Lottie from 'lottie-react';
import animationData from './animation.json';

function Button() {
  const [hover, setHover] = useState(false);
  
  return (
    <Lottie
      animationData={animationData}
      loop={hover}
      autoplay={hover}
      style={{ width: 48, height: 48 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      renderer="svg"
    />
  );
}
```

### 6. Padrões de Microinteração (auto-aplicados pela skill)

| Componente | Animação sugerida | Trigger |
|---|---|---|
| **Card** | Fade-in + slide-up (200-300ms, ease-out) | Mount / IntersectionObserver |
| **Button** | Scale 0.95 (tap) / 1.02 (hover) + ripple | Hover / Active / Focus |
| **Modal/Toast** | Fade-in + scale 0.95→1 (spring) | Open |
| **Loading** | Loop infinito (spinner, pulse, skeleton) | Mount |
| **Icon** | Morph / bounce / rotate (150-250ms) | Hover / Click / State change |
| **List item** | Stagger fade-in (50ms delay/item) | Mount / Filter |
| **Page transition** | Slide + fade (300ms) | Route change |

## Regras de ouro (anti-patterns a evitar)

| ❌ Erro comum | ✅ Padrão correto |
|---|---|
| `renderer: 'canvas'` sem necessidade | `renderer: 'svg'` (vetorial, acessível, escalável) |
| Sem `animation.destroy()` no unmount | Cleanup obrigatório no `useEffect` return / `beforeunload` |
| `loop: true` em animação de feedback (success/error) | `loop: false` + `autoplay: true` + event `complete` |
| JSON Lottie > 500KB sem otimizar | `lottie.setQuality('low')` + remover layers desnecessárias no AE |
| Múltiplas instâncias sem `lottie.freeze()` em tabs ocultas | `lottie.freeze()` ao esconder, `unfreeze()` ao mostrar |
| Seletor direto no container sem cleanup | `lottie-web` limpa o container no `destroy()` |

## Validação contra docs oficiais (conferido 2026-08-29)

- [Lottie-web Load Animation](https://context7.com/airbnb/lottie-web/llms.txt)
- [Lottie-web Events](https://context7.com/airbnb/lottie-web/llms.txt)
- [Lottie-web Cleanup](https://context7.com/airbnb/lottie-web/llms.txt)
- [Lottie-web Performance](https://context7.com/airbnb/lottie-web/llms.txt)
- [Lottie React](https://github.com/gamote/lottie-react)

## Referências

- `references/lottie-web-cheatsheet.md` — API completa resumida
- `references/microinteraction-patterns.json` — presets JSON para cards, buttons, modals, loading, icons
- `references/lottie-react-patterns.tsx` — componentes React prontos (Button, Card, Modal, Loading, Icon)
- `references/performance-checklist.md` — checklist de otimização (quality, subframe, freeze, cleanup, bundle size)
- `references/aftereffects-bodymovin-tips.md` — como exportar JSON otimizado do AE (Bodymovin settings)

## Outcome esperado

Ao ativar esta skill, a IA deve:
1. Usar `renderer: 'svg'` por padrão (vetorial, acessível)
2. Incluir `destroy()` cleanup em todo componente/hook
3. Aplicar `setQuality('low')` ou `2` para animações complexas
4. Usar `setSubframe(false)` para respeitar FPS original do AE
5. Implementar `lottie.freeze()/unfreeze()` em tabs/modais condicionais
6. Mapear microinterações padrão (card, button, modal, loading, icon) automaticamente
7. No React: usar `lottie-react` com props tipadas (`animationData`, `loop`, `autoplay`, `renderer`)
8. Registrar event listeners (`complete`, `loopComplete`, `data_ready`, `DOMLoaded`, `destroy`) para feedback de estado
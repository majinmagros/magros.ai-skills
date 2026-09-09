# Lottie-web Cheatsheet — API resumida (load, events, cleanup, performance)

## Setup básico (vanilla JS)

```javascript
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

## Event listeners (feedback de estado)

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

## Cleanup & Memory Management (obrigatório)

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

## Performance Optimization

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

# Performance Checklist — Lottie-web

- [ ] `renderer: 'svg'` por padrão (vetorial, acessível, escalável)
- [ ] `destroy()` cleanup em todo unmount (`useEffect` return / `beforeunload`)
- [ ] `setQuality('low')` ou divisor `2` para animações complexas
- [ ] `setSubframe(false)` para respeitar FPS original do AE
- [ ] `lottie.freeze()` em tabs ocultas / modais fechados; `unfreeze()` ao mostrar
- [ ] JSON Lottie > 500KB → otimizar (remover layers no AE, ver `aftereffects-bodymovin-tips.md`)
- [ ] Feedback animations (success/error): `loop: false` + `autoplay: true` + evento `complete`
- [ ] `lottie.resize()` se o container muda de tamanho
- [ ] Event listeners (`complete`, `loopComplete`, `data_ready`, `DOMLoaded`, `destroy`) para feedback de estado
- [ ] No React: `lottie-react` com props tipadas (`animationData`, `loop`, `autoplay`, `renderer`)

# After Effects Bodymovin Tips — Exportar JSON otimizado

- Exporte via plugin Bodymovin (After Effects → Window → Extensions → Bodymovin)
- Remova layers desnecessárias antes de exportar (guias, solids ocultos, mattes não usados)
- Prefira formas vetoriais a imagens rasterizadas dentro da composição
- Evite efeitos não suportados pelo lottie-web (ver matriz de suporte da LottieFiles) — substitua por equivalentes
- Reduza keyframes: simplifique curvas, remova holds redundantes
- Meta: JSON final < 500KB; acima disso, volte e simplifique a composição
- Teste o JSON no preview da LottieFiles antes de integrar
- Versione o `.aep` junto do JSON exportado para re-exportes futuros

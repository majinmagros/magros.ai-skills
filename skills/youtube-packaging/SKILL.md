---
name: youtube-packaging
description: Package a finished video for YouTube with 3 thumbs and 3 titles for A/B testing. Use when the edit is locked and you need description, timestamps and link page. Use quando embalar vídeo: 3 thumbs + 3 títulos para teste A/B, descrição com timestamps/links, página de links.
---

# YouTube Packaging

Da transcrição final travada à embalagem testável: 3 thumbs + 3 títulos + descrição + página de links.

## Quando usar

Após o corte final, antes de publicar. Entrada obrigatória: transcrição do vídeo final com timestamps. Sem transcrição, volte uma etapa — nunca invente timestamps ou links.

## Passos

1. **Parta da transcrição final** — use o texto pós-corte como única fonte de verdade para títulos, capítulos e links. Tudo que não está na transcrição não entra na embalagem.
2. **Gere 3 títulos para teste A/B** — 3 ângulos distintos (impacto, curiosidade, utilidade/SEO), curtos, sem clickbait que o vídeo não paga. Alinhe ao tom de voz do canal e a títulos que já performaram.
3. **Gere 3 thumbs** — 1 conceito por título quando possível; texto mínimo e legível em mobile, alto contraste, rosto/expressão só se for padrão do canal. Exporte nos tamanhos do teste A/B do YouTube.
4. **Escreva a descrição padrão** — hook de 2 linhas + capítulos com timestamps + todos os links mencionados + CTA (inscrever, newsletter, comunidade). Links quebrados ou genéricos bloqueiam a etapa.
5. **Crie a página de links do episódio** — agregue todos os links do roteiro/pesquisa em página no seu domínio, com promo do curso/comunidade e pixels (Meta, Google Ads). Cada episódio tem sua URL própria.
6. **Publique com gate manual** — revise embalagem 1x na mão e publique você. Só conecte upload automático via API do YouTube quando zerarem as correções por N episódios seguidos.

## Regras

- NEVER publicar sem o pacote 3×3 (3 títulos + 3 thumbs): sem variante não há teste.
- NEVER inventar timestamp, citação ou link fora da transcrição.
- Descrição segue o padrão do canal; não improvise estrutura por episódio.
- Página de links sempre no domínio próprio com pixels; link solto em comentário não conta.
- Newsletter/shorts a partir da mesma transcrição preservam tom de voz; texto "com cara de GPT" volta para revisão.

## Related skills

- `video-cut-pipeline` — corte e edição antes da embalagem.
- `ads-creative-factory` — variantes criativas em escala.
- `content-engine` — desdobramento em posts, carrosséis e shorts.

---
name: pesquisa-social
description: Use when the user wants to research what real users are saying about a topic/product/model across social platforms — sentiment, complaints, experiences. Triggers on "pesquisa social", "o que estão falando", "sentimento dos usuários", "last 30 days", "opinião de quem usou", "reclamações sobre". Sits between shallow web search and expensive deep research.
---

# Skill: Pesquisa-social — sentimento real de usuários (estilo Last 30 Days)

Busca a experiência REAL de quem usa, em vez de manchetes/artigos rankeados.
Preenche o meio-termo entre busca web (rápida/rasa) e deep research
(completa/cara/lenta).

## 1. Decida o nível (três degraus)

| Degrau | Quando usar | Custo |
|---|---|---|
| **Busca web** | Pergunta de dia a dia, sem profundidade | Instantânea |
| **Pesquisa social** (esta skill) | Quer sentimento/experiência de usuários | Médio |
| **Deep research** | Relatório exaustivo com fontes formais | Milhões de tokens, 15–30 min |

Se a pergunta é sobre reação popular a lançamento/modelo/ferramenta, a
pesquisa social SUPERSA o deep research (que é enviesado por jornalistas).

## 2. Fontes e acesso (por custo)

- **Grátis, sem chave**: Reddit, Hacker News, Polymarket, GitHub.
- **Grátis, com ferramenta**: YouTube via `yt-dlp` (transcrições/legendas).
- **Com API/chave**: TikTok, Instagram, LinkedIn (agregadores tipo
  Scraper Creators); X via cookies do browser logado ou chave paga (~centavos).
- Restrinja por fonte quando preciso: "busque só no YouTube" / "só no TikTok".

## 3. Processo (4 etapas)

1. **Melhorar o prompt** do tema, mesmo que o usuário tenha sido vago.
2. **Decidir onde procurar**: por tema (ex.: celebridade → subreddit + X);
   dispare buscas em paralelo.
3. **Ler fundo**: comentários, posts, threads e transcrições de vídeo — não só títulos.
4. **Ranquear por convergência**: mesma queixa/opinião repetida em várias
   plataformas vira destaque; comentário solto não contamina o relatório.

## 4. Entrega

- Relatório em **Markdown** com: sentimento geral, pontos positivos/negativos,
  padrões-chave, plataformas acessadas e fontes linkadas (autor/vídeo/post).
- Separe "fato reportado" de "opinião"; cite quem falou.
- Se uma fonte exigir chave que não existe, diga e continue com as que tem acesso.

## 5. Regras

- Não invente fonte: só cite o que foi realmente acessado/lido.
- Convergência > volume bruto: 3 queixas idênticas valem mais que 50 soltas.

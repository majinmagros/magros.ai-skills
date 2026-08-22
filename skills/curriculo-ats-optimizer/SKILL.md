---
name: curriculo-ats-optimizer
description: Use quando precisar criar ou otimizar currículo para passar no filtro ATS brasileiro — formatação parser-safe, extração de 70–80% keywords da vaga, Verbo+Ação+Resultado com métricas, Gupy/Kenoby/Lever/Greenhouse/LinkedIn. Triggers em "currículo ats", "currículo gupy", "currículo sem experiência", "otimizar currículo", "palavras-chave vaga", "stack vagas", "scanner ats", "currículo júnior".
metadata:
  origin: ECC
---

# Skill: Currículo ATS Optimizer — Parser-Safe + Keyword Match (Brasil)

Currículo que passa no robô **e** convence o humano em 6–7s. Foco: estrutura que o parser extrai + 70–80% das keywords da vaga distribuídas naturalmente.

## 1. Como o ATS filtra (entenda antes de escrever)

1. **Parsing** — extrai nome, contato, experiência, formação, habilidades. Se falhar, vira lixo digital.
2. **Keyword Match** — compara seu texto com a descrição da vaga. Conta correspondências **literais** ("gestão de projetos" ≠ "gerenciei projetos" para alguns ATS).
3. **Ranqueamento** — ordena por nota. Recrutador só olha top 20–30%. Nota baixa = você não existe.

> Brasil: **Gupy**, **Kenoby**, **Vagas.com**, **Lever**, **Greenhouse**, **Recrut.AI** e LinkedIn. 75% dos currículos são eliminados antes do humano (Jobscan 2023). Vaga média recebe **250 candidaturas** (Catho). Scan humano = **6–7s** (eye-tracking).

## 2. Formatação parser-safe (obrigatório)

| Faça | Não faça |
|---|---|
| Coluna única | Múltiplas colunas |
| Fontes padrão: Helvetica, Arial, Calibri 10–12pt | Fontes decorativas |
| Margens 2,54 cm | Caixas de texto, tabelas, ícones, gráficos |
| Seções com títulos padrão: Resumo, Experiência, Formação, Habilidades | Títulos criativos ("Minha jornada") |
| PDF texto-selecionável (não imagem) | PDF escaneado / imagem |

**Seções na ordem:** Cabeçalho (nome, telefone, e-mail, cidade, LinkedIn/portfólio) → Resumo Profissional (3–4 linhas) → Experiência → Formação → Habilidades → Idiomas/Certificações.

## 3. Extração de keywords (70–80% da vaga)

### Passo 1 — Liste
Copie a descrição da vaga e extraia: cargo exato, hard skills (React, Node.js, PostgreSQL, REST API, Docker, AWS), certificações, soft skills citadas, termos da indústria.

### Passo 2 — Distribua
| Seção | O que incluir |
|---|---|
| **Resumo** | 5–8 keywords principais + cargo alvo literal ("Desenvolvedor Full Stack") |
| **Experiência (bullets)** | Keywords em contexto: "Desenvolvi API REST em Node.js com PostgreSQL, deploy em AWS EC2 com CI/CD GitHub Actions" |
| **Habilidades** | Subseções: Frontend (React, TypeScript, Tailwind), Backend (Node.js, Python, PostgreSQL, Redis), DevOps (Docker, AWS, Git) — liste sigla + extenso quando houver: "Otimização para Mecanismos de Busca (SEO)" |

> Meta: **70–80%** das keywords obrigatórias. Use **correspondência exata** da vaga + inclua variações naturais. Não concentre tudo num bloco — distribua.

### Passo 3 — Verifique
- [ ] Cargo da vaga aparece literal no resumo/título?
- [ ] ORM nomeado ("Prisma", "TypeORM") se a vaga cita?
- [ ] "full stack" escrito por extenso se a vaga é full stack?
- [ ] Densidade natural? Leia em voz alta — se soar robótico, reescreva.

## 4. Bullets que o humano escaneia (Verbo + Ação + Resultado)

**Fórmula:** Verbo de ação + o que fez + resultado com métrica.

**Verbos PT-BR:**
- Liderança: Liderei, Coordenei, Gerenciei, Supervisionei
- Resultado: Aumentei, Reduzi, Otimizei, Melhorei, Superei
- Criação: Desenvolvi, Criei, Implementei, Lancei, Estruturei
- Análise: Analisei, Identifiquei, Mapeei, Diagnostiquei

**Antes → Depois:**
- ❌ "Responsável pelo desenvolvimento de aplicações web"
- ✅ "Desenvolvi aplicação web em React/Next.js com API REST Node.js + PostgreSQL; deploy em AWS com CI/CD, reduzindo tempo de entrega em 30%"

**Sem experiência?** Use projetos, freelas, voluntariado, iniciação científica. Mesma fórmula:
- "Criei MVP de e-commerce (React, Node.js, PostgreSQL, Stripe) | github.com/seuuser/projeto — 2,3k acessos no primeiro mês"

## 5. Personalização por vaga (obrigatória para vagas competitivas)

Para **cada** candidatura, gere uma variação:
1. Resumo reescrito com top 5 keywords daquela vaga
2. Habilidades reordenadas (o que a vaga pede primeiro, vai pro topo)
3. Top 3–5 bullets realinhados ao cargo
4. Carta curta mencionando a empresa (se solicitado)

> Currículo genérico = resultado genérico. Mesmo base, 2–3 versões por tipo de vaga (ex.: Frontend vs Full Stack).

## 6. Sem experiência — o que colocar

| Seção | Estratégia |
|---|---|
| **Resumo** | Cargo alvo + stack + diferencial ("Desenvolvedor Júnior focado em React/Node.js, 3 projetos em produção, busco primeira oportunidade") |
| **Projetos** | Cada projeto: `[Nome] | React, Node.js, PostgreSQL, AWS | github.com/...` + 2–3 bullets com métrica |
| **Experiência** | Se vazia, renomeie para "Experiência e Projetos" e liste projetos/freelas/voluntariado |
| **Formação** | Curso + instituição + ano; adicione cursos relevantes (Alura, Rocketseat, DIO) com carga horária |

## 7. Scanner e iteração

1. Passe o PDF em um scanner ATS (ex.: ATS CV Checker, CVScore, VantageCV) — veja parsing e % de keywords.
2. Corrija falhas de formatação primeiro, depois keywords faltantes.
3. Teste humano 6s: alguém externo escaneia e diz cargo + 3 skills em 6s? Se não, simplifique.

## 8. Checklist final (antes de enviar)

- [ ] Coluna única, Helvetica/Arial, 2,54 cm, sem tabelas/ícones?
- [ ] Cabeçalho com nome, telefone, e-mail, LinkedIn?
- [ ] Resumo com cargo literal + 5–8 keywords da vaga?
- [ ] 70–80% keywords distribuídas (resumo + bullets + habilidades)?
- [ ] Bullets com Verbo+Ação+Resultado + números (%, R$, pessoas, tempo)?
- [ ] Habilidades em subseções claras (Frontend/Backend/DevOps)?
- [ ] PDF texto-selecionável, nome arquivo `Nome_Sobrenome_Cargo.pdf`?
- [ ] Versão personalizada para esta vaga específica?

## 9. Integração com skills ECC

| Skill | Relação |
|---|---|
| `humanizar-texto` | Evita currículo robótico após injeção de keywords |
| `article-writing` | Resumo profissional enxuto e impactante |
| `seo` | Lógica de keyword match é a mesma de SEO on-page |
| `plain-language-response` | Clareza para scan humano de 6s |

## 10. Validação oficial (2026-08-22)

| Claim | Fonte oficial |
|---|---|
| 75% eliminados antes do humano; parsing → keyword match → ranking | https://airesume.guru/pt/blog/como-otimizar-seu-curriculo-para-ats-e-conseguir-mais-entrevistas-em-2026 (Jobscan 2023) |
| 250 candidaturas/vaga (Catho), Gupy/Kenoby/Lever/Greenhouse/Recrut.AI, coluna única Helvetica 2,54cm | https://vantage-cv.com/pt/blog/guia-completo-para-otimizar-seu-curriculo-para-ats-em-2026 + https://stylingcv.com/blog/curriculo-ats-2026-como-passar-filtro/ |
| 6–7s scan humano, princípio Gestalt, 70–80% keywords, Verbo+Ação+Resultado | https://airesume.guru/pt/blog/como-otimizar-seu-curriculo-para-ats-e-conseguir-mais-entrevistas-em-2026 |
| ATS literal ("gestão de projetos" ≠ "gerenciei projetos"), sigla+extenso | https://cvscore.net/br/blog/palavras-chave-curriculo-ats |
| Stack Vagas 2 agentes (ATS + qualificador) + gerador, 5k currículos treinados | Vídeo `Y4aD-yaDKb4` @Sujeitoprogramador (2026-05-21) — validar em stackvagas (app local) |

## Referências

- VantageCV: https://vantage-cv.com/pt/blog/guia-completo-para-otimizar-seu-curriculo-para-ats-em-2026
- AI Resume Guru: https://airesume.guru/pt/blog/como-otimizar-seu-curriculo-para-ats-e-conseguir-mais-entrevistas-em-2026
- CVScore: https://cvscore.net/br/blog/palavras-chave-curriculo-ats
- StylingCV (Gupy/Catho/LinkedIn BR): https://stylingcv.com/blog/curriculo-ats-2026-como-passar-filtro/
- Vídeo origem: `Y4aD-yaDKb4` — @Sujeitoprogramador; `nxvWxQ9Q-6E` contexto Stack Vagas


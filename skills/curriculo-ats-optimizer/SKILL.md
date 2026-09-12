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

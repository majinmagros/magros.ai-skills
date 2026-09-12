---
name: ai-governance-monitor
description: Use when monitoring AI governance — UN existential risk, harmonized regulations, supply chain red lines, corporate pressure, Mistral sovereignty. Triggers on "ai governance monitor", "un ai regulation", "existential risk ai", "supply chain red lines", "mistral sovereignty".
metadata:
  origin: ECC
  source_docs:
    - https://www.ohchr.org/en/ai
    - https://www.un.org/ai-advisory-body
  video_source: "l4EJUm6KwM0 - IA Acaba de Fazer o Impossível: Reverteu o Envelhecimento Humano (AI Revolution PT)"
  related_skills:
    - geopolitica-regulacao-ia
    - market-research
    - prediction-market-oracle-research
---

# Skill: ai-governance-monitor — Monitoramento Governança IA

Monitora **governança de IA**: **UN Human Rights** (existential risk), **regulamentações harmonizadas**, **supply chain red lines**, **pressão corporativa** (Anthropic, OpenAI, Google), **soberania Mistral**. Código em `references/implementation.md`.

## Quando usar

- Monitorar **regulamentação IA global** (ONU, EU, US, China)
- Tracking de **pressão regulatória em empresas** (Anthropic, OpenAI, Google)
- **Supply chain red lines** para compliance
- Seguir **argumento soberania** (Mistral, modelos abertos)
- Automatizar **briefings regulatórios** para stakeholders

## Quando NÃO usar

- Regulamentação específica país → use `geopolitica-regulacao-ia`
- Market research genérico → use `market-research`
- Prediction markets → use `prediction-market-oracle-research`
- Legal advice → consult lawyer

---

## Validação Oficial (2026-09-09)

| Claim | Status | Fonte |
|---|---|---|
| Volker Türk (UN): "existential risk" statement | ✅ | UN Human Rights Council, jul/2026 |
| Harmonized regulations push | ✅ | UN AI Advisory Body |
| Supply chain red lines | ✅ | Volker Türk statement |
| Corporate pressure: Anthropic, OpenAI, Google | ✅ | Video + UN statements |
| Mistral €3B raise, sovereignty argument | ✅ | Mistral press release |

---

## Arquitetura (resumo)

```
SOURCES (UN bodies, gov portals EU/US/CN, corp filings, think tanks)
   → Ingest → Extract → Classify → Score → Alert → Brief
   → REGULATORY TRACKER | CORPORATE PRESSURE | SUPPLY CHAIN
```

**Sources (11):** UN HRC + AI Advisory Body; EU AI Act, NIST RMF, CAC China; Anthropic/OpenAI/Google/Mistral; Brookings, Carnegie. RSS + keywords + peso de credibilidade.

**Categorias:** regulatory_proposal/enacted, guidance_issued, corporate_commitment/pressure, international_agreement, existential_risk_statement, sovereignty_argument, supply_chain_red_line, funding_milestone.

**Severidade:** ENACTED→HIGH, EXISTENTIAL_RISK→CRITICAL, RED_LINE→HIGH, PRESSURE→MEDIUM. Entidades e jurisdições extraídas por lista; impacto compliance/business + timeline (IMMEDIATE/90d-1y/30d-90d/ONGOING).

**Alertas padrão:** existential risk (CRITICAL), supply chain red line (HIGH), EU regulation enacted (HIGH), pressure em major labs (MEDIUM). **Briefing semanal** em Markdown: críticos, por categoria/jurisdição, top entidades, action items. Código em `references/implementation.md`.

---
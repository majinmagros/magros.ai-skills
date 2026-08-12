---
name: financiamento-imobiliario
description: Use when analyzing, reviewing, or assisting with real estate financing (financiamento imobiliário) in Brazil — especially CAIXA, FGTS, ITBI, contracts, SIOPI, DAMP, SCR, and buyer rights. Triggers on "financiamento", "imobiliário", "CAIXA", "FGTS", "ITBI", "SIOPI", "DAMP", "comprar apartamento", "escritura", "habite-se", "garantir financiamento", "analisar contrato imobiliário", "checklist imobiliário". Provides comprehensive analysis of financing costs, document verification, legal rights, and step-by-step guidance for homebuyers.
---

# Skill: Financiamento Imobiliário

## Context
You are helping someone who is buying or has bought a property in Brazil with financing (usually CAIXA). The user may be a layperson who needs clear, jargon-free explanations.

## Workflow

### Step 1: Understand the Situation
1. Ask the user:
   - Which bank/lender? (CAIXA, Itaú, Bradesco, Santander, etc.)
   - What documents do they have? (contract, SIOPI, DAMP, SCR, extrato)
   - What is the specific question or problem?

2. Read the available documents in the project directory (usually `C:\Projetos\apto-XXXX\`)

### Step 2: Extract Key Information
From the documents, identify:

| Document | What to Extract |
|----------|-----------------|
| **SIOPI** | Proposta number, financing amount, interest rates, monthly payment, insurance costs |
| **DAMP/FGTS** | FGTS amount used, declared property value |
| **Contract (Cury/incorporadora)** | Property price, delivery date, penalties, escrow rules |
| **SCR** | Current debt, pending releases, payment status |
| **Memorial Descritivo** | Vagas de garagem, area total, classificação (HIS/HMP/R2V/NR) |

### Step 3: Identify Issues
Check for:
- [ ] **Value discrepancies** across documents (SIOPI vs contract vs DAMP)
- [ ] **Classification issues** (R2V vs NR vs HIS — especially with Decreto 63.122/2024)
- [ ] **FGTS amount** — is the declared value consistent with the contract price?
- [ ] **Interest rates** — compare nominal, effective, CET, CESH
- [ ] **Hidden fees** — insurance, admin fees, ITBI, escritura
- [ ] **Delivery deadlines** — tolerância (usually 180 days), penalties
- [ ] **Garage rules** — indeterminada, manobrista, area comum vs vinculada à matrícula

### Step 4: Calculate
Use the financing parameters to project:

1. **Construction phase:** Monthly encargo = juros sobre saldo liberado + seguros + taxa admin
2. **Amortization phase:** Use PRICE or SAC system to project monthly payments
3. **Total cost:** Sum all payments over the financing term

### Step 5: Deliver
Create or update:
- Financial analysis document
- Cash flow projection
- Notification/email templates (if needed)
- Checklist for next steps

## Legal Framework

| Law | Subject | Relevance |
|-----|---------|-----------|
| **CDC 8.078/90** | Consumer protection | Right to clear information, prior notice |
| **Lei 4.591/64** | Condominium/property | Escritura, registro, incorporação |
| **Lei 9.514/97** | Alienação fiduciária | CAIXA guarantee mechanism |
| **Lei 10.931/04** | ITBI and property taxes | Tax rules for property transfer |
| **Lei 13.786/18** | Patrimônio de afetação | Construction guarantee, delivery deadline |
| **Decreto 63.122/2024** | São Paulo housing program | HIS/HMP/R2V/NR classifications |
| **Decreto 63.130/2024** | Termo de responsabilidade | Buyer obligations, 10-year rules |

## Key Formulas

### Encargo de Obra (fase construção)
```
Encargo = (Saldo Devedor × Taxa Mensal) + Seguros + Taxa Admin
```
Onde Taxa Mensal ≈ Taxa Nominal Anual / 12

### Prestação PRICE
```
Prestação = Principal × [i × (1+i)^n] / [(1+i)^n - 1]
```
Onde:
- i = taxa mensal (nominal / 12)
- n = número de parcelas

### ITBI (São Paulo)
```
ITBI = 3% × maior(valor venal, valor contratual, valor avaliação)
```

## Templates

### Template: E-mail à CAIXA
```markdown
Assunto: Solicitação de Esclarecimento — Valores Divergentes (Contrato X / Proposta Y)

1. Apresentação (nome, CPF, contrato, proposta)
2. Valores divergentes identificados (SIOPI, DAMP, contrato)
3. Perguntas específicas sobre origem dos valores
4. Requerimento de resposta formal em 15 dias
5. Fundamentação legal (CDC, Lei 9.785/99)
```

### Template: Notificação à Incorporadora
```markdown
1. Identificação das partes
2. Objeto da notificação (inconsistência identificada)
3. Fatos + análise
4. Requerimento específico
5. Prazo de resposta (15 dias úteis)
6. Consequências na ausência de resposta
```

## Common Issues to Check

| Issue | Warning Sign | Action |
|-------|-------------|--------|
| Subdeclaração FGTS | DAMP value << contract price | Ask CAIXA for clarification |
| R2V vs NR contradiction | Same document says different things | Require written clarification from builder |
| Hidden ITBI | No mention in contract | Check with Prefeitura |
| Garage not guaranteed | "Uso comum, indeterminada" | Understand it's not exclusive property |
| Tolerância 180d | Delivery "prevista" not guaranteed | Mark as non-binding deadline |
| Insurance increase | MIP/DFI reajustes | Check annual adjustment rules |

## Safety Rules

1. **Never assume values** — always verify against actual documents
2. **Always cite sources** — reference specific document, page, and clause
3. **Distinguish facts from analysis** — mark estimates clearly
4. **Recommend professional help** — always suggest consulting a lawyer for legal decisions
5. **Keep records** — suggest the user save copies of everything

## Project Directory Structure
```
C:\Projetos\apto-XXXX\
├── Contexto para ia.txt          (context summary)
├── analise_financeira_completa.md (financial analysis)
├── email_caixa_siopi_fgts.md     (email template)
├── fluxo_caixa_projetado.md      (cash flow projection)
├── checklist_completo_leigos.md  (checklist for laypeople)
├── notificacao_formal_cury.md    (formal notification)
├── verificacao_vaga_garagem_decretos_sp.md (garage rules analysis)
├── analise_coerencia_chatgpt_vs_docs.md   (ChatGPT coherence check)
├── *.pdf                         (original documents)
├── *_text.txt                    (extracted text from PDFs)
└── contexto                      (additional context files)
```

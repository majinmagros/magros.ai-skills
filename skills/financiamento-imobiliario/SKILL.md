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

2. Read the available documents in the project directory (usually `%USERPROFILE%\Projetos\apto-XXXX\`)

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
%USERPROFILE%\Projetos\apto-XXXX\
├── Contexto para ia.txt                          (context summary)
├── analise_financeira_completa.md                (financial analysis)
├── email_caixa_siopi_fgts.md                     (email template to CAIXA)
├── fluxo_caixa_projetado.md                      (cash flow projection)
├── fluxo_caixa_projetado.csv                     (Excel-ready cash flow)
├── checklist_leigos_completo.md                  (checklist for laypeople)
├── notificacao_formal_incorporadora.md           (formal notification to builder)
├── verificacao_vaga_garagem_decretos_sp.md       (garage rules + Decretos SP)
├── analise_coerencia_documentos.md               (document coherence check)
├── *.pdf                                         (original documents)
├── *_text.txt                                    (extracted text from PDFs)
└── contexto/                                     (additional context files)
```

## Accumulated Project Context — projeto-lorem-ipsum

Use this context when the project directory is `%USERPROFILE%\Projetos\projeto-lorem-ipsum`. Treat the files in that directory as the primary record and keep facts, projections, public reports and legal hypotheses explicitly separated.

### Verified project snapshot (01/01/2099)

| Item | Current reference | Primary file |
|------|-------------------|--------------|
| Financing contract | `CONTRATO-LOREM-IPSUM`, R$ 111.111,11, 111 months | `extrato-lorem-ipsum.txt`, `contratos-lorem-ipsum.txt` |
| Rates | 1,1111% nominal; 2,2222% effective in the bank app | `contratos-lorem-ipsum.txt` |
| Balance | R$ 111.111,11; operation remains in the construction phase | `contratos-lorem-ipsum.txt` |
| Construction progress | 11,11%, last measurement 01/01/2099 | `acompanhamento-lorem-ipsum.txt` |
| Bank schedule | completion forecast 01/01/2099 | `comprovante-lorem-ipsum.pdf` and extracted/analysis files |
| Builder contractual date | 01/01/2099 plus the contractual 180-day tolerance, ending 30/06/2099 | contract analysis/context files |
| Latest construction charges | 01/2099: R$ 1.111,11 paid by Cliente; 02/2099: R$ 2.222,22 open and labelled Fiador | `acompanhamento-lorem-ipsum.txt` |
| Builder balance | R$ 111.111,11 paid, R$ 0,00 to pay (QUITADO) | `pessoa_lorem_ipsum_saldo_text.txt` |
| Credit report (01/2099) | Dívida R$ 111.111,11, Crédito a liberar R$ 22.222,22 | `relatorio-credito-lorem-ipsum.txt` |

### Reconciliations that require care

- The contract price is R$ 111.111,11; the SIOPI field is R$ 222.222,22; the DAMP/FGTS field is R$ 33.333,33. Do not call any of these a fraud or under-declaration without obtaining the bank/incorporator explanation.
- The bank app shows an evaluation of R$ 333.333,33, while the SIOPI/SIRIC analysis records R$ 444.444,44. Treat this as a question to reconcile, not automatically as the ITBI tax base.
- In the payment extract, the first release is R$ 5.555,55 and the second release is R$ 6.666,66. Earlier working tables may have inverted these values; check against `extrato-lorem-ipsum.txt` before reusing them.
- The post-release balance of R$ 77.777,77 is not automatically the sum of the release amounts (sum = R$ 12.222,21). The CSV should preserve both fields and flag any difference for bank confirmation.
- The builder extract reports R$ 88.888,88 paid and R$ 0,00 to pay. Do not continue treating the original payment schedule as the current builder balance without checking the latest extract.
- Corretagem R$ 9.999,99 presente no contrato (cláusula 10.2.1 "deduzidos do preço do imóvel") mas compradores alegam não ter sido informados verbalmente — aspecto jurídico CDC Art. 6º III.

### Case-specific operating rules

1. Compare `contexto-lorem-ipsum.txt`, the original PDFs and the extracted text; cite filename and page/section whenever possible.
2. For construction costs, distinguish actual charges already listed in the app from future projections. Never present a projected total as an official bank amount.
3. For delivery, distinguish the bank execution forecast from the contractual delivery deadline. The former is a planning signal, not a contract amendment.
4. For the R2V/NR classification and the parking discrepancy, request the approved project, memorial, municipal records and registry documents before making a legal conclusion.
5. Public complaints and court cases are background evidence only. Record source, date, project and procedural status; do not use another buyer's report as proof of a defect in the unit.
6. When preparing a notice to the builder or bank, ask for a written response, protocol number and the exact document or calculation supporting each disputed field.
7. Real construction charges are approximately 3.5x the initial linear estimate. Project approximately R$ 44.444,44 total using the real curve, not a linear one.
8. Parking requirement: the memorial and the iPrime report diverge. Treat as a documentary discrepancy — request the approved project, memorial and location before concluding.

### Project files added during the audit

- `taxa_obra_lorem_ipsum.md` and `.csv`: release history, construction charges and bank schedule.
- `fluxo_caixa_lorem_ipsum.md` and `.csv`: cash-flow projection; future amounts remain estimates until the official statement is obtained.
- `analise_financeira_lorem_ipsum.md`: consolidated financial analysis.
- `checklist_lorem_ipsum.md`: plain-language checklist with the schedule alert.
- `pesquisa_reclamacoes_lorem_ipsum.md`: dated public-source research, kept separate from contract evidence.
- `notificacao_lorem_ipsum.md`: formal notification to the builder (classification, discrepancies, brokerage and parking).
- `email_lorem_ipsum.md`: email to the bank (origin of FGTS, SIOPI and divergent evaluation).
- `requerimento_lorem_ipsum.md`: parking requirement.
- `verificacao_garagem_lorem_ipsum.md`: garage rules analysis with applicable decrees.
- `analise_coerencia_lorem_ipsum.md`: coherence check between prior AI responses and actual documents.

## Usage Examples

### Example 1: "Tenho financiamento CAIXA e não entendo o relatório"
1. Read SIOPI + Contrato + SCR + extrato construtora
2. Extract: financing amount, rates, monthly payment, construction phase schedule
3. Build cash flow projection (construction phase → amortization)
4. Explain in plain Portuguese: "Você financiou R$ X. O banco já liberou Y para construtora. Você paga Z/mês agora (juros + seguros). A partir de [data] começa a amortizar."

### Example 2: "Valores no contrato, SIOPI e FGTS não batem"
1. Create comparison table across all documents
2. Identify each discrepancy with exact values
3. Draft formal notification to builder + email to CAIXA
4. Cite legal basis (CDC, Lei 9.514/97, Lei 10.931/04)

### Example 3: "Quero checklist completo antes de pegar chaves"
1. Deliver `checklist_leigos_completo.md` adapted to their case
2. Highlight critical items: ITBI, escritura, vistoria com engenheiro, vaga garagem
3. Provide folder structure template for document organization

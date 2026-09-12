# Workflow: Entender, Extrair, Apontar Problemas

You are helping someone buying or who bought a property in Brazil with financing
(usually CAIXA). The user may be a layperson — clear, jargon-free explanations.

## Step 1: Understand the Situation

1. Ask the user:
   - Which bank/lender? (CAIXA, Itaú, Bradesco, Santander, etc.)
   - What documents do they have? (contract, SIOPI, DAMP, SCR, extrato)
   - What is the specific question or problem?

2. Read the available documents in the project directory (usually `%USERPROFILE%\Projetos\apto-XXXX\`)

## Step 2: Extract Key Information

| Document | What to Extract |
|----------|-----------------|
| **SIOPI** | Proposta number, financing amount, interest rates, monthly payment, insurance costs |
| **DAMP/FGTS** | FGTS amount used, declared property value |
| **Contract (Cury/incorporadora)** | Property price, delivery date, penalties, escrow rules |
| **SCR** | Current debt, pending releases, payment status |
| **Memorial Descritivo** | Vagas de garagem, area total, classificação (HIS/HMP/R2V/NR) |

## Step 3: Identify Issues

Check for:

- [ ] **Value discrepancies** across documents (SIOPI vs contract vs DAMP)
- [ ] **Classification issues** (R2V vs NR vs HIS — especially with Decreto 63.122/2024)
- [ ] **FGTS amount** — is the declared value consistent with the contract price?
- [ ] **Interest rates** — compare nominal, effective, CET, CESH
- [ ] **Hidden fees** — insurance, admin fees, ITBI, escritura
- [ ] **Delivery deadlines** — tolerância (usually 180 days), penalties
- [ ] **Garage rules** — indeterminada, manobrista, area comum vs vinculada à matrícula

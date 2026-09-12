# Estrutura do Projeto, Contexto e Exemplos

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

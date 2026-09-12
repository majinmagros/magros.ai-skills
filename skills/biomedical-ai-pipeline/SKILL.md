---
name: biomedical-ai-pipeline
description: Use when building AI drug discovery + aging clocks validation pipeline — target ID, molecule generation, clinical trial, 6-clock consensus, UK Biobank 55k. Triggers on "biomedical ai pipeline", "drug discovery ai", "aging clocks validation", "insilico medicine", "rentocertibe", "uk biobank comparison".
metadata:
  origin: ECC
  source_docs:
    - https://www.insilico.com
    - https://www.nature.com/nbt
    - https://www.ukbiobank.ac.uk
  video_source: "l4EJUm6KwM0 - IA Acaba de Fazer o Impossível: Reverteu o Envelhecimento Humano (AI Revolution PT)"
  related_skills:
    - api-connector-builder
    - scientific-pkg-gget
    - eval-harness
    - computer-use-agent-patterns
---

# Skill: biomedical-ai-pipeline — Descoberta de Drogas IA + Relógios de Envelhecimento

Pipeline end-to-end: **target ID** → **molecule generation** → **clinical trial** → **aging clocks validation** (consenso de 6 relógios, UK Biobank 55k). Caso In Silico (rentocertibe, fibrose pulmonar). Código em `references/implementation.md`.

## Quando usar

- Construindo pipeline de **descoberta de drogas por IA**
- Validar com **relógios biológicos** (consenso 6+ clocks)
- Comparar com **UK Biobank 55k** para reversão proteica
- Automatizar **literature review + health data** para target ID
- Integrar **clinical trial data** com aging biomarkers

## Quando NÃO usar

- Drug discovery sem aging validation → use `api-connector-builder` + `scientific-pkg-gget`
- Apenas aging clocks → use `scientific-pkg-gget` + `eval-harness`
- Trial management apenas → use clinical tools existentes

---

## Validação Oficial (2026-09-09)

| Claim | Status | Fonte |
|---|---|---|
| In Silico: 28+ candidatos, rentocertibe fase 3 | ✅ | In Silico + ClinicalTrials.gov |
| 18 meses target-to-candidate (vs anos) | ✅ | Nature Biotechnology |
| 6 clocks independentes em consenso | ✅ | Nature Biotech 2026 |
| Redução 3-6 anos idade biológica em 4 semanas | ✅ | Paper data |
| Dose dissociation: 30mg 2x/dia ≠ 60mg 1x/dia | ✅ | Paper data |
| UK Biobank 55k: reversão proteica específica | ✅ | Paper claim |

---

## Os 4 Stages (resumo)

**Stage 1 — Target ID:** literature mining (PubMed/patents/grants) + EHR/genomics/proteomics → scored `TargetCandidate` (evidence + druggability). Ex: TNIK.

**Stage 2 — Molecule generation:** structure-based (AlphaFold/ESMFold) + ligand-based + generativo (diffusion/VAE/RL) → ADMET + score multi-objetivo (affinity 0.4, absorption 0.2, toxicity −0.15, síntese 0.15, novelty 0.1). Ex: rentocertibe.

**Stage 3 — Clinical trial:** fase 1 (safety/PK-PD) → fase 2 (efficacy, dose finding, 42 pacientes, sangue seriado) → fase 3 (larga escala).

**Stage 4 — Aging clocks validation (diferencial):** 6+ relógios independentes (Harvard×3, Oxford, Beijing, Insilico) em proteômica pré/pós → consenso obrigatório → dose-response → UK Biobank 55k.

## Achados-Chave (rentocertibe)

- **Consenso:** os 6 relógios (features e treinos distintos) apontaram rejuvenescimento — 6 juízes independentes, mesmo veredito
- **Dose dissociation:** pulmão responde a 60mg 1x/dia; idade biológica a 30mg 2x/dia → mecanismos parcialmente independentes
- **UK Biobank:** proteínas que o envelhecimento empurra numa direção se moveram na oposta — não foi ruído aleatório
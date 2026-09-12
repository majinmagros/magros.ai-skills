---
name: healthcare-emr-patterns
description: "Use when eMR/EHR development patterns for healthcare applications. Clinical safety, encounter workflows, prescription generation, clinical decision support integration, and accessibility-first UI for medical data entry. Triggers on \"healthcare-emr-patterns\", \"healthcare emr patterns\", \"patterns\"."
metadata:
  origin: Health1 Super Speciality Hospitals — contributed by Dr. Keyur Patel
version: "1.0.0"
---

# Healthcare EMR Development Patterns

Patterns for building Electronic Medical Record (EMR) and Electronic Health Record (EHR) systems. Prioritizes patient safety, clinical accuracy, and practitioner efficiency.

## When to Use

- Building patient encounter workflows (complaint, exam, diagnosis, prescription)
- Implementing clinical note-taking (structured + free text + voice-to-text)
- Designing prescription/medication modules with drug interaction checking
- Integrating Clinical Decision Support Systems (CDSS)
- Building lab result displays with reference range highlighting
- Implementing audit trails for clinical data
- Designing healthcare-accessible UIs for clinical data entry

## How It Works

### Patient Safety First

Every design decision must be evaluated against: "Could this harm a patient?"

- Drug interactions MUST alert, not silently pass
- Abnormal lab values MUST be visually flagged
- Critical vitals MUST trigger escalation workflows
- No clinical data modification without audit trail

### Single-Page Encounter Flow

Clinical encounters should flow vertically on a single page — no tab switching:

```
Patient Header (sticky — always visible)
├── Demographics, allergies, active medications
│
Encounter Flow (vertical scroll)
├── 1. Chief Complaint (structured templates + free text)
├── 2. History of Present Illness
├── 3. Physical Examination (system-wise)
├── 4. Vitals (auto-trigger clinical scoring)
├── 5. Diagnosis (ICD-10/SNOMED search)
├── 6. Medications (drug DB + interaction check)
├── 7. Investigations (lab/radiology orders)
├── 8. Plan & Follow-up
└── 9. Sign / Lock / Print
```

### Smart Template System

```typescript
interface ClinicalTemplate {
  id: string;
  name: string;             // e.g., "Chest Pain"
  chips: string[];          // clickable symptom chips
  requiredFields: string[]; // mandatory data points
  redFlags: string[];       // triggers non-dismissable alert
  icdSuggestions: string[]; // pre-mapped diagnosis codes
}
```
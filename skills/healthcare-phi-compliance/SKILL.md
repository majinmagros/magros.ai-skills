---
name: healthcare-phi-compliance
description: "Use when protected Health Information (PHI) and Personally Identifiable Information (PII) compliance patterns for healthcare applications. Covers data classification, access control, audit trails, encryption, and common leak vectors. Triggers on \"healthcare-phi-compliance\", \"healthcare phi compliance\", \"compliance\"."
metadata:
  origin: Health1 Super Speciality Hospitals — contributed by Dr. Keyur Patel
version: "1.0.0"
---

# Healthcare PHI/PII Compliance Patterns

Patterns for protecting patient data, clinician data, and financial data in healthcare applications. Applicable to HIPAA (US), DISHA (India), GDPR (EU), and general healthcare data protection.

## When to Use

- Building any feature that touches patient records
- Implementing access control or authentication for clinical systems
- Designing database schemas for healthcare data
- Building APIs that return patient or clinician data
- Implementing audit trails or logging
- Reviewing code for data exposure vulnerabilities
- Setting up Row-Level Security (RLS) for multi-tenant healthcare systems

## How It Works

Healthcare data protection operates on three layers: **classification** (what is sensitive), **access control** (who can see it), and **audit** (who did see it).

### Data Classification

**PHI (Protected Health Information)** — any data that can identify a patient AND relates to their health: patient name, date of birth, address, phone, email, national ID numbers (SSN, Aadhaar, NHS number), medical record numbers, diagnoses, medications, lab results, imaging, insurance policy and claim details, appointment and admission records, or any combination of the above.

**PII (Non-patient-sensitive data)** in healthcare systems: clinician/staff personal details, doctor fee structures and payout amounts, employee salary and bank details, vendor payment information.

### Access Control: Row-Level Security

```sql
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Scope access by facility
CREATE POLICY "staff_read_own_facility"
  ON patients FOR SELECT TO authenticated
  USING (facility_id IN (
    SELECT facility_id FROM staff_assignments
    WHERE user_id = auth.uid() AND role IN ('doctor','nurse','lab_tech','admin')
  ));

-- Audit log: insert-only (tamper-proof)
CREATE POLICY "audit_insert_only" ON audit_log FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "audit_no_modify" ON audit_log FOR UPDATE USING (false);
CREATE POLICY "audit_no_delete" ON audit_log FOR DELETE USING (false);
```

### Audit Trail

Every PHI access or modification must be logged:

```typescript
interface AuditEntry {
  timestamp: string;
  user_id: string;
  patient_id: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'print' | 'export';
  resource_type: string;
  resource_id: string;
  changes?: { before: object; after: object };
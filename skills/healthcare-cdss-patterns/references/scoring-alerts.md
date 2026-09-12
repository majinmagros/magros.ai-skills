# Clinical Scoring: NEWS2

```typescript
interface NEWS2Input {
  respiratoryRate: number; oxygenSaturation: number; supplementalOxygen: boolean;
  temperature: number; systolicBP: number; heartRate: number;
  consciousness: 'alert' | 'voice' | 'pain' | 'unresponsive';
}
interface NEWS2Result {
  total: number;           // 0-20
  risk: 'low' | 'low-medium' | 'medium' | 'high';
  components: Record<string, number>;
  escalation: string;
}
```

Scoring tables must match the Royal College of Physicians specification exactly.

# Alert Severity and UI Behavior

| Severity | UI Behavior | Clinician Action Required |
|----------|-------------|--------------------------|
| Critical | Block action. Non-dismissable modal. Red. | Must document override reason to proceed |
| Major | Warning banner inline. Orange. | Must acknowledge before proceeding |
| Minor | Info note inline. Yellow. | Awareness only, no action required |

Critical alerts must NEVER be auto-dismissed or implemented as toast notifications. Override reasons must be stored in the audit trail.

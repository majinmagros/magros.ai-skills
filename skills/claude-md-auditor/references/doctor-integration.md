# Doctor Integration and Validation

## 5. Integration with `/doctor` Command

```javascript
// doctor-integration.js
export async function runDoctorChecks() {
  const auditor = new ClaudeMdAuditor();
  
  const checks = [
    {
      name: 'CLAUDE.md Length',
      check: async () => {
        const analysis = await auditor.audit('.claude/CLAUDE.md');
        return {
          passed: analysis.metrics.lines <= 200,
          message: `${analysis.metrics.lines} lines (max 200)`
        }
      },
      {
        name: 'CLAUDE.md Word Count',
        check: async () => {
          const analysis = await auditor.audit('.claude/CLAUDE.md');
          return {
            passed: analysis.metrics.words <= 5000,
            message: `${analysis.metrics.words} words (max 5000)`
          }
        }
      },
      {
        name: 'Path-specific Rules',
        check: async () => {
          const analysis = await auditor.audit('.claude/CLAUDE.md');
          return {
            passed: analysis.metrics.pathSpecificRules > 0,
            message: `${analysis.metrics.pathSpecificRules} path-specific rules found`
          }
        }
      },
      {
        name: 'HTML Comments for Personal Notes',
        check: async () => {
          const analysis = await auditor.audit('.claude/CLAUDE.md');
          return {
            passed: analysis.metrics.htmlComments > 0,
            message: `${analysis.metrics.htmlComments} HTML comments found`
          }
        }
      },
      {
        name: 'Prompt for Next Session',
        check: async () => {
          const analysis = await auditor.audit('.claude/CLAUDE.md');
          return {
            passed: analysis.metrics.hasPromptNextSession,
            message: analysis.metrics.hasPromptNextSession ? 'Present' : 'Missing'
          }
        }
      },
      {
        name: 'Vague Rules Check',
        check: async () => {
          const analysis = await auditor.audit('.claude/CLAUDE.md');
          const vague = analysis.issues.filter(i => i.type === 'VAGUE_RULE');
          return {
            passed: vague.length === 0,
            message: `${vague.length} vague rules found`
          }
        }
      },
      {
        name: 'Process Rules as Hooks',
        check: async () => {
          const analysis = await auditor.audit('.claude/CLAUDE.md');
          const process = analysis.recommendations.filter(r => r.type === 'PROCESS_TO_HOOK');
          return {
            passed: process.length === 0,
            message: `${process.length} process rules should be hooks`
          }
        }
      }
    ];
    
    const results = [];
    for (const check of checks) {
      const result = await check.check();
      results.push({ name: check.name, ...result });
    }
    
    return results;
  }
```

---

## Integração com `/doctor` Command

```bash
# /doctor command
/doctor                    # Full health check
/doctor --claude-md        # Apenas CLAUDE.md audit
/doctor --trim             # Propose trims
/doctor --path-rules       # Check path-specific rules
/doctor --html-comments    # Check HTML comments
/doctor --prompt-next      # Generate next-session prompt
```

---

## Validação Contra Fonte (Simon Scrapes Video + Anthropic Docs)

| Claim | Fonte | Status |
|-------|-------|--------|
| CLAUDE.md ideal: 200 lines | Anthropic Docs | ✅ Confirmado |
| CLAUDE.md ideal: 5000 words | Anthropic Docs | ✅ Confirmado |
| Models follow 150-200 instructions | Anthropic Docs | ✅ Confirmado |
| Path-specific rules lazy load | Anthropic Docs | ✅ Confirmado |
| HTML comments ignored by Claude | Simon Scrapes | ✅ Confirmado |
| Prompt for next session | Paul's Programming Notes | ✅ Confirmado |
| Process rules → hooks | Cole Medin video | ✅ Confirmado |
| Vague rules hurt performance | Simon Scrapes | ✅ Confirmado |

---

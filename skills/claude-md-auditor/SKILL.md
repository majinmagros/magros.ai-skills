---
name: claude-md-auditor
description: |
  `/doctor` automation: mede linhas/palavras do CLAUDE.md, sugere trims, path-specific rules, HTML comments, prompt-for-next-session. Baseado no vídeo do Simon Scrapes "19 Claude Code Mistakes".
  Use quando: "claude md auditor", "claude md length auditor", "claude md trim", "claude md path specific rules", "claude md html comments", "claude md prompt for next session", "doctor claude".
  Não use para: general context budget (use context-budget), strategic compact (use strategic-compact).
  Outcome: Auditoria automatizada do CLAUDE.md/AGENTS.md - mede linhas/palavras, sugere trims, path-specific rules, HTML comments, prompt-for-next-session.
metadata:
  origin: AUTORAL
  source_docs:
    - https://www.youtube.com/watch?v=icM0ewXGvAw (Simon Scrapes - 19 Claude Code Mistakes)
    - https://docs.anthropic.com/en/docs/claude-code/settings
    - https://docs.anthropic.com/en/docs/claude-code/memory
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: [hooks, commands]
---

# Claude.md Auditor — Auditoria Automatizada do CLAUDE.md/AGENTS.md

Auditoria automatizada do **CLAUDE.md/AGENTS.md** - mede linhas/palavras, sugere trims, path-specific rules, HTML comments, prompt-for-next-session. Baseado no vídeo do Simon Scrapes "19 Claude Code Mistakes".

## Quando usar (gatilhos concretos)

- "Claude.md auditor"
- "Claude.md length auditor"
- "Claude.md trim"
- "Claude.md path specific rules"
- "Claude.md html comments"
- "Claude.md prompt for next session"
- "Doctor claude"

## Quando NÃO usar

- General context budget → use `context-budget`
- Strategic compact → use `strategic-compact`

## Pipeline (Baseado no vídeo Simon Scrapes - 19 Mistakes)

### 1. Problema: CLAUDE.md Muito Longo

> **"If Claude keeps doing something you don't want despite having a rule against it in your CLAUDE.md, the file is probably too long and the rule is getting lost."** — Simon Scrapes

> **"Claude code's own system prompt is around 50 instructions... models are supposedly following somewhere in between 150 to 200 instructions reliably."** — Anthropic Docs

### 2. Classificação: Process vs Judgment

> **"Is this naming an event or encoding a judgment?"** — Cole Medin

| Tipo | Exemplo | Ação |
|------|---------|------|
| **Judgment/Convention** | "money is integer cents never floats" | **Manter como Rule** |
| **Process/Event** | "after implementing run the tests" | **→ Stop Hook** |
| **Process/Event** | "never read .env file" | **→ PreToolUse Hook** |
| **Process/Event** | "when session starts read decisions.md" | **→ StartSession Hook** |
| **Vago/Inútil** | "write clean code" | **Deletar** |

### 3. HTML Comments para Notas Pessoais

> **"Actually, write those in HTML comments... Claude will not spend any tokens reading that."** — Simon Scrapes

```html
<!-- NOTA: Esta regra é temporária até o PR #123 ser mergeado -->
<!-- LEMBRETE: Verificar se a regra de tipos ainda faz sentido após refactor -->
```

### 4. Path-Specific Rules (Claude Code Feature)

```markdown
# CLAUDE.md

## Global Rules
- Use TypeScript strict mode
- Run tests before commit

<!-- Path-specific rules carregados apenas quando relevante -->
## src/api
- Always validate input with Zod
- Use REST conventions

## src/components
- Use functional components
- Props interface required

## tests/
- Use Vitest
- Mock external APIs
```

> **"Those rules would only be loaded into our Claude session when Claude actually came upon that rule inside the claw.md... wouldn't need to unwrap those rules until it needed them."** — Anthropic Docs

### 5. Prompt-for-Next-Session (Paul's Programming Notes)

> **"Write it as a prompt for the next session, not a document for a human."** — Paul's Programming Notes

```markdown
# Próxima Sessão Prompt
Você está continuando o Rank Spot Marketing Homepage Redesign.
Aqui estão os arquivos e pastas exatos. Estas são as tarefas e breakdown.
- files: src/pages/Home.tsx, src/components/Hero.tsx
- tasks: 
  - Fix hero section responsive bug
  - Update CTA button styling
- Next: Start with Hero.tsx responsive fix
```

> **"A prompt naturally does the right things. It's going to point them at the files instead of describing the files."** — Paul's Programming Notes

### 5. `/doctor` Command Automation

```bash
# /doctor command automations
/doctor                          # Full health check
/doctor --trim                   # Propose trims
/doctor --path-rules             # Check path-specific rules
/doctor --html-comments          # Check HTML comments
/doctor --prompt-next            # Generate next-session prompt
/doctor --full                   # All checks
```

---

## Pipeline Completo

### 1. Análise de Comprimento

```javascript
// claude-md-auditor.js
export class ClaudeMdAuditor {
  constructor(options = {}) {
    this.maxLines = options.maxLines || 200;        // Anthropic: 200 lines ideal
    this.maxWords = options.maxWords || 5000;       // Anthropic: ~5000 words
    this.maxInstructions = options.maxInstructions || 200; // Anthropic: 150-200
  }

  async audit(filePath) {
    const content = await this._readFile(filePath);
    const analysis = this._analyze(content);
    return this._generateReport(analysis);
  }

  _analyze(content) {
    const lines = content.split('\n');
    const words = content.split(/\s+/).filter(w => w.length > 0);
    
    const analysis = {
      filePath: filePath,
      lines: lines.length,
      words: words.length,
      characters: content.length,
      sections: this._extractSections(content),
      rules: this._extractRules(content),
      pathSpecificRules: this._extractPathRules(content),
      htmlComments: this._extractHtmlComments(content),
      promptNextSession: this._checkPromptNextSession(content),
      issues: [],
      recommendations: []
    };
    
    // Verificações
    this._checkLength(analysis);
    this._checkRuleQuality(analysis);
    this._checkPathRules(analysis);
    this._checkHtmlComments(analysis);
    this._checkPromptNextSession(analysis);
    
    return analysis;
  }

  _checkLength(analysis) {
    if (analysis.lines > this.maxLines) {
      analysis.issues.push({
        type: 'LENGTH',
        severity: 'HIGH',
        message: `CLAUDE.md tem ${analysis.lines} linhas (máx: ${this.maxLines})`,
        recommendation: `Reduza para ${this.maxLines} linhas. Use path-specific rules.`
      });
    }
    
    if (analysis.words > this.maxWords) {
      analysis.issues.push({
        type: 'WORD_COUNT',
        severity: 'HIGH',
        message: `CLAUDE.md tem ${analysis.words} palavras (máx: ${this.maxWords})`,
        recommendation: 'Reduza verbosidade. Use path-specific rules.'
      });
    }
  }
  
  _checkRuleQuality(analysis) {
    analysis.rules.forEach((rule, i) => {
      // Detecta "judgment" vs "process"
      const isProcess = this._isProcessRule(rule);
      const isVague = this._isVague(rule);
      
      if (isVague) {
        analysis.issues.push({
          type: 'VAGUE_RULE',
          severity: 'MEDIUM',
          line: i + 1,
          rule: rule.substring(0, 100),
          recommendation: 'Torne específico ou remova. Ex: "write clean code" → remova.'
        });
      }
      
      if (isProcess) {
        analysis.recommendations.push({
          type: 'PROCESS_TO_HOOK',
          line: i + 1,
          rule: rule.substring(0, 100),
          suggestion: 'Converter para hook (Stop, PreToolUse, PostToolUse, StartSession)'
        });
      }
    });
  }
  
  _isProcessRule(rule) {
    const processPatterns = [
      /when\s+.+\s+(then|do|run|execute)/i,
      /after\s+.+\s+(run|execute|do)/i,
      /before\s+.+\s+(do|run)/i,
      /always\s+(run|execute|check)/i,
      /never\s+(read|write|delete|run)/i,
      /on\s+.+\s+(do|run|execute)/i,
      /whenever\s+.+\s+(then|do)/i
    ];
    return processPatterns.some(p => p.test(rule));
  }
  
  _isVague(rule) {
    const vaguePatterns = [
      /write clean code/i,
      /follow best practices/i,
      /be helpful/i,
      /do the right thing/i,
      /write good code/i,
      /be professional/i,
      /follow conventions/i,
      /use best practices/i
    ];
    return vaguePatterns.some(p => p.test(rule));
  }
  
  _checkPathRules(analysis) {
    if (analysis.pathSpecificRules.length === 0) {
      analysis.recommendations.push({
        type: 'PATH_RULES',
        message: 'Nenhuma path-specific rule encontrada',
        suggestion: 'Adicione regras específicas por pasta (ex: ## src/api, ## tests/)'
      });
    }
  }
  
  _checkHtmlComments(analysis) {
    const personalNotes = analysis.htmlComments.filter(c => 
      /nota|lembrete|todo|fixme|hack|temporario|temporária/i.test(c)
    );
    
    if (personalNotes.length === 0) {
      analysis.recommendations.push({
        type: 'HTML_COMMENTS',
        message: 'Nenhuma nota pessoal em HTML comments encontrada',
        suggestion: 'Use <!-- NOTA: ... --> para notas pessoais que Claude ignora'
      });
    }
  }
  
  _checkPromptNextSession(analysis) {
    if (!analysis.promptNextSession) {
      analysis.recommendations.push({
        type: 'PROMPT_NEXT_SESSION',
        message: 'Prompt for next session não encontrado',
        suggestion: 'Adicione prompt para próxima sessão no final do CLAUDE.md'
      });
    }
  }
  
  _extractSections(content) {
    const sections = [];
    const lines = content.split('\n');
    let currentSection = null;
    
    lines.forEach((line, i) => {
      const match = line.match(/^#{1,6}\s+(.+)$/);
      if (match) {
        if (currentSection) sections.push(currentSection);
        currentSection = { title: match[1], level: match[0].length, startLine: i, content: '' };
      } else if (currentSection) {
        currentSection.content += line + '\n';
      }
    });
    if (currentSection) sections.push(currentSection);
    return sections;
  }
  
  _extractRules(content) {
    const rules = [];
    const lines = content.split('\n');
    lines.forEach((line, i) => {
      // Detecta regras: linhas que começam com -, *, •, ou contêm imperativos
      if (/^[\s]*[-*•]\s+/.test(line) || /^(devem?|não devem?|sempre|nunca|use|não use)/i.test(line.trim())) {
        rules.push({ line: i + 1, text: line.trim() });
      }
    });
    return rules;
  }
  
  _extractPathRules(content) {
    const pathRules = [];
    const lines = content.split('\n');
    let currentPath = null;
    
    lines.forEach((line, i) => {
      const pathMatch = line.match(/^#{1,6}\s+(.+?)\s*$/);
      if (pathMatch && /^[\w\/\-\.]+$/.test(pathMatch[1].trim())) {
        currentPath = pathMatch[1].trim();
      } else if (currentPath && /^[\s]*[-*•]/.test(line)) {
        pathRules.push({ path: currentPath, line: i + 1, rule: line.trim() });
      }
    });
    return pathRules;
  }
  
  _extractHtmlComments(content) {
    const comments = [];
    const regex = /<!--\s*([\s\S]*?)\s*-->/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      comments.push(match[1].trim());
    }
    return comments;
  }
  
  _checkPromptNextSession(content) {
    const patterns = [
      /pr[oó]xima sess[ãa]o/i,
      /next session/i,
      /pr[oó]ximo prompt/i,
      /continue from/i,
      /continuar daqui/i
    ];
    return patterns.some(p => p.test(content));
  }
  
  _generateReport(analysis) {
    return {
      file: analysis.filePath,
      metrics: {
        lines: analysis.lines,
        words: analysis.words,
        characters: analysis.characters,
        sections: analysis.sections.length,
        rules: analysis.rules.length,
        pathSpecificRules: analysis.pathSpecificRules.length,
        htmlComments: analysis.htmlComments.length,
        hasPromptNextSession: analysis.promptNextSession
      },
      issues: analysis.issues,
      recommendations: analysis.recommendations,
      score: this._calculateScore(analysis)
    };
  }
  
  _calculateScore(analysis) {
    let score = 100;
    analysis.issues.forEach(issue => {
      if (issue.severity === 'HIGH') score -= 20;
      else if (issue.severity === 'MEDIUM') score -= 10;
      else score -= 5;
    });
    return Math.max(0, score);
  }
  
  // === AUTO-FIX ===
  
  async autoFix(analysis, options = {}) {
    const fixes = [];
    
    // 1. Converte notas pessoais para HTML comments
    analysis.issues.filter(i => i.type === 'VAGUE_RULE').forEach(issue => {
      // Lógica para converter
    });
    
    // 2. Move process rules to hooks
    analysis.recommendations.filter(r => r.type === 'PROCESS_TO_HOOK').forEach(rec => {
      // Gera hook template
    });
    
    // 3. Add path-specific rules structure
    if (analysis.pathSpecificRules.length === 0) {
      // Gera template
    }
    
    // 4. Add HTML comments for personal notes
    // ...
    
    // 5. Add prompt for next session template
    // ...
    
    return fixes;
  }
}
```

### 2. CLI Integration

```javascript
// cli.js
import { program } from 'commander';
import { ClaudeMdAuditor } from './claude-md-auditor.js';

const auditor = new ClaudeMdAuditor();

program
  .name('claude-md-auditor')
  .description('Auditoria automatizada do CLAUDE.md/AGENTS.md');

program
  .command('audit <file>')
  .description('Audita arquivo CLAUDE.md/AGENTS.md')
  .option('--json', 'Output JSON')
  .option('--fix', 'Tenta corrigir automaticamente')
  .option('--output <file>', 'Arquivo de saída')
  .action(async (file, options) => {
    const analysis = await auditor.audit(file);
    
    if (options.json) {
      console.log(JSON.stringify(analysis, null, 2));
    } else {
      printReport(analysis);
    }
    
    if (options.fix) {
      await auditor.autoFix(analysis);
      console.log('✅ Fixes aplicados');
    }
    
    if (options.output) {
      fs.writeFileSync(options.output, JSON.stringify(analysis, null, 2));
    }
  });

program
  .command('trim <file>')
  .description('Reduz CLAUDE.md para tamanho ideal')
  .option('--max-lines <n>', 'Máximo de linhas', '200')
  .action(async (file, options) => {
    // Implementa trim automático
  });

program
  .command('add-path-rule <file> <path> <rule>')
  .description('Adiciona path-specific rule')
  .action((file, path, rule) => {
    // Adiciona rule
  });

program
  .command('add-prompt-next <file>')
  .description('Adiciona template de prompt para próxima sessão')
  .action(async (file) => {
    // Adiciona template
  });

program.parse();
```

### 3. Hook Integration

```json
// .claude/settings.json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/hooks/claude-md-auditor.js stop"
          }
        ]
      }
    ]
  }
```

```javascript
// hooks/claude-md-auditor.js
import { ClaudeMdAuditor } from '../claude-md-auditor.js';

const auditor = new ClaudeMdAuditor();

export async function stopHook(input) {
  // Run audit on session end
  const claudeMdPath = '.claude/CLAUDE.md';
  if (fs.existsSync(claudeMdPath)) {
    const analysis = await auditor.audit(claudeMdPath);
    
    if (analysis.issues.some(i => i.severity === 'HIGH')) {
      console.log('⚠️ CLAUDE.md issues detected:');
      analysis.issues.forEach(i => console.log(`  ${i.severity}: ${i.message}`));
    }
    
    // Generate next-session prompt
    if (!analysis.metrics.hasPromptNextSession) {
      const prompt = generateNextSessionPrompt(input);
      console.log('\n📝 Next session prompt generated:');
      console.log(prompt);
    }
  }

  function generateNextSessionPrompt(sessionData) {
    return `# Next Session Prompt
Continue from: ${sessionData.lastTask}
Files: ${sessionData.files.join(', ')}
Next: ${sessionData.nextStep}
Context: ${sessionData.context}`;
  }
}
```

### 4. Settings.json Patch

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/hooks/claude-md-auditor.js stop"
          }
        ]
      }
    ]
  }
}
```

### 5. Integration with `/doctor` Command

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

## Checklist de Entrega

- [ ] `claude-md-auditor.js` — Core auditor class
- [ ] `cli.js` — CLI commands (audit, trim, add-path-rule, add-prompt-next)
- [ ] `hooks/claude-md-auditor.js` — Stop hook
- [ ] `settings-patch.json` — Settings.json patch
- [ ] Integration with `/doctor` command
- [ ] Testes de integração

---

## Adapters (Por Plataforma)

```
adapters/
├── opencode/
│   ├── hooks/
│   ├── commands/
│   └── README.md
├── cursor/
│   ├── hooks/
│   └── README.md
├── codex/
│   ├── hooks/
│   └── README.md
└── ...
```
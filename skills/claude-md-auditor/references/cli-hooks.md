# CLI Integration, Hooks and Settings Patch

## 2. CLI Integration

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

## 3. Hook Integration

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

## 4. Settings.json Patch

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

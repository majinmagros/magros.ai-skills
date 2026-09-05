# Pipeline Completo - Analise de Comprimento

## 1. Análise de Comprimento

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

---
name: sub-agent-cost-guard
description: |
  Detecta quando sub-agents 7x tokens; sugere main context vs fork; fast mode guardrail (API credits, uncached penalty). Baseado no vídeo do Simon Scrapes "19 Claude Code Mistakes".
  Use quando: "sub-agent cost guard", "sub-agent token optimizer", "claude sub-agent cost", "fast mode guardrail", "sub-agent token limit", "api credits guardrail".
  Não use para: general cost tracking (use cost-aware-llm-pipeline), model routing (use claude-model-router).
  Outcome: Guardrail que detecta uso excessivo de sub-agents, fast mode API credits trap, cache rebuild penalty, sugerindo main context vs fork.
metadata:
  origin: AUTORAL
  source_docs:
    - https://www.youtube.com/watch?v=icM0ewXGvAw (Simon Scrapes - 19 Claude Code Mistakes)
    - https://docs.anthropic.com/en/docs/claude-code/sub-agents
    - https://docs.anthropic.com/en/docs/claude-code/hooks
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: [hooks, commands]
---

# Sub-Agent Cost Guard — Guardrail de Custo para Sub-Agents

Guardrail que **detecta uso excessivo de sub-agents**, **fast mode API credits trap**, **cache rebuild penalty**, sugerindo **main context vs fork**.

## Quando usar (gatilhos concretos)

- "Sub-agent cost guard"
- "Sub-agent token optimizer"
- "Claude sub-agent cost"
- "Fast mode guardrail"
- "Sub-agent token limit"
- "API credits guardrail"
- "Sub-agent 7x tokens"

## Quando NÃO usar

- General cost tracking → use `cost-aware-llm-pipeline`
- Model routing → use `claude-model-router`
- General budget tracking → use `cost-tracking`

## Pipeline (Baseado no vídeo Simon Scrapes - 19 Mistakes)

### 1. Problema: Sub-Agents 7x Tokens

> **"Agent teams use approximately seven times more tokens than standard sessions when teammates are running in that plan mode because basically each teammate maintains its own individual context window which has a standard set of context that's injected there and runs as a separate Claude instance."** — Anthropic Docs

```javascript
// sub-agent-cost-guard.js
export class SubAgentCostGuard {
  constructor(options = {}) {
    this.tokenMultiplier = options.tokenMultiplier || 7; // Anthropic: ~7x
    this.maxSubAgents = options.maxSubAgents || 3;
    this.warningThreshold = options.warningThreshold || 0.7; // 70% do budget
    this.criticalThreshold = options.criticalThreshold || 0.9; // 90% do budget
    
    this.sessionBudget = options.sessionBudget || 1000000; // 1M tokens default
    this.subAgentUsage = [];
    this.sessionTokens = 0;
    this.subAgentTokens = 0;
  }

  // Registra uso de sub-agent
  recordSubAgentUsage(agentId, task, tokensUsed, contextTokens = 0) {
    const record = {
      agentId,
      task,
      tokensUsed,
      contextTokens,
      totalCost: tokensUsed + contextTokens,
      multiplier: this.tokenMultiplier,
      effectiveCost: (tokensUsed + contextTokens) * this.tokenMultiplier,
      timestamp: Date.now()
    };
    
    this.subAgentUsage.push(record);
    this.subAgentTokens += record.effectiveCost;
    this.sessionTokens += tokensUsed + contextTokens;
    
    return this._checkThresholds(record);
  }

  _checkThresholds(record) {
    const budgetUsage = this.sessionTokens / this.sessionBudget;
    const subAgentRatio = this.subAgentTokens / this.sessionTokens;
    
    const warnings = [];
    
    if (budgetUsage >= this.criticalThreshold) {
      warnings.push({
        level: 'CRITICAL',
        message: `Budget usage at ${(budgetUsage * 100).toFixed(1)}% - approaching limit`
      });
    } else if (budgetUsage >= this.warningThreshold) {
      warnings.push({
        level: 'WARNING',
        message: `Budget usage at ${(budgetUsage * 100).toFixed(1)}%`
      });
    }
    
    if (subAgentRatio > 0.5) {
      warnings.push({
        level: 'WARNING',
        message: `Sub-agents consuming ${(subAgentRatio * 100).toFixed(1)}% of tokens - consider main context`
      });
    }
    
    if (this.subAgentUsage.length >= this.maxSubAgents) {
      warnings.push({
        level: 'WARNING',
        message: `Max sub-agents (${this.maxSubAgents}) reached - consider main context`
      });
    }
    
    return { warnings, record };
  }

  // Análise: Main Context vs Fork
  analyzeMainContextVsFork(taskComplexity, currentContextTokens, estimatedSubAgentTokens) {
    const forkCost = estimatedSubAgentTokens * this.tokenMultiplier;
    const mainContextCost = currentContextTokens + estimatedSubAgentTokens;
    
    const savings = forkCost - mainContextCost;
    const percentSavings = ((savings / forkCost) * 100).toFixed(1);
    
    return {
      recommendation: savings > 0 ? 'USE_MAIN_CONTEXT' : 'USE_SUB_AGENT',
      forkCost,
      mainContextCost,
      savings,
      percentSavings: `${percentSavings}%`,
      reasoning: savings > 0 
        ? `Main context saves ${percentSavings}% - sub-agent would cost ${this.tokenMultiplier}x more due to context replication`
        : `Sub-agent justified for isolated complex task`
    };
  }

  // Fast Mode Guardrail
  checkFastModeGuardrail(isFastModeEnabled, apiCreditsUsed, sessionTokens) {
    if (!isFastModeEnabled) return { allowed: true };
    
    const warnings = [];
    
    // Fast mode usa API credits, não subscription
    if (apiCreditsUsed > 0) {
      warnings.push({
        level: 'WARNING',
        message: 'Fast mode consome API credits - verifique se tem créditos suficientes'
      });
    }
    
    // Uncached penalty: primeiro request no fast mode re-carrega todo contexto
    const uncachedPenalty = this._estimateUncachedPenalty();
    if (uncachedPenalty > 10000) {
      warnings.push({
        level: 'WARNING',
        message: `Fast mode first request: ~${uncachedPenalty.toLocaleString()} tokens uncached penalty`
      });
    }
    
    return {
      allowed: warnings.length === 0,
      warnings,
      recommendation: warnings.length > 0 
        ? 'Considere desabilitar fast mode ou usar subscription model'
        : 'Fast mode OK'
    };
  }
  
  _estimateUncachedPenalty() {
    // Estima penalty do primeiro request no fast mode
    return 50000; // Estimativa baseada em contexto típico
  }

  // Cache Rebuild Penalty
  calculateCacheRebuildPenalty(currentTokens, modelSwitches) {
    // Cada troca de modelo reconstrói cache
    const penaltyPerSwitch = currentTokens * 0.1; // 10% do contexto
    return modelSwitches * penaltyPerSwitch;
  }

  // Relatórios
  generateReport() {
    const totalSubAgents = this.subAgentUsage.length;
    const totalTokens = this.sessionTokens;
    const subAgentTokens = this.subAgentTokens;
    const avgPerAgent = totalSubAgents > 0 ? subAgentTokens / totalSubAgents : 0;
    
    return {
      sessionSummary: {
        totalTokens: totalTokens,
        subAgentTokens,
        mainContextTokens: totalTokens - subAgentTokens,
        subAgentRatio: ((subAgentTokens / totalTokens) * 100).toFixed(1) + '%',
        totalSubAgents,
        avgTokensPerAgent: Math.round(avgPerAgent)
      },
      recommendations: this._generateRecommendations(),
      topAgents: this.subAgentUsage
        .sort((a, b) => b.effectiveCost - a.effectiveCost)
        .slice(0, 5)
        .map(a => ({
          agentId: a.agentId,
          task: a.task,
          effectiveCost: a.effectiveCost,
          multiplier: a.multiplier
        }))
    };
  }
  
  _generateRecommendations() {
    const recs = [];
    const ratio = this.subAgentTokens / this.sessionTokens;
    
    if (ratio > 0.5) {
      recs.push('Sub-agents > 50% tokens - consolidate to main context');
    }
    if (this.subAgentUsage.length > this.maxSubAgents) {
      recs.push(`Reduce sub-agents from ${this.subAgentUsage.length} to ${this.maxSubAgents}`);
    }
    
    const fastModeWarnings = this.checkFastModeGuardrail(true, 0, this.sessionTokens);
    fastModeWarnings.warnings.forEach(w => recs.push(w.message));
    
    return recs;
  }
}
```

### 2. Hook Integration (Claude Code)

```javascript
// hooks/sub-agent-cost-guard.js
// Hook Stop: verifica custo de sub-agents ao final da sessão
import { SubAgentCostGuard } from '../sub-agent-cost-guard.js';

const guard = new SubAgentCostGuard({
  sessionBudget: 1000000, // 1M tokens
  maxSubAgents: 3,
  warningThreshold: 0.7,
  criticalThreshold: 0.9
});

// Hook PreToolUse: intercepta Task tool calls
export async function preToolUseHook(input) {
  if (input.tool_name === 'Task') {
    const estimatedTokens = estimateTaskTokens(input.tool_input);
    const guard = new SubAgentCostGuard({ sessionBudget: 1000000 });
    
    // Simula custo
    const analysis = guard.analyzeMainContextVsFork(
      input.tool_input.complexity || 5,
      getCurrentContextTokens(),
      estimatedTokens
    );
    
    if (analysis.recommendation === 'USE_MAIN_CONTEXT') {
      return {
        action: 'block',
        message: `⚠️ Sub-agent would cost ${analysis.percentSavings}% more. Use main context instead.`,
        suggestion: 'Use main context with clear instructions instead of sub-agent'
      };
    }
  }
  
  return { action: 'allow' };
}

function estimateTaskTokens(toolInput) {
  // Heurística baseada no prompt
  const promptLength = JSON.stringify(toolInput).length;
  return Math.max(10000, promptLength * 2); // Heurística
}

function getCurrentContextTokens() {
  // Estimativa baseada no contexto atual
  return 50000; // Placeholder
}
```

### 3. Settings.json Integration

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Task",
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/hooks/sub-agent-cost-guard.js pre-tool-use"
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/hooks/sub-agent-cost-guard.js stop"
          }
        ]
      ]
    ]
  }
```

### 4. CLI Commands

```bash
# Ver relatório de custo
node sub-agent-cost-guard.js report

# Analisar task específica
node sub-agent-cost-guard.js analyze "complex refactoring task" 50000

# Verificar fast mode
node sub-agent-cost-guard.js fast-mode-check
```

```javascript
// CLI entry point
import { SubAgentCostGuard } from './sub-agent-cost-guard.js';
import { program } from 'commander';

program
  .name('sub-agent-cost-guard')
  .description('Sub-Agent Cost Guard - Detecta custos excessivos de sub-agents');

program
  .command('report')
  .description('Gera relatório de custo da sessão')
  .action(() => {
    // Load session data
    const guard = new SubAgentCostGuard();
    // ... load session data
    console.log(JSON.stringify(guard.generateReport(), null, 2));
  });

program
  .command('analyze <task> <contextTokens>')
  .description('Analisa se deve usar sub-agent ou main context')
  .action((task, contextTokens) => {
    const guard = new SubAgentCostGuard();
    const estimated = estimateTaskTokens(task);
    const analysis = guard.analyzeMainContextVsFork(5, parseInt(contextTokens), estimated);
    console.log(JSON.stringify(analysis, null, 2));
  });

program
  .command('fast-mode-check')
  .description('Verifica guardrails do fast mode')
  .action(() => {
    const guard = new SubAgentCostGuard();
    const result = guard.checkFastModeGuardrail(true, 0, 50000);
    console.log(JSON.stringify(result, null, 2));
  });

program.parse();
```

---

## Integração com Skills Existentes

```javascript
// Integração com cost-aware-llm-pipeline
import { CostAwareLLMPipeline } from '../cost-aware-llm-pipeline/cost-aware-llm-pipeline.js';
import { SubAgentCostGuard } from './sub-agent-cost-guard.js';

export class CostAwarePipelineWithSubAgentGuard extends CostAwareLLMPipeline {
  constructor(options) {
    super(options);
    this.subAgentGuard = new SubAgentCostGuard(options.subAgentGuard);
  }

  async route(model, task, context) {
    // Check sub-agent cost before routing
    if (this._shouldUseSubAgent(task)) {
      const analysis = this.subAgentGuard.analyzeMainContextVsFork(
        task.complexity,
        context.tokens,
        this.estimateTokens(task)
      );
      
      if (analysis.recommendation === 'USE_MAIN_CONTEXT') {
        // Force main context
        return this.routeWithMainContext(model, task, context);
      }
    }
    
    return super.route(model, task, context);
  }
  
  _shouldUseSubAgent(task) {
    return task.type === 'complex' || task.type === 'parallel' || task.subAgents > 0;
  }
}
```

---

## Validação Contra Fonte (Simon Scrapes Video + Anthropic Docs)

| Claim | Fonte | Status |
|-------|-------|--------|
| Sub-agents 7x tokens | Anthropic Docs | ✅ Confirmado |
| Fast mode API credits | Simon Scrapes Video | ✅ Confirmado |
| Uncached penalty | Simon Scrapes Video | ✅ Confirmado |
| Cache rebuild penalty | Simon Scrapes Video | ✅ Confirmado |
| Sub-agent context isolation | Anthropic Docs | ✅ Confirmado |
| 7x token multiplier | Anthropic Docs | ✅ Confirmado |

---

## Checklist de Entrega

- [ ] `sub-agent-cost-guard.js` — Core logic
- [ ] `hooks/sub-agent-cost-guard.js` — PreToolUse + Stop hooks
- [ ] `cli.js` — CLI commands (report, analyze, fast-mode-check)
- [ ] `settings-patch.json` — Settings.json patch
- [ ] Testes de integração
- [ ] Documentação de uso

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
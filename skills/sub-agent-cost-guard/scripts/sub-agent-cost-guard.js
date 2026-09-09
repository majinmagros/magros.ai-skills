// sub-agent-cost-guard.js — Core: 7x multiplier, thresholds, main-vs-fork, fast mode, cache rebuild, report
// Extraído de SKILL.md (2026-09-09).
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

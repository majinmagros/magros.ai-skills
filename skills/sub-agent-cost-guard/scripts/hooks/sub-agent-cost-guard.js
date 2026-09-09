// hooks/sub-agent-cost-guard.js — PreToolUse (bloqueia Task caro) + Stop (relatório final)
// Extraído de SKILL.md (2026-09-09). Registrar via settings-patch.json.
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
        message: `Sub-agent would cost ${analysis.percentSavings}% more. Use main context instead.`,
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

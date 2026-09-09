#!/usr/bin/env node
// cli.js — report | analyze <task> <contextTokens> | fast-mode-check
// Extraído de SKILL.md (2026-09-09).
// Uso:
//   node sub-agent-cost-guard.js report
//   node sub-agent-cost-guard.js analyze "complex refactoring task" 50000
//   node sub-agent-cost-guard.js fast-mode-check
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

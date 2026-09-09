// templates.js — Templates prontos (ship-change, daily-triage, code + LLM as graph)
// Extraído de SKILL.md (2026-09-09) para progressive disclosure.
export const GraphTemplates = {
  // Code-as-Graph: Ship Change Workflow (do vídeo AI Jason)
  shipChange: {
    nodes: [
      { id: 'setup', type: 'script', config: { script: 'setup-environment.sh' } },
      { id: 'implement', type: 'agent', config: { task: 'Implement feature' } },
      { id: 'verify', type: 'agent', config: { task: 'Verify implementation' } },
      { id: 'test', type: 'script', config: { script: 'run-tests.sh' } },
      { id: 'pr', type: 'agent', config: { task: 'Create PR' } }
    ],
    edges: [
      { from: 'setup', to: 'implement' },
      { from: 'implement', to: 'verify' },
      { from: 'verify', to: 'test' },
      { from: 'test', to: 'pr' }
    ]
  },

  // Code-as-Graph: Daily Bad Design Triage (do vídeo AI Jason)
  dailyTriage: {
    nodes: [
      { id: 'fetch', type: 'script', config: { script: 'fetch-designs.sh' } },
      { id: 'filter', type: 'agent', config: { task: 'Filter bad designs' } },
      { id: 'evaluate', type: 'agent', config: { task: 'Evaluate designs' } },
      { id: 'rank', type: 'agent', config: { task: 'Rank worst designs' } },
      { id: 'publish', type: 'script', config: { script: 'publish-report.sh' } },
      { id: 'improve', type: 'agent', config: { task: 'Improve agent' } }
    ],
    edges: [
      { from: 'fetch', to: 'filter' },
      { from: 'filter', to: 'evaluate' },
      { from: 'evaluate', to: 'rank' },
      { from: 'rank', to: 'publish' },
      { from: 'rank', to: 'improve' }
    ]
  },

  // LLM-as-Graph: Ship Change (Skill + SOP)
  shipChangeSOP: {
    sop: 'ship-change-sop',
    variables: {
      scope: 'string',
      plan: 'string',
      repo: 'string'
    },
    steps: [
      { id: 'setup', type: 'script', script: 'setup-env.sh' },
      { id: 'grill', type: 'skill', skill: 'grilling', input: { scope: '{{variables.scope}}' } },
      { id: 'spec', type: 'skill', skill: 'to-spec', input: { decisions: '{{steps.grill.output}}' } },
      { id: 'tickets', type: 'skill', skill: 'to-tickets', input: { spec: '{{steps.spec.output}}' } },
      { id: 'implement', type: 'skill', skill: 'implement', input: { tickets: '{{steps.tickets.output}}' } },
      { id: 'verify', type: 'skill', skill: 'verify', input: { implementation: '{{steps.implement.output}}' } },
      { id: 'pr', type: 'skill', skill: 'create-pr', input: { changes: '{{steps.verify.output}}' } }
    ]
  },

  // LLM-as-Graph: Daily Bad Design Triage
  dailyTriageSOP: {
    sop: 'daily-triage-sop',
    steps: [
      { id: 'fetch', type: 'script', script: 'fetch-designs.py' },
      { id: 'heuristic-filter', type: 'script', script: 'heuristic-filter.py' },
      { id: 'vision-eval', type: 'parallel', branches: [
        { nodeId: 'eval-1', input: { batch: '{{steps.heuristic-filter.output.batch1}}' } },
        { nodeId: 'eval-2', input: { batch: '{{steps.heuristic-filter.output.batch2}}' } }
      ]},
      { id: 'rank', type: 'skill', skill: 'rank-designs', input: { evaluations: '{{steps.vision-eval.output}}' } },
      { id: 'report', type: 'script', script: 'generate-report.py' },
      { id: 'improve', type: 'skill', skill: 'improve-agent', input: { worst: '{{steps.rank.output.worst}}' } }
    ]
  }
};

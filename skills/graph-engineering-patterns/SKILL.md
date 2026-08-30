---
name: graph-engineering-patterns
description: |
  Templates unificados para Graph Engineering: code-as-graph (dynamic workflow) + LLM-as-graph (skill + SOP + scripts). I/O schemas, state management, verifier/planner separation. Baseado no vídeo do AI Jason "I don't prompt agents anymore..." e práticas de engenharia de grafos.
  Use quando: "graph engineering patterns", "code as graph", "llm as graph", "dynamic workflow templates", "llm as graph templates", "graph engineering templates".
  Não use para: orchestration runtime (use orchestration skills), basic workflow (use routines).
  Outcome: Biblioteca de templates para code-as-graph (dynamic workflow) + LLM-as-graph (skill + SOP + scripts) com I/O schemas, state management, verifier/planner separation.
metadata:
  origin: AUTORAL
  source_docs:
    - https://www.youtube.com/watch?v=_9OT25ZvrWs (AI Jason video)
    - https://github.com/anthropics/claude-code/tree/main/docs/dynamic-workflow
    - https://docs.anthropic.com/en/docs/claude-code/hooks
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: [hooks, commands]
---

# Graph Engineering Patterns — Templates Unificados para Graph Engineering

Biblioteca de **templates unificados** para Graph Engineering: **code-as-graph** (dynamic workflow) + **LLM-as-graph** (skill + SOP + scripts). I/O schemas, state management, verifier/planner separation.

## Quando usar (gatilhos concretos)

- "Graph engineering patterns"
- "Code as graph templates"
- "LLM as graph patterns"
- "Dynamic workflow templates"
- "LLM as graph templates"
- "Graph engineering templates"

## Quando NÃO usar

- Orchestration runtime → use `orchestration` skills
- Basic workflow → use `routines`
- Simple orchestration → use `agent-harness-construction`

## Core: Dual Approach

### 1. Code-as-Graph (Dynamic Workflow)

```javascript
// code-as-graph.js — Code-as-Graph usando Dynamic Workflow (Claude Code)
import { spawn } from 'child_process';
import { EventEmitter } from 'events';

export class CodeAsGraph extends EventEmitter {
  constructor(options = {}) {
    super();
    this.nodes = new Map();
    this.edges = new Map();
    this.state = new Map();
    this.checkpoints = new Map();
  }

  // Define um nó no grafo
  addNode(id, config) {
    const node = {
      id,
      type: config.type, // 'agent', 'script', 'tool', 'decision', 'parallel', 'loop'
      config: config.config || {},
      inputSchema: config.inputSchema || {},
      outputSchema: config.outputSchema || {},
      retries: config.retries || 3,
      timeout: config.timeout || 300000,
      fallback: config.fallback,
      onSuccess: config.onSuccess,
      onFailure: config.onFailure
    };
    this.nodes.set(id, node);
    return this;
  }

  // Define arestas (dependências)
  addEdge(from, to, condition = null) {
    if (!this.edges.has(from)) this.edges.set(from, []);
    this.edges.get(from).push({ to, condition });
    return this;
  }

  // Executa o grafo
  async execute(initialState = {}) {
    this.state = new Map(Object.entries(initialState));
    const executionOrder = this._topologicalSort();
    const results = {};

    for (const nodeId of executionOrder) {
      const node = this.nodes.get(nodeId);
      const input = this._gatherInput(nodeId);
      
      // Valida input
      if (!this._validateInput(node, input)) {
        throw new Error(`Invalid input for node ${nodeId}`);
      }

      // Executa nó
      const result = await this._executeNode(node, input);
      results[nodeId] = result;
      this.state.set(nodeId, result);
      
      this.emit('nodeComplete', { nodeId, result });
    }

    return results;
  }

  // Parallel execution para nós independentes
  async executeParallel(nodeIds, input) {
    const promises = nodeIds.map(id => this._executeNode(this.nodes.get(id), input));
    return Promise.all(promises);
  }

  // Loop com condição
  addLoop(nodeId, condition, maxIterations = 100) {
    this.nodes.get(nodeId).loop = { condition, maxIterations, current: 0 };
  }

  _topologicalSort() {
    const visited = new Set();
    const temp = new Set();
    const order = [];

    const visit = (nodeId) => {
      if (temp.has(nodeId)) throw new Error(`Cycle detected at ${nodeId}`);
      if (visited.has(nodeId)) return;
      
      temp.add(nodeId);
      const edges = this.edges.get(nodeId) || [];
      edges.forEach(edge => visit(edge.to));
      temp.delete(nodeId);
      visited.add(nodeId);
      order.push(nodeId);
    };

    this.nodes.forEach((_, nodeId) => visit(nodeId));
    return order;
  }

  _gatherInput(nodeId) {
    const edges = [...this.edges.entries()]
      .filter(([_, edges]) => edges.some(e => e.to === nodeId))
      .map(([from]) => this.state.get(from));
    return Object.assign({}, ...edges.map((_, i) => this.state.get(this._getPredecessors(nodeId)[i])));
  }

  _getPredecessors(nodeId) {
    return [...this.edges.entries()]
      .filter(([_, edges]) => edges.some(e => e.to === nodeId))
      .map(([from]) => from);
  }

  _validateInput(node, input) {
    // Validate against inputSchema
    return true; // Simplified
  }

  async _executeNode(node, input) {
    switch (node.type) {
      case 'agent':
        return this._runAgent(node, input);
      case 'script':
        return this._runScript(node, input);
      case 'tool':
        return this._callTool(node, input);
      case 'decision':
        return this._evaluateDecision(node, input);
      case 'parallel':
        return this._executeParallel(node, input);
      case 'loop':
        return this._executeLoop(node, input);
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  async _runAgent(node, input) {
    // Spawn sub-agent
    const prompt = this._buildPrompt(node.config, input);
    // Implementation depends on harness
  }

  _runScript(node, input) {
    // Execute script
  }

  _callTool(node, input) {
    // Call tool
  }

  _evaluateDecision(node, input) {
    // Evaluate condition
  }

  _executeParallel(node, input) {
    // Execute parallel branches
  }

  _executeLoop(node, input) {
    // Execute loop
  }
}
```

### 2. LLM-as-Graph (Skill + SOP + Scripts)

```javascript
// llm-as-graph.js — LLM-as-Graph usando Skills + SOP + Scripts
import { ConfigConstants } from '../threejs-config-constants/config-constants.js';

export class LLMAsGraph {
  constructor(options = {}) {
    this.skills = new Map();
    this.sopTemplates = new Map();
    this.scripts = new Map();
    this.stateStore = new Map();
    this.config = ConfigConstants.createThreeJSDefaults();
  }

  // Registra uma skill
  registerSkill(name, skill) {
    this.skills.set(name, {
      name,
      description: skill.description,
      triggers: skill.triggers || [],
      inputSchema: skill.inputSchema || {},
      outputSchema: skill.outputSchema || {},
      steps: skill.steps || [],
      tools: skill.tools || [],
      references: skill.references || [],
      scripts: skill.scripts || []
    });
  }

  // Registra SOP template
  registerSOP(name, template) {
    this.sopTemplates.set(name, {
      name,
      description: template.description,
      steps: template.steps || [],
      variables: template.variables || {},
      decisionPoints: template.decisionPoints || [],
      outputFormat: template.outputFormat
    });
  }

  // Registra script determinístico
  registerScript(name, script) {
    this.scripts.set(name, {
      name,
      description: script.description,
      execute: script.execute,
      schema: script.schema,
      timeout: script.timeout || 30000
    });
  }

  // Executa um nó LLM-as-Graph
  async executeNode(nodeId, input) {
    const node = this.nodes.get(nodeId);
    if (!node) throw new Error(`Node not found: ${nodeId}`);

    // 1. Resolve SOP template se especificado
    let sop = null;
    if (node.sop) {
      sop = this.sopTemplates.get(node.sop);
      if (!sop) throw new Error(`SOP not found: ${node.sop}`);
    }

    // 2. Prepara contexto
    const context = {
      input,
      state: this.stateStore,
      skills: this.skills,
      scripts: this.scripts,
      config: this.config
    };

    // 3. Executa steps do SOP
    if (sop) {
      for (const step of sop.steps) {
        const result = await this._executeStep(step, context);
        context.state.set(step.id, result);
      }
    }

    // 3. Executa skill steps se não há SOP
    if (node.steps) {
      for (const step of node.steps) {
        const result = await this._executeSkillStep(step, context);
        context.state.set(step.id, result);
      }
    }

    // 4. Executa scripts determinísticos
    if (node.scripts) {
      for (const scriptName of node.scripts) {
        const script = this.scripts.get(scriptName);
        if (script) {
          await script.execute(context);
        }
      }
    }

    // 4. Valida output
    if (node.outputSchema) {
      this._validateOutput(node.outputSchema, context.state.get(node.id));
    }

    return context.state.get(node.id);
  }

  _executeStep(step, context) {
    // Executa um step do SOP
    if (step.type === 'skill') {
      return this._invokeSkill(step.skill, step.input, context);
    }
    if (step.type === 'script') {
      return this.scripts.get(step.script)?.execute(context);
    }
    if (step.type === 'decision') {
      return this._evaluateDecision(step.condition, context);
    }
    if (step.type === 'parallel') {
      return Promise.all(step.branches.map(b => this.executeNode(b, context)));
    }
    if (step.type === 'loop') {
      return this._executeLoop(step, context);
    }
  }

  _executeSkillStep(step, context) {
    const skill = this.skills.get(step.skill);
    if (!skill) throw new Error(`Skill not found: ${step.skill}`);
    
    // Execute skill steps
    return skill.steps.reduce(async (acc, step) => {
      const accResult = await acc;
      return this._executeSkillStep(step, { ...context, input: accResult });
    }, Promise.resolve({}));
  }

  _invokeSkill(skillName, input, context) {
    const skill = this.skills.get(skillName);
    if (!skill) throw new Error(`Skill not found: ${skillName}`);
    return skill.steps.reduce(async (acc, step) => {
      const accResult = await acc;
      return this._executeSkillStep(step, { ...context, input: accResult });
    }, Promise.resolve(input));
  }

  _executeSkillStep(step, context) {
    // Execute single step
  }

  _evaluateDecision(condition, context) {
    // Evaluate decision condition
  }

  _executeLoop(step, context) {
    // Execute loop
  }

  _validateOutput(schema, output) {
    // Validate output against schema
  }
}
```

### 3. State Management & I/O Schemas

```javascript
// state-management.js
import { ConfigConstants } from '../threejs-config-constants/config-constants.js';

export class GraphStateManager {
  constructor() {
    this.states = new Map(); // nodeId -> state
    this.globalState = new Map();
    this.history = [];
    this.schemas = new Map();
  }

  // Define I/O schema para um nó
  defineSchema(nodeId, schema) {
    this.schemas.set(nodeId, {
      input: schema.input || {},
      output: schema.output || {},
      state: schema.state || {}
    });
  }

  // Set state with validation
  setState(nodeId, state) {
    const schema = this.schemas.get(nodeId);
    if (schema?.state) {
      // Validate state against schema
    }
    this.states.set(nodeId, state);
    this.history.push({ nodeId, state, timestamp: Date.now() });
  }

  getState(nodeId) {
    return this.states.get(nodeId);
  }

  // Global state access
  setGlobal(key, value) {
    this.globalState.set(key, value);
  }

  getGlobal(key) {
    return this.globalState.get(key);
  }

  // Snapshot & restore
  snapshot() {
    return {
      states: new Map(this.states),
      globalState: new Map(this.globalState),
      timestamp: Date.now()
    };
  }

  restore(snapshot) {
    this.states = new Map(snapshot.states);
    this.globalState = new Map(snapshot.globalState);
  }

  // Persistence
  saveToFile(path) {
    const data = {
      states: Object.fromEntries(this.states),
      globalState: Object.fromEntries(this.globalState),
      history: this.history
    };
    return JSON.stringify(data, null, 2);
  }

  loadFromFile(json) {
    const data = JSON.parse(json);
    this.states = new Map(Object.entries(data.states || {}));
    this.globalState = new Map(Object.entries(data.globalState || {}));
    this.history = data.history || [];
  }
}
```

### 4. Verifier/Planner Separation

```javascript
// verifier-planner.js
export class VerifierPlanner {
  constructor(graph, stateManager) {
    this.graph = graph;
    this.stateManager = stateManager;
    this.verifiers = new Map();
    this.planners = new Map();
  }

  // Registra um verifier
  registerVerifier(name, verifier) {
    this.verifiers.set(name, {
      name,
      validate: verifier.validate,
      schema: verifier.schema,
      severity: verifier.severity || 'error' // 'error' | 'warning' | 'info'
    });
  }

  // Registra um planner
  registerPlanner(name, planner) {
    this.planners.set(name, {
      name,
      plan: planner.plan,
      estimate: planner.estimate,
      optimize: planner.optimize
    });
  }

  // Executa verificação
  async verify(nodeId, output) {
    const results = [];
    
    for (const [name, verifier] of this.verifiers) {
      const result = await verifier.validate(output, this.stateManager.getState(nodeId));
      results.push({ verifier: name, ...result });
      
      if (!result.valid && verifier.severity === 'error') {
        throw new Error(`Verification failed: ${name} - ${result.message}`);
      }
    }
    
    return results;
  }

  // Executa planejamento
  async plan(goal, context = {}) {
    // Seleciona planner apropriado
    const planner = this._selectPlanner(goal);
    
    const plan = await planner.plan({
      goal,
      context,
      currentState: this.stateManager.globalState,
      graph: this.graph
    });
    
    // Valida plano
    await this.verify('plan', plan);
    
    return plan;
  }

  _selectPlanner(goal) {
    // Lógica para selecionar planner baseado no goal
    return this.planners.get('default') || this.planners.values().next().value;
  }

  // Verificadores padrão
  static createDefaultVerifiers() {
    return {
      'output-schema': {
        validate: async (output, schema) => {
          // Validate output against schema
          return { valid: true };
        }
      },
      'no-hallucination': {
        validate: async (output) => {
          // Check for hallucination markers
          const hallucinationPatterns = [
            'as an ai language model',
            'i cannot',
            'i don\'t have access',
            'as of my knowledge cutoff'
          ];
          const text = JSON.stringify(output).toLowerCase();
          const found = hallucinationPatterns.filter(p => text.includes(p));
          return { 
            valid: found.length === 0, 
            message: found.length > 0 ? `Hallucination detected: ${found.join(', ')}` : null
          };
        }
      },
      'completeness': {
        validate: async (output, schema) => {
          // Check required fields
          if (!schema?.required) return { valid: true };
          const missing = schema.required.filter(f => !(f in output));
          return { 
            valid: missing.length === 0, 
            message: missing.length > 0 ? `Missing fields: ${missing.join(', ')}` : null
          };
        }
      }
    };
  }
}
```

## I/O Schemas & Contracts

```javascript
// io-schemas.js
export const IOSchemas = {
  // Code-as-Graph node schemas
  agentNode: {
    input: {
      type: 'object',
      properties: {
        task: { type: 'string' },
        context: { type: 'object' },
        tools: { type: 'array', items: { type: 'string' } },
        maxTokens: { type: 'number' }
      },
      required: ['task']
    },
    output: {
      type: 'object',
      properties: {
        result: { type: 'string' },
        artifacts: { type: 'array' },
        tokensUsed: { type: 'number' },
        success: { type: 'boolean' }
      },
      required: ['result', 'success']
    }
  },

  scriptNode: {
    input: {
      type: 'object',
      properties: {
        script: { type: 'string' },
        args: { type: 'object' },
        env: { type: 'object' }
      },
      required: ['script']
    },
    output: {
      type: 'object',
      properties: {
        stdout: { type: 'string' },
        stderr: { type: 'string' },
        exitCode: { type: 'number' },
        artifacts: { type: 'array' }
      },
      required: ['exitCode']
    }
  },

  decisionNode: {
    input: {
      type: 'object',
      properties: {
        condition: { type: 'string' },
        context: { type: 'object' }
      },
      required: ['condition']
    },
    output: {
      type: 'object',
      properties: {
        decision: { type: 'boolean' },
        reason: { type: 'string' }
      },
      required: ['decision']
    }
  },

  parallelNode: {
    input: {
      type: 'object',
      properties: {
        branches: { 
          type: 'array', 
          items: { 
            type: 'object',
            properties: {
              nodeId: { type: 'string' },
              input: { type: 'object' }
            }
          }
        }
      },
      required: ['branches']
    },
    output: {
      type: 'object',
      properties: {
        results: { type: 'array' }
      },
      required: ['results']
    }
  },

  // LLM-as-Graph schemas
  skillInvocation: {
    input: {
      type: 'object',
      properties: {
        skill: { type: 'string' },
        input: { type: 'object' },
        context: { type: 'object' }
      },
      required: ['skill', 'input']
    },
    output: {
      type: 'object',
      properties: {
        result: {},
        artifacts: { type: 'array' },
        stateChanges: { type: 'object' }
      }
    }
  },

  sopExecution: {
    input: {
      type: 'object',
      properties: {
        sop: { type: 'string' },
        variables: { type: 'object' },
        context: { type: 'object' }
      },
      required: ['sop', 'variables']
    },
    output: {
      type: 'object',
      properties: {
        steps: { type: 'array' },
        finalState: { type: 'object' },
        decisions: { type: 'array' }
      },
      required: ['steps', 'finalState']
    }
  }
};
```

## Templates Prontos

```javascript
// templates.js
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
```

---

## Referências Oficiais (Validados 2026-08-30)

- [AI Jason Video: "I don't prompt agents anymore..."](https://www.youtube.com/watch?v=_9OT25ZvrWs)
- [Claude Code Dynamic Workflow](https://docs.anthropic.com/en/docs/claude-code/dynamic-workflow)
- [Claude Code Hooks](https://docs.anthropic.com/en/docs/claude-code/hooks)
- [Anthropic: Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)

---

## Checklist de Entrega

- [ ] `code-as-graph.js` — Code-as-Graph engine
- [ ] `llm-as-graph.js` — LLM-as-Graph engine
- [ ] `state-management.js` — State management + I/O schemas
- [ ] `verifier-planner.js` — Verifier/Planner separation
- [ ] `io-schemas.js` — I/O schemas para todos node types
- [ ] `templates.js` — Templates prontos (ship-change, daily-triage, etc.)
- [ ] `verifier-planner.js` — Verifier/Planner separation
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
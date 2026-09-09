// code-as-graph.js — Code-as-Graph usando Dynamic Workflow (Claude Code)
// Extraído de SKILL.md (2026-09-09) para progressive disclosure.
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

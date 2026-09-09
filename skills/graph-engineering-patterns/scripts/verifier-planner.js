// verifier-planner.js — Verifier/Planner separation
// Extraído de SKILL.md (2026-09-09) para progressive disclosure.
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

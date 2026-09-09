// llm-as-graph.js — LLM-as-Graph usando Skills + SOP + Scripts
// Extraído de SKILL.md (2026-09-09) para progressive disclosure.
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

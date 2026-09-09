// state-management.js — State management + I/O schemas
// Extraído de SKILL.md (2026-09-09) para progressive disclosure.
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

// io-schemas.js — I/O schemas para todos os node types
// Extraído de SKILL.md (2026-09-09) para progressive disclosure.
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

# Integration — CostAwarePipeline com SubAgentGuard

```javascript
// Integração com cost-aware-llm-pipeline
import { CostAwareLLMPipeline } from '../cost-aware-llm-pipeline/cost-aware-llm-pipeline.js';
import { SubAgentCostGuard } from './sub-agent-cost-guard.js';

export class CostAwarePipelineWithSubAgentGuard extends CostAwareLLMPipeline {
  constructor(options) {
    super(options);
    this.subAgentGuard = new SubAgentCostGuard(options.subAgentGuard);
  }

  async route(model, task, context) {
    // Check sub-agent cost before routing
    if (this._shouldUseSubAgent(task)) {
      const analysis = this.subAgentGuard.analyzeMainContextVsFork(
        task.complexity,
        context.tokens,
        this.estimateTokens(task)
      );

      if (analysis.recommendation === 'USE_MAIN_CONTEXT') {
        // Force main context
        return this.routeWithMainContext(model, task, context);
      }
    }

    return super.route(model, task, context);
  }

  _shouldUseSubAgent(task) {
    return task.type === 'complex' || task.type === 'parallel' || task.subAgents > 0;
  }
}
```

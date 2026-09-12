# Evolution, Configuration, Anti-Patterns, Results

## Evolution Across Model Capabilities

The harness should simplify as models improve. Following Anthropic's evolution:

### Stage 1 — Weaker Models (Sonnet-class)
- Full sprint decomposition required
- Context resets between sprints (avoid context anxiety)
- 2-agent minimum: Initializer + Coding Agent
- Heavy scaffolding compensates for model limitations

### Stage 2 — Capable Models (Opus 4.5-class)
- Full 3-agent harness: Planner + Generator + Evaluator
- Sprint contracts before each implementation phase
- 10-sprint decomposition for complex apps
- Context resets still useful but less critical

### Stage 3 — Frontier Models (Opus 4.6-class)
- Simplified harness: single planning pass, continuous generation
- Evaluation reduced to single end-pass (model is smarter)
- No sprint structure needed
- Automatic compaction handles context growth

> **Key principle:** Every harness component encodes an assumption about what the model can't do alone. When models improve, re-test those assumptions. Strip away what's no longer needed.

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `GAN_MAX_ITERATIONS` | `15` | Maximum generator-evaluator cycles |
| `GAN_PASS_THRESHOLD` | `7.0` | Weighted score to pass (1-10) |
| `GAN_PLANNER_MODEL` | `sonnet` | Model for planning agent |
| `GAN_GENERATOR_MODEL` | `sonnet` | Model for generator agent |
| `GAN_EVALUATOR_MODEL` | `sonnet` | Model for evaluator agent |
| `GAN_EVAL_CRITERIA` | `design,originality,craft,functionality` | Comma-separated criteria |
| `GAN_DEV_SERVER_PORT` | `3000` | Port for the live app |
| `GAN_DEV_SERVER_CMD` | `npm run dev` | Command to start dev server |
| `GAN_PROJECT_DIR` | `.` | Project working directory |
| `GAN_SKIP_PLANNER` | `false` | Skip planner, use spec directly |
| `GAN_EVAL_MODE` | `playwright` | `playwright`, `screenshot`, or `code-only` |

### Evaluation Modes

| Mode | Tools | Best For |
|------|-------|----------|
| `playwright` | Browser MCP + live interaction | Full-stack apps with UI |
| `screenshot` | Screenshot + visual analysis | Static sites, design-only |
| `code-only` | Tests + linting + build | APIs, libraries, CLI tools |

## Anti-Patterns

1. **Evaluator too lenient** — If the evaluator passes everything on iteration 1, your rubric is too generous. Tighten scoring criteria and add explicit penalties for common AI patterns.

2. **Generator ignoring feedback** — Ensure feedback is passed as a file, not inline. The generator should read `feedback-NNN.md` at the start of each iteration.

3. **Infinite loops** — Always set `GAN_MAX_ITERATIONS`. If the generator can't improve past a score plateau after 3 iterations, stop and flag for human review.

4. **Evaluator testing superficially** — The evaluator must use Playwright to **interact** with the live app, not just screenshot it. Click buttons, fill forms, test error states.

5. **Evaluator praising its own fixes** — Never let the evaluator suggest fixes and then evaluate those fixes. The evaluator only critiques; the generator fixes.

6. **Context exhaustion** — For long sessions, use Claude Agent SDK's automatic compaction or reset context between major phases.

## Results: What to Expect

Based on Anthropic's published results:

| Metric | Solo Agent | GAN Harness | Improvement |
|--------|-----------|-------------|-------------|
| Time | 20 min | 4-6 hours | 12-18x longer |
| Cost | $9 | $125-200 | 14-22x more |
| Quality | Barely functional | Production-ready | Phase change |
| Core features | Broken | All working | N/A |
| Design | Generic AI slop | Distinctive, polished | N/A |

**The tradeoff is clear:** ~20x more time and cost for a qualitative leap in output quality. This is for projects where quality matters.

## References

- [Anthropic: Harness Design for Long-Running Apps](https://www.anthropic.com/engineering/harness-design-long-running-apps) — Original paper by Prithvi Rajasekaran
- [Epsilla: The GAN-Style Agent Loop](https://www.epsilla.com/blogs/anthropic-harness-engineering-multi-agent-gan-architecture) — Architecture deconstruction
- [Martin Fowler: Harness Engineering](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html) — Broader industry context
- [OpenAI: Harness Engineering](https://openai.com/index/harness-engineering/) — OpenAI's parallel work

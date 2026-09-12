# The 12-Layer Stack

Every agent system has these layers. Any of them can corrupt the answer:

| # | Layer | What Goes Wrong |
|---|-------|----------------|
| 1 | System prompt | Conflicting instructions, instruction bloat |
| 2 | Session history | Stale context injection from previous turns |
| 3 | Long-term memory | Pollution across sessions, old topics in new conversations |
| 4 | Distillation | Compressed artifacts re-entering as pseudo-facts |
| 5 | Active recall | Redundant re-summary layers wasting context |
| 6 | Tool selection | Wrong tool routing, model skips required tools |
| 7 | Tool execution | Hallucinated execution — claims to call but doesn't |
| 8 | Tool interpretation | Misread or ignored tool output |
| 9 | Answer shaping | Format corruption in final response |
| 10 | Platform rendering | Transport-layer mutation (UI, API, CLI mutates valid answers) |
| 11 | Hidden repair loops | Silent fallback/retry agents running second LLM pass |
| 12 | Persistence | Expired state or cached artifacts reused as live evidence |

# Common Failure Patterns

## 1. Wrapper Regression

The base model produces correct answers, but the wrapper layers make it worse.

**Symptoms:**

- Model works fine in playground or direct API call, breaks in your agent
- Added a new prompt layer, existing behavior degraded
- Agent sounds confident but is confidently wrong
- "It was working before the last update"

## 2. Memory Contamination

Old topics leak into new conversations through history, memory retrieval, or distillation.

**Symptoms:**

- Agent brings up unrelated past topics
- User corrections don't stick (old memory overwrites new)
- Same-session artifacts re-enter as pseudo-facts
- Memory grows without bound, degrading response quality over time

## 3. Tool Discipline Failure

Tools are declared in the prompt but not enforced in code. The model skips them or hallucinates execution.

**Symptoms:**

- "Must use tool X" in prompt, but model answers without calling it
- Tool results look correct but were never actually executed
- Different tools fight over the same responsibility
- Model uses tool when it shouldn't, or skips it when it must

## 4. Rendering/Transport Corruption

The agent's internal answer is correct, but the platform layer mutates it during delivery.

**Symptoms:**

- Logs show correct answer, user sees broken output
- Markdown rendering, JSON parsing, or streaming fragments corrupt valid responses
- Hidden fallback agent quietly replaces the answer before delivery
- Output differs between terminal and UI

## 5. Hidden Agent Layers

Silent repair, retry, summarization, or recall agents run without explicit contracts.

**Symptoms:**

- Output changes between internal generation and user delivery
- "Auto-fix" loops run a second LLM pass the user doesn't know about
- Multiple agents modify the same output without coordination
- Answers get "smoothed" or "corrected" by invisible layers

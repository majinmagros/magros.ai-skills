# The Three Agents

## Architecture

```
                    ┌─────────────┐
                    │   PLANNER   │
                    │  (Sonnet)   │
                    └──────┬──────┘
                           │ Product Spec
                           │ (features, sprints, design direction)
                           ▼
              ┌────────────────────────┐
              │                        │
              │   GENERATOR-EVALUATOR  │
              │      FEEDBACK LOOP     │
              │                        │
              │  ┌──────────┐          │
              │  │GENERATOR │--build-->│──┐
              │  │ (Sonnet) │          │  │
              │  └────▲─────┘          │  │
              │       │                │  │ live app
              │    feedback             │  │
              │       │                │  │
              │  ┌────┴─────┐          │  │
              │  │EVALUATOR │<-test----│──┘
              │  │ (Sonnet) │          │
              │  │+Playwright│         │
              │  └──────────┘          │
              │                        │
              │   5-15 iterations      │
              └────────────────────────┘
```

## 1. Planner Agent

**Role:** Product manager — expands a brief prompt into a full product specification.

**Key behaviors:**
- Takes a one-line prompt and produces a 16-feature, multi-sprint specification
- Defines user stories, technical requirements, and visual design direction
- Is deliberately **ambitious** — conservative planning leads to underwhelming results
- Produces evaluation criteria that the Evaluator will use later

**Model:** Sonnet by default; raise via `GAN_PLANNER_MODEL=opus` for deeper spec expansion

## 2. Generator Agent

**Role:** Developer — implements features according to the spec.

**Key behaviors:**
- Works in structured sprints (or continuous mode with newer models)
- Negotiates a "sprint contract" with the Evaluator before writing code
- Uses full-stack tooling: React, FastAPI/Express, databases, CSS
- Manages git for version control between iterations
- Reads Evaluator feedback and incorporates it in next iteration

**Model:** Sonnet by default; raise via `GAN_GENERATOR_MODEL=opus` for maximum coding capability

## 3. Evaluator Agent

**Role:** QA engineer — tests the live running application, not just code.

**Key behaviors:**
- Uses **Playwright MCP** to interact with the live application
- Clicks through features, fills forms, tests API endpoints
- Scores against four criteria (see `rubric.md`)
- Returns structured feedback with scores and specific issues
- Is engineered to be **ruthlessly strict** — never praises mediocre work

**Model:** Sonnet by default; raise via `GAN_EVALUATOR_MODEL=opus` for stronger judgment + tool use

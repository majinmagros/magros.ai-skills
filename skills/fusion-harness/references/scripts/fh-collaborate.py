#!/usr/bin/env python3
""" /fh collaborate <goal> — Architect plans, builders execute, architect integrates """
import asyncio, json, sys, subprocess
from pathlib import Path

async def main():
    goal = " ".join(sys.argv[1:])
    stack = load_model_stack()
    architect = next(m for m in stack.models if "architect" in m.role)
    builders = [m for m in stack.models if "builder" in m.role]

    # 1. ARCHITECT: Generate plan with task breakdown
    plan_prompt = f"""
    Goal: {goal}
    Available builders: {[m.alias for m in builders]}
    Create a task plan with:
    - Tasks (T1, T2, T3...)
    - Dependencies (T2 depends on T1)
    - Owner (which builder alias)
    - Mode (code/research/verify)
    - Risk analysis
    Output as JSON.
    """
    plan = await query_model(architect.alias, architect.id, plan_prompt)
    tasks = parse_plan(plan.response)

    # 2. BUILDERS: Execute assigned tasks in parallel per dependency level
    completed = {}
    for level in topological_sort(tasks):
        level_tasks = [t for t in tasks if t.level == level]
        results = await asyncio.gather(*[
            execute_task(t, completed, builders) for t in level_tasks
        ])
        for t, result in zip(level_tasks, results):
            completed[t.id] = result
            print(f"✅ {t.id} ({t.owner}): {result.summary}")

    # 3. ARCHITECT: Final integration + validation
    integration_prompt = f"""
    Goal: {goal}
    Completed tasks: {json.dumps(completed, indent=2)}
    Integrate all outputs, validate, produce final deliverable.
    """
    final = await query_model(architect.alias, architect.id, integration_prompt)
    print(f"\nFINAL INTEGRATION:\n{final.response}")

    # Save state
    save_state(goal, tasks, completed, final.response)

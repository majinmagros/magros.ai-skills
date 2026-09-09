# task_execution.py — Decompose, checkpoints, parallel execution
# Extraído de SKILL.md (2026-09-09).


class TaskExecutionPatterns:
    @staticmethod
    def decompose_task(task: str) -> list:
        """Decompõe tarefa complexa em subtarefas atômicas."""
        # Use LLM para decompor
        prompt = f"""
        Decomponha esta tarefa em subtarefas atômicas:
        {task}

        Retorne lista de subtarefas atômicas, cada uma executável independentemente.
        """
        # ... LLM call
        return subtasks

    @staticmethod
    def execute_with_checkpoints(task: str, checkpoints: list) -> dict:
        """Executa tarefa com checkpoints de validação."""
        results = {}
        for checkpoint in checkpoints:
            result = execute_subtask(checkpoint)
            if not validate(checkpoint, result):
                raise Exception(f"Checkpoint failed: {checkpoint}")
            results[checkpoint] = result
        return results

    @staticmethod
    def parallel_execution(tasks: list, max_parallel: int = 3) -> list:
        """Executa tarefas independentes em paralelo."""
        import asyncio
        semaphore = asyncio.Semaphore(3)

        async def limited_task(task):
            async with semaphore:
                return await execute_task(task)

        return asyncio.gather(*[limited_task(t) for t in tasks])

# recurring_tasks.py — Cron-like scheduler em background thread
# Extraído de SKILL.md (2026-09-09).


class RecurringTaskPatterns:
    def __init__(self):
        self.tasks = {}
        self.scheduler = None

    def add_recurring_task(self, name: str, schedule: str, func: callable,
                           args: tuple = (), kwargs: dict = None) -> str:
        """Adiciona tarefa recorrente (cron-like)."""
        import schedule

        job = schedule.every().day.at("09:00").do(func, *args, **kwargs)
        # ou schedule.every().monday.at("10:00").do(...)
        # schedule.every().hour.do(...)

        task_id = f"task_{len(self.tasks)}"
        self.tasks[task_id] = {
            "name": name,
            "schedule": schedule,
            "func": func,
            "args": args,
            "kwargs": kwargs or {},
            "job": job
        }
        return task_id

    def start_scheduler(self):
        """Inicia scheduler em background."""
        import threading
        import time

        def run_scheduler():
            while True:
                schedule.run_pending()
                time.sleep(60)

        self.scheduler = threading.Thread(target=run_scheduler, daemon=True)
        self.scheduler.start()

    def stop_scheduler(self):
        if self.scheduler:
            self.scheduler.join(timeout=5)

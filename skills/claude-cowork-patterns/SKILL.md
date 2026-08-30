---
name: claude-cowork-patterns
description: |
  Cowork patterns: task execution, file ops, folder processing, recurring tasks. Baseado no vídeo da Luciana Papini "Me de 34 minutos e eu te darei 10 000 horas de conhecimento do Claude".
  Use quando: "claude cowork patterns", "cowork patterns claude", "task execution patterns", "file operations patterns", "folder processing patterns", "recurring tasks claude". Non-triggers: automação apenas API, automação desktop-only.
  Outcome: Padrões Cowork: task execution, file ops, folder processing, recurring tasks, approval gates.
metadata:
  origin: AUTORAL
  source_docs:
    - https://www.youtube.com/watch?v=Bezlzmti6_U (Luciana Papini video)
    - https://docs.anthropic.com/en/docs/claude-code/cowork
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: [hooks, commands]
---

# Claude Cowork Patterns - Padrões Cowork

Padrões Cowork: **task execution, file ops, folder processing, recurring tasks, approval gates**.

## Quando usar (gatilhos concretos)

- "Cowork task execution patterns"
- "File operations patterns"
- "Folder processing patterns"
- "Recurring tasks patterns"
- "Approval gates patterns"

## Quando NÃO usar

- Automação apenas API (use `api-connector-builder`)
- Automação desktop-only (use `automacao-deterministica`)
- Automação mobile-only

## Core Patterns

### 1. Task Execution Patterns

```python
# task_execution.py
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
```

### 2. File Operations Patterns

```python
# file_operations.py
class FileOperationPatterns:
    @staticmethod
    def safe_read(filepath: str, encoding: str = "utf-8") -> str:
        """Leitura segura com validação."""
        path = Path(filepath)
        if not path.exists():
            raise FileNotFoundError(f"File not found: {filepath}")
        if path.stat().st_size > 10_000_000:  # 10MB
            raise ValueError("File too large for safe read")
        return path.read_text(encoding=encoding)
    
    @staticmethod
    def safe_write(filepath: str, content: str, backup: bool = True) -> bool:
        """Escrita segura com backup automático."""
        path = Path(filepath)
        if backup and path.exists():
            backup_path = path.with_suffix(path.suffix + ".bak." + datetime.now().isoformat())
            shutil.copy2(filepath, backup_path)
        
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        return True
    
    @staticmethod
    def atomic_write(filepath: str, content: str) -> bool:
        """Escrita atômica (write to temp + rename)."""
        path = Path(filepath)
        temp_path = path.with_suffix(path.suffix + ".tmp")
        temp_path.write_text(content, encoding="utf-8")
        temp_path.replace(filepath)
        return True
    
    @staticmethod
    def organize_downloads(download_dir: str, rules: dict) -> int:
        """Organiza downloads baseando-se em regras."""
        count = 0
        for file in Path(download_dir).iterdir():
            for pattern, target_dir in rules.items():
                if re.match(pattern, file.name):
                    target = Path(target_dir)
                    target.mkdir(parents=True, exist_ok=True)
                    shutil.move(str(file), target / file.name)
                    count += 1
                    break
        return count
```

### 3. Folder Processing Patterns

```python
# folder_processing.py
class FolderProcessingPatterns:
    @staticmethod
    def process_folder_recursive(root: str, processor: callable, 
                                 pattern: str = "*", max_depth: int = None) -> dict:
        """Processa pasta recursivamente com processador customizado."""
        results = {"processed": 0, "errors": [], "skipped": 0}
        
        for root, dirs, files in os.walk(root):
            if max_depth is not None:
                depth = root.count(os.sep) - root.count(os.sep)
                if depth >= max_depth:
                    dirs.clear()  # Don't recurse deeper
            
            for file in files:
                if fnmatch.fnmatch(file, pattern):
                    filepath = os.path.join(root, file)
                    try:
                        result = processor(filepath)
                        results["processed"] += 1
                    except Exception as e:
                        results["errors"].append({"file": filepath, "error": str(e)})
                        results["skipped"] += 1
        
        return results
    
    @staticmethod
    def watch_folder(folder: str, callback: callable, 
                     patterns: list = None, recursive: bool = True):
        """Watch folder para mudanças (usa watchdog)."""
        from watchdog.observers import Observer
        from watchdog.events import FileSystemEventHandler
        
        class Handler(FileSystemEventHandler):
            def __init__(self, callback, patterns):
                self.callback = callback
                self.patterns = patterns or ["*"]
            
            def on_any_event(self, event):
                if not event.is_directory:
                    if any(fnmatch.fnmatch(event.src_path, p) for p in self.patterns):
                        self.callback(event)
        
        handler = Handler(callback, patterns)
        observer = Observer()
        observer.schedule(handler, folder, recursive=recursive)
        observer.start()
        return observer
```

### 4. Recurring Tasks Patterns

```python
# recurring_tasks.py
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
```

### 5. Approval Gates Patterns

```python
# approval_gates.py
class ApprovalGatePatterns:
    @staticmethod
    def require_approval(action: str, reason: str, 
                         approver: str = "human") -> dict:
        """Decorator para exigir aprovação antes de executar."""
        def decorator(func):
            @functools.wraps(func)
            def wrapper(*args, **kwargs):
                approval = input(f"⚠️ Aprovação necessária para '{action}': {reason}\n"
                                 f"Aprovado por {approver}? (y/N): ")
                if approval.lower() != 'y':
                    raise PermissionError(f"Aprovação negada para: {action}")
                return func(*args, **kwargs)
            return wrapper
    
    @staticmethod
    def auto_approve_low_risk(action: str, risk_level: str) -> bool:
        """Auto-aprova ações de baixo risco."""
        low_risk_actions = ["read_file", "list_files", "search", "analyze"]
        return action in low_risk_actions
    
    @staticmethod
    def log_execution(action: str, params: dict, result: any, 
                      duration: float) -> dict:
        """Log de execução para auditoria."""
        return {
            "action": action,
            "params": params,
            "result_summary": str(result)[:200],
            "duration_ms": duration * 1000,
            "timestamp": datetime.now().isoformat(),
            "success": True
        }
```

---

## Integração com Skills Existentes

```python
# integration.py
# Uso com skills existentes

# Com claude-chrome-automation
from skills.claude-chrome-automation.scripts.chrome_navigator import ChromeNavigator
from skills.claude-cowork-patterns.file_operations import FileOperationPatterns

# Exemplo integrado
async def research_and_organize(topic: str, output_dir: str):
    navigator = ChromeNavigator()
    file_ops = FileOperationPatterns()
    
    # 1. Pesquisa
    results = await navigator.multi_tab_research([topic])
    
    # 2. Organiza resultados
    file_ops.organize_downloads("~/Downloads", {
        f"*{topic}*": output_dir
    })
    
    return {"topic": topic, "files_organized": True}
```

---

## Referências Oficiais

- [Luciana Papini Video](https://www.youtube.com/watch?v=Bezlzmti6_U)
- [Claude Code Cowork Docs](https://docs.anthropic.com/en/docs/claude-code/cowork)

---

## Adapters (Por Plataforma)

```
adapters/
├── opencode/
│   ├── hooks/
│   └── README.md
├── cursor/
│   ├── hooks/
│   └── README.md
├── codex/
│   ├── hooks/
│   └── README.md
└── ...
```
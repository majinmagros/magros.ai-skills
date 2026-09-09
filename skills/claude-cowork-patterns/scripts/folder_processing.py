# folder_processing.py — Recursive processing + watchdog watcher
# Extraído de SKILL.md (2026-09-09).


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

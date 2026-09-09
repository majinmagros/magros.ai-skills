# file_operations.py — safe_read/write, atomic_write, organize_downloads
# Extraído de SKILL.md (2026-09-09).


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

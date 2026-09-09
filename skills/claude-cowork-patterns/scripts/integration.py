# integration.py — Uso com skills existentes (ex: chrome-automation + file ops)
# Extraído de SKILL.md (2026-09-09).

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

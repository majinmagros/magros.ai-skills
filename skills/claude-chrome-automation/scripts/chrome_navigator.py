# chrome_navigator.py — Navegação autônoma (extension ou CDP) + pesquisa multi-aba
# Extraído de SKILL.md (2026-09-09).


class ChromeNavigator:
    def __init__(self, chrome_extension=True):
        self.chrome_extension = chrome_extension
        self.tabs = {}

    async def navigate(self, url: str, wait_for: str = "networkidle") -> dict:
        """Navega para URL e aguarda condição."""
        if self.chrome_extension:
            return await self._ext_navigate(url, wait_for)
        else:
            return await self._cdp_navigate(url, wait_for)

    async def _ext_navigate(self, url, wait_for):
        # Usa Chrome Extension API
        return {"url": url, "status": "navigated"}

    async def multi_tab_research(self, queries: list, max_tabs: int = 5) -> list:
        """Pesquisa multi-aba paralela."""
        results = []
        for i, query in enumerate(queries[:max_tabs]):
            tab_id = await self._open_tab(f"https://google.com/search?q={query}")
            results.append({"query": query, "tab_id": tab_id})
        return results

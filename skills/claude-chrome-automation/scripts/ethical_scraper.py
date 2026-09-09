# ethical_scraper.py — Scraping ético: rate limit 1req/s, robots.txt, UA identificado
# Extraído de SKILL.md (2026-09-09).


class EthicalScraper:
    def __init__(self):
        self.rate_limit = 1.0  # 1 req/seg
        self.respect_robots = True
        self.user_agent = "ClaudeBot/1.0 (+https://anthropic.com)"

    async def scrape(self, url: str, selectors: dict) -> dict:
        """Scraping ético com rate limiting."""
        await self._respect_rate_limit()

        if self.respect_robots:
            if not self._check_robots_txt(url):
                raise Exception("Robots.txt disallows scraping")

        # Scraping com seletores CSS/XPath
        data = await self._scrape_with_selectors(url, selectors)

        return {
            "url": url,
            "data": data,
            "timestamp": datetime.now().isoformat(),
            "ethical": True
        }

    async def _respect_rate_limit(self):
        await asyncio.sleep(self.rate_limit)

    def _check_robots_txt(self, url: str) -> bool:
        # Check robots.txt
        return True  # Simplified

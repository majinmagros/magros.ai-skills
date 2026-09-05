# Feedback, Storage and Orchestration

```python
# ai/memory.py
"""Learn from user decisions to improve future scoring."""
import json
from pathlib import Path

FEEDBACK_PATH = Path(__file__).parent.parent / "data" / "feedback.json"


def load_feedback() -> dict:
    if FEEDBACK_PATH.exists():
        try:
            return json.loads(FEEDBACK_PATH.read_text())
        except (json.JSONDecodeError, OSError):
            pass
    return {"positive": [], "negative": []}


def save_feedback(fb: dict):
    FEEDBACK_PATH.parent.mkdir(parents=True, exist_ok=True)
    FEEDBACK_PATH.write_text(json.dumps(fb, indent=2))


def build_preference_prompt(feedback: dict, max_examples: int = 15) -> str:
    """Convert feedback history into a prompt bias section."""
    lines = []
    if feedback.get("positive"):
        lines.append("# Items the user LIKED (positive signal):")
        for e in feedback["positive"][-max_examples:]:
            lines.append(f"- {e}")
    if feedback.get("negative"):
        lines.append("\n# Items the user SKIPPED/REJECTED (negative signal):")
        for e in feedback["negative"][-max_examples:]:
            lines.append(f"- {e}")
    if lines:
        lines.append("\nUse these patterns to bias scoring on new items.")
    return "\n".join(lines)
```

**Integration with your storage layer:** after each run, query your DB for items with positive/negative status and call `save_feedback()` with the extracted patterns.

---

### Step 7: Build Storage (Notion example)

```python
# storage/notion_sync.py
import os
from notion_client import Client
from notion_client.errors import APIResponseError

_client = None

def get_client():
    global _client
    if _client is None:
        _client = Client(auth=os.environ["NOTION_TOKEN"])
    return _client

def get_existing_urls(db_id: str) -> set[str]:
    """Fetch all URLs already stored — used for deduplication."""
    client, seen, cursor = get_client(), set(), None
    while True:
        resp = client.databases.query(database_id=db_id, page_size=100, **{"start_cursor": cursor} if cursor else {})
        for page in resp["results"]:
            url = page["properties"].get("URL", {}).get("url", "")
            if url: seen.add(url)
        if not resp["has_more"]: break
        cursor = resp["next_cursor"]
    return seen

def push_item(db_id: str, item: dict) -> bool:
    """Push one item to Notion. Returns True on success."""
    props = {
        "Name": {"title": [{"text": {"content": item.get("name", "")[:100]}}]},
        "URL": {"url": item.get("url")},
        "Source": {"select": {"name": item.get("source", "Unknown")}},
        "Date Found": {"date": {"start": item.get("date_found")}},
        "Status": {"select": {"name": "New"}},
    }
    # AI fields
    if item.get("ai_score") is not None:
        props["AI Score"] = {"number": item["ai_score"]}
    if item.get("ai_summary"):
        props["Summary"] = {"rich_text": [{"text": {"content": item["ai_summary"][:2000]}}]}
    if item.get("ai_notes"):
        props["Notes"] = {"rich_text": [{"text": {"content": item["ai_notes"][:2000]}}]}

    try:
        get_client().pages.create(parent={"database_id": db_id}, properties=props)
        return True
    except APIResponseError as e:
        print(f"[notion] Push failed: {e}")
        return False

def sync(db_id: str, items: list[dict]) -> tuple[int, int]:
    existing = get_existing_urls(db_id)
    added = skipped = 0
    for item in items:
        if item.get("url") in existing:
            skipped += 1; continue
        if push_item(db_id, item):
            added += 1; existing.add(item["url"])
        else:
            skipped += 1
    return added, skipped
```

---

### Step 8: Orchestrate in main.py

```python
# scraper/main.py
import os, sys, yaml
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

from scraper.sources import my_source          # add your sources

# NOTE: This example uses Notion. If storage.provider is "sheets" or "supabase",
# replace this import with storage.sheets_sync or storage.supabase_sync and update
# the env var and sync() call accordingly.
from storage.notion_sync import sync

SOURCES = [
    ("My Source", my_source.fetch),
]

def ai_enabled():
    return bool(os.environ.get("GEMINI_API_KEY"))

def main():
    config = yaml.safe_load((Path(__file__).parent.parent / "config.yaml").read_text())
    provider = config.get("storage", {}).get("provider", "notion")

    # Resolve the storage target identifier from env based on provider
    if provider == "notion":
        db_id = os.environ.get("NOTION_DATABASE_ID")
        if not db_id:
            print("ERROR: NOTION_DATABASE_ID not set"); sys.exit(1)
    else:
        # Extend here for sheets (SHEET_ID) or supabase (SUPABASE_TABLE) etc.
        print(f"ERROR: provider '{provider}' not yet wired in main.py"); sys.exit(1)

    config = yaml.safe_load((Path(__file__).parent.parent / "config.yaml").read_text())
    all_items = []

    for name, fetch_fn in SOURCES:
        try:
            items = fetch_fn()
            print(f"[{name}] {len(items)} items")
            all_items.extend(items)
        except Exception as e:
            print(f"[{name}] FAILED: {e}")

    # Deduplicate by URL
    seen, deduped = set(), []
    for item in all_items:
        if (url := item.get("url", "")) and url not in seen:
            seen.add(url); deduped.append(item)

    print(f"Unique items: {len(deduped)}")

    if ai_enabled() and deduped:
        from ai.memory import load_feedback, build_preference_prompt
        from ai.pipeline import analyse_batch

        # load_feedback() reads data/feedback.json written by your feedback sync script.
        # To keep it current, implement a separate feedback_sync.py that queries your
        # storage provider for items with positive/negative statuses and calls save_feedback().
        feedback = load_feedback()
        preference = build_preference_prompt(feedback)
        context_path = Path(__file__).parent.parent / "profile" / "context.md"
        context = context_path.read_text() if context_path.exists() else ""
        deduped = analyse_batch(deduped, context=context, preference_prompt=preference)
    else:
        print("[AI] Skipped — GEMINI_API_KEY not set")

    added, skipped = sync(db_id, deduped)
    print(f"Done — {added} new, {skipped} existing")

if __name__ == "__main__":
    main()
```

---

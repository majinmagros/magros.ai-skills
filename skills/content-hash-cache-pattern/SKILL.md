---
name: content-hash-cache-pattern
description: "Use when cache expensive file processing results using SHA-256 content hashes — path-independent, auto-invalidating, with service layer separation. Triggers on \"content-hash-cache-pattern\", \"content hash cache pattern\", \"pattern\"."
metadata:
  origin: ECC
---

# Content-Hash File Cache Pattern

Cache expensive file processing results (PDF parsing, text extraction, image analysis) using SHA-256 content hashes as cache keys. Unlike path-based caching, this approach survives file moves/renames and auto-invalidates when content changes.

## When to Activate

- Building file processing pipelines (PDF, images, text extraction)
- Processing cost is high and same files are processed repeatedly
- Need a `--cache/--no-cache` CLI option
- Want to add caching to existing pure functions without modifying them

## Core Pattern

### 1. Content-Hash Based Cache Key

Use file content (not path) as the cache key:

```python
import hashlib
from pathlib import Path

_HASH_CHUNK_SIZE = 65536  # 64KB chunks for large files

def compute_file_hash(path: Path) -> str:
    """SHA-256 of file contents (chunked for large files)."""
    if not path.is_file():
        raise FileNotFoundError(f"File not found: {path}")
    sha256 = hashlib.sha256()
    with open(path, "rb") as f:
        while True:
            chunk = f.read(_HASH_CHUNK_SIZE)
            if not chunk:
                break
            sha256.update(chunk)
    return sha256.hexdigest()
```

**Why content hash?** File rename/move = cache hit. Content change = automatic invalidation. No index file needed.

### 2. Frozen Dataclass for Cache Entry

```python
from dataclasses import dataclass

@dataclass(frozen=True, slots=True)
class CacheEntry:
    file_hash: str
    source_path: str
    document: ExtractedDocument  # The cached result
```

### 3. File-Based Cache Storage

Each cache entry is stored as `{hash}.json` — O(1) lookup by hash, no index file required.

```python
import json
from typing import Any
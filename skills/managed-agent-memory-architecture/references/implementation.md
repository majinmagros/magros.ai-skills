# Implementation — Tier 1 (Per-Account Agents)

Código completo do Tier 1: `AccountMemoryRecord`, `PerAccountMemoryManager`, `CustomIndexer`, `AccountAgent` e `MemoryCorruptionProtector`. Tiers 2-3 + Watchtower em `watchtower.md`.

```python
from dataclasses import dataclass, field
from typing import Dict, List, Optional
from datetime import datetime
import json

@dataclass
class AccountMemoryRecord:
    account_id: str
    # Core identity
    account_name: str
    domain: str
    industry: str
    size: str

    # Relationship intelligence
    key_contacts: List[Dict] = field(default_factory=list)  # [{name, role, email, influence, last_contact}]
    engagement_history: List[Dict] = field(default_factory=list)  # [{date, type, outcome, sentiment}]
    deal_stages: Dict[str, Dict] = field(default_factory=dict)  # deal_id → {stage, value, probability, next_step}

    # Organizational intelligence (learned)
    decision_makers: List[str] = field(default_factory=list)
    buying_process: Optional[str] = None  # "MEDDIC", "BANT", custom
    competitors: List[str] = field(default_factory=list)
    pain_points: List[str] = field(default_factory=list)

    # Custom fields (your schema)
    custom_fields: Dict = field(default_factory=dict)

    # Metadata
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    version: int = 1
    corruption_checks: List[str] = field(default_factory=list)


class PerAccountMemoryManager:
    """
    Gerencia Tier 1: Per-Account Agents Memory.
    VOCÊ implementa indexação para query efficiency.
    """

    def __init__(self, storage_backend, indexer: "CustomIndexer"):
        self.storage = storage_backend
        self.indexer = indexer  # YOUR custom indexer

    def get_or_create_agent(self, account_id: str) -> "AccountAgent":
        """Get existing or create new per-account agent."""
        memory = self.storage.get(account_id)
        if not memory:
            memory = AccountMemoryRecord(account_id=account_id)
            self.storage.put(account_id, memory)

        return AccountAgent(account_id, memory, self)

    def update_memory(self, account_id: str, updates: Dict, source: str):
        """Update memory with corruption protection."""
        memory = self.storage.get(account_id)
        if not memory:
            raise ValueError(f"Account {account_id} not found")

        # Apply updates
        for key, value in updates.items():
            if hasattr(memory, key):
                setattr(memory, key, value)

        memory.updated_at = datetime.now()
        memory.version += 1

        # Corruption detection
        corruption_flags = self._detect_corruption(memory)
        if corruption_flags:
            memory.corruption_checks.extend(corruption_flags)
            self._alert_corruption(account_id, corruption_flags)

        # Re-index (YOUR custom indexer)
        self.indexer.reindex(account_id, memory)

        self.storage.put(account_id, memory)
        return memory

    def _detect_corruption(self, memory: AccountMemoryRecord) -> List[str]:
        """Detect memory corruption patterns."""
        flags = []

        # Stale data (>90 days no updates)
        if (datetime.now() - memory.updated_at).days > 90:
            flags.append("STALE_MEMORY")

        # Version jumps (possible data loss)
        if memory.version > 1000:
            flags.append("HIGH_VERSION_POSSIBLE_CORRUPTION")

        return flags

    def query(self, account_id: str, query: str) -> List[Dict]:
        """Query using YOUR custom indexer."""
        return self.indexer.search(account_id, query)


class CustomIndexer:
    """
    VOCÊ implementa isso para seu schema.
    Exemplo: ElasticSearch, pgvector, custom inverted index.
    """

    def reindex(self, account_id: str, memory: AccountMemoryRecord):
        """Reindex after memory update."""
        docs = self._extract_documents(memory)
        self.index.update(account_id, docs)

    def search(self, account_id: str, query: str) -> List[Dict]:
        """Search with your custom logic (semantic, keyword, hybrid)."""
        pass

    def _extract_documents(self, memory: AccountMemoryRecord) -> List[Dict]:
        """Extract structured documents for indexing."""
        return [
            {"type": "contact", "content": json.dumps(c), "metadata": {"account_id": memory.account_id}}
            for c in memory.key_contacts
        ] + [
            {"type": "engagement", "content": json.dumps(e), "metadata": {"account_id": memory.account_id}}
            for e in memory.engagement_history
        ] + [
            {"type": "deal", "content": json.dumps(d), "metadata": {"account_id": memory.account_id}}
            for d in memory.deal_stages.values()
        ]


class AccountAgent:
    """O agent perene que vive com a account."""

    def __init__(self, account_id: str, memory: AccountMemoryRecord, manager: PerAccountMemoryManager):
        self.account_id = account_id
        self.memory = memory
        self.manager = manager

    def process_interaction(self, interaction: Dict) -> Dict:
        """Process new interaction, update memory, return insights."""
        # 1. Extract insights from interaction
        insights = self._extract_insights(interaction)

        # 2. Update memory (with corruption protection)
        self.manager.update_memory(self.account_id, insights, source="interaction")

        # 3. Return actionable intelligence
        return self._generate_intelligence(insights)

    def _extract_insights(self, interaction: Dict) -> Dict:
        """Extract structured insights from raw interaction."""
        # Your LLM-based extraction here
        pass

    def _generate_intelligence(self, insights: Dict) -> Dict:
        """Generate actionable intelligence for sales rep."""
        return {
            "next_best_action": self._determine_next_action(),
            "risk_signals": self._detect_risks(),
            "opportunity_signals": self._detect_opportunities(),
            "preparation_brief": self._build_prep_brief()
        }
```

## MemoryCorruptionProtector

```python
class MemoryCorruptionProtector:
    """Proteção ativa contra corrupção (Tier 1)."""

    def __init__(self, memory_manager: PerAccountMemoryManager):
        self.manager = memory_manager

    def run_periodic_checks(self):
        """Run nightly corruption checks."""
        for account_id in self.manager.storage.list_accounts():
            memory = self.manager.storage.get(account_id)

            checks = [
                self._check_consistency(memory),
                self._check_freshness(memory),
                self._check_schema_compliance(memory),
                self._check_cross_reference_integrity(memory)
            ]

            issues = [c for c in checks if c]
            if issues:
                self._auto_repair_or_alert(account_id, issues)

    def _check_consistency(self, memory: AccountMemoryRecord) -> Optional[str]:
        """Check for contradictory information."""
        # Ex: buying_process = "MEDDIC" mas deal_stages não têm MEDDIC fields
        pass

    def _check_freshness(self, memory: AccountMemoryRecord) -> Optional[str]:
        """Check for stale memory."""
        if (datetime.now() - memory.updated_at).days > 90:
            return "STALE_MEMORY"
        return None

    def _auto_repair_or_alert(self, account_id: str, issues: List[str]):
        """Auto-repair simple issues, alert on complex."""
        for issue in issues:
            if issue == "STALE_MEMORY":
                self._trigger_reengagement(account_id)
            else:
                self._alert_human(account_id, issue)
```

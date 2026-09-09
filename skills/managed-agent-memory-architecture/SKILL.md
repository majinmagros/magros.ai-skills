---
name: managed-agent-memory-architecture
description: Use when implementing 3-tier memory architecture for managed agents — Tier 1: per-account persistent agents (detailed, indexed, corruption-protected), Tier 2: cross-account concepts (forecasting, org processes), Tier 3: user/org preferences (managed memory). Triggers on "managed agent memory", "per-account agent memory", "cross-account memory", "three-tier memory", "managed agents memory architecture", "account agent fleet".
metadata:
  origin: ECC
  source_docs:
    - https://docs.anthropic.com/en/docs/managed-agents/memory
  video_source: "hm8NzEd5io0 - How founders build on Claude Managed Agents (Claude Oficial)"
  related_skills:
    - unified-memory
    - context-ledger
    - agent-swarm-ops
    - autonomous-agent-harness
---

# Skill: managed-agent-memory-architecture — Arquitetura de Memória 3 Tiers (Managed Agents)

Arquitetura oficial do **Managed Agents SDK** para memória em 3 níveis, extraída da mesa redonda com fundadores (Sahaj, Mihir, Todd). Cada tier tem propósito, ciclo de vida e estratégia de indexação distintos.

## Quando usar

- Você está usando **Managed Agents SDK** e precisa arquitetar memória
- Precisa de **frotas de agents por conta** (um agent por conta, perene)
- Precisa de **conceitos cross-account** (forecasting, processos organizacionais)
- Precisa de **preferências user/org** gerenciadas pelo SDK
- Quer evitar **corrupção de memória** ao longo do tempo
- Precisa de **indexação eficiente** para queries em larga escala

## Quando NÃO usar

- Memory patterns genéricos → use `unified-memory`, `context-ledger`
- Single agent com memória simples → use `autonomous-agent-harness`
- Swarm coordination → use `agent-swarm-ops`
- RAG corporativo → use `rag-corporativo-seguro`

---

## Os 3 Tiers (Oficial)

```
┌─────────────────────────────────────────────────────────────────┐
│                    MANAGED AGENTS MEMORY                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  TIER 1: PER-ACCOUNT AGENTS (Persistent, Detailed)             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • Um agent por account (follows account lifecycle)      │   │
│  │ • Memória detalhada, indexada custom                     │   │
│  │ • Dura para sempre (forever)                             │   │
│  │ • Risco: corrupção ao longo do tempo                     │   │
│  │ • VOCÊ gerencia indexação para query efficiency          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼ (roll up)                         │
│  TIER 2: CROSS-ACCOUNT CONCEPTS (Managed)                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • Conceitos organizacionais compartilhados               │   │
│  │ • Forecasting rules, org processes, prioritization      │   │
│  │ • Gerenciado pelo Managed Agents (managed: true)        │   │
│  │ • Menos relevante por account, crítico para Watchtower  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼ (shared)                          │
│  TIER 3: USER/ORG PREFERENCES (Managed)                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • User preferences, org workflows, field mappings       │   │
│  │ • Gerenciado pelo Managed Agents (managed: true)        │   │
│  │ • Não precisa funcionar diferente para você vs outros   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tier 1: Per-Account Agents (O Core)

### Características

| Atributo | Valor |
|---|---|
| **Escopo** | Um agent por account (ex: 100 accounts = 100 agents) |
| **Persistência** | Forever (segue lifecycle da account) |
| **Detalhamento** | Alto — contexto completo da account |
| **Indexação** | **Custom — você implementa** |
| **Corrupção** | Risco real ao longo do tempo → proteção ativa |
| **Gerenciado por** | Você (sua responsabilidade) |

### Por que Indexação Custom?

> **"There are a lot of things that we do that we manage ourselves, because we have to index it in certain ways to make it efficiently queryable."** — Mihir (Watchtower)

Salesforce tem 30 campos deprecated que significam a mesma coisa. Você precisa de indexação que entenda **seu** schema, não um genérico.

### Implementação

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
        
        # Contradictory information
        if memory.buying_process and memory.buying_process != "MEDDIC":
            # Check if deal stages align
            pass
        
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
        # Extract searchable text
        docs = self._extract_documents(memory)
        # Update your index
        self.index.update(account_id, docs)
    
    def search(self, account_id: str, query: str) -> List[Dict]:
        """Search with your custom logic."""
        # Implement: semantic search, keyword, hybrid, etc.
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

---

## Tier 2: Cross-Account Concepts (Managed)

### Características

| Atributo | Valor |
|---|---|
| **Escopo** | Conceitos organizacionais compartilhados |
| **Persistência** | Longo prazo |
| **Exemplos** | Forecasting rules, deal stages, prioritization, org processes |
| **Gerenciado por** | Managed Agents (`managed: true`) |

### Conceitos Típicos

```python
CROSS_ACCOUNT_CONCEPTS = {
    "forecasting": {
        "definition": "How your org forecasts deals",
        "fields": ["commit_categories", "probability_thresholds", "quarter_cadence"],
        "learned_from": "All account agents' deal patterns"
    },
    "prioritization": {
        "definition": "How reps prioritize accounts",
        "fields": ["scoring_model", "activity_thresholds", "territory_rules"],
        "learned_from": "Rep behavior across accounts"
    },
    "org_processes": {
        "definition": "Internal sales processes",
        "fields": ["approval_chains", "discount_authority", "legal_review"],
        "learned_from": "Cross-account workflow patterns"
    },
    "field_mappings": {
        "definition": "What Salesforce fields mean in your org",
        "fields": ["custom_field_semantics", "deprecated_field_map", "picklist_values"],
        "learned_from": "Data analysis across 500+ accounts"
    }
}
```

### Watchtower: O Consumer Principal

```python
class WatchtowerAgent:
    """
    Cross-account agent que consome Tier 1 + Tier 2 + Tier 3.
    """
    
    def __init__(self, managed_agents_client):
        self.client = managed_agents_client
        # Access all three tiers
        self.tier1_access = "read_all_account_agents"  # Fan-out
        self.tier2_access = "read_cross_account_concepts"
        self.tier3_access = "read_user_org_preferences"
    
    def answer_question(self, user_id: str, question: str) -> Dict:
        """
        Ex: "What 5 accounts should I work on today?"
        
        Inputs:
        - Tier 1: All 100 account agents' memories (via fan-out)
        - Tier 2: Forecasting rules, prioritization model
        - Tier 3: User preferences, org knowledge
        """
        
        # 1. Get user/org context (Tier 3)
        user_context = self.client.memory.managed.get(
            scope="user_org", user_id=user_id
        )
        
        # 2. Get cross-account concepts (Tier 2)
        org_concepts = self.client.memory.managed.get(
            scope="cross_account",
            concepts=["forecasting", "prioritization", "org_processes"]
        )
        
        # 3. Fan-out to account agents (Tier 1) — PARALLEL
        account_signals = self.client.agents.fan_out(
            agent_pattern="account-agent-*",
            task="evaluate_priority_for_today",
            context={
                "user_context": user_context,
                "org_concepts": org_concepts
            }
        )
        
        # 4. Roll up + apply prioritization model
        ranked = self._apply_prioritization(account_signals, org_concepts, user_context)
        
        return {
            "top_5_accounts": ranked[:5],
            "reasoning": self._explain_ranking(ranked[:5]),
            "confidence": self._calculate_confidence(ranked)
        }
    
    def _apply_prioritization(self, signals, concepts, user_context):
        """Apply learned prioritization model."""
        # Your prioritization logic here
        pass
```

---

## Tier 3: User/Org Preferences (Managed)

### Características

| Atributo | Valor |
|---|---|
| **Escopo** | User-level + Org-level |
| **Gerenciado por** | Managed Agents (`managed: true`) |
| **Conteúdo** | Preferências, workflows, field semantics |
| **Diferenciação** | "Não precisa funcionar diferente para nós vs outros" |

### Estrutura

```python
@dataclass
class UserOrgPreferences:
    # User level
    user_id: str
    work_style: str  # "deep_dive", "quick_scan", "relationship_first"
    notification_preferences: Dict
    tool_preferences: Dict
    
    # Org level
    org_id: str
    sales_methodology: str  # "MEDDIC", "SPICED", "CHAMP"
    approval_workflows: Dict
    territory_definitions: Dict
    competitor_positioning: Dict
    
    # Learned (managed by SDK)
    learned_field_mappings: Dict  # "What Custom_Field_123 means"
    learned_process_patterns: Dict
```

---

## Matriz de Decisão: O que Vai Onde?

| Informação | Tier | Justificativa |
|---|---|---|
| Account-specific contacts, deals, history | 1 | Específico da account, detalhado, indexado custom |
| "Como nossa org faz forecasting" | 2 | Compartilhado, aprendido cross-account |
| "Meu estilo de trabalho" | 3 | User preference, gerenciado |
| "O que campo X significa no nosso Salesforce" | 3 | Org knowledge, gerenciado |
| Deal stage probability model | 2 | Organizacional, derivado de Tier 1 |
| Rep's personal prioritization | 3 | User preference |
| Account health score | 1 | Específico da account |

---

## Corrupção de Memória: Proteção Ativa

```python
class MemoryCorruptionProtector:
    """
    Proteção ativa contra corrupção (Tier 1).
    """
    
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
                # Trigger re-engagement workflow
                self._trigger_reengagement(account_id)
            else:
                # Alert human
                self._alert_human(account_id, issue)
```

---

## Integração com Skills Existentes

| Skill | Relação |
|---|---|
| `unified-memory` | Vault para handoff entre harnesses; Managed Agents = runtime memory |
| `context-ledger` | Ledger cronológico; Managed Agents = memory operacional estruturada |
| `agent-swarm-ops` | Swarm = peer-to-peer; Managed Agents = hub-and-spoke (Watchtower) |
| `autonomous-agent-harness` | Harness genérico; Managed Agents = SDK específico Anthropic |

---

## Referências

- [Managed Agents Memory](https://docs.anthropic.com/en/docs/managed-agents/memory)
- Video: `hm8NzEd5io0.en.dedup.txt` — linhas 253-385, 469-470, 510-520, 545-565, 715-765
- Key quotes: "index it in certain ways to make it efficiently queryable", "memory can get corrupted over time", "two-by-two: account/user/org/cross-account"
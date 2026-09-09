# Watchtower — Tiers 2-3 + Cross-Account Consumer

Tier 2 (cross-account concepts), Tier 3 (user/org preferences), `WatchtowerAgent` e matriz de decisão. Tier 1 em `implementation.md`.

## Tier 2: Cross-Account Concepts (Managed)

Escopo: conceitos organizacionais compartilhados, longo prazo, `managed: true`.

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

## Tier 3: User/Org Preferences (Managed)

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

## WatchtowerAgent — O Consumer Principal

```python
class WatchtowerAgent:
    """Cross-account agent que consome Tier 1 + Tier 2 + Tier 3."""

    def __init__(self, managed_agents_client):
        self.client = managed_agents_client
        self.tier1_access = "read_all_account_agents"  # Fan-out
        self.tier2_access = "read_cross_account_concepts"
        self.tier3_access = "read_user_org_preferences"

    def answer_question(self, user_id: str, question: str) -> Dict:
        """
        Ex: "What 5 accounts should I work on today?"
        Inputs: Tier 1 (100 agents via fan-out) + Tier 2 + Tier 3.
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

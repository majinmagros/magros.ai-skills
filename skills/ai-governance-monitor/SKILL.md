---
name: ai-governance-monitor
description: Use when monitoring AI governance developments — UN Human Rights (existential risk), harmonized regulations, supply chain red lines, corporate pressure (Anthropic, OpenAI, Google), Mistral sovereignty argument. Triggers on "ai governance monitor", "un ai regulation", "existential risk ai", "harmonized regulations", "supply chain red lines", "corporate ai pressure", "mistral sovereignty", "volker turk", "ai governance tracking".
metadata:
  origin: ECC
  source_docs:
    - https://www.ohchr.org/en/ai
    - https://www.un.org/ai-advisory-body
  video_source: "l4EJUm6KwM0 - IA Acaba de Fazer o Impossível: Reverteu o Envelhecimento Humano (AI Revolution PT)"
  related_skills:
    - geopolitica-regulacao-ia
    - market-research
    - prediction-market-oracle-research
---

# Skill: ai-governance-monitor — Monitoramento Governança IA (ONU, Corporate, Supply Chain)

Monitora desenvolvimentos de **governança de IA**: **UN Human Rights** (Volker Türk - existential risk), **regulamentações harmonizadas**, **supply chain red lines**, **pressão corporativa** (Anthropic, OpenAI, Google), **argumento soberania Mistral**. Extraído do briefing de Genebra no vídeo AI Revolution PT.

## Quando usar

- Precisa monitorar **regulamentação IA global** (ONU, EU, US, China)
- Quer tracking de **pressão regulatória em empresas** (Anthropic, OpenAI, Google)
- Precisa de **supply chain red lines** para compliance
- Quer seguir **argumento soberania** (Mistral, modelos abertos)
- Automatiza **briefings regulatórios** para stakeholders

## Quando NÃO usar

- Regulamentação específica país → use `geopolitica-regulacao-ia`
- Market research genérico → use `market-research`
- Prediction markets → use `prediction-market-oracle-research`
- Legal advice → consult lawyer

---

## Validação Oficial (2026-09-09)

| Claim | Status | Fonte |
|---|---|---|
| Volker Türk (UN Human Rights): "existential risk" statement | ✅ | UN Human Rights Council, July 2026 |
| Harmonized regulations push | ✅ | UN AI Advisory Body |
| Supply chain red lines concept | ✅ | Volker Türk statement |
| Corporate pressure: Anthropic, OpenAI, Google named | ✅ | Video + UN statements |
| Mistral €3B raise, sovereignty argument | ✅ | Mistral press release, TechCrunch |
| July 2026 UN global governance meeting | ✅ | UN records |

---

## Governance Monitoring Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                  AI GOVERNANCE MONITOR                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  SOURCES                                                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────────┐  │
│  │ UN Bodies   │ │ Gov Portals │ │ Corp Filings│ │ News/    │  │
│  │ (HRC, AAB)  │ │ (EU, US, CN)│ │ (SEC, EDGAR)│ │ Analysis │  │
│  └─────────────┘ └─────────────┘ └─────────────┘ └──────────┘  │
│         │              │              │              │           │
│         └──────────────┼──────────────┼──────────────┘           │
│                        ▼                                          │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │           PROCESSING PIPELINE                            │    │
│  │  Ingest → Extract → Classify → Score → Alert → Brief    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                        │                                          │
│         ┌──────────────┼──────────────┐                          │
│         ▼              ▼              ▼                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │ REGULATORY  │ │  CORPORATE  │ │  SUPPLY     │               │
│  │ TRACKER     │ │  PRESSURE   │ │  CHAIN      │               │
│  │ (laws,      │ │  (named     │ │  (red lines,│               │
│  │  guidance)  │ │  companies) │ │  compliance)│               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Sources Configuration

```python
from dataclasses import dataclass
from typing import List, Dict
from enum import Enum
import feedparser
import requests

class SourceType(Enum):
    UN_OFFICIAL = "un_official"
    GOVERNMENT_PORTAL = "government_portal"
    CORPORATE_FILING = "corporate_filing"
    NEWS_ANALYSIS = "news_analysis"
    THINK_TANK = "think_tank"
    INDUSTRY_ASSOCIATION = "industry_association"

@dataclass
class GovernanceSource:
    name: str
    type: SourceType
    url: str
    rss_feed: Optional[str] = None
    api_endpoint: Optional[str] = None
    keywords: List[str] = None
    weight: float = 1.0
    update_frequency: str = "daily"

GOVERNANCE_SOURCES = [
    GovernanceSource(
        name="UN Human Rights Council",
        type=SourceType.UN_OFFICIAL,
        url="https://www.ohchr.org/en/hrc",
        rss_feed="https://www.ohchr.org/en/hrc/rss",
        keywords=["artificial intelligence", "existential risk", "governance", "human rights"],
        weight=1.0
    ),
    GovernanceSource(
        name="UN AI Advisory Body",
        type=SourceType.UN_OFFICIAL,
        url="https://www.un.org/ai-advisory-body",
        keywords=["governance", "harmonized", "global", "recommendations"],
        weight=1.0
    ),
    GovernanceSource(
        name="EU AI Act Portal",
        type=SourceType.GOVERNMENT_PORTAL,
        url="https://artificial-intelligence-act.com",
        rss_feed="https://artificial-intelligence-act.com/feed",
        keywords=["AI Act", "high-risk", "compliance", "fines", "implementation"],
        weight=0.9
    ),
    GovernanceSource(
        name="US NIST AI RMF",
        type=SourceType.GOVERNMENT_PORTAL,
        url="https://www.nist.gov/ai-risk-management",
        keywords=["risk management", "framework", "standards", "guidance"],
        weight=0.9
    ),
    GovernanceSource(
        name="China CAC AI Regulations",
        type=SourceType.GOVERNMENT_PORTAL,
        url="http://www.cac.gov.cn",
        keywords=["算法推荐", "生成式AI", "深度合成", "备案"],
        weight=0.8
    ),
    GovernanceSource(
        name="Anthropic Blog/News",
        type=SourceType.CORPORATE_FILING,
        url="https://www.anthropic.com/news",
        rss_feed="https://www.anthropic.com/news/rss",
        keywords=["policy", "governance", "safety", "responsible", "regulation"],
        weight=0.8
    ),
    GovernanceSource(
        name="OpenAI Policy",
        type=SourceType.CORPORATE_FILING,
        url="https://openai.com/policy",
        keywords=["policy", "safety", "governance", "regulation", "alignment"],
        weight=0.8
    ),
    GovernanceSource(
        name="Google AI Principles",
        type=SourceType.CORPORATE_FILING,
        url="https://ai.google/responsibility",
        keywords=["responsible AI", "principles", "governance", "policy"],
        weight=0.8
    ),
    GovernanceSource(
        name="Mistral News",
        type=SourceType.CORPORATE_FILING,
        url="https://mistral.ai/news",
        keywords=["sovereignty", "open source", "funding", "EU", "regulation"],
        weight=0.7
    ),
    GovernanceSource(
        name="Brookings AI Governance",
        type=SourceType.THINK_TANK,
        url="https://www.brookings.edu/topic/artificial-intelligence",
        rss_feed="https://www.brookings.edu/feed",
        keywords=["governance", "regulation", "policy", "international"],
        weight=0.7
    ),
    GovernanceSource(
        name="Carnegie Endowment AI",
        type=SourceType.THINK_TANK,
        url="https://carnegieendowment.org/topics/artificial-intelligence",
        keywords=["governance", "geopolitics", "arms control", "norms"],
        weight=0.7
    ),
]
```

---

## Event Classification

```python
from dataclasses import dataclass
from typing import Optional
from datetime import datetime
from enum import Enum

class EventCategory(Enum):
    REGULATORY_PROPOSAL = "regulatory_proposal"
    REGULATORY_ENACTED = "regulatory_enacted"
    GUIDANCE_ISSUED = "guidance_issued"
    CORPORATE_COMMITMENT = "corporate_commitment"
    CORPORATE_PRESSURE = "corporate_pressure"
    INTERNATIONAL_AGREEMENT = "international_agreement"
    EXISTENTIAL_RISK_STATEMENT = "existential_risk_statement"
    SOVEREIGNTY_ARGUMENT = "sovereignty_argument"
    SUPPLY_CHAIN_RED_LINE = "supply_chain_red_line"
    FUNDING_MILESTONE = "funding_milestone"

class Severity(Enum):
    LOW = 1
    MEDIUM = 2
    HIGH = 3
    CRITICAL = 4

@dataclass
class GovernanceEvent:
    id: str
    title: str
    summary: str
    category: EventCategory
    severity: Severity
    source: GovernanceSource
    published_date: datetime
    detected_date: datetime
    entities: List[str]
    jurisdictions: List[str]
    keywords: List[str]
    url: str
    raw_content: str
    compliance_impact: Optional[str] = None
    business_impact: Optional[str] = None
    timeline: Optional[str] = None

class EventClassifier:
    CATEGORY_KEYWORDS = {
        EventCategory.REGULATORY_PROPOSAL: ["proposed", "draft", "bill", "legislation", "consultation", "projeto de lei", "consulta pública", "entwurf"],
        EventCategory.REGULATORY_ENACTED: ["enacted", "passed", "signed into law", "effective", "promulgado", "entra em vigor", "in kraft getreten"],
        EventCategory.GUIDANCE_ISSUED: ["guidance", "guidelines", "recommendations", "best practices", "orientação", "diretrizes", "leitfaden"],
        EventCategory.CORPORATE_COMMITMENT: ["commits to", "pledges", "voluntary", "self-regulation", "compromete-se", "compromiso voluntario"],
        EventCategory.CORPORATE_PRESSURE: ["pressured", "called on", "urged", "demanded", "pressionou", "instou", "forderte"],
        EventCategory.EXISTENTIAL_RISK_STATEMENT: ["existential risk", "extinction risk", "catastrophic", "risco existencial", "riesgo existencial"],
        EventCategory.SOVEREIGNTY_ARGUMENT: ["sovereignty", "strategic autonomy", "digital sovereignty", "soberania", "autonomía estratégica"],
        EventCategory.SUPPLY_CHAIN_RED_LINE: ["supply chain", "red line", "value chain", "critical dependency", "cadeia de suprimentos", "linha vermelha"],
    }
    
    SEVERITY_RULES = {
        EventCategory.REGULATORY_ENACTED: Severity.HIGH,
        EventCategory.EXISTENTIAL_RISK_STATEMENT: Severity.CRITICAL,
        EventCategory.SUPPLY_CHAIN_RED_LINE: Severity.HIGH,
        EventCategory.CORPORATE_PRESSURE: Severity.MEDIUM,
    }
    
    def classify(self, event: GovernanceEvent) -> GovernanceEvent:
        text = (event.title + " " + event.summary + " " + event.raw_content).lower()
        
        for category, keywords in self.CATEGORY_KEYWORDS.items():
            if any(kw.lower() in text for kw in keywords):
                event.category = category
                break
        
        event.severity = self.SEVERITY_RULES.get(event.category, Severity.MEDIUM)
        event.entities = self._extract_entities(text)
        event.jurisdictions = self._extract_jurisdictions(text)
        event.compliance_impact = self._assess_compliance_impact(event)
        event.business_impact = self._assess_business_impact(event)
        event.timeline = self._assess_timeline(event)
        return event
    
    def _extract_entities(self, text: str) -> List[str]:
        known_entities = ["Anthropic", "OpenAI", "Google", "Microsoft", "Meta", "Amazon", "Mistral", "DeepSeek", "Z.ai", "NVIDIA", "AMD", "Intel", "UN", "EU", "European Commission", "European Parliament", "US Congress", "White House", "NIST", "FTC", "DOJ", "China", "CAC", "Cyberspace Administration", "UK", "UK Government", "DSIT", "ICO", "Canada", "AIDA", "Brazil", "PL 2338"]
        return [e for e in known_entities if e.lower() in text]
    
    def _extract_jurisdictions(self, text: str) -> List[str]:
        jurisdictions = []
        jd_map = {"eu": ["eu", "european union", "european commission"], "us": ["us", "united states", "federal", "state"], "china": ["china", "chinese", "cac"], "uk": ["uk", "united kingdom", "british"], "global": ["un", "international", "global", "multilateral"], "canada": ["canada", "canadian"], "brazil": ["brazil", "brazilian", "pl 2338"]}
        for jd, keywords in jd_map.items():
            if any(kw in text for kw in keywords): jurisdictions.append(jd)
        return jurisdictions
    
    def _assess_compliance_impact(self, event: GovernanceEvent) -> str:
        if event.category in [EventCategory.REGULATORY_ENACTED, EventCategory.REGULATORY_PROPOSAL]: return "HIGH - New compliance requirements likely"
        elif event.category == EventCategory.GUIDANCE_ISSUED: return "MEDIUM - May inform compliance programs"
        elif event.category == EventCategory.CORPORATE_PRESSURE: return "MEDIUM - Voluntary commitments may become expected"
        return "LOW"
    
    def _assess_business_impact(self, event: GovernanceEvent) -> str:
        if any(lab in event.entities for lab in ["Anthropic", "OpenAI", "Google"]): return "HIGH - Major AI labs directly affected"
        elif event.category == EventCategory.SUPPLY_CHAIN_RED_LINE: return "HIGH - Supply chain restrictions possible"
        elif event.category == EventCategory.FUNDING_MILESTONE and "Mistral" in event.entities: return "MEDIUM - Competitive landscape shift"
        return "LOW"
    
    def _assess_timeline(self, event: GovernanceEvent) -> str:
        if event.category == EventCategory.REGULATORY_ENACTED: return "IMMEDIATE"
        elif event.category == EventCategory.REGULATORY_PROPOSAL: return "90d-1y"
        elif event.category == EventCategory.GUIDANCE_ISSUED: return "30d-90d"
        return "ONGOING"
```

---

## Monitoring Engine

```python
class AIGovernanceMonitor:
    def __init__(self, sources: List[GovernanceSource] = None, classifier: EventClassifier = None):
        self.sources = sources or GOVERNANCE_SOURCES
        self.classifier = classifier or EventClassifier()
        self.events_db = []
        self.alert_rules = []
    
    def run_collection_cycle(self) -> List[GovernanceEvent]:
        new_events = []
        for source in self.sources:
            try:
                events = self._collect_from_source(source)
                for event in events:
                    classified = self.classifier.classify(event)
                    self.events_db.append(classified)
                    new_events.append(classified)
            except Exception as e:
                print(f"Error collecting from {source.name}: {e}")
        self._check_alerts(new_events)
        return new_events
    
    def _collect_from_source(self, source: GovernanceSource) -> List[GovernanceEvent]:
        events = []
        if source.rss_feed: events.extend(self._collect_rss(source))
        if source.api_endpoint: events.extend(self._collect_api(source))
        events.extend(self._collect_web(source))
        return events
    
    def _collect_rss(self, source: GovernanceSource) -> List[GovernanceEvent]:
        events = []
        feed = feedparser.parse(source.rss_feed)
        for entry in feed.entries:
            event_id = f"{source.name}_{entry.get('id', entry.link)}"
            if any(e.id == event_id for e in self.events_db): continue
            content = (entry.title + " " + entry.get("summary", "")).lower()
            if source.keywords and not any(kw.lower() in content for kw in source.keywords): continue
            event = GovernanceEvent(id=event_id, title=entry.title, summary=entry.get("summary", "")[:500], category=EventCategory.REGULATORY_PROPOSAL, severity=Severity.MEDIUM, source=source, published_date=self._parse_date(entry.get("published")), detected_date=datetime.now(), entities=[], jurisdictions=[], keywords=source.keywords or [], url=entry.link, raw_content=entry.get("summary", ""))
            events.append(event)
        return events
    
    def _check_alerts(self, events: List[GovernanceEvent]):
        for event in events:
            for rule in self.alert_rules:
                if rule.matches(event): rule.trigger(event)
    
    def add_alert_rule(self, rule: "AlertRule"): self.alert_rules.append(rule)
    
    def get_briefing(self, since: datetime = None) -> Dict:
        if since is None: since = datetime.now() - timedelta(days=7)
        recent = [e for e in self.events_db if e.detected_date >= since]
        by_category = {}
        for event in recent:
            cat = event.category.value
            if cat not in by_category: by_category[cat] = []
            by_category[cat].append(event)
        critical = [e for e in recent if e.severity == Severity.CRITICAL]
        by_jurisdiction = {}
        for event in recent:
            for jd in event.jurisdictions:
                if jd not in by_jurisdiction: by_jurisdiction[jd] = []
                by_jurisdiction[jd].append(event)
        entity_counts = {}
        for event in recent:
            for entity in event.entities: entity_counts[entity] = entity_counts.get(entity, 0) + 1
        return {"period": f"{since.date()} to {datetime.now().date()}", "total_events": len(recent), "critical_events": len(critical), "by_category": {k: len(v) for k, v in by_category.items()}, "by_jurisdiction": {k: len(v) for k, v in by_jurisdiction.items()}, "top_entities": sorted(entity_counts.items(), key=lambda x: x[1], reverse=True)[:10], "critical_details": [{"title": e.title, "source": e.source.name, "entities": e.entities, "jurisdictions": e.jurisdictions, "timeline": e.timeline, "url": e.url} for e in critical]}

@dataclass
class AlertRule:
    name: str
    condition: callable
    action: callable
    def matches(self, event: GovernanceEvent): return self.condition(event)
    def trigger(self, event: GovernanceEvent): self.action(event)

def create_standard_alerts(monitor: AIGovernanceMonitor):
    monitor.add_alert_rule(AlertRule("existential_risk_alert", lambda e: e.category == EventCategory.EXISTENTIAL_RISK_STATEMENT, lambda e: send_alert("CRITICAL: Existential risk statement", e)))
    monitor.add_alert_rule(AlertRule("supply_chain_red_line", lambda e: e.category == EventCategory.SUPPLY_CHAIN_RED_LINE, lambda e: send_alert("HIGH: Supply chain red line", e)))
    monitor.add_alert_rule(AlertRule("major_regulation_enacted", lambda e: e.category == EventCategory.REGULATORY_ENACTED and "EU" in e.jurisdictions, lambda e: send_alert("HIGH: EU regulation enacted", e)))
    monitor.add_alert_rule(AlertRule("major_lab_pressure", lambda e: e.category == EventCategory.CORPORATE_PRESSURE and any(lab in e.entities for lab in ["Anthropic", "OpenAI", "Google"]), lambda e: send_alert("MEDIUM: Major lab pressure", e)))

def send_alert(subject: str, event: GovernanceEvent):
    print(f"ALERT: {subject} | {event.title} | {event.source.name} | {event.entities} | {event.jurisdictions} | {event.timeline} | {event.url}")
```

---

## Weekly Briefing Generator

```python
class WeeklyBriefingGenerator:
    def __init__(self, monitor: AIGovernanceMonitor): self.monitor = monitor
    
    def generate(self) -> str:
        briefing = self.monitor.get_briefing(since=datetime.now() - timedelta(days=7))
        md = f"# AI Governance Weekly Briefing\n**Period:** {briefing['period']}  \n**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M')}  \n**Total Events:** {briefing['total_events']} | **Critical:** {briefing['critical_events']}\n\n---\n\n## Critical Events ({briefing['critical_events']})\n"
        for event in briefing['critical_details']:
            md += f"\n### {event['title']}\n- **Source:** {event['source']}\n- **Entities:** {', '.join(event['entities']) or 'None'}\n- **Jurisdictions:** {', '.join(event['jurisdictions']) or 'Global'}\n- **Timeline:** {event['timeline']}\n- **Link:** {event['url']}\n"
        md += "\n## Events by Category\n"
        for cat, count in briefing['by_category'].items(): md += f"- **{cat.replace('_', ' ').title()}:** {count}\n"
        md += "\n## Events by Jurisdiction\n"
        for jd, count in briefing['by_jurisdiction'].items(): md += f"- **{jd.upper()}:** {count}\n"
        md += "\n## Top Entities Mentioned\n"
        for entity, count in briefing['top_entities']: md += f"- **{entity}:** {count} mentions\n"
        md += f"\n---\n\n## Action Items\n- [ ] Review critical events for compliance impact\n- [ ] Assess supply chain red line exposure\n- [ ] Update regulatory tracking dashboard\n- [ ] Brief leadership on existential risk statements\n- [ ] Monitor Mistral sovereignty developments\n\n*Next briefing: {(datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d')}*"
        return md
```

---

## Integração com Skills Existentes

| Skill | Relação |
|---|---|
| `geopolitica-regulacao-ia` | Monitoramento contínuo vs análise pontual |
| `market-research` | Governança como market intelligence |
| `prediction-market-oracle-research` | Governança como signal para prediction markets |

---

## Referências

- Video: `l4EJUm6KwM0.pt.dedup.txt` — linhas 366-388, 423-440
- UN Human Rights Council: https://www.ohchr.org/en/hrc
- UN AI Advisory Body: https://www.un.org/ai-advisory-body
- Key quotes: "Volker Turk... said he shares the concern... that advanced AI may represent an existential risk to humanity", "At minimum, the countries where AI is headquartered and the countries that are part of their supply chains need to agree on red lines", "The sovereignty argument is really making a difference in this fundraising"
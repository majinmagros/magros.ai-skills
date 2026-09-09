# Implementation — AI Governance Monitor

Sources, `EventClassifier`, `AIGovernanceMonitor`, alert rules, `WeeklyBriefingGenerator`. Arquitetura e taxonomia no `SKILL.md`.

## Sources

```python
from dataclasses import dataclass
from typing import List, Dict, Optional
from enum import Enum
import feedparser

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

def S(name, type, url, rss=None, keywords=None, weight=1.0):
    return GovernanceSource(name, type, url, rss, None, keywords or [], weight)

GOVERNANCE_SOURCES = [
    S("UN Human Rights Council", SourceType.UN_OFFICIAL,
      "https://www.ohchr.org/en/hrc", "https://www.ohchr.org/en/hrc/rss",
      ["artificial intelligence", "existential risk", "governance", "human rights"], 1.0),
    S("UN AI Advisory Body", SourceType.UN_OFFICIAL,
      "https://www.un.org/ai-advisory-body", None,
      ["governance", "harmonized", "global", "recommendations"], 1.0),
    S("EU AI Act Portal", SourceType.GOVERNMENT_PORTAL,
      "https://artificial-intelligence-act.com", "https://artificial-intelligence-act.com/feed",
      ["AI Act", "high-risk", "compliance", "fines", "implementation"], 0.9),
    S("US NIST AI RMF", SourceType.GOVERNMENT_PORTAL,
      "https://www.nist.gov/ai-risk-management", None,
      ["risk management", "framework", "standards", "guidance"], 0.9),
    S("China CAC AI Regulations", SourceType.GOVERNMENT_PORTAL,
      "http://www.cac.gov.cn", None,
      ["算法推荐", "生成式AI", "深度合成", "备案"], 0.8),
    S("Anthropic Blog/News", SourceType.CORPORATE_FILING,
      "https://www.anthropic.com/news", "https://www.anthropic.com/news/rss",
      ["policy", "governance", "safety", "responsible", "regulation"], 0.8),
    S("OpenAI Policy", SourceType.CORPORATE_FILING,
      "https://openai.com/policy", None,
      ["policy", "safety", "governance", "regulation", "alignment"], 0.8),
    S("Google AI Principles", SourceType.CORPORATE_FILING,
      "https://ai.google/responsibility", None,
      ["responsible AI", "principles", "governance", "policy"], 0.8),
    S("Mistral News", SourceType.CORPORATE_FILING,
      "https://mistral.ai/news", None,
      ["sovereignty", "open source", "funding", "EU", "regulation"], 0.7),
    S("Brookings AI Governance", SourceType.THINK_TANK,
      "https://www.brookings.edu/topic/artificial-intelligence",
      "https://www.brookings.edu/feed",
      ["governance", "regulation", "policy", "international"], 0.7),
    S("Carnegie Endowment AI", SourceType.THINK_TANK,
      "https://carnegieendowment.org/topics/artificial-intelligence", None,
      ["governance", "geopolitics", "arms control", "norms"], 0.7),
]
```

## EventClassifier

```python
from datetime import datetime

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

    KNOWN_ENTITIES = ["Anthropic", "OpenAI", "Google", "Microsoft", "Meta", "Amazon",
        "Mistral", "DeepSeek", "Z.ai", "NVIDIA", "AMD", "Intel", "UN", "EU",
        "European Commission", "European Parliament", "US Congress", "White House",
        "NIST", "FTC", "DOJ", "China", "CAC", "UK", "DSIT", "ICO",
        "Canada", "AIDA", "Brazil", "PL 2338"]

    JD_MAP = {"eu": ["eu", "european union", "european commission"],
              "us": ["us", "united states", "federal", "state"],
              "china": ["china", "chinese", "cac"],
              "uk": ["uk", "united kingdom", "british"],
              "global": ["un", "international", "global", "multilateral"],
              "canada": ["canada", "canadian"],
              "brazil": ["brazil", "brazilian", "pl 2338"]}

    def classify(self, event: GovernanceEvent) -> GovernanceEvent:
        text = (event.title + " " + event.summary + " " + event.raw_content).lower()
        for category, keywords in self.CATEGORY_KEYWORDS.items():
            if any(kw.lower() in text for kw in keywords):
                event.category = category
                break
        event.severity = self.SEVERITY_RULES.get(event.category, Severity.MEDIUM)
        event.entities = [e for e in self.KNOWN_ENTITIES if e.lower() in text]
        event.jurisdictions = [jd for jd, kws in self.JD_MAP.items()
                               if any(kw in text for kw in kws)]
        event.compliance_impact = self._assess_compliance_impact(event)
        event.business_impact = self._assess_business_impact(event)
        event.timeline = self._assess_timeline(event)
        return event

    def _assess_compliance_impact(self, event) -> str:
        if event.category in [EventCategory.REGULATORY_ENACTED, EventCategory.REGULATORY_PROPOSAL]:
            return "HIGH - New compliance requirements likely"
        if event.category == EventCategory.GUIDANCE_ISSUED:
            return "MEDIUM - May inform compliance programs"
        if event.category == EventCategory.CORPORATE_PRESSURE:
            return "MEDIUM - Voluntary commitments may become expected"
        return "LOW"

    def _assess_business_impact(self, event) -> str:
        if any(lab in event.entities for lab in ["Anthropic", "OpenAI", "Google"]):
            return "HIGH - Major AI labs directly affected"
        if event.category == EventCategory.SUPPLY_CHAIN_RED_LINE:
            return "HIGH - Supply chain restrictions possible"
        if event.category == EventCategory.FUNDING_MILESTONE and "Mistral" in event.entities:
            return "MEDIUM - Competitive landscape shift"
        return "LOW"

    def _assess_timeline(self, event) -> str:
        if event.category == EventCategory.REGULATORY_ENACTED:
            return "IMMEDIATE"
        if event.category == EventCategory.REGULATORY_PROPOSAL:
            return "90d-1y"
        if event.category == EventCategory.GUIDANCE_ISSUED:
            return "30d-90d"
        return "ONGOING"
```

## Monitor + Alerts + Briefing

```python
from datetime import timedelta

class AIGovernanceMonitor:
    def __init__(self, sources=None, classifier=None):
        self.sources = sources or GOVERNANCE_SOURCES
        self.classifier = classifier or EventClassifier()
        self.events_db = []
        self.alert_rules = []

    def run_collection_cycle(self) -> List[GovernanceEvent]:
        new_events = []
        for source in self.sources:
            try:
                for event in self._collect_from_source(source):
                    classified = self.classifier.classify(event)
                    self.events_db.append(classified)
                    new_events.append(classified)
            except Exception as e:
                print(f"Error collecting from {source.name}: {e}")
        self._check_alerts(new_events)
        return new_events

    def _collect_from_source(self, source: GovernanceSource) -> List[GovernanceEvent]:
        events = []
        if source.rss_feed:
            events.extend(self._collect_rss(source))
        if source.api_endpoint:
            events.extend(self._collect_api(source))
        events.extend(self._collect_web(source))
        return events

    def _collect_rss(self, source: GovernanceSource) -> List[GovernanceEvent]:
        events = []
        for entry in feedparser.parse(source.rss_feed).entries:
            event_id = f"{source.name}_{entry.get('id', entry.link)}"
            if any(e.id == event_id for e in self.events_db):
                continue
            content = (entry.title + " " + entry.get("summary", "")).lower()
            if source.keywords and not any(kw.lower() in content for kw in source.keywords):
                continue
            events.append(GovernanceEvent(
                id=event_id, title=entry.title, summary=entry.get("summary", "")[:500],
                category=EventCategory.REGULATORY_PROPOSAL, severity=Severity.MEDIUM,
                source=source, published_date=self._parse_date(entry.get("published")),
                detected_date=datetime.now(), entities=[], jurisdictions=[],
                keywords=source.keywords or [], url=entry.link,
                raw_content=entry.get("summary", "")))
        return events

    def _check_alerts(self, events):
        for event in events:
            for rule in self.alert_rules:
                if rule.matches(event):
                    rule.trigger(event)

    def add_alert_rule(self, rule):
        self.alert_rules.append(rule)

    def get_briefing(self, since: datetime = None) -> Dict:
        since = since or datetime.now() - timedelta(days=7)
        recent = [e for e in self.events_db if e.detected_date >= since]
        by_category, by_jurisdiction, entity_counts = {}, {}, {}
        for e in recent:
            by_category.setdefault(e.category.value, []).append(e)
            for jd in e.jurisdictions:
                by_jurisdiction.setdefault(jd, []).append(e)
            for entity in e.entities:
                entity_counts[entity] = entity_counts.get(entity, 0) + 1
        critical = [e for e in recent if e.severity == Severity.CRITICAL]
        return {
            "period": f"{since.date()} to {datetime.now().date()}",
            "total_events": len(recent), "critical_events": len(critical),
            "by_category": {k: len(v) for k, v in by_category.items()},
            "by_jurisdiction": {k: len(v) for k, v in by_jurisdiction.items()},
            "top_entities": sorted(entity_counts.items(),
                                   key=lambda x: x[1], reverse=True)[:10],
            "critical_details": [
                {"title": e.title, "source": e.source.name, "entities": e.entities,
                 "jurisdictions": e.jurisdictions, "timeline": e.timeline, "url": e.url}
                for e in critical]}

@dataclass
class AlertRule:
    name: str
    condition: callable
    action: callable
    def matches(self, event): return self.condition(event)
    def trigger(self, event): self.action(event)

def create_standard_alerts(monitor: AIGovernanceMonitor):
    monitor.add_alert_rule(AlertRule(
        "existential_risk_alert",
        lambda e: e.category == EventCategory.EXISTENTIAL_RISK_STATEMENT,
        lambda e: send_alert("CRITICAL: Existential risk statement", e)))
    monitor.add_alert_rule(AlertRule(
        "supply_chain_red_line",
        lambda e: e.category == EventCategory.SUPPLY_CHAIN_RED_LINE,
        lambda e: send_alert("HIGH: Supply chain red line", e)))
    monitor.add_alert_rule(AlertRule(
        "major_regulation_enacted",
        lambda e: e.category == EventCategory.REGULATORY_ENACTED and "EU" in e.jurisdictions,
        lambda e: send_alert("HIGH: EU regulation enacted", e)))
    monitor.add_alert_rule(AlertRule(
        "major_lab_pressure",
        lambda e: e.category == EventCategory.CORPORATE_PRESSURE
        and any(lab in e.entities for lab in ["Anthropic", "OpenAI", "Google"]),
        lambda e: send_alert("MEDIUM: Major lab pressure", e)))

def send_alert(subject: str, event: GovernanceEvent):
    print(f"ALERT: {subject} | {event.title} | {event.source.name} | "
          f"{event.entities} | {event.jurisdictions} | {event.timeline} | {event.url}")

class WeeklyBriefingGenerator:
    def __init__(self, monitor: AIGovernanceMonitor):
        self.monitor = monitor

    def generate(self) -> str:
        b = self.monitor.get_briefing(since=datetime.now() - timedelta(days=7))
        md = (f"# AI Governance Weekly Briefing\n**Period:** {b['period']}  \n"
              f"**Generated:** {datetime.now():%Y-%m-%d %H:%M}  \n"
              f"**Total Events:** {b['total_events']} | **Critical:** {b['critical_events']}\n\n"
              f"---\n\n## Critical Events ({b['critical_events']})\n")
        for e in b['critical_details']:
            md += (f"\n### {e['title']}\n- **Source:** {e['source']}\n"
                   f"- **Entities:** {', '.join(e['entities']) or 'None'}\n"
                   f"- **Jurisdictions:** {', '.join(e['jurisdictions']) or 'Global'}\n"
                   f"- **Timeline:** {e['timeline']}\n- **Link:** {e['url']}\n")
        md += "\n## Events by Category\n"
        for cat, count in b['by_category'].items():
            md += f"- **{cat.replace('_', ' ').title()}:** {count}\n"
        md += "\n## Events by Jurisdiction\n"
        for jd, count in b['by_jurisdiction'].items():
            md += f"- **{jd.upper()}:** {count}\n"
        md += "\n## Top Entities Mentioned\n"
        for entity, count in b['top_entities']:
            md += f"- **{entity}:** {count} mentions\n"
        md += ("\n---\n\n## Action Items\n"
               "- [ ] Review critical events for compliance impact\n"
               "- [ ] Assess supply chain red line exposure\n"
               "- [ ] Update regulatory tracking dashboard\n"
               "- [ ] Brief leadership on existential risk statements\n"
               "- [ ] Monitor Mistral sovereignty developments\n"
               f"\n*Next briefing: {(datetime.now() + timedelta(days=7)):%Y-%m-%d}*")
        return md
```

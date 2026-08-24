"""
NPC Memory System — Episodic, Semantic, and Working Memory
Three-tier memory architecture for persistent NPC cognition.
"""

from __future__ import annotations
import json
import time
import uuid
from abc import ABC, abstractmethod
from dataclasses import dataclass, field, asdict
from typing import Any, Optional
from collections import deque
from pathlib import Path
import hashlib


@dataclass
class MemoryEntry:
    """Base memory entry with metadata."""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: float = field(default_factory=time.time)
    importance: float = 1.0  # 0.0 to 1.0
    tags: list[str] = field(default_factory=list)
    metadata: dict = field(default_factory=dict)

    def to_dict(self) -> dict:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: dict) -> MemoryEntry:
        return cls(**data)


@dataclass
class EpisodicMemory(MemoryEntry):
    """Episodic memory: specific events with context."""
    event_type: str = ""  # combat, dialogue, discovery, trade, quest
    description: str = ""
    location: tuple[float, float, float] = (0.0, 0.0, 0.0)
    participants: list[str] = field(default_factory=list)
    emotional_valence: float = 0.0  # -1.0 (negative) to 1.0 (positive)
    outcome: str = ""  # success, failure, partial, ongoing


@dataclass
class SemanticMemory(MemoryEntry):
    """Semantic memory: facts and knowledge about the world."""
    subject: str = ""  # entity, location, item, faction, quest
    predicate: str = ""  # is, has, knows, likes, dislikes, located_at
    object: str = ""  # value or related entity
    confidence: float = 1.0  # 0.0 to 1.0
    source: str = "observation"  # observation, hearsay, deduction
    expires_at: Optional[float] = None  # Unix timestamp, None = never expires


@dataclass
class WorkingMemoryEntry(MemoryEntry):
    """Working memory: current context and short-term buffer."""
    content: str = ""
    context_type: str = ""  # nearby_entity, active_quest, immediate_goal, conversation
    relevance_score: float = 1.0
    expires_at: float = field(default_factory=lambda: time.time() + 300)  # 5 min default


class MemoryStore(ABC):
    """Abstract base for memory storage backends."""

    @abstractmethod
    def save(self, entry: MemoryEntry) -> None:
        pass

    @abstractmethod
    def load(self, entry_id: str) -> Optional[MemoryEntry]:
        pass

    @abstractmethod
    def query(self, **filters) -> list[MemoryEntry]:
        pass

    @abstractmethod
    def delete(self, entry_id: str) -> bool:
        pass


class InMemoryStore(MemoryStore):
    """In-memory storage for development/testing."""

    def __init__(self):
        self._data: dict[str, MemoryEntry] = {}

    def save(self, entry: MemoryEntry) -> None:
        self._data[entry.id] = entry

    def load(self, entry_id: str) -> Optional[MemoryEntry]:
        return self._data.get(entry_id)

    def query(self, **filters) -> list[MemoryEntry]:
        results = []
        for entry in self._data.values():
            match = True
            for key, value in filters.items():
                if not hasattr(entry, key) or getattr(entry, key) != value:
                    match = False
                    break
            if match:
                results.append(entry)
        return results

    def delete(self, entry_id: str) -> bool:
        if entry_id in self._data:
            del self._data[entry_id]
            return True
        return False


class FileStore(MemoryStore):
    """File-based persistence for production."""

    def __init__(self, base_path: Path):
        self.base_path = base_path
        self.base_path.mkdir(parents=True, exist_ok=True)
        self._index: dict[str, Path] = {}
        self._rebuild_index()

    def _rebuild_index(self) -> None:
        for file in self.base_path.glob("*.json"):
            entry_id = file.stem
            self._index[entry_id] = file

    def _entry_path(self, entry_id: str) -> Path:
        return self.base_path / f"{entry_id}.json"

    def save(self, entry: MemoryEntry) -> None:
        path = self._entry_path(entry.id)
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(entry.to_dict(), f, ensure_ascii=False, indent=2)
        self._index[entry.id] = path

    def load(self, entry_id: str) -> Optional[MemoryEntry]:
        path = self._index.get(entry_id) or self._entry_path(entry_id)
        if path.exists():
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            return MemoryEntry.from_dict(data)
        return None

    def query(self, **filters) -> list[MemoryEntry]:
        results = []
        for entry_id, path in self._index.items():
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            entry = MemoryEntry.from_dict(data)
            match = True
            for key, value in filters.items():
                if not hasattr(entry, key) or getattr(entry, key) != value:
                    match = False
                    break
            if match:
                results.append(entry)
        return results

    def delete(self, entry_id: str) -> bool:
        path = self._index.get(entry_id)
        if path and path.exists():
            path.unlink()
            del self._index[entry_id]
            return True
        return False


class EpisodicMemorySystem:
    """Manages episodic memories with retrieval by similarity, recency, importance."""

    def __init__(self, store: MemoryStore, max_entries: int = 10000):
        self.store = store
        self.max_entries = max_entries
        self._recency_index: deque[str] = deque(maxlen=max_entries)

    def add(self, memory: EpisodicMemory) -> str:
        self.store.save(memory)
        self._recency_index.append(memory.id)
        self._enforce_capacity()
        return memory.id

    def _enforce_capacity(self) -> None:
        if len(self._recency_index) > self.max_entries:
            oldest_id = self._recency_index.popleft()
            self.store.delete(oldest_id)

    def retrieve_by_similarity(self, query: str, top_k: int = 5) -> list[EpisodicMemory]:
        """Simple text similarity retrieval (replace with embeddings in production)."""
        all_memories = self.store.query()
        episodic = [m for m in all_memories if isinstance(m, EpisodicMemory)]
        scored = []
        query_words = set(query.lower().split())
        for mem in episodic:
            mem_words = set(mem.description.lower().split())
            overlap = len(query_words & mem_words)
            if overlap > 0:
                score = overlap / len(query_words | mem_words)
                score *= mem.importance
                scored.append((score, mem))
        scored.sort(key=lambda x: x[0], reverse=True)
        return [m for _, m in scored[:top_k]]

    def retrieve_by_recency(self, top_k: int = 10) -> list[EpisodicMemory]:
        recent_ids = list(self._recency_index)[-top_k:]
        memories = []
        for eid in reversed(recent_ids):
            mem = self.store.load(eid)
            if isinstance(mem, EpisodicMemory):
                memories.append(mem)
        return memories

    def retrieve_by_importance(self, top_k: int = 10) -> list[EpisodicMemory]:
        all_memories = self.store.query()
        episodic = [m for m in all_memories if isinstance(m, EpisodicMemory)]
        episodic.sort(key=lambda m: m.importance, reverse=True)
        return episodic[:top_k]

    def retrieve_combined(self, query: str, top_k: int = 10,
                          recency_weight: float = 0.3,
                          importance_weight: float = 0.4,
                          similarity_weight: float = 0.3) -> list[EpisodicMemory]:
        """Combined retrieval with weighted scoring."""
        all_memories = self.store.query()
        episodic = [m for m in all_memories if isinstance(m, EpisodicMemory)]
        now = time.time()

        scored = []
        query_words = set(query.lower().split())
        for mem in episodic:
            # Similarity
            mem_words = set(mem.description.lower().split())
            overlap = len(query_words & mem_words)
            sim_score = overlap / len(query_words | mem_words) if (query_words | mem_words) else 0

            # Recency (exponential decay)
            age_hours = (now - mem.timestamp) / 3600
            recency_score = 2 ** (-age_hours / 24)  # Half-life of 24 hours

            # Importance
            imp_score = mem.importance

            total = (similarity_weight * sim_score +
                     recency_weight * recency_score +
                     importance_weight * imp_score)
            scored.append((total, mem))

        scored.sort(key=lambda x: x[0], reverse=True)
        return [m for _, m in scored[:top_k]]


class SemanticMemorySystem:
    """Manages semantic knowledge as a knowledge graph."""

    def __init__(self, store: MemoryStore):
        self.store = store
        self._subject_index: dict[str, set[str]] = {}  # subject -> entry_ids

    def add(self, memory: SemanticMemory) -> str:
        self.store.save(memory)
        if memory.subject not in self._subject_index:
            self._subject_index[memory.subject] = set()
        self._subject_index[memory.subject].add(memory.id)
        return memory.id

    def add_fact(self, subject: str, predicate: str, object_: str,
                 confidence: float = 1.0, source: str = "observation",
                 expires_at: Optional[float] = None) -> str:
        memory = SemanticMemory(
            subject=subject,
            predicate=predicate,
            object=object_,
            confidence=confidence,
            source=source,
            expires_at=expires_at
        )
        return self.add(memory)

    def get_facts(self, subject: str) -> list[SemanticMemory]:
        entry_ids = self._subject_index.get(subject, set())
        facts = []
        for eid in entry_ids:
            mem = self.store.load(eid)
            if isinstance(mem, SemanticMemory) and (mem.expires_at is None or mem.expires_at > time.time()):
                facts.append(mem)
        return facts

    def query_triples(self, subject: Optional[str] = None,
                      predicate: Optional[str] = None,
                      object_: Optional[str] = None) -> list[SemanticMemory]:
        all_memories = self.store.query()
        semantic = [m for m in all_memories if isinstance(m, SemanticMemory)]
        results = []
        for mem in semantic:
            if mem.expires_at and mem.expires_at <= time.time():
                continue
            if subject and mem.subject != subject:
                continue
            if predicate and mem.predicate != predicate:
                continue
            if object_ and mem.object != object_:
                continue
            results.append(mem)
        return results

    def update_confidence(self, entry_id: str, new_confidence: float) -> bool:
        mem = self.store.load(entry_id)
        if isinstance(mem, SemanticMemory):
            mem.confidence = max(0.0, min(1.0, new_confidence))
            self.store.save(mem)
            return True
        return False

    def contradict(self, subject: str, predicate: str, object_: str) -> list[str]:
        """Find and mark contradictory facts."""
        facts = self.query_triples(subject=subject, predicate=predicate)
        contradicted = []
        for fact in facts:
            if fact.object != object_:
                fact.confidence *= 0.5  # Reduce confidence
                self.store.save(fact)
                contradicted.append(fact.id)
        return contradicted


class WorkingMemorySystem:
    """Short-term working memory with attention and decay."""

    def __init__(self, store: MemoryStore, capacity: int = 50, default_ttl: float = 300):
        self.store = store
        self.capacity = capacity
        self.default_ttl = default_ttl
        self._attention_weights: dict[str, float] = {}

    def add(self, content: str, context_type: str,
            relevance: float = 1.0, ttl: Optional[float] = None,
            metadata: Optional[dict] = None) -> str:
        entry = WorkingMemoryEntry(
            content=content,
            context_type=context_type,
            relevance_score=relevance,
            expires_at=time.time() + (ttl or self.default_ttl),
            metadata=metadata or {}
        )
        self.store.save(entry)
        self._attention_weights[entry.id] = relevance
        self._enforce_capacity()
        return entry.id

    def _enforce_capacity(self) -> None:
        all_entries = self.store.query()
        working = [e for e in all_entries if isinstance(e, WorkingMemoryEntry)]
        if len(working) > self.capacity:
            # Remove lowest attention + oldest
            working.sort(key=lambda e: (self._attention_weights.get(e.id, 0), e.timestamp))
            for entry in working[:len(working) - self.capacity]:
                self.store.delete(entry.id)
                self._attention_weights.pop(entry.id, None)

    def get_current_context(self, context_type: Optional[str] = None) -> list[WorkingMemoryEntry]:
        all_entries = self.store.query()
        working = [e for e in all_entries if isinstance(e, WorkingMemoryEntry)]
        now = time.time()
        working = [e for e in working if e.expires_at > now]
        if context_type:
            working = [e for e in working if e.context_type == context_type]
        working.sort(key=lambda e: self._attention_weights.get(e.id, 0), reverse=True)
        return working

    def focus_attention(self, entry_id: str, weight: float = 2.0) -> bool:
        """Increase attention weight for an entry."""
        entry = self.store.load(entry_id)
        if isinstance(entry, WorkingMemoryEntry):
            self._attention_weights[entry_id] = weight
            return True
        return False

    def decay_attention(self, factor: float = 0.9) -> None:
        """Decay all attention weights."""
        for eid in self._attention_weights:
            self._attention_weights[eid] *= factor


class MemoryManager:
    """Unified memory manager coordinating all three tiers."""

    def __init__(self, base_path: Optional[Path] = None, max_episodic: int = 10000):
        if base_path:
            store = FileStore(base_path)
        else:
            store = InMemoryStore()

        self.episodic = EpisodicMemorySystem(store, max_episodic)
        self.semantic = SemanticMemorySystem(store)
        self.working = WorkingMemorySystem(store)
        self.store = store

    def record_event(self, event_type: str, description: str,
                     location: tuple[float, float, float],
                     participants: list[str],
                     emotional_valence: float = 0.0,
                     outcome: str = "ongoing",
                     importance: float = 1.0) -> str:
        """Record an episodic memory and extract semantic facts."""
        memory = EpisodicMemory(
            event_type=event_type,
            description=description,
            location=location,
            participants=participants,
            emotional_valence=emotional_valence,
            outcome=outcome,
            importance=importance
        )
        eid = self.episodic.add(memory)

        # Extract semantic facts from event
        self._extract_semantic_facts(memory)

        # Add to working memory for immediate context
        self.working.add(
            content=f"{event_type}: {description}",
            context_type="recent_event",
            relevance=importance,
            metadata={"event_id": eid, "event_type": event_type}
        )
        return eid

    def _extract_semantic_facts(self, memory: EpisodicMemory) -> None:
        """Extract semantic knowledge from episodic memory."""
        for participant in memory.participants:
            # Participant was at location
            self.semantic.add_fact(
                subject=participant,
                predicate="was_at",
                object_=f"{memory.location[0]},{memory.location[1]},{memory.location[2]}",
                confidence=0.8,
                source="episodic_memory"
            )

        # Event outcome as fact
        if memory.outcome != "ongoing":
            self.semantic.add_fact(
                subject=memory.id,
                predicate="outcome",
                object_=memory.outcome,
                confidence=0.9,
                source="episodic_memory"
            )

    def get_context_for_llm(self, query: str, max_tokens: int = 2000) -> str:
        """Build context string for LLM prompt from all memory tiers."""
        parts = []

        # Working memory (highest priority)
        working = self.working.get_current_context()
        if working:
            parts.append("=== CURRENT CONTEXT ===")
            for w in working[:10]:
                parts.append(f"[{w.context_type}] {w.content}")

        # Relevant episodic memories
        episodic = self.episodic.retrieve_combined(query, top_k=5)
        if episodic:
            parts.append("\n=== RELEVANT MEMORIES ===")
            for e in episodic:
                parts.append(f"[{e.event_type}] {e.description} (importance: {e.importance:.2f})")

        # Relevant semantic facts
        query_words = set(query.lower().split())
        for word in query_words:
            facts = self.semantic.query_triples(subject=word)
            if facts:
                parts.append(f"\n=== KNOWLEDGE: {word} ===")
                for f in facts[:5]:
                    parts.append(f"  {f.subject} {f.predicate} {f.object} (conf: {f.confidence:.2f})")

        context = "\n".join(parts)
        # Truncate to token budget (rough estimate: 1 token ≈ 4 chars)
        if len(context) > max_tokens * 4:
            context = context[:max_tokens * 4] + "\n[TRUNCATED]"
        return context

    def save_all(self, path: Path) -> None:
        """Export all memories to a single file for backup."""
        all_entries = self.store.query()
        data = [e.to_dict() for e in all_entries]
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

    def load_all(self, path: Path) -> int:
        """Import memories from backup file."""
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        count = 0
        for entry_data in data:
            entry = MemoryEntry.from_dict(entry_data)
            self.store.save(entry)
            count += 1
        return count
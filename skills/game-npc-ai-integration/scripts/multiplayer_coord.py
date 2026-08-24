"""
Multi-Player Coordination — Party Chat, Shared Knowledge, Combat Tactics
Enables NPCs to coordinate with players and other NPCs in multiplayer scenarios.
"""

from __future__ import annotations
import time
import threading
import uuid
from dataclasses import dataclass, field, asdict
from typing import Optional
from enum import Enum
from collections import defaultdict
from abc import ABC, abstractmethod


class PartyRole(Enum):
    TANK = "tank"
    DPS_MELEE = "dps_melee"
    DPS_RANGED = "dps_ranged"
    HEALER = "healer"
    SUPPORT = "support"
    SCOUT = "scout"
    LEADER = "leader"
    NONE = "none"


class CombatState(Enum):
    PEACE = "peace"
    ENGAGING = "engaging"
    COMBAT = "combat"
    RETREATING = "retreating"
    REGROUPING = "regrouping"


@dataclass
class PartyMember:
    """Member of a party (player or NPC)."""
    entity_id: str
    name: str
    is_npc: bool = False
    role: PartyRole = PartyRole.NONE
    level: int = 1
    health: float = 100.0
    max_health: float = 100.0
    mana: float = 100.0
    max_mana: float = 100.0
    position: tuple[float, float, float] = (0.0, 0.0, 0.0)
    status_effects: list[str] = field(default_factory=list)
    last_update: float = field(default_factory=time.time)

    def health_percent(self) -> float:
        return self.health / self.max_health if self.max_health > 0 else 0.0

    def is_alive(self) -> bool:
        return self.health > 0

    def to_dict(self) -> dict:
        data = asdict(self)
        data["role"] = self.role.value
        return data

    @classmethod
    def from_dict(cls, data: dict) -> PartyMember:
        data = data.copy()
        data["role"] = PartyRole(data.get("role", "none"))
        return cls(**data)


@dataclass
class ChatMessage:
    """Message in party chat."""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    sender_id: str = ""
    sender_name: str = ""
    content: str = ""
    timestamp: float = field(default_factory=time.time)
    message_type: str = "chat"  # chat, system, tactic, callout
    metadata: dict = field(default_factory=dict)

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class SharedKnowledgeEntry:
    """Entry in shared knowledge base."""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    topic: str = ""  # location, enemy, resource, quest, secret
    content: str = ""
    source_id: str = ""  # entity that discovered/shared
    confidence: float = 1.0
    timestamp: float = field(default_factory=time.time)
    expires_at: Optional[float] = None
    verified_by: list[str] = field(default_factory=list)

    def is_expired(self) -> bool:
        if self.expires_at is None:
            return False
        return time.time() > self.expires_at

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class TacticalCallout:
    """Tactical callout during combat."""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    caller_id: str = ""
    callout_type: str = ""  # target_focus, peel, heal, interrupt, cooldown, retreat, engage
    target_id: str = ""
    position: tuple[float, float, float] = (0.0, 0.0, 0.0)
    urgency: float = 1.0  # 0.0 to 1.0
    timestamp: float = field(default_factory=time.time)
    expires_at: float = field(default_factory=lambda: time.time() + 10.0)

    def is_expired(self) -> bool:
        return time.time() > self.expires_at

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class CombatAssignment:
    """Role assignment for combat."""
    entity_id: str
    role: PartyRole
    priority_target: str = ""
    secondary_targets: list[str] = field(default_factory=list)
    position_assignment: tuple[float, float, float] = (0.0, 0.0, 0.0)
    special_instructions: str = ""


class PartyChat:
    """Party chat system with history and filtering."""

    def __init__(self, max_history: int = 500):
        self.max_history = max_history
        self.messages: list[ChatMessage] = []
        self._lock = threading.Lock()

    def send(self, sender_id: str, sender_name: str, content: str,
             message_type: str = "chat", metadata: dict = None) -> ChatMessage:
        msg = ChatMessage(
            sender_id=sender_id,
            sender_name=sender_name,
            content=content,
            message_type=message_type,
            metadata=metadata or {}
        )
        with self._lock:
            self.messages.append(msg)
            if len(self.messages) > self.max_history:
                self.messages.pop(0)
        return msg

    def get_recent(self, count: int = 50, since: float = None) -> list[ChatMessage]:
        with self._lock:
            msgs = self.messages
            if since:
                msgs = [m for m in msgs if m.timestamp > since]
            return msgs[-count:]

    def get_by_type(self, message_type: str, count: int = 20) -> list[ChatMessage]:
        with self._lock:
            msgs = [m for m in self.messages if m.message_type == message_type]
            return msgs[-count:]

    def search(self, query: str, count: int = 20) -> list[ChatMessage]:
        with self._lock:
            query_lower = query.lower()
            results = [m for m in self.messages if query_lower in m.content.lower()]
            return results[-count:]


class SharedKnowledgeBase:
    """Shared knowledge base synchronized across party members."""

    def __init__(self, max_entries: int = 1000):
        self.max_entries = max_entries
        self.entries: dict[str, SharedKnowledgeEntry] = {}  # id -> entry
        self.by_topic: defaultdict[str, set[str]] = defaultdict(set)  # topic -> entry_ids
        self._lock = threading.Lock()

    def add(self, entry: SharedKnowledgeEntry) -> str:
        with self._lock:
            self.entries[entry.id] = entry
            self.by_topic[entry.topic].add(entry.id)
            self._enforce_capacity()
            return entry.id

    def add_knowledge(self, topic: str, content: str, source_id: str,
                      confidence: float = 1.0, expires_in: float = None) -> str:
        entry = SharedKnowledgeEntry(
            topic=topic,
            content=content,
            source_id=source_id,
            confidence=confidence,
            expires_at=time.time() + expires_in if expires_in else None
        )
        return self.add(entry)

    def _enforce_capacity(self) -> None:
        if len(self.entries) > self.max_entries:
            # Remove oldest expired entries first
            now = time.time()
            expired = [eid for eid, e in self.entries.items() if e.is_expired()]
            for eid in expired:
                self._remove_entry(eid)

            # If still over capacity, remove oldest
            if len(self.entries) > self.max_entries:
                sorted_entries = sorted(self.entries.items(), key=lambda x: x[1].timestamp)
                for eid, _ in sorted_entries[:len(self.entries) - self.max_entries]:
                    self._remove_entry(eid)

    def _remove_entry(self, entry_id: str) -> None:
        entry = self.entries.pop(entry_id, None)
        if entry:
            self.by_topic[entry.topic].discard(entry_id)

    def get(self, entry_id: str) -> Optional[SharedKnowledgeEntry]:
        with self._lock:
            entry = self.entries.get(entry_id)
            if entry and entry.is_expired():
                self._remove_entry(entry_id)
                return None
            return entry

    def get_by_topic(self, topic: str, min_confidence: float = 0.0) -> list[SharedKnowledgeEntry]:
        with self._lock:
            entry_ids = self.by_topic.get(topic, set())
            results = []
            for eid in entry_ids:
                entry = self.entries.get(eid)
                if entry and not entry.is_expired() and entry.confidence >= min_confidence:
                    results.append(entry)
            results.sort(key=lambda e: (e.confidence, e.timestamp), reverse=True)
            return results

    def verify(self, entry_id: str, verifier_id: str) -> bool:
        with self._lock:
            entry = self.entries.get(entry_id)
            if entry and verifier_id not in entry.verified_by:
                entry.verified_by.append(verifier_id)
                entry.confidence = min(1.0, entry.confidence + 0.1)
                return True
            return False

    def contradict(self, entry_id: str, contradictor_id: str) -> bool:
        with self._lock:
            entry = self.entries.get(entry_id)
            if entry:
                entry.confidence = max(0.0, entry.confidence - 0.2)
                return True
            return False

    def get_all_topics(self) -> list[str]:
        with self._lock:
            return list(self.by_topic.keys())

    def cleanup_expired(self) -> int:
        with self._lock:
            now = time.time()
            expired = [eid for eid, e in self.entries.items() if e.expires_at and e.expires_at < now]
            for eid in expired:
                self._remove_entry(eid)
            return len(expired)


class CombatTactics:
    """Combat tactics coordinator for party."""

    def __init__(self):
        self.party_members: dict[str, PartyMember] = {}
        self.assignments: dict[str, CombatAssignment] = {}  # entity_id -> assignment
        self.callouts: list[TacticalCallout] = []
        self.combat_state = CombatState.PEACE
        self.combat_start_time: float = 0
        self.focus_target: str = ""
        self._lock = threading.Lock()

    def update_member(self, member: PartyMember) -> None:
        with self._lock:
            self.party_members[member.entity_id] = member

    def remove_member(self, entity_id: str) -> None:
        with self._lock:
            self.party_members.pop(entity_id, None)
            self.assignments.pop(entity_id, None)

    def get_member(self, entity_id: str) -> Optional[PartyMember]:
        with self._lock:
            return self.party_members.get(entity_id)

    def get_all_members(self) -> list[PartyMember]:
        with self._lock:
            return list(self.party_members.values())

    def get_living_members(self) -> list[PartyMember]:
        with self._lock:
            return [m for m in self.party_members.values() if m.is_alive()]

    def get_members_by_role(self, role: PartyRole) -> list[PartyMember]:
        with self._lock:
            return [m for m in self.party_members.values() if m.role == role and m.is_alive()]

    def assign_roles(self, role_assignments: dict[str, PartyRole]) -> None:
        with self._lock:
            for entity_id, role in role_assignments.items():
                if entity_id in self.party_members:
                    self.party_members[entity_id].role = role

    def auto_assign_roles(self) -> dict[str, PartyRole]:
        """Automatically assign roles based on class/spec (override in game-specific adapter)."""
        assignments = {}
        for member in self.get_living_members():
            # Default: first tank gets tank, first healer gets healer, rest DPS
            pass
        return assignments

    def set_focus_target(self, target_id: str, caller_id: str = "") -> None:
        with self._lock:
            self.focus_target = target_id
            if caller_id:
                self.add_callout(TacticalCallout(
                    caller_id=caller_id,
                    callout_type="target_focus",
                    target_id=target_id,
                    urgency=0.9
                ))

    def get_focus_target(self) -> str:
        with self._lock:
            return self.focus_target

    def add_callout(self, callout: TacticalCallout) -> None:
        with self._lock:
            self.callouts.append(callout)
            # Clean expired
            now = time.time()
            self.callouts = [c for c in self.callouts if not c.is_expired()]

    def get_active_callouts(self, for_entity: str = None) -> list[TacticalCallout]:
        with self._lock:
            now = time.time()
            active = [c for c in self.callouts if not c.is_expired()]
            if for_entity:
                # Filter callouts relevant to this entity
                relevant = []
                for c in active:
                    if c.callout_type in ["heal", "peel"] and c.target_id == for_entity:
                        relevant.append(c)
                    elif c.callout_type in ["target_focus", "interrupt", "engage"]:
                        relevant.append(c)
                return relevant
            return active

    def enter_combat(self) -> None:
        with self._lock:
            if self.combat_state == CombatState.PEACE:
                self.combat_state = CombatState.ENGAGING
                self.combat_start_time = time.time()

    def engage_combat(self) -> None:
        with self._lock:
            self.combat_state = CombatState.COMBAT

    def retreat(self) -> None:
        with self._lock:
            self.combat_state = CombatState.RETREATING

    def regroup(self) -> None:
        with self._lock:
            self.combat_state = CombatState.REGROUPING

    def end_combat(self) -> None:
        with self._lock:
            self.combat_state = CombatState.PEACE
            self.focus_target = ""
            self.callouts.clear()

    def get_combat_state(self) -> CombatState:
        with self._lock:
            return self.combat_state

    def get_tactical_advice(self, entity_id: str) -> list[str]:
        """Generate tactical advice for a specific party member."""
        with self._lock:
            advice = []
            member = self.party_members.get(entity_id)
            if not member:
                return advice

            # Health-based advice
            if member.health_percent() < 0.3:
                advice.append("CRITICAL: Health below 30% - seek healing or retreat")
            elif member.health_percent() < 0.5:
                advice.append("WARNING: Health below 50% - play defensively")

            # Role-based advice
            if member.role == PartyRole.TANK:
                if self.focus_target and not self._has_aggro(member.entity_id):
                    advice.append(f"TAUNT: Focus target {self.focus_target} is not on you")
            elif member.role == PartyRole.HEALER:
                low_health = [m for m in self.get_living_members() if m.health_percent() < 0.4]
                if low_health:
                    advice.append(f"HEAL PRIORITY: {len(low_health)} allies below 40% health")
            elif member.role in (PartyRole.DPS_MELEE, PartyRole.DPS_RANGED):
                if self.focus_target:
                    advice.append(f"DPS: Focus fire on {self.focus_target}")
                else:
                    advice.append("DPS: No focus target - pick priority target")

            # Callout-based advice
            callouts = self.get_active_callouts(entity_id)
            for callout in callouts:
                if callout.callout_type == "heal" and callout.target_id == entity_id:
                    advice.append("INCOMING HEAL: Stand still for heal")
                elif callout.callout_type == "peel" and callout.target_id == entity_id:
                    advice.append("PEEL REQUESTED: Enemies on you - kite to tank")

            return advice

    def _has_aggro(self, entity_id: str) -> bool:
        """Check if entity has aggro on focus target (game-specific)."""
        # Override in adapter
        return False


class PartyManager:
    """High-level party management coordinating chat, knowledge, and combat."""

    def __init__(self, party_id: str, leader_id: str):
        self.party_id = party_id
        self.leader_id = leader_id
        self.chat = PartyChat()
        self.knowledge = SharedKnowledgeBase()
        self.tactics = CombatTactics()
        self.members: dict[str, PartyMember] = {}
        self.invited: set[str] = set()
        self._lock = threading.Lock()

    def add_member(self, member: PartyMember) -> bool:
        with self._lock:
            if len(self.members) >= 5:  # Standard party size
                return False
            self.members[member.entity_id] = member
            self.tactics.update_member(member)
            self.chat.send("SYSTEM", "Party", f"{member.name} joined the party", "system")
            return True

    def remove_member(self, entity_id: str) -> bool:
        with self._lock:
            member = self.members.pop(entity_id, None)
            if member:
                self.tactics.remove_member(entity_id)
                self.chat.send("SYSTEM", "Party", f"{member.name} left the party", "system")
                return True
            return False

    def invite(self, entity_id: str, entity_name: str) -> None:
        with self._lock:
            self.invited.add(entity_id)
            self.chat.send("SYSTEM", "Party", f"{entity_name} invited to party", "system")

    def accept_invite(self, entity_id: str, member: PartyMember) -> bool:
        with self._lock:
            if entity_id in self.invited:
                self.invited.remove(entity_id)
                return self.add_member(member)
            return False

    def decline_invite(self, entity_id: str) -> bool:
        with self._lock:
            return self.invited.discard(entity_id)

    def send_chat(self, sender_id: str, content: str, message_type: str = "chat") -> Optional[ChatMessage]:
        with self._lock:
            member = self.members.get(sender_id)
            if member:
                return self.chat.send(sender_id, member.name, content, message_type)
            return None

    def share_knowledge(self, source_id: str, topic: str, content: str,
                        confidence: float = 1.0, expires_in: float = 3600) -> str:
        with self._lock:
            return self.knowledge.add_knowledge(topic, content, source_id, confidence, expires_in)

    def get_knowledge(self, topic: str, min_confidence: float = 0.5) -> list[SharedKnowledgeEntry]:
        with self._lock:
            return self.knowledge.get_by_topic(topic, min_confidence)

    def start_combat(self) -> None:
        with self._lock:
            self.tactics.enter_combat()
            self.chat.send("SYSTEM", "Party", "Combat engaged!", "system")

    def end_combat(self) -> None:
        with self._lock:
            self.tactics.end_combat()
            self.chat.send("SYSTEM", "Party", "Combat ended", "system")

    def callout(self, caller_id: str, callout_type: str, target_id: str = "",
                position: tuple = (0,0,0), urgency: float = 1.0) -> TacticalCallout:
        with self._lock:
            caller = self.members.get(caller_id)
            caller_name = caller.name if caller else "Unknown"
            callout = TacticalCallout(
                caller_id=caller_id,
                callout_type=callout_type,
                target_id=target_id,
                position=position,
                urgency=urgency
            )
            self.tactics.add_callout(callout)

            # Also send as chat message for visibility
            type_names = {
                "target_focus": "FOCUS TARGET",
                "peel": "PEEL NEEDED",
                "heal": "HEAL REQUEST",
                "interrupt": "INTERRUPT",
                "cooldown": "COOLDOWN",
                "retreat": "RETREAT",
                "engage": "ENGAGE"
            }
            label = type_names.get(callout_type, callout_type.upper())
            self.chat.send(caller_id, caller_name, f"[{label}] {target_id or ''}", "callout")

            return callout

    def get_tactical_advice(self, entity_id: str) -> list[str]:
        with self._lock:
            return self.tactics.get_tactical_advice(entity_id)

    def get_party_status(self) -> dict:
        with self._lock:
            return {
                "party_id": self.party_id,
                "leader_id": self.leader_id,
                "member_count": len(self.members),
                "members": {eid: m.to_dict() for eid, m in self.members.items()},
                "combat_state": self.tactics.get_combat_state().value,
                "focus_target": self.tactics.get_focus_target(),
                "knowledge_topics": self.knowledge.get_all_topics()
            }


# Game-specific adapters would extend these base classes
# Example structure for Mineflayer:
#
# class MineflayerPartyManager(PartyManager):
#     def __init__(self, bot, party_id: str, leader_id: str):
#         super().__init__(party_id, leader_id)
#         self.bot = bot
#         # Listen for chat events, combat events, etc.
#
#     def auto_assign_roles(self):
#         # Assign based on armor, weapons, etc.
#         pass


# Example structure for FiveM/RageMP:
#
# class GTAPartyManager(PartyManager):
#     def __init__(self, player_ped, party_id: str, leader_id: str):
#         super().__init__(party_id, leader_id)
#         self.player_ped = player_ped
#         # Listen for sync events from server
#
#     def auto_assign_roles(self):
#         # Assign based on loadout, vehicle, etc.
#         pass
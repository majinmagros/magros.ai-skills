"""
NPC Personality Engine — Traits, Quirks, Speech Patterns, Relationships
Defines and enforces consistent NPC personality across all interactions.
"""

from __future__ import annotations
import json
import random
from dataclasses import dataclass, field, asdict
from typing import Optional
from enum import Enum
from pathlib import Path
import math


class TraitCategory(Enum):
    BIG_FIVE = "big_five"
    GAME_SPECIFIC = "game_specific"


@dataclass
class Trait:
    """Single personality trait with score and category."""
    name: str
    value: float  # -1.0 to 1.0
    category: TraitCategory = TraitCategory.GAME_SPECIFIC
    description: str = ""

    def __post_init__(self):
        self.value = max(-1.0, min(1.0, self.value))

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "value": self.value,
            "category": self.category.value,
            "description": self.description
        }

    @classmethod
    def from_dict(cls, data: dict) -> Trait:
        return cls(
            name=data["name"],
            value=data["value"],
            category=TraitCategory(data.get("category", "game_specific")),
            description=data.get("description", "")
        )


# Big Five trait definitions
BIG_FIVE_TRAITS = {
    "openness": Trait("openness", 0.0, TraitCategory.BIG_FIVE,
                      "Curiosity, creativity, willingness to try new things"),
    "conscientiousness": Trait("conscientiousness", 0.0, TraitCategory.BIG_FIVE,
                               "Organization, dependability, discipline"),
    "extraversion": Trait("extraversion", 0.0, TraitCategory.BIG_FIVE,
                          "Sociability, assertiveness, energy from social interaction"),
    "agreeableness": Trait("agreeableness", 0.0, TraitCategory.BIG_FIVE,
                           "Cooperation, trust, compassion"),
    "neuroticism": Trait("neuroticism", 0.0, TraitCategory.BIG_FIVE,
                         "Emotional instability, anxiety, moodiness"),
}

# Game-specific trait definitions
GAME_TRAITS = {
    "bravery": Trait("bravery", 0.0, TraitCategory.GAME_SPECIFIC,
                     "Willingness to face danger, combat initiative"),
    "curiosity": Trait("curiosity", 0.0, TraitCategory.GAME_SPECIFIC,
                       "Drive to explore, investigate, learn"),
    "loyalty": Trait("loyalty", 0.0, TraitCategory.GAME_SPECIFIC,
                     "Faithfulness to allies, faction, promises"),
    "greed": Trait("greed", 0.0, TraitCategory.GAME_SPECIFIC,
                   "Desire for wealth, resources, material gain"),
    "honor": Trait("honor", 0.0, TraitCategory.GAME_SPECIFIC,
                   "Adherence to code, fairness, reputation"),
    "pragmatism": Trait("pragmatism", 0.0, TraitCategory.GAME_SPECIFIC,
                        "Practical over idealistic, ends justify means"),
    "suspicion": Trait("suspicion", 0.0, TraitCategory.GAME_SPECIFIC,
                       "Distrust of strangers, hidden motives"),
    "playfulness": Trait("playfulness", 0.0, TraitCategory.GAME_SPECIFIC,
                         "Humor, teasing, lightheartedness"),
}


@dataclass
class SpeechPattern:
    """Defines how an NPC speaks."""
    formality: float = 0.5  # 0.0 (casual) to 1.0 (formal)
    verbosity: float = 0.5  # 0.0 (terse) to 1.0 (verbose)
    humor: float = 0.3      # 0.0 (serious) to 1.0 (joking)
    dialect_markers: list[str] = field(default_factory=list)  # e.g., ["ye", "aye", "lass"]
    catchphrases: list[str] = field(default_factory=list)
    verbal_tics: list[str] = field(default_factory=list)  # e.g., ["*cough*", "hmm,"]
    emotion_expressions: dict[str, list[str]] = field(default_factory=dict)
    # e.g., {"anger": ["By the gods!", "Curse it!"]}

    def to_dict(self) -> dict:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: dict) -> SpeechPattern:
        return cls(**data)

    def apply(self, text: str, emotion: str = "neutral") -> str:
        """Apply speech pattern to generated text."""
        result = text

        # Apply verbal tics randomly
        if self.verbal_tics and random.random() < 0.15:
            tic = random.choice(self.verbal_tics)
            if random.random() < 0.5:
                result = f"{tic} {result}"
            else:
                result = f"{result} {tic}"

        # Apply catchphrase randomly
        if self.catchphrases and random.random() < 0.1:
            phrase = random.choice(self.catchphrases)
            result = f"{result} {phrase}"

        # Apply dialect markers (simple substitution)
        for marker in self.dialect_markers:
            if marker in ["ye", "ya"]:
                result = result.replace("you", marker).replace("You", marker.capitalize())

        # Apply emotion expression
        if emotion in self.emotion_expressions and self.emotion_expressions[emotion]:
            if random.random() < 0.3:
                expr = random.choice(self.emotion_expressions[emotion])
                result = f"{expr} {result}"

        return result


@dataclass
class Quirk:
    """Behavioral quirk that manifests in specific situations."""
    name: str
    trigger: str  # Situation that triggers quirk
    behavior: str  # Description of behavior
    probability: float = 0.3
    cooldown: float = 60.0  # Seconds between triggers
    last_triggered: float = 0.0

    def should_trigger(self, current_time: float) -> bool:
        if current_time - self.last_triggered < self.cooldown:
            return False
        return random.random() < self.probability

    def trigger(self, current_time: float) -> str:
        self.last_triggered = current_time
        return self.behavior


class PersonalityProfile:
    """Complete personality profile for an NPC."""

    PRESETS = {
        "villager_merchant": {
            "big_five": {"openness": 0.2, "conscientiousness": 0.7, "extraversion": 0.6,
                        "agreeableness": 0.8, "neuroticism": 0.2},
            "game": {"bravery": 0.1, "curiosity": 0.3, "loyalty": 0.5, "greed": 0.7,
                    "honor": 0.6, "pragmatism": 0.8, "suspicion": 0.4, "playfulness": 0.2},
            "speech": {"formality": 0.6, "verbosity": 0.5, "humor": 0.2,
                      "dialect_markers": ["friend", "good sir"], "catchphrases": ["Fair trade!", "Best price in town!"],
                      "verbal_tics": ["*rubs hands*", "*counts coins*"], "emotion_expressions": {
                          "joy": ["Excellent!", "Wonderful!"],
                          "anger": ["Highway robbery!", "Unacceptable!"]
                      }},
            "quirks": [
                {"name": "haggle_reflex", "trigger": "trade_offer", "behavior": "Automatically counters any offer", "probability": 0.8},
                {"name": "item_appraisal", "trigger": "see_rare_item", "behavior": "Comments on item value", "probability": 0.6},
            ]
        },
        "city_guard": {
            "big_five": {"openness": 0.2, "conscientiousness": 0.9, "extraversion": 0.3,
                        "agreeableness": 0.4, "neuroticism": 0.2},
            "game": {"bravery": 0.8, "curiosity": 0.2, "loyalty": 0.9, "greed": 0.1,
                    "honor": 0.9, "pragmatism": 0.7, "suspicion": 0.6, "playfulness": 0.1},
            "speech": {"formality": 0.8, "verbosity": 0.3, "humor": 0.1,
                      "dialect_markers": ["citizen", "halt"], "catchphrases": ["Move along.", "The law is the law."],
                      "verbal_tics": ["*adjusts helmet*", "*hand on sword*"], "emotion_expressions": {
                          "anger": ["You're under arrest!", "Stop right there!"],
                          "fear": ["Reinforcements!", "Fall back!"]
                      }},
            "quirks": [
                {"name": "patrol_route", "trigger": "idle", "behavior": "Walks patrol route", "probability": 0.9},
                {"name": "suspicious_check", "trigger": "see_hooded_figure", "behavior": "Demands identification", "probability": 0.7},
            ]
        },
        "wandering_scholar": {
            "big_five": {"openness": 0.9, "conscientiousness": 0.6, "extraversion": 0.4,
                        "agreeableness": 0.7, "neuroticism": 0.3},
            "game": {"bravery": 0.3, "curiosity": 0.9, "loyalty": 0.4, "greed": 0.2,
                    "honor": 0.5, "pragmatism": 0.4, "suspicion": 0.2, "playfulness": 0.5},
            "speech": {"formality": 0.7, "verbosity": 0.8, "humor": 0.3,
                      "dialect_markers": ["fascinating", "observe"], "catchphrases": ["Most intriguing...", "Let me record this."],
                      "verbal_tics": ["*adjusts spectacles*", "*scribbles notes*"], "emotion_expressions": {
                          "joy": ["A remarkable discovery!", "This changes everything!"],
                          "surprise": ["Extraordinary!", "I never expected..."]
                      }},
            "quirks": [
                {"name": "lore_dump", "trigger": "asked_about_topic", "behavior": "Gives extensive historical context", "probability": 0.7},
                {"name": "sketch_environment", "trigger": "new_location", "behavior": "Stops to sketch surroundings", "probability": 0.5},
            ]
        },
        "street_urchin": {
            "big_five": {"openness": 0.6, "conscientiousness": 0.2, "extraversion": 0.7,
                        "agreeableness": 0.3, "neuroticism": 0.5},
            "game": {"bravery": 0.4, "curiosity": 0.7, "loyalty": 0.3, "greed": 0.8,
                    "honor": 0.1, "pragmatism": 0.9, "suspicion": 0.7, "playfulness": 0.6},
            "speech": {"formality": 0.1, "verbosity": 0.4, "humor": 0.5,
                      "dialect_markers": ["mate", "oi", "copper"], "catchphrases": ["Shiny!", "Leg it!"],
                      "verbal_tics": ["*pickpocket motion*", "*glances around*"], "emotion_expressions": {
                          "joy": ["Result!", "Nice one!"],
                          "fear": ["Run!", "Bail!"]
                      }},
            "quirks": [
                {"name": "pickpocket_attempt", "trigger": "near_wealthy_npc", "behavior": "Attempts to steal", "probability": 0.4},
                {"name": "gossip_share", "trigger": "friendly_conversation", "behavior": "Shares rumor for coin", "probability": 0.6},
            ]
        },
        "grizzled_veteran": {
            "big_five": {"openness": 0.3, "conscientiousness": 0.7, "extraversion": 0.2,
                        "agreeableness": 0.3, "neuroticism": 0.4},
            "game": {"bravery": 0.9, "curiosity": 0.2, "loyalty": 0.7, "greed": 0.2,
                    "honor": 0.8, "pragmatism": 0.9, "suspicion": 0.8, "playfulness": 0.1},
            "speech": {"formality": 0.4, "verbosity": 0.3, "humor": 0.2,
                      "dialect_markers": ["kid", "rookie", "back in my day"], "catchphrases": ["I've seen things...", "War changes a man."],
                      "verbal_tics": ["*spits*", "*stares into distance*"], "emotion_expressions": {
                          "anger": ["You know nothing of war.", "Don't test me."],
                          "sadness": ["Another name for the wall.", "They were good kids."]
                      }},
            "quirks": [
                {"name": "war_story", "trigger": "campfire_rest", "behavior": "Tells grim war story", "probability": 0.5},
                {"name": "tactical_assessment", "trigger": "combat_start", "behavior": "Issues tactical commands", "probability": 0.8},
            ]
        }
    }

    def __init__(self, name: str = "Custom NPC"):
        self.name = name
        self.traits: dict[str, Trait] = {}
        self.speech = SpeechPattern()
        self.quirks: list[Quirk] = []
        self._load_defaults()

    def _load_defaults(self) -> None:
        """Load default trait values."""
        for trait in BIG_FIVE_TRAITS.values():
            self.traits[trait.name] = Trait(trait.name, 0.0, trait.category, trait.description)
        for trait in GAME_TRAITS.values():
            self.traits[trait.name] = Trait(trait.name, 0.0, trait.category, trait.description)

    @classmethod
    def from_preset(cls, preset_name: str) -> PersonalityProfile:
        """Create profile from predefined preset."""
        if preset_name not in cls.PRESETS:
            raise ValueError(f"Unknown preset: {preset_name}. Available: {list(cls.PRESETS.keys())}")

        preset = cls.PRESETS[preset_name]
        profile = cls(preset_name)

        # Set Big Five traits
        for name, value in preset.get("big_five", {}).items():
            if name in profile.traits:
                profile.traits[name].value = value

        # Set game traits
        for name, value in preset.get("game", {}).items():
            if name in profile.traits:
                profile.traits[name].value = value

        # Set speech pattern
        speech_data = preset.get("speech", {})
        profile.speech = SpeechPattern.from_dict(speech_data)

        # Set quirks
        for quirk_data in preset.get("quirks", []):
            profile.quirks.append(Quirk(**quirk_data))

        return profile

    def get_trait(self, name: str) -> Optional[float]:
        """Get trait value (-1.0 to 1.0)."""
        trait = self.traits.get(name)
        return trait.value if trait else None

    def set_trait(self, name: str, value: float) -> bool:
        """Set trait value."""
        if name in self.traits:
            self.traits[name].value = max(-1.0, min(1.0, value))
            return True
        return False

    def get_trait_category(self, category: TraitCategory) -> dict[str, float]:
        """Get all traits in a category."""
        return {name: trait.value for name, trait in self.traits.items()
                if trait.category == category}

    def evaluate_action(self, action: str, context: dict) -> float:
        """Evaluate how likely NPC is to take an action based on personality.
        Returns score from -1.0 (very unlikely) to 1.0 (very likely)."""
        action = action.lower()
        score = 0.0

        # Combat actions
        if action in ["attack", "fight", "charge"]:
            score += self.get_trait("bravery") * 0.5
            score -= self.get_trait("neuroticism") * 0.3
            score += self.get_trait("honor") * 0.2

        # Flee/avoid
        elif action in ["flee", "retreat", "avoid"]:
            score -= self.get_trait("bravery") * 0.5
            score += self.get_trait("neuroticism") * 0.3
            score += self.get_trait("pragmatism") * 0.2

        # Trade/negotiate
        elif action in ["trade", "negotiate", "haggle"]:
            score += self.get_trait("greed") * 0.3
            score += self.get_trait("pragmatism") * 0.2
            score += self.get_trait("extraversion") * 0.2

        # Explore/investigate
        elif action in ["explore", "investigate", "search"]:
            score += self.get_trait("curiosity") * 0.5
            score += self.get_trait("openness") * 0.3

        # Help/ally
        elif action in ["help", "ally", "cooperate"]:
            score += self.get_trait("agreeableness") * 0.4
            score += self.get_trait("loyalty") * 0.3
            score -= self.get_trait("suspicion") * 0.2

        # Betray/deceive
        elif action in ["betray", "deceive", "lie"]:
            score -= self.get_trait("honor") * 0.5
            score -= self.get_trait("agreeableness") * 0.3
            score += self.get_trait("pragmatism") * 0.2
            score += self.get_trait("greed") * 0.2

        # Social/flirt
        elif action in ["socialize", "flirt", "charm"]:
            score += self.get_trait("extraversion") * 0.4
            score += self.get_trait("playfulness") * 0.3
            score += self.get_trait("agreeableness") * 0.2

        # Context modifiers
        if context.get("threat_level", 0) > 0.7:
            score += self.get_trait("bravery") * 0.2
            score -= self.get_trait("neuroticism") * 0.2

        if context.get("ally_present", False):
            score += self.get_trait("loyalty") * 0.2

        return max(-1.0, min(1.0, score))

    def generate_response_style(self, emotion: str = "neutral") -> dict:
        """Generate style parameters for LLM response generation."""
        return {
            "formality": self.speech.formality,
            "verbosity": self.speech.verbosity,
            "humor": self.speech.humor,
            "emotion": emotion,
            "dialect_markers": self.speech.dialect_markers,
            "catchphrases": self.speech.catchphrases,
            "verbal_tics": self.speech.verbal_tics,
            "emotion_expressions": self.speech.emotion_expressions.get(emotion, []),
            "trait_influences": {
                "extraversion": self.get_trait("extraversion"),
                "agreeableness": self.get_trait("agreeableness"),
                "neuroticism": self.get_trait("neuroticism"),
                "playfulness": self.get_trait("playfulness"),
            }
        }

    def check_quirks(self, trigger: str, current_time: float) -> list[str]:
        """Check and trigger applicable quirks."""
        behaviors = []
        for quirk in self.quirks:
            if quirk.trigger == trigger and quirk.should_trigger(current_time):
                behaviors.append(quirk.trigger(current_time))
        return behaviors

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "traits": {name: trait.to_dict() for name, trait in self.traits.items()},
            "speech": self.speech.to_dict(),
            "quirks": [{"name": q.name, "trigger": q.trigger, "behavior": q.behavior,
                       "probability": q.probability, "cooldown": q.cooldown}
                      for q in self.quirks]
        }

    def save(self, path: Path) -> None:
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(self.to_dict(), f, ensure_ascii=False, indent=2)

    @classmethod
    def load(cls, path: Path) -> PersonalityProfile:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        profile = cls(data["name"])
        for name, trait_data in data.get("traits", {}).items():
            if name in profile.traits:
                profile.traits[name] = Trait.from_dict(trait_data)
        profile.speech = SpeechPattern.from_dict(data.get("speech", {}))
        for quirk_data in data.get("quirks", []):
            profile.quirks.append(Quirk(**quirk_data))
        return profile


class RelationshipManager:
    """Manages NPC relationships with players and other NPCs."""

    RELATIONSHIP_TYPES = {
        "ally": (50, 100),
        "friend": (20, 50),
        "acquaintance": (0, 20),
        "neutral": (-20, 0),
        "dislike": (-50, -20),
        "rival": (-80, -50),
        "enemy": (-100, -80),
    }

    def __init__(self):
        self.relationships: dict[str, float] = {}  # entity_id -> value (-100 to 100)
        self.relationship_history: dict[str, list[dict]] = {}  # entity_id -> events

    def get_value(self, entity_id: str) -> float:
        return self.relationships.get(entity_id, 0.0)

    def get_type(self, entity_id: str) -> str:
        value = self.get_value(entity_id)
        for rel_type, (min_v, max_v) in self.RELATIONSHIP_TYPES.items():
            if min_v <= value <= max_v:
                return rel_type
        return "neutral"

    def modify(self, entity_id: str, delta: float, reason: str, timestamp: float = None) -> float:
        """Modify relationship value. Returns new value."""
        if timestamp is None:
            import time
            timestamp = time.time()

        current = self.relationships.get(entity_id, 0.0)
        new_value = max(-100.0, min(100.0, current + delta))
        self.relationships[entity_id] = new_value

        # Record history
        if entity_id not in self.relationship_history:
            self.relationship_history[entity_id] = []
        self.relationship_history[entity_id].append({
            "timestamp": timestamp,
            "delta": delta,
            "reason": reason,
            "old_value": current,
            "new_value": new_value
        })

        return new_value

    def decay(self, entity_id: str, rate: float = 0.1) -> float:
        """Apply decay toward neutral (0)."""
        current = self.get_value(entity_id)
        if current > 0:
            new_value = current * (1 - rate)
        elif current < 0:
            new_value = current * (1 - rate)
        else:
            return current
        self.relationships[entity_id] = new_value
        return new_value

    def get_allies(self, threshold: float = 50) -> list[str]:
        return [eid for eid, val in self.relationships.items() if val >= threshold]

    def get_enemies(self, threshold: float = -50) -> list[str]:
        return [eid for eid, val in self.relationships.items() if val <= threshold]

    def get_summary(self) -> dict:
        summary = {}
        for eid, val in self.relationships.items():
            summary[eid] = {
                "value": val,
                "type": self.get_type(eid),
                "history_count": len(self.relationship_history.get(eid, []))
            }
        return summary
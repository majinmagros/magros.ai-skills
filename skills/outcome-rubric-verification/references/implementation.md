# Implementation — Outcome Rubric Verification

Implementação base completa: `OutcomeRubricVerifier` + `HillClimbLoop` + exemplo de briefs. O `SKILL.md` traz o padrão resumido.

```python
from dataclasses import dataclass
from typing import Callable, List, Optional
from enum import Enum

class VerificationResult(Enum):
    PASS = "pass"
    FAIL = "fail"
    CHOOSE_NOT_TO_SHOW = "choose_not_to_show"

@dataclass
class RubricCriterion:
    name: str
    description: str
    weight: float
    verifier_prompt: str  # Prompt específico para este critério
    threshold: float = 0.8  # Score mínimo 0-1

@dataclass
class Rubric:
    criteria: List[RubricCriterion]
    overall_threshold: float = 0.85
    max_iterations: int = 5

@dataclass
class VerificationFeedback:
    criterion: str
    score: float  # 0-1
    feedback: str  # Specific actionable feedback
    passed: bool

@dataclass
class OutcomeResult:
    output: any
    verification: VerificationResult
    scores: dict[str, float]
    feedback: List[VerificationFeedback]
    iterations: int

class OutcomeRubricVerifier:
    """
    Verifier independente com context window limpo.
    Não compartilha estado com o generator.
    """

    def __init__(
        self,
        rubric: Rubric,
        verifier_model: str = "claude-opus-4",  # Strong model for verification
        ground_truth_fetchers: dict[str, Callable] = None
    ):
        self.rubric = rubric
        self.verifier_model = verifier_model
        self.ground_truth_fetchers = ground_truth_fetchers or {}

    def verify(self, candidate_output: any, context: dict) -> OutcomeResult:
        """Verifica candidate contra rubrica com context window limpo."""
        all_feedback = []
        all_scores = {}

        for criterion in self.rubric.criteria:
            # Fetch ground truth if needed (independent of generator)
            ground_truth = None
            if criterion.name in self.ground_truth_fetchers:
                ground_truth = self.ground_truth_fetchers[criterion.name](context)

            # Build verifier prompt (clean context - no generator traces)
            verifier_prompt = self._build_verifier_prompt(
                criterion, candidate_output, ground_truth, context
            )

            # Call verifier model (independent context)
            score, feedback = self._call_verifier(verifier_prompt)

            all_feedback.append(VerificationFeedback(
                criterion=criterion.name,
                score=score,
                feedback=feedback,
                passed=score >= criterion.threshold
            ))
            all_scores[criterion.name] = score

        # Weighted overall score
        overall = sum(
            all_scores[c.name] * c.weight
            for c in self.rubric.criteria
        )

        passed = overall >= self.rubric.overall_threshold and all(
            f.passed for f in all_feedback
        )

        return OutcomeResult(
            output=candidate_output if passed else None,
            verification=VerificationResult.PASS if passed else VerificationResult.FAIL,
            scores=all_scores,
            feedback=all_feedback,
            iterations=0  # Tracked by caller
        )

    def _build_verifier_prompt(self, criterion, candidate, ground_truth, context):
        return f"""
You are an independent verifier. Evaluate ONE criterion only.

CRITERION: {criterion.name}
DESCRIPTION: {criterion.description}
THRESHOLD: {criterion.threshold}

CANDIDATE OUTPUT:
{candidate}

GROUND TRUTH (if available):
{ground_truth or "Not available for this criterion"}

CONTEXT:
{context}

Score 0-1 and provide specific feedback on what would improve this criterion.
Be ruthless — this is the only thing preventing false positives.
"""

    def _call_verifier(self, prompt: str) -> tuple[float, str]:
        # Call verifier model with clean context
        # Implementation depends on your LLM client
        pass


class HillClimbLoop:
    """Orchestrates generator → verifier → feedback loop."""

    def __init__(
        self,
        generator: Callable[[dict, List[VerificationFeedback]], any],
        verifier: OutcomeRubricVerifier,
        max_iterations: int = 5
    ):
        self.generator = generator
        self.verifier = verifier
        self.max_iterations = max_iterations

    def run(self, initial_input: dict, context: dict) -> OutcomeResult:
        feedback = []

        for iteration in range(self.max_iterations):
            # Generator produces candidate (receives previous feedback)
            candidate = self.generator(initial_input, feedback)

            # Independent verification
            result = self.verifier.verify(candidate, context)
            result.iterations = iteration + 1

            if result.verification == VerificationResult.PASS:
                return result

            # Feed specific feedback to generator for next iteration
            feedback = result.feedback

        # Max iterations reached — choose not to show
        return OutcomeResult(
            output=None,
            verification=VerificationResult.CHOOSE_NOT_TO_SHOW,
            scores={},
            feedback=feedback,
            iterations=self.max_iterations
        )
```

## Exemplo de uso: Meeting Briefs

```python
def create_briefs_rubric() -> Rubric:
    return Rubric(
        criteria=[
            RubricCriterion(
                name="correct_person",
                description="Pulled correct LinkedIn/profile for the right person",
                weight=0.35,
                verifier_prompt="Does the brief reference the correct person? Verify name, company, role match.",
                threshold=0.9
            ),
            RubricCriterion(
                name="relevant_context",
                description="Includes pre-context from previous interactions (weeks ago)",
                weight=0.25,
                verifier_prompt="Does the brief include relevant historical context? Check for specific past meetings, agreements, topics.",
                threshold=0.8
            ),
            RubricCriterion(
                name="actionable_structure",
                description="Structured as: who → why meeting → what to do → key questions",
                weight=0.25,
                verifier_prompt="Is the brief scannable and actionable? Correct order: person, purpose, outcomes, questions.",
                threshold=0.85
            ),
            RubricCriterion(
                name="no_hallucination",
                description="No fabricated information, all claims verifiable",
                weight=0.15,
                verifier_prompt="Any claim that cannot be traced to a source? Flag as hallucination.",
                threshold=1.0  # Zero tolerance
            )
        ],
        overall_threshold=0.85,
        max_iterations=5
    )

# Ground truth fetchers (independent of generator)
ground_truth = {
    "correct_person": lambda ctx: fetch_linkedin(ctx["attendee_email"]),
    "relevant_context": lambda ctx: fetch_meeting_history(ctx["user_id"], ctx["attendee_email"]),
}

# Usage
rubric = create_briefs_rubric()
verifier = OutcomeRubricVerifier(rubric, ground_truth_fetchers=ground_truth)

def brief_generator(input_data, feedback):
    # Your generator logic here, incorporating feedback
    prompt = build_brief_prompt(input_data, feedback)
    return llm_call(prompt)

loop = HillClimbLoop(brief_generator, verifier, max_iterations=5)
result = loop.run(
    initial_input={"meeting_id": "mtg_123", "attendee_email": "tom@company.com"},
    context={"user_id": "user_456", "attendee_email": "tom@company.com"}
)

if result.verification == VerificationResult.PASS:
    show_brief(result.output)
else:
    log_failed_brief(result)  # Choose not to show
    notify_user("Could not generate verified brief for this meeting")
```

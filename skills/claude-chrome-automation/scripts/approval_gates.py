# approval_gates.py — Gates para ações sensíveis (delete, payment, email, deploy...)
# Extraído de SKILL.md (2026-09-09).


class ApprovalGates:
    def __init__(self, sensitive_actions: list = None):
        self.sensitive_actions = sensitive_actions or [
            "delete", "payment", "send_email", "post_social",
            "delete_file", "admin_action", "production_deploy"
        ]

    async def check_approval(self, action: str, context: dict) -> dict:
        """Verifica se ação precisa de aprovação."""
        if action in self.sensitive_actions:
            return {
                "approved": False,
                "requires_approval": True,
                "message": f"Ação '{action}' requer aprovação manual",
                "context": context
            }
        return {"approved": True}

    async def request_approval(self, action: str, context: dict) -> bool:
        """Solicita aprovação ao usuário."""
        # Integração com hook de aprovação
        pass

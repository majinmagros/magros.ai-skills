---
name: approval-rejection-board
description: "Painel local de aprovação/rejeição conectado à sessão: N variações, teclas A/R, comentários e digitar terminei para o agente ler o veredito e iterar. Use ao revisar muitas variações antes de decidir ou amplificar. Triggers PT: aprovar rejeitar variações, painel de decisões, terminei, loop de aprovação. Triggers EN: approval board, rejection board, variations review, decision loop."
metadata:
  origin: ECC
---

# Approval/Rejection Board — Decisão Humana em Lote

> Fonte: Maestros da IA `@maestrosdaia/Ckuo9Bvy3zk` ("My Favorite NEW Claude Code Skill", 2026-10-12).

## Quando usar

- O agente gerou N variações (10, 50, 500) e você precisa decidir rápido.
- O gargalo é a decisão, não o prompt: aprovar/rejeitar com critério + feedback.
- Quer controlar gasto: humano decide antes de o agente amplificar.

## Como funciona

1. O agente sobe um server local + HTML com as variações (conectado à sessão — não é HTML estático).
2. Você navega e marca com teclas A (aprovar) / R (rejeitar), com comentário do porquê.
3. Digita "terminei" → o agente lê aprovados/rejeitados + comentários e prossegue.
4. O server tem timer e morre sozinho — sem processo órfão.

## Casos reais (vídeo)

- 10 topics virais, 10 arquiteturas de agente, 10 microtemplates, 500 variações de carrossel, heroes.
- Serve para qualquer coisa, não só visual: nome, copy, plano, arquitetura.

## Loop de treino (auto-melhoria do agente)

1. Gere 50–500 variações com o agente.
2. Aprove/rejeite usando os comentários como feedback.
3. "Termina; use o feedback para aprimorar esse agente."
4. Repita até 90–100% de aprovação — o agente está calibrado no seu gosto.

## Regras

- Toda rejeição ganha um porquê; comentário vazio não retroalimenta.
- Uma rodada = um tipo de decisão (não misture copy com arquitetura).
- Menos é mais: se a aprovação cai, reduza N antes de aumentar contexto.
- Decisão é o gargalo do trabalho com IA — o board existe para torná-la barata.

## Related skills

- `plan-canvas` — anotar/aprovar planos e artefatos no browser.
- `visual-qa-designer` — revisão visual lado a lado.
- `triagem-ideias` — triagem de ideias antes de virar produção.
- `approval-loop-morning-digest` — loop diário de aprovações assimétricas.

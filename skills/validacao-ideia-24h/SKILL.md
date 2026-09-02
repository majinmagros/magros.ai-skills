---
name: validacao-ideia-24h
description: Valida ideia de negocio em 24h com App Store scraper + swarm 100 compradores sinteticos. Use when quer saber se ideia tem demanda antes de investir, validar SaaS/app/fisico com oferta vs produto, ou simular GO/KILL/PIVOT. Triggers on "validar ideia", "24 horas", "product market fit", "swarm compradores", "multidao faminta", "validacao mercado".
---

# Validação de Ideia em 24h — Swarm Sintético

> Baseado em `Maestros da IA — IbECGYRDd_w` (2026-08-31) — transcript `IbECGYRDd_w.pt.dedup.txt:259-650`. Framework apresentado como agente da comunidade (1 prompt → relatório PDF).

Uma ideia sem demanda é um tiro no escuro. Valide por **comportamento de compra**, não intenção (waitlist ≠ venda, `l.76-88`).

## Quando usar

- Ideia crua de SaaS/app/agência/negócio físico antes de investir meses
- Quer mapear concorrentes + reclamações reais da App Store/Play Store
- Quer simular 100 personas compradoras em paralelo para veredito GO/KILL/PIVOT

## Quando NÃO usar

- Ideia já validada com vendas reais → use `plan` direto
- Tarefa de execução (lazy/capricho) → use `unlazy`/`capricho`

## Framework (5 etapas, 1 prompt no agente completo)

### 1. Descreva a ideia (input)
Ideia + dor que sana + cliente ideal + concorrentes que conhece (se souber, `l.242-257`). O agente complementa o resto.

### 2. Scrape App Store / Play Store (evidência real)
Busque o que já existe para a dor:
- Volume (ex: 5M instalações, `l.284-285`)
- Satisfação (ex: 42.9% 1-2 estrelas, `l.285-286`)
- Reclamações literais + avaliações na íntegra (`l.289-298`)
- Concorrentes com >1M instalações e notas (`l.299-306`)

Saída: relatório concorrentes + brechas (ex: "todo mundo faz X ruim → antítese" `l.310-321`) + demanda vs oferta.

### 3. Swarm 100 compradores sintéticos (subagentes paralelos)
Delegue N subagentes com persona distinta (perfil, objeções, poder aquisitivo):
- Cada um decide `compraria/não` + nota + razão + disposição a pagar (`l.335-349`, `l.585-589`)
- Ex: 100 fake buyers → 2% comprariam (`l.544-549`) = sinal vermelho; 90% = ceticismo, valide com checkout real.

Execute em paralelo via `agent-harness-construction` / `sessoes-orquestradas`.

### 4. Veredito + oferta
Distinga **produto vs oferta** (`l.97-180`):
- Produto bom + oferta ruim = não vende. Ex: contador "50% imposto ou grátis" elimina risco (`l.112-136`).
- Analise objeções recorrentes do swarm: preço, qualidade, alternativas (PF da esquina), plano, desconfiança (`l.600-633`), e gere pivôs de preço/oferta; re-rode swarm.

Decisão: **GO** (demanda + oferta forte) / **PIVOT** (dor real, oferta errada) / **KILL** (sem demanda, ex: estúdio pilates Campinas `l.461-478`, tendência caindo).

### 5. Relatório + validação real
Gere PDF (`l.402-403`) e, se GO, valide no mundo: página de vendas + Google Ads + checkout com cartão (`l.562-563`) — única validação real é compra.

## Saída

- `relatorio-validacao.md` + `swarm-100.json` + `oferta-pivot.md`

## Referências

- `references/swarm-prompt.md` — prompt do swarm 100 personas
- `references/app-store-scraper.md` — App Store/Play Store scraping
- `triagem-ideias` — versão leve 5 fases sem swarm

## Checklist

- [ ] App Store scrape com reclamações literais
- [ ] 100 personas com nota + WTP
- [ ] Veredito GO/KILL/PIVOT com razão
- [ ] Próximo passo: Ads checkout se GO

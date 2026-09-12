---
name: cloud-design
description: Use quando precisar de prototipagem UI alta-fidelidade no Claude (Cloud Design) — design system versionado, referências visuais (screenshots/URLs), iteração em linguagem natural, export standalone HTML/PDF para handoff ao Cursor/Cloud Code. Limites de uso SEPARADOS do Cloud Code. Triggers: "cloud design", "protótipo alta fidelidade", "design system versionado", "export html pdf handoff", "claude design". Não use para direção criativa genérica (`frontend-design-direction`, `make-interfaces-feel-better`, `taste`); Cloud Design é tool concreta com workflow próprio.
metadata:
  origin: ecc
  module: media-generation
  cost: medium
  stability: stable
  defaultInstall: false
---

# Skill: cloud-design — Prototipagem Alta-Fidelidade no Claude (Cloud Design)

**Cloud Design** é uma ferramenta do Claude (disponível nos planos Pro/Max) para criar protótipos de UI fiéis, com design system versionado, referências visuais, e export para implementação. Diferente do Cloud Code (código), o foco é **protótipo visual**.

## Quando usar

- Você precisa de **protótipos alta-fidelidade** (não wireframes) antes de codar.
- Quer **design system versionado** no projeto (cores, tipografia, componentes, spacing).
- Tem **referências visuais** (screenshots Dribbble, Landing Folio, Lapa.Ninja, URLs) e quer fidelidade.
- Precisa **iterar em linguagem natural** ("remova o blog", "mude para mobile", "use fonte do Airbnb").
- Quer **export standalone HTML/PDF** para passar ao Cursor/Cloud Code/Figma implementar.
- Quer **compartilhar link** do protótipo com o time (visualização/edição colaborativa).

Não use para:
- Direção criativa genérica / design tokens → `frontend-design-direction`, `make-interfaces-feel-better`, `taste`.
- Geração de código direta → `frontend-patterns`, `react-patterns`, Cloud Code.
- Protótipos rápidos gratuitos → Google Stitch (gratuito, menos fiel em multi-telas).

## Workflow Cloud Design

### 1. Criar projeto
- Acesse `claude.ai/design` (requer plano Pro ou Max).
- "Create project" → nome → "High fidelity" (recomendado).

### 2. Configurar Design System (opcional mas recomendado)
- Aba **Design System** → "Create new" ou anexe arquivo:
  - JSON/CSS do seu design system.
  - Arquivo `.fig` (Figma).
  - URL de design system público (ex.: Airbnb, GitHub Primer).
- Isso garante **consistência** across telas: cores, fontes, spacing, border radius, sombras.

### 3. Adicionar referências visuais
- Anexe **screenshots** (Dribbble, Landing Folio, Lapa.Ninja, seu próprio Figma).
- Cole **URLs** de sites de referência.
- O Cloud Design extrai: layout, cores, tipografia, componentes, spacing.

### 4. Prompt inicial (linguagem natural)
```
Crie a página Home de um SAS para imobiliária (venda/locação).
Use o design system do Airbnb (anexado).
Referência visual: screenshot do Dribbble "real estate dashboard".
Inclua: hero com busca, cards de imóveis, filtros, footer.
```

### 5. Iterar em linguagem natural
```
Remova os links "Ajuda", "Anúncios", "Blog" do header.
Mude o botão primário para outline.
Versão mobile: hamburger menu funcional.
Adicione animação de entrada nos cards (fade + slide up).
```

### 6. Export / Handoff
| Formato | Uso | Comando |
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
|---|---|---|
| **Standalone HTML** | Passar para Cursor/Cloud Code implementar | Share → "Export standalone HTML" → baixa `.zip` com HTML+CSS+JS |
| **PDF** | Documentação, aprovação stakeholder | Share → "Export PDF" |
| **Link compartilhado** | Colaboração time (view/edit) | Share → "Copy link" → 누구나 acessa no `claude.ai/design` |
| **Design files** | Inspecionar componentes React-like gerados | Aba "Design files" → componentes semi-prontos |

### 7. Implementar no Cursor/Cloud Code
```
Implemente este layout seguindo EXATAMENTE o HTML exportado:
- Estrutura de componentes React (server/client)
- Tailwind classes equivalentes
- Framer Motion para animações
- Design system tokens (cores, spacing, tipografia)
```

## Limites de uso (importante)

- **Cloud Design** e **Cloud Code** têm **limites SEPARADOS** (semana/mês).
- Cloud Design consome **muito mais tokens** (protótipos complexos = ~20% do limite semanal em 1 sessão).
- Plano Pro: limite semanal ~100-150 protótipos médios.
- Plano Max: limite maior, mas ainda separado.
- Monitore em: Settings → Usage → "Cloud Design" vs "Cloud Code".

## Cloud Design vs Google Stitch

| Critério | Cloud Design | Google Stitch |
|---|---|---|
| **Fidelidade multi-tela** | ✅ Mantém design system across telas | ❌ Perde consistência após 1-2 telas |
| **Design system versionado** | ✅ Nativo (JSON/Figma/URL) | ⚠️ Parcial (anexa arquivo, mas não versiona) |
| **Iteração linguagem natural** | ✅ Robusta ("remova X", "mobile first") | ⚠️ Básica (esquece contexto rápido) |
| **Export HTML standalone** | ✅ Completo (HTML+CSS+JS zipado) | ✅ HTML único |
| **Export PDF** | ✅ Nativo | ❌ Não tem |
| **Link colaborativo** | ✅ View/Edit no Claude | ❌ Não tem |
| **Custo** | Plano Pro/Max (tokens) | **Gratuito** (conta Google) |
| **Limite** | Separado do Cloud Code | ~300 telas/mês grátis |

## Integração com workflow ECC

```
Cloud Design (protótipo)
    ↓ export HTML/PDF
frontend-design-direction / make-interfaces-feel-better (refinar direção)
    ↓ handoff
Cursor / Cloud Code (implementação)
    → react-patterns, motion-patterns, design-system
    → e2e-testing / browser-qa (validar)
```

## Validação oficial (2026-08-20)

| Claim | Fonte / Notas |
|---|---|
| Disponível em planos Pro/Max do Claude | Verificado no vídeo `dsOGGuZi-JY` e UI do `claude.ai/design` |
| Limites separados Cloud Design vs Cloud Code | Confirmado na UI de Usage (Settings → Usage) |
| Design system versionado (JSON/Figma/URL) | UI nativa: aba "Design System" → Create/Attach |
| Export standalone HTML (zip) | Share → "Export standalone HTML" |
| Export PDF | Share → "Export PDF" |
| Link compartilhado view/edit | Share → "Copy link" |
| Google Stitch: gratuito, ~300 telas/mês | https://stitch.withgoogle.com |

## Referências

- **Cloud Design**: `claude.ai/design` (requer login Pro/Max)
- **Google Stitch**: https://stitch.withgoogle.com (gratuito)
- **Design system references**: Dribbble, Landing Folio, Lapa.Ninja, Figma Community
- **Vídeo origem**: `dsOGGuZi-JY` — @Sujeitoprogramador (2026-08-20)
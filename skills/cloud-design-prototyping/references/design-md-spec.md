# DESIGN.md Specification (Canonical Schema)

## Purpose
Single source of truth for design system. Consumed by:
- Open Design agent (plugin + skill binding)
- Engineering handoff (Cursor/Codex/Claude Code)
- Documentation (living spec)
- QA/Validation (visual regression)

---

## Schema (Required Sections)

### 1. Brand Identity
```markdown
## Brand
- Logo: [SVG string | URL | path]
- Tagline: "string"
- Voice: [professional | friendly | bold | technical | minimal | playful]
- Personality: [array of adjectives]
```

### 2. Color Tokens
```markdown
## Colors
| Token | Hex | RGB | Usage | Accessibility |
|---|---|---|---|---|
| --color-primary | #0066CC | 0,102,204 | CTAs, links, focus rings | AA on white |
| --color-primary-hover | #0052A3 | 0,82,163 | Hover states | AA on white |
| --color-secondary | #00D4AA | 0,212,170 | Success, accents | AA on dark |
| --color-accent | #FF6B35 | 255,107,53 | Warnings, highlights | AA on white |
| --color-surface | #FFFFFF | 255,255,255 | Cards, modals | — |
| --color-surface-elevated | #F8FAFC | 248,250,252 | Dropdowns, tooltips | — |
| --color-text-primary | #1A1A2E | 26,26,46 | Headings, body | AAA on surface |
| --color-text-secondary | #64748B | 100,116,139 | Captions, placeholders | AA on surface |
| --color-text-inverse | #FFFFFF | 255,255,255 | On primary/dark | AAA on primary |
| --color-border | #E2E8F0 | 226,232,240 | Dividers, inputs | — |
| --color-focus | #0066CC | 0,102,204 | Focus rings | — |
| --color-error | #EF4444 | 239,68,68 | Errors, destructive | AA on white |
| --color-success | #10B981 | 16,185,129 | Success states | AA on white |
| --color-warning | #F59E0B | 245,158,11 | Warnings | AA on white |
```

**Semantic Color Mapping (Required):**
```markdown
## Semantic Colors
| Semantic Token | Maps To |
|---|---|
| color-bg-primary | --color-surface |
| color-bg-secondary | --color-surface-elevated |
| color-text-primary | --color-text-primary |
| color-text-secondary | --color-text-secondary |
| color-border-default | --color-border |
| color-border-focus | --color-focus |
| color-interactive-primary | --color-primary |
| color-interactive-hover | --color-primary-hover |
| color-status-success | --color-success |
| color-status-warning | --color-warning |
| color-status-error | --color-error |
```

### 3. Typography Tokens
```markdown
## Typography
| Token | Font Family | Size (clamp) | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| --font-heading-xl | Inter | clamp(3rem, 6vw, 5rem) | 800 | 1.05 | -0.02em |
| --font-heading-lg | Inter | clamp(2.25rem, 4vw, 3.5rem) | 700 | 1.1 | -0.01em |
| --font-heading-md | Inter | clamp(1.75rem, 3vw, 2.5rem) | 700 | 1.15 | -0.01em |
| --font-heading-sm | Inter | clamp(1.25rem, 2vw, 1.75rem) | 600 | 1.2 | 0 |
| --font-body-lg | Inter | 1.125rem | 400 | 1.7 | 0 |
| --font-body | Inter | 1rem | 400 | 1.6 | 0 |
| --font-body-sm | Inter | 0.875rem | 400 | 1.5 | 0 |
| --font-caption | Inter | 0.75rem | 500 | 1.5 | 0.01em |
| --font-mono | JetBrains Mono | 0.875rem | 400 | 1.6 | 0 |
```

**Fluid Type Scale (CSS):**
```css
:root {
  --font-heading-xl: clamp(3rem, 6vw, 5rem);
  --font-heading-lg: clamp(2.25rem, 4vw, 3.5rem);
  --font-heading-md: clamp(1.75rem, 3vw, 2.5rem);
  --font-heading-sm: clamp(1.25rem, 2vw, 1.75rem);
  --font-body-lg: 1.125rem;
  --font-body: 1rem;
  --font-body-sm: 0.875rem;
  --font-caption: 0.75rem;
}
```

### 4. Spacing Tokens
```markdown
## Spacing
| Token | Value | Rem | Use Case |
|---|---|---|---|
| --space-0 | 0px | 0 | Reset |
| --space-1 | 4px | 0.25rem | Micro gap |
| --space-2 | 8px | 0.5rem | Base unit |
| --space-3 | 12px | 0.75rem | Small gap |
| --space-4 | 16px | 1rem | Medium gap |
| --space-5 | 20px | 1.25rem | Large gap |
| --space-6 | 24px | 1.5rem | Section gap |
| --space-8 | 32px | 2rem | Large section |
| --space-10 | 40px | 2.5rem | XL section |
| --space-12 | 48px | 3rem | XXL section |
| --space-16 | 64px | 4rem | Hero spacing |
```

**Scale Ratio:** 1.25 (major third) ou 1.5 (perfect fifth)
```css
:root {
  --space-base: 8px;
  --space-scale: 1.25;
  --space-1: calc(var(--space-base) * 0.5);
  --space-2: var(--space-base);
  --space-3: calc(var(--space-base) * 1.5);
  --space-4: calc(var(--space-base) * 2);
  --space-5: calc(var(--space-base) * 2.5);
  --space-6: calc(var(--space-base) * 3);
  --space-8: calc(var(--space-base) * 4);
  --space-10: calc(var(--space-base) * 5);
  --space-12: calc(var(--space-base) * 6);
  --space-16: calc(var(--space-base) * 8);
}
```

### 5. Border Radius
```markdown
## Radius
| Token | Value | Use Case |
|---|---|---|
| --radius-none | 0px | Sharp |
| --radius-sm | 4px | Badges, chips |
| --radius-md | 8px | Buttons, inputs |
| --radius-lg | 12px | Cards, modals |
| --radius-xl | 16px | Large cards |
| --radius-2xl | 24px | Hero elements |
| --radius-full | 9999px | Pills, avatars |
```

### 6. Shadows
```markdown
## Shadows
| Token | Value | Use Case |
|---|---|---|
| --shadow-none | none | Flat |
| --shadow-xs | 0 1px 2px rgba(0,0,0,0.03) | Subtle |
| --shadow-sm | 0 1px 2px rgba(0,0,0,0.05) | Cards default |
| --shadow-md | 0 4px 6px rgba(0,0,0,0.07) | Elevated cards |
| --shadow-lg | 0 10px 15px rgba(0,0,0,0.08) | Modals, dropdowns |
| --shadow-xl | 0 20px 25px rgba(0,0,0,0.1) | Hero, overlays |
| --shadow-focus | 0 0 0 3px var(--color-focus) | Focus rings |
```

### 7. Breakpoints
```markdown
## Breakpoints
| Token | Value | Label |
|---|---|---|
| --bp-xs | 320px | Mobile small |
| --bp-sm | 640px | Mobile |
| --bp-md | 768px | Tablet |
| --bp-lg | 1024px | Desktop |
| --bp-xl | 1280px | Wide |
| --bp-2xl | 1536px | Ultra-wide |
```

### 8. Z-Index
```markdown
## Z-Index
| Token | Value | Layer |
|---|---|---|
| --z-base | 0 | Base |
| --z-dropdown | 100 | Dropdowns |
| --z-sticky | 200 | Sticky headers |
| --z-modal-backdrop | 300 | Modal backdrop |
| --z-modal | 400 | Modal content |
| --z-popover | 500 | Popovers, tooltips |
| --z-toast | 600 | Toasts |
| --z-tooltip | 700 | Tooltips |
```

---

## Component Specs (Required per Component)

### Button
```markdown
## Component: Button
### Variants
| Variant | Background | Text | Border | Use Case |
|---|---|---|---|---|
| primary | --color-primary | --color-text-inverse | none | Main CTA |
| secondary | --color-surface | --color-text-primary | --color-border | Secondary |
| ghost | transparent | --color-text-primary | none | Tertiary |
| danger | --color-error | --color-text-inverse | none | Destructive |
| success | --color-success | --color-text-inverse | none | Confirm |

### Sizes
| Size | Padding | Font Size | Min Height |
|---|---|---|---|
| sm | 8px 16px | --font-body-sm | 32px |
| md | 12px 24px | --font-body | 40px |
| lg | 16px 32px | --font-body-lg | 48px |

### States
| State | Modifications |
|---|---|
| default | Base styles |
| hover | Brightness +10%, shadow-md |
| focus | --shadow-focus ring |
| active | Scale 0.98, brightness -5% |
| disabled | Opacity 0.5, cursor not-allowed |
| loading | Spinner, disabled styles |
```

### Card
```markdown
## Component: Card
### Variants
| Variant | Background | Border | Shadow | Use Case |
|---|---|---|---|---|
| default | --color-surface | --color-border | --shadow-sm | Default |
| elevated | --color-surface | none | --shadow-md | Featured |
| outlined | transparent | --color-border | none | Subtle |
| interactive | --color-surface | --color-border | --shadow-sm | Clickable |

### Structure
| Part | Padding | Notes |
|---|---|---|
| header | --space-6 | Optional |
| body | --space-6 | Content |
| footer | --space-6 | Actions, aligned right |
```

### Form Input
```markdown
## Component: Input
### Sizes
| Size | Padding | Font | Height |
|---|---|---|---|
| sm | 8px 12px | --font-body-sm | 36px |
| md | 10px 16px | --font-body | 44px |
| lg | 14px 20px | --font-body-lg | 52px |

### States
| State | Border | Background | Focus Ring |
|---|---|---|---|
| default | --color-border | --color-surface | none |
| hover | --color-border-hover | --color-surface | none |
| focus | --color-focus | --color-surface | --shadow-focus |
| error | --color-error | --color-error-bg | --shadow-focus (error) |
| disabled | --color-border | --color-surface-elevated | none |
```

---

## CSS Variables Output (Canonical)

```css
:root {
  /* Colors */
  --color-primary: #0066CC;
  --color-primary-hover: #0052A3;
  --color-secondary: #00D4AA;
  --color-accent: #FF6B35;
  --color-surface: #FFFFFF;
  --color-surface-elevated: #F8FAFC;
  --color-text-primary: #1A1A2E;
  --color-text-secondary: #64748B;
  --color-text-inverse: #FFFFFF;
  --color-border: #E2E8F0;
  --color-border-hover: #CBD5E1;
  --color-focus: #0066CC;
  --color-error: #EF4444;
  --color-success: #10B981;
  --color-warning: #F59E0B;
  
  /* Semantic */
  --color-bg-primary: var(--color-surface);
  --color-bg-secondary: var(--color-surface-elevated);
  --color-text-primary: var(--color-text-primary);
  --color-text-secondary: var(--color-text-secondary);
  --color-border-default: var(--color-border);
  --color-border-focus: var(--color-focus);
  --color-interactive-primary: var(--color-primary);
  --color-interactive-hover: var(--color-primary-hover);
  --color-status-success: var(--color-success);
  --color-status-warning: var(--color-warning);
  --color-status-error: var(--color-error);
  
  /* Typography */
  --font-heading-xl: clamp(3rem, 6vw, 5rem);
  --font-heading-lg: clamp(2.25rem, 4vw, 3.5rem);
  --font-heading-md: clamp(1.75rem, 3vw, 2.5rem);
  --font-heading-sm: clamp(1.25rem, 2vw, 1.75rem);
  --font-body-lg: 1.125rem;
  --font-body: 1rem;
  --font-body-sm: 0.875rem;
  --font-caption: 0.75rem;
  --font-mono: JetBrains Mono;
  
  /* Spacing */
  --space-base: 8px;
  --space-1: calc(var(--space-base) * 0.5);
  --space-2: var(--space-base);
  --space-3: calc(var(--space-base) * 1.5);
  --space-4: calc(var(--space-base) * 2);
  --space-5: calc(var(--space-base) * 2.5);
  --space-6: calc(var(--space-base) * 3);
  --space-8: calc(var(--space-base) * 4);
  --space-10: calc(var(--space-base) * 5);
  --space-12: calc(var(--space-base) * 6);
  --space-16: calc(var(--space-base) * 8);
  
  /* Radius */
  --radius-none: 0;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 24px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-xs: 0 1px 2px rgba(0,0,0,0.03);
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.08);
  --shadow-xl: 0 20px 25px rgba(0,0,0,0.1);
  --shadow-focus: 0 0 0 3px var(--color-focus);
  
  /* Breakpoints */
  --bp-xs: 320px;
  --bp-sm: 640px;
  --bp-md: 768px;
  --bp-lg: 1024px;
  --bp-xl: 1280px;
  --bp-2xl: 1536px;
  
  /* Z-Index */
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal-backdrop: 300;
  --z-modal: 400;
  --z-popover: 500;
  --z-toast: 600;
  --z-tooltip: 700;
}
```

---

## Validation Checklist

- [ ] All required sections present (Brand, Colors, Typography, Spacing, Radius, Shadows, Breakpoints, Z-Index)
- [ ] Semantic color mapping complete
- [ ] Fluid type scale (clamp) used
- [ ] Spacing scale consistent (ratio 1.25 or 1.5)
- [ ] Component specs complete (Button, Card, Input minimum)
- [ ] States defined for interactive components
- [ ] Responsive breakpoints defined
- [ ] Z-index scale logical
- [ ] CSS variables output matches markdown tokens
- [ ] Accessibility contrast ratios documented (AA/AAA)
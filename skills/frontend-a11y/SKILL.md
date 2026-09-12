---
name: frontend-a11y
description: Use when building accessible React/Next.js UI — semantic HTML, ARIA, form labeling, keyboard navigation, focus management, screen reader support. Triggers on "accessible form", "aria-label", "keyboard navigation", "focus trap modal", "screen reader", "a11y review".
metadata:
  origin: community
---

# Frontend Accessibility Patterns

Practical accessibility patterns for React and Next.js: missing labels, wrong ARIA, non-semantic interactives, broken keyboard nav. Código completo em `references/patterns.md`.

## When to Activate

- Building or reviewing form components (`<input>`, `<select>`, `<textarea>`)
- Creating interactive elements (modals, dropdowns, tooltips, tabs)
- Using `<div>` or `<span>` with `onClick`
- Adding `aria-*` attributes to any element
- Implementing keyboard navigation or focus management
- Receiving accessibility feedback from review tools (CodeRabbit, ESLint a11y)
- Building components that must support screen readers

## Form Accessibility

```tsx
// BAD: label desconectado — screen readers não associam
<label>Email</label>
<input type="email" />

// GOOD: htmlFor + id + required + erro linkado
<label htmlFor="email">Email <span aria-hidden="true">*</span></label>
<input id="email" type="email" required aria-required="true"
  aria-describedby="email-error" aria-invalid={!!error} />
{error && <span id="email-error" role="alert">{error}</span>}
```

Form login completo (estados, validação, autocomplete) → `references/patterns.md`.

## Semantic HTML

```tsx
// BAD: div sem role, sem teclado, sem nome acessível
<div onClick={handleClick}>Submit</div>
// GOOD: button é focável, Enter/Space, anuncia "button"
<button type="button" onClick={handleClick}>Submit</button>

// BAD: <div onClick={() => navigate('/home')}>Home</div>
// GOOD: <a href="/home">Home</a> (right/middle-click + teclado)

// BAD: <h1>…</h1> seguido de <h4> — GOOD: níveis sequenciais (h1→h2)
```

## ARIA (só quando HTML nativo não basta — ARIA errada é pior que nenhuma)

```tsx
// aria-label: sem texto visível | aria-labelledby: referencia texto visível
<button aria-label="Close modal"><XIcon /></button>
// aria-describedby: descrição suplementar
<button aria-describedby="delete-warning" onClick={handleDelete}>Delete account</button>
// aria-live: polite espera, assertive interrompe (só erros urgentes)
<div role="status" aria-live={isError ? 'assertive' : 'polite'} aria-atomic="true">{message}</div>
// aria-expanded + aria-controls em accordion/dropdown
```

## Keyboard, Focus, Images, Motion (resumo)

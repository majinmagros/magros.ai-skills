---
name: liquid-glass-design
description: "Use when iOS 26 Liquid Glass design system — dynamic glass material with blur, reflection, and interactive morphing for SwiftUI, UIKit, and WidgetKit. Triggers on \"liquid-glass-design\", \"liquid glass design\", \"design\"."
metadata:
  origin: ECC
---

# Liquid Glass Design System (iOS 26)

Dynamic glass material that blurs, reflects, and reacts to touch for iOS 26+. Detalhes em `references/`.

## When to Activate

- Building or updating apps for iOS 26+ with the new design language
- Implementing glass-style buttons, cards, toolbars, or containers
- Creating morphing transitions between glass elements
- Applying Liquid Glass effects to widgets
- Migrating existing blur/material effects to the new Liquid Glass API

## Core Principles

1. **Container first** — wrap sibling glass views in `GlassEffectContainer` / `UIGlassContainerEffect`
2. **Glass last** — apply `.glassEffect()` after frame, font, padding
3. **Interactive is opt-in** — `.interactive()` only on elements that respond to touch
4. **Animate hierarchy changes** — `withAnimation` + `glassEffectID` for morphing
5. **Test every appearance** — light, dark, accented; keep text contrast readable

## Example

```swift
Text("Hello, World!")
    .font(.title)
    .padding()
    .glassEffect(.regular.tint(.orange).interactive(), in: .rect(cornerRadius: 16.0))
```

## References

- `references/swiftui.md` — basic/tinted glass, buttons, container, union, morphing, scroll-under-sidebar
- `references/uikit.md` — `UIGlassEffect`, container effect, scroll edges, toolbar integration
- `references/widgetkit.md` — rendering modes, accent groups, images, container background
- `references/decisions.md` — design decisions, best practices, anti-patterns, when to use

## Checklist

- [ ] Multiple glass views wrapped in a container with tuned `spacing`
- [ ] `.interactive()` only on touchable elements
- [ ] `clipsToBounds = true` on UIKit glass with corner radius
- [ ] Widget accented mode handled, no opaque backgrounds behind glass
- [ ] Contrast verified in light, dark, and tinted appearances

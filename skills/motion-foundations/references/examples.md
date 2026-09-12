# Motion Foundations — End-to-End Example, Anti-Patterns, Scope

## End-to-End: Tokens + Springs + Accessibility + SSR Guard

```tsx
// components/fade-in-card.tsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { motionTokens, springs } from "@/lib/motion-tokens"
import { useSafeMotion } from "@/hooks/use-reduced-motion"
import { motionConfig } from "@/lib/motion-config"

interface FadeInCardProps {
  children: React.ReactNode
  delay?: number
}

export function FadeInCard({ children, delay = 0 }: FadeInCardProps) {
  // SSR guard — initial must match server output (opacity: 1)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Accessibility — disables transform when reduced motion is preferred
  const safeMotion = useSafeMotion(motionTokens.distance.md)

  // Device gate — skip animation on low-end hardware
  if (!motionConfig.shouldAnimate() || !mounted) {
    return <div>{children}</div>
  }

  return (
    <motion.div
      initial={safeMotion.initial}
      animate={safeMotion.animate}
      exit={safeMotion.exit}
      transition={{
        ...springs.gentle,
        delay,
      }}
      whileHover={{ scale: motionTokens.scale.pop }}
      whileTap={{ scale: motionTokens.scale.press }}
    >
      {children}
    </motion.div>
  )
}
```

## Constraints / Non-Goals

This skill does **not** cover:

- UI component patterns (button, modal, stagger) → see `motion-patterns`
- Drag, gestures, SVG, text animations, custom hooks → see `motion-advanced`
- CSS-only animations or Tailwind `animate-*` classes without `motion/react`
- Third-party animation libraries (GSAP, anime.js, etc.)
- Motion design decisions (when to animate, what to emphasize) — that is a design concern, not a code constraint

## Anti-Patterns

| Anti-pattern | Rule violated | Fix |
| --------------------------------------- | ------- | ------------------------------- |
| `import { motion } from "framer-motion"` | Rule 1 | Use `motion/react` |
| `initial={{ opacity: 0 }}` on SSR component | Rule 2 | Add mount guard |
| Skipping `useReducedMotion` check | Rule 3 | Use `useSafeMotion` hook |
| `animate={{ width: "100%" }}` | Rule 4 | Use `scaleX` transform instead |
| `transition={{ duration: 0.4 }}` inline | Rule 5 | Use `motionTokens.duration.normal` |
| `{ stiffness: 300, damping: 30 }` inline | Rule 6 | Use `springs.snappy` |
| Missing `"use client"` directive | Rule 7 | Add to top of file |
| `navigator.hardwareConcurrency` at module level | Rule 8 | Wrap in `typeof navigator !== "undefined"` |

## Related Skills

- **`motion-patterns`** — consumes tokens and springs defined here to build button, modal, stagger, page transition, and scroll patterns. Does not redefine any values.
- **`motion-advanced`** — consumes tokens and springs defined here for drag, SVG, text, and gesture patterns. Adds `useAnimate` sequences and custom hooks on top of this foundation.

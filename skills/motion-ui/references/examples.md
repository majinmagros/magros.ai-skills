# Examples — Motion UI (código completo)

Modal acessível completo + 7 exemplos (button, reduced motion, stagger, modal, parallax, skeleton, shared layout). Regras e tabelas no `SKILL.md`.

## Modal Essentials (Full Example)

```tsx
import React, { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "motion/react"

function useFocusTrap(ref: React.RefObject<HTMLDivElement | null>, active: boolean) {
  useEffect(() => {
    if (!active || !ref.current) return
    const el = ref.current
    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last  = focusable[focusable.length - 1]

    function handleKey(e: KeyboardEvent) {
      if (e.key !== "Tab") return
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }

    el.addEventListener("keydown", handleKey)
    first?.focus()
    return () => el.removeEventListener("keydown", handleKey)
  }, [active, ref])
}

function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = prev }
  }, [active])
}

function Modal({ open, closeModal }: { open: boolean; closeModal: () => void }) {
  const ref = useRef<HTMLDivElement>(null)

  useFocusTrap(ref, open)
  useScrollLock(open)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal()
    }
    if (open) window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, closeModal])

  return (
    // mode="wait" ensures exit animation finishes before any new modal enters
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 flex items-center justify-center bg-black/40"
        >
          <motion.div
            ref={ref}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1,    opacity: 1 }}
            exit={{    scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white p-6 rounded"
          >
            <h2 id="modal-title">Dialog Title</h2>
            <button onClick={closeModal}>Close</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Example() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      <Modal open={open} closeModal={() => setOpen(false)} />
    </>
  )
}
```

## Button Interaction

```tsx
import { motion } from "motion/react"

export function Button() {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
    >
      Click me
    </motion.button>
  )
}
```

## Reduced Motion Example

```tsx
import { motion, useReducedMotion } from "motion/react"

export function FadeIn() {
  const reduce = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.1 : 0.35, ease: [0.22, 1, 0.36, 1] }}
    />
  )
}
```

## Stagger List

```tsx
import { motion } from "motion/react"

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 } // keep ≤ 0.1s to avoid sluggishness
  }
}

const item = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }
}

export function List() {
  return (
    <motion.ul variants={container} initial="hidden" animate="visible">
      {[1, 2, 3].map(i => (
        <motion.li key={i} variants={item}>Item {i}</motion.li>
      ))}
    </motion.ul>
  )
}
```

## Modal with AnimatePresence

```tsx
import { motion, AnimatePresence } from "motion/react"

export function Modal({ open }: { open: boolean }) {
  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1    }}
          exit={{    opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
    </AnimatePresence>
  )
}
```

## Scroll Parallax

```tsx
import { useScroll, useTransform, motion } from "motion/react"

export function Parallax() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -80])

  return <motion.div style={{ y }} />
}
```

## Skeleton Loading

```tsx
import { motion } from "motion/react"

export function Skeleton() {
  return (
    <motion.div
      className="bg-gray-200 h-6 w-full rounded"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{
        duration: 1.5,       // comfortable pulse — was missing, caused fast flash
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  )
}
```

## Shared Layout (Crossfade)

```tsx
import { motion } from "motion/react"

// layoutId must be unique per mounted instance.
// If multiple instances can exist simultaneously, append a unique id:
// layoutId={`shared-${item.id}`}
export function Shared() {
  return <motion.div layoutId="shared" />
}
```

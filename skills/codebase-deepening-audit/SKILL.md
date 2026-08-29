---
name: codebase-deepening-audit
description: Use when auditing a codebase for architectural improvements, identifying shallow modules that should be combined or deepened into clean, simple interfaces. Triggers on "improve codebase architecture", "deepening modules", "auditoria de arquitetura", "módulos profundos", "arquitetura limpa".
metadata:
  origin: Matt Pocock / ECC
---

# Codebase Deepening Audit

Survey a codebase to identify architectural improvement opportunities based on John Ousterhout's "deep modules" philosophy (lots of behavior hidden behind a simple interface).

## Core Concepts
- **Deep Modules**: Modules that provide extensive functionality while exposing a simple, clean interface.
- **Surface Complexity**: Eliminating superficial abstractions or excessive small classes/files that increase cognitive load without adding value.
- **Visual Reporting**: Generating actionable HTML reports detailing structural candidates for refactoring.

## Workflow
1. Scan the repository structure and module boundaries.
2. Evaluate interface-to-implementation ratios across components.
3. Generate a structured report highlighting deepening opportunities and architectural risks.

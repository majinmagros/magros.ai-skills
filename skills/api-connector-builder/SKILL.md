---
name: api-connector-builder
description: Build a new API connector or provider by matching the target repo's existing integration pattern exactly. Use when adding one more integration without inventing a second architecture.
metadata:
  origin: ECC direct-port adaptation
version: "1.0.0"
---

# API Connector Builder

Use this when the job is to add a repo-native integration surface, not just a generic HTTP client.

The point is to match the host repository's pattern:

- connector layout
- config schema
- auth model
- error handling
- test style
- registration/discovery wiring

## When to Use

- "Build a Jira connector for this project"
- "Add a Slack provider following the existing pattern"
- "Create a new integration for this API"
- "Build a plugin that matches the repo's connector style"

## Guardrails

- do not invent a new integration architecture when the repo already has one
- do not start from vendor docs alone; start from existing in-repo connectors first
- do not stop at transport code if the repo expects registry wiring, tests, and docs
- do not cargo-cult old connectors if the repo has a newer current pattern

## Workflow

### 1. Learn the house style

Inspect at least 2 existing connectors/providers and map:

- file layout
- abstraction boundaries
- config model
- retry / pagination conventions
- registry hooks
- test fixtures and naming

### 2. Narrow the target integration

Define only the surface the repo actually needs:

- auth flow
- key entities
- core read/write operations
- pagination and rate limits
- webhook or polling model

### 3. Build in repo-native layers

Typical slices:

- config/schema
- client/transport
- mapping layer
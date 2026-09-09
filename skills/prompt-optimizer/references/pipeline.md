# Pipeline — Prompt Optimizer (6 fases + output format + exemplos + bench)

Pipeline completo de análise, formato de saída exato, 3 exemplos trabalhados e o bench SoT/ToT/ReAct. Resumo operacional no `SKILL.md`.

## Analysis Pipeline (6 fases, sequencial)

### Phase 0: Project Detection

1. Check `CLAUDE.md` no working directory — convenções do projeto
2. Detect tech stack:
   - `package.json` → Node.js / TypeScript / React / Next.js
   - `go.mod` → Go
   - `pyproject.toml` / `requirements.txt` → Python
   - `Cargo.toml` → Rust
   - `build.gradle` / `pom.xml` → Java / Kotlin (checar `quarkus` → Quarkus, `spring-boot` → Spring Boot)
   - `Package.swift` → Swift
   - `Gemfile` → Ruby
   - `composer.json` → PHP
   - `*.csproj` / `*.sln` → .NET
   - `Makefile` / `CMakeLists.txt` → C / C++
   - `cpanfile` / `Makefile.PL` → Perl
3. Anotar stack para Phases 3-4. Sem arquivos → "tech stack unknown".

### Phase 1: Intent Detection

| Category | Signal Words | Example |
|----------|-------------|---------|
| New Feature | build, create, add, implement, 创建, 实现, 添加 | "Build a login page" |
| Bug Fix | fix, broken, not working, error, 修复, 报错 | "Fix the auth flow" |
| Refactor | refactor, clean up, restructure, 重构, 整理 | "Refactor the API layer" |
| Research | how to, what is, explore, investigate, 怎么, 如何 | "How to add SSO" |
| Testing | test, coverage, verify, 测试, 覆盖率 | "Add tests for the cart" |
| Review | review, audit, check, 审查, 检查 | "Review my PR" |
| Documentation | document, update docs, 文档 | "Update the API docs" |
| Infrastructure | deploy, CI, docker, database, 部署, 数据库 | "Set up CI/CD pipeline" |
| Design | design, architecture, plan, 设计, 架构 | "Design the data model" |

### Phase 2: Scope Assessment

| Scope | Heuristic | Orchestration |
|-------|-----------|---------------|
| TRIVIAL | Single file, < 50 lines | Direct execution |
| LOW | Single component or module | Single command or skill |
| MEDIUM | Multiple components, same domain | Command chain + /verify |
| HIGH | Cross-domain, 5+ files | /plan first, then phased execution |
| EPIC | Multi-session, multi-PR, architectural shift | Use blueprint skill for multi-session plan |

Sem projeto detectado: estimar pela descrição e marcar como incerto.

### Phase 3: ECC Component Matching

#### By Intent Type

| Intent | Commands | Skills | Agents |
|--------|----------|--------|--------|
| New Feature | /plan, /tdd, /code-review, /verify | tdd-workflow, verification-loop | planner, tdd-guide, code-reviewer |
| Bug Fix | /tdd, /build-fix, /verify | tdd-workflow | tdd-guide, build-error-resolver |
| Refactor | /refactor-clean, /code-review, /verify | verification-loop | refactor-cleaner, code-reviewer |
| Research | /plan | search-first, iterative-retrieval | — |
| Testing | /tdd, /e2e, /test-coverage | tdd-workflow, e2e-testing | tdd-guide, e2e-runner |
| Review | /code-review | security-review | code-reviewer, security-reviewer |
| Documentation | /update-docs, /update-codemaps | — | doc-updater |
| Infrastructure | /plan, /verify | docker-patterns, deployment-patterns, database-migrations | architect |
| Design (MEDIUM-HIGH) | /plan | — | planner, architect |
| Design (EPIC) | — | blueprint (invoke as skill) | planner, architect |

#### By Tech Stack

| Tech Stack | Skills to Add | Agent |
|------------|--------------|-------|
| Python / Django | django-patterns, django-tdd, django-security, django-verification, python-patterns, python-testing | python-reviewer |
| Go | golang-patterns, golang-testing | go-reviewer, go-build-resolver |
| Spring Boot / Java | springboot-patterns, springboot-tdd, springboot-security, springboot-verification, java-coding-standards, jpa-patterns | java-reviewer |
| Quarkus / Java | quarkus-patterns, quarkus-tdd, quarkus-security, quarkus-verification, java-coding-standards, jpa-patterns | java-reviewer |
| Kotlin / Android | kotlin-coroutines-flows, compose-multiplatform-patterns, android-clean-architecture | kotlin-reviewer |
| TypeScript / React | frontend-patterns, backend-patterns, coding-standards | code-reviewer |
| Swift / iOS | swiftui-patterns, swift-concurrency-6-2, swift-actor-persistence, swift-protocol-di-testing | code-reviewer |
| PostgreSQL | postgres-patterns, database-migrations | database-reviewer |
| Perl | perl-patterns, perl-testing, perl-security | code-reviewer |
| C++ | cpp-coding-standards, cpp-testing | code-reviewer |
| Other / Unlisted | coding-standards (universal) | code-reviewer |

### Phase 4: Missing Context Detection

- [ ] **Tech stack** — Phase 0 detectou ou usuário informa?
- [ ] **Target scope** — arquivos/diretórios/módulos citados?
- [ ] **Acceptance criteria** — como saber que terminou?
- [ ] **Error handling** — edge cases e falhas?
- [ ] **Security** — auth, validação, secrets?
- [ ] **Testing** — unit, integração, E2E?
- [ ] **Performance** — carga, latência, recursos?
- [ ] **UI/UX** — specs, responsivo, a11y? (se frontend)
- [ ] **Database** — schema, migrations, índices? (se dados)
- [ ] **Existing patterns** — arquivos/convenções de referência?
- [ ] **Scope boundaries** — o que NÃO fazer?

**3+ itens críticos faltando** → até 3 perguntas de esclarecimento antes de gerar o prompt otimizado.

### Phase 5: Workflow & Model Recommendation

```
Research → Plan → Implement (TDD) → Review → Verify → Commit
```

MEDIUM+ sempre começa com /plan. EPIC usa blueprint skill.

| Scope | Recommended Model | Rationale |
|-------|------------------|-----------|
| TRIVIAL-LOW | Sonnet 4.6 | Fast, cost-efficient for simple tasks |
| MEDIUM | Sonnet 4.6 | Best coding model for standard work |
| HIGH | Sonnet 4.6 (main) + Opus 4.6 (planning) | Opus for architecture, Sonnet for implementation |
| EPIC | Opus 4.6 (blueprint) + Sonnet 4.6 (execution) | Deep reasoning for multi-session planning |

**Multi-prompt splitting** (HIGH/EPIC): Prompt 1 Research+Plan (search-first, /plan) → Prompts 2-N uma fase cada (termina com /verify) → Final: integration + /code-review. `/save-session` e `/resume-session` entre sessões.

## Output Format (estrutura exata, responder no idioma do input)

### Section 1: Prompt Diagnosis

**Strengths:** o que o prompt original faz bem.

**Issues:**

| Issue | Impact | Suggested Fix |
|-------|--------|---------------|
| (problem) | (consequence) | (how to fix) |

**Needs Clarification:** lista numerada. Se Phase 0 detectou, afirmar em vez de perguntar.

### Section 2: Recommended ECC Components

| Type | Component | Purpose |
|------|-----------|---------|
| Command | /plan | Plan architecture before coding |
| Skill | tdd-workflow | TDD methodology guidance |
| Agent | code-reviewer | Post-implementation review |
| Model | Sonnet 4.6 | Recommended for this scope |

### Section 3: Optimized Prompt — Full Version

Prompt completo em um único bloco de código, self-contained e copiável: task + contexto, stack, /commands nos estágios certos, acceptance criteria, verification, boundaries (NOT to do). Para blueprint: "Use the blueprint skill to..." (não `/blueprint` — é skill, não comando).

### Section 4: Optimized Prompt — Quick Version

| Intent | Quick Pattern |
|--------|--------------|
| New Feature | `/plan [feature]. /tdd to implement. /code-review. /verify.` |
| Bug Fix | `/tdd — write failing test for [bug]. Fix to green. /verify.` |
| Refactor | `/refactor-clean [scope]. /code-review. /verify.` |
| Research | `Use search-first skill for [topic]. /plan based on findings.` |
| Testing | `/tdd [module]. /e2e for critical flows. /test-coverage.` |
| Review | `/code-review. Then use security-reviewer agent.` |
| Docs | `/update-docs. /update-codemaps.` |
| EPIC | `Use blueprint skill for "[objective]". Execute phases with /verify gates.` |

### Section 5: Enhancement Rationale

| Enhancement | Reason |
|-------------|--------|
| (what was added) | (why it matters) |

### Footer

> Not what you need? Tell me what to adjust, or make a normal task request
> if you want execution instead of prompt optimization.

## Examples

### Trigger Examples

- "Optimize this prompt for ECC"
- "Rewrite this prompt so Claude Code uses the right commands"
- "帮我优化这个指令"
- "How should I prompt ECC for this task?"

### Example 1: Vague Chinese Prompt (Project Detected)

**User input:**
```
帮我写一个用户登录页面
```

**Phase 0 detects:** `package.json` with Next.js 15, TypeScript, Tailwind CSS

**Optimized Prompt (Full):**
```
使用项目现有技术栈（Next.js 15 + TypeScript + Tailwind CSS）实现用户登录页面。

技术要求：
- 沿用项目现有的组件结构和路由约定
- 表单验证使用项目中已有的验证方案（检查是否已用 Zod/Yup/其他）
- 认证方式：沿用项目现有认证方案（如无，默认 JWT）
- 包含：邮箱/密码登录表单、表单验证、错误提示、加载状态、响应式布局

工作流：
1. /plan 先规划组件结构和认证流程，参考现有页面的模式
2. /tdd 测试先行：编写登录表单的单元测试和认证流程的集成测试
3. 实现登录页面和认证逻辑
4. /code-review 审查实现
5. /verify 验证所有测试通过且页面正常渲染

安全要求：
- 密码不明文传输
- 防止暴力破解（rate limiting）
- XSS 防护
- CSRF token

验收标准：
- 所有测试通过，覆盖率 80%+
- 页面在移动端和桌面端正常渲染
- 登录成功跳转到 dashboard，失败显示错误信息

不要做：
- 不要实现注册页面
- 不要实现忘记密码功能
- 不要修改现有的路由结构
```

### Example 2: Moderate English Prompt

**User input:**
```
Add a REST API endpoint for user profile updates with validation
```

**Phase 0 detects:** `go.mod` with Go 1.22, Chi router

**Optimized Prompt (Full):**
```
Add a REST API endpoint for user profile updates (PATCH /api/users/:id).

Tech stack: Go 1.22 + Chi router (detected from project)

Requirements:
- PATCH /api/users/:id — partial update of user profile
- Input validation for fields: name, email, avatar_url, bio
- Auth: require valid token, users can only update own profile
- Return 200 with updated user on success
- Return 400 with validation errors on invalid input
- Return 401/403 for auth failures
- Follow existing API patterns in the codebase

Workflow:
1. /plan the endpoint structure, middleware chain, and validation logic
2. /tdd — write table-driven tests for success, validation failure, auth failure, not-found
3. Implement following existing handler patterns
4. /go-review
5. /verify — run full test suite, confirm no regressions

Do not:
- Modify existing endpoints
- Change the database schema (use existing user table)
- Add new dependencies without checking existing ones first (use search-first skill)
```

### Example 3: EPIC Project

**User input:**
```
Migrate our monolith to microservices
```

**Optimized Prompt (Full):**
```
Use the blueprint skill to plan: "Migrate monolith to microservices architecture"

Before executing, answer these questions in the blueprint:
1. Which domain boundaries exist in the current monolith?
2. Which service should be extracted first (lowest coupling)?
3. Communication pattern: REST APIs, gRPC, or event-driven (Kafka/RabbitMQ)?
4. Database strategy: shared DB initially or database-per-service from start?
5. Deployment target: Kubernetes, Docker Compose, or serverless?

The blueprint should produce phases like:
- Phase 1: Identify service boundaries and create domain map
- Phase 2: Set up infrastructure (API gateway, service mesh, CI/CD per service)
- Phase 3: Extract first service (strangler fig pattern)
- Phase 4: Verify with integration tests, then extract next service
- Phase N: Decommission monolith

Each phase = 1 PR, with /verify gates between phases.
Use /save-session between phases. Use /resume-session to continue.
Use git worktrees for parallel service extraction when dependencies allow.

Recommended: Opus 4.6 for blueprint planning, Sonnet 4.6 for phase execution.
```

## SoT / ToT / ReAct Bench (FullCycle, 2026-09)

Demo autoral, N=1, nao benchmark. Fonte: video #112 `Gb1vss1SvwI`
("Are more complex prompts better?"). Mesma task nos 5 prompts:
gerar PR de issue+diff+CI+template via LangChain/GPT-5.5.

| # | Prompt | Formato |
|---|---|---|
| 1 | direct | pedido direto, sem raciocinio exposto |
| 2 | CoT auditavel | passo a passo verificavel |
| 3 | Skeleton-of-Thought (SoT) | skeleton de 5 secoes -> loop expand |
| 4 | Tree-of-Thoughts (ToT) | 3 candidatos + score + voto |
| 5 | ReAct agent | tools read-issue/diff/tests/conventions/save-PR |

LLM-as-judge (autor do video): SoT 30, ToT 30,
direct 27, CoT 27, ReAct 27. Leitura: sofisticacao != melhor
neste caso; diferenca de 3 pts em N=1 nao prova superioridade.

Quando usar cada um:
- direct -> tarefa trivial ou bem especificada, custo minimo.
- CoT auditavel -> precisa rastrear o raciocinio e achar erro.
- SoT -> resposta longa paralelizavel em secoes independentes.
- ToT -> espaco de solucoes aberto, vale comparar candidatos.
- ReAct -> tarefa com ferramentas e estado externo (repo, CI).

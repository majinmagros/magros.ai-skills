---
name: glm-integration-patterns
description: Use when integrating GLM/Z.ai as budget coding agent — browser automation, C/C++ strength, long task persistence, $18/mo quota. Triggers on "glm integration", "z.ai coding agent", "glm browser automation", "glm c coding", "glm budget tier", "glm trial quota".
metadata:
  origin: ECC
  source_docs:
    - https://z.ai
    - https://z.ai/pricing
    - https://github.com/zai-org
  video_source: "EIiXhCaZ4rw - I Mathematically CALCULATED the worth of Codex & Claude Code PLANS (AI Code King)"
  related_skills:
    - roteamento-modelos-gratuitos
    - local-llm-efficiency
    - subscription-tier-routing
    - testsprite-cli-integration
---

# Skill: glm-integration-patterns — GLM/Z.ai como Budget Coding Agent

Padrões para **GLM (Z.ai)** como coding orçamentário: **browser automation**, **C/C++ strength**, **long task persistence**, **$18/mo**, **trial quota**. Código em `references/implementation.md`.

## Quando usar

- Orçamento apertado: coding capacity por ~$18/mo
- Precisa de **browser automation** (interface interaction, check work)
- Trabalha com **C/C++** (ponto forte do GLM)
- Tasks longas com **persistence** (keeps working toward goal)
- Novos usuários: **trial quota** disponível
- Fallback quando allowances Codex/Claude esgotados

## Quando NÃO usar

- Frontier reasoning (Opus/Fable/GPT-4o) → use subscription tiers
- 50+ idiomas → GLM suporta ~10
- Image generation → GLM não tem
- Roteamento genérico free tier → use `roteamento-modelos-gratuitos`
- LLMs locais → use `local-llm-efficiency`

---

## Validação Oficial (2026-09-09)

| Claim | Status | Fonte |
|---|---|---|
| Coding plan $18/mo ($80/$168 tiers maiores) | ✅ | https://z.ai/pricing |
| Trial quota para novos usuários | ✅ | Z.ai website |
| Browser automation: interact + check work | ✅ | Video + Z.ai features |
| C coding strength | ✅ | Video + benchmarks |
| Longer task persistence | ✅ | Video |
| ~10 idiomas | ✅ | Z.ai docs |

---

## GLM Capability Matrix

| Capability | Level | Notes |
|---|---|---|
| **General coding** | Strong | Everyday coding work |
| **C/C++** | **Very Strong** | Destaque do vídeo |
| **Browser automation** | Strong | Click, inspect, verify deployed app |
| **Long tasks** | Strong | Keeps working toward goal |
| **Frontier reasoning** | Moderate | Not Opus/Fable level |
| **Languages** | ~10 | vs 50+ frontier |
| **Image generation** | None | Use Codex desktop |
| **Cost** | **$18/mo** | Best value for volume |

---

## Uso Rápido

```python
from openai import OpenAI  # Z.ai é OpenAI-compatible

client = OpenAI(base_url="https://api.z.ai/v1", api_key="...")  # dashboard Z.ai

# Modelos: glm-4.5 (padrão), glm-4.5-air (rápido/barato), glm-4v (vision)
resp = client.chat.completions.create(
    model="glm-4.5", messages=[{"role": "user", "content": task}],
    max_tokens=8192, temperature=0.1,
)
```

Padrões prontos em `references/implementation.md`: `GLMAgent` (codegen + `c_cpp_task` + `persistent_task` com DONE-loop), `GLMBrowserAutomation` (verify deployed app + checkout flow), C++ moderno (coroutines, `std::expected`, `SafeBuffer`), `should_use_glm_budget` (quando usar vs tiers caros), `GLMTrialManager`.

**Quando usar GLM:** allowances esgotados, C/C++, browser automation, volume com budget apertado. Sempre valide output C/C++ com compile + run.

---

## Anti-Patterns

| ❌ Errado | ✅ Correto |
|---|---|
| GLM para frontier reasoning | Opus/Fable/GPT-4o para reasoning complexo |
| Esperar 50+ idiomas | Aceitar ~10 idiomas |
| Pedir image generation | Codex desktop ou DALL-E |
| Ignorar browser automation | Usar para verification de deployed apps |
| Não testar output C/C++ | Validar com compile + run |

---

## Integração com Skills Existentes

| Skill | Relação |
|---|---|
| `roteamento-modelos-gratuitos` | GLM como free/cheap tier option |
| `subscription-tier-routing` | GLM como budget fallback tier |
| `testsprite-cli-integration` | GLM browser automation alternative |
| `local-llm-efficiency` | GLM como cloud alternative to local |

---

## Referências

- `references/implementation.md` — agent, browser, C++, trial manager
- [Z.ai](https://z.ai) · [Pricing](https://z.ai/pricing)
- Video: `EIiXhCaZ4rw.en.dedup.txt` — linhas 328-361

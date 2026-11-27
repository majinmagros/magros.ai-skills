---
name: agent-observability
description: Use when instrumenting or debugging a production LLM agent — traces per session, spans per LLM call and tool call, token/cost attribution, and latency diagnosis via OpenTelemetry. Triggers on "observabilidade de agente", "tracing de agente", "OpenTelemetry agente", "otel", "por que o agente demorou", "agente chamou tool errada", "custo por conversa", "agent tracing", "Langfuse", "LangSmith", "Arize Phoenix", "Opik". Non-triggers: scoring output quality (use `agent-eval` or `eval-harness`), auditing context size (use `context-budget`), security review of tool access (use `agent-guardrails`).
metadata:
  origin: ECC
---

# Agent Observability

Um agente sem trace é um agente que você não pode consertar. Quando ele responde
mal, demora, ou gasta tokens demais, a pergunta é sempre a mesma: **em qual passo
ele decidiu isso?** Sem registro por passo, a resposta é chute.

Fonte: ColeMedin `@ColeMedin/k87Iqft91j8` (2026-11). O vídeo lista os cinco
componentes que todo agente precisa antes de produção: permissões por tool,
humano no circuito, limites de rede, sistema de memória, e observabilidade —
sendo a observabilidade a que permite diagnosticar os outros quatro.

## Quando usar

- Agente já roda em produção ou em uso real e você precisa explicar o comportamento.
- Latência alta e você não sabe se é LLM, tool ou retry.
- Custo por conversa subindo sem mudança de código.
- O agente chama a tool errada e você só vê o output final.
- Você quer otimizar tokens e precisa saber onde eles vão.

Não use para: avaliar qualidade de output (isso é `agent-eval` / `eval-harness`);
auditar quanto de contexto está carregado (isso é `context-budget`); revisar
permissões de tool (isso é `agent-guardrails`, que esta skill complementa).

## Modelo mínimo: 3 níveis

| Nível | O que é | Serve para |
|---|---|---|
| **Trace** | uma sessão/conversa inteira, com `trace_id` estável | agrupar tudo que aconteceu num pedido |
| **Span** | um passo: chamada de LLM, execução de tool, recuperação | achar o passo culpado |
| **Atributo** | chave/valor no span: modelo, tokens, status, tool name | filtrar, agregar, cobrar |

Regra: **todo turno recebe um trace; toda chamada de LLM e de tool vira span
filho.** Sem isso você tem log, não observabilidade.

## O que registrar por span

Siga as convenções GenAI do OpenTelemetry em vez de inventar nomes:

| Campo | Span de LLM | Span de tool |
|---|---|---|
| `gen_ai.system` | `anthropic`, `openai`, `google` | — |
| `gen_ai.request.model` | `claude-sonnet-4-5` | — |
| `gen_ai.usage.input_tokens` / `output_tokens` | sim | — |
| `gen_ai.operation.name` | `chat` | `execute_tool` |
| `tool.name` | — | nome exato da tool |
| `tool.args` / `tool.result` | — | truncado, com cuidado com PII |
| `status.code` + mensagem de erro | sim | sim |
| duração | automática | automática |

Custo por conversa = soma de `input_tokens`/`output_tokens` dos spans de LLM
vezes o preço do modelo daquele span. Guarde o preço como config, não hardcode
dentro do span.

## Instrumentação mínima (Python)

```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter

provider = TracerProvider()
provider.add_span_processor(BatchSpanProcessor(OTLPSpanExporter()))  # OTEL_EXPORTER_OTLP_ENDPOINT
trace.set_tracer_provider(provider)
tracer = trace.get_tracer("agent")

def call_llm(model: str, messages: list) -> str:
    with tracer.start_as_current_span("chat") as span:
        span.set_attribute("gen_ai.operation.name", "chat")
        span.set_attribute("gen_ai.system", "anthropic")
        span.set_attribute("gen_ai.request.model", model)
        resp = client.messages.create(model=model, messages=messages)
        span.set_attribute("gen_ai.usage.input_tokens", resp.usage.input_tokens)
        span.set_attribute("gen_ai.usage.output_tokens", resp.usage.output_tokens)
        return resp.content[0].text
```

```python
def run_tool(name: str, fn, *args, **kwargs):
    with tracer.start_as_current_span(f"execute_tool {name}") as span:
        span.set_attribute("gen_ai.operation.name", "execute_tool")
        span.set_attribute("tool.name", name)
        try:
            return fn(*args, **kwargs)
        except Exception as exc:
            span.record_exception(exc)
            span.set_status(trace.Status(trace.StatusCode.ERROR, str(exc)))
            raise
```

Ponto único de instrumentação: envolva o **cliente de LLM** e o **dispatcher de
tools**. Se você instrumenta em cada call site, vai esquecer um.

## Backends

Todos os de baixo falam OTLP, então o código não muda ao trocar:

| Backend | Quando |
|---|---|
| Langfuse (self-host, OSS) | quer custo por trace e prompt management junto |
| Arize Phoenix (OSS) | quer eval + trace no mesmo lugar, local |
| LangSmith | stack LangChain/LangGraph |
| Opik | OSS, foco em eval de agente |
| Grafana Tempo / Jaeger | já tem stack OTel na empresa; trace cru |
| Atlas Agent Engine (MongoDB) | protótipo/avaliação; público em prévia |

## Diagnóstico: perguntas que o trace responde

| Sintoma | Olhe |
|---|---|
| Resposta lenta | span mais longo: LLM (modelo grande? output longo?) ou tool (rede?) |
| Tool errada | sequência de `tool.name` + `tool.args`; falta descrição na tool? |
| Custo alto | tokens de input por span; contexto inflado ou histórico não podado? |
| Falha intermitente | `status.code=ERROR` + `record_exception`; retry contando como sucesso? |
| Alucinação | o span de retrieval trouxe algo? o LLM respondeu sem span de busca? |

## Regras

1. **Trace desde o dia 1.** Adicionar depois exige instrumentar tudo de novo.
2. **Um trace por turno de usuário**, propagado para sub-agentes e jobs assíncronos.
3. **Truncar payloads**, nunca despejar prompt inteiro nem PII no span.
4. **Custo é atributo, não relatório separado.** Se está no span, dá para agregar.
5. **Amostragem:** 100% em staging, 10–20% em produção com 100% dos erros.
6. **A CLI serve.** Exportar traces em JSONL e deixar o agente de código analisar
   em escala é mais barato que construir dashboard antes de saber a pergunta.

## Checklist

- [ ] Todo turno gera um `trace_id` propagado a sub-agentes
- [ ] Spans de LLM com modelo + tokens de input/output
- [ ] Spans de tool com nome, args truncados, status e duração
- [ ] Exceções registradas com `record_exception` + status ERROR
- [ ] Custo por conversa calculável a partir dos spans
- [ ] Retenção e mascaramento de PII definidos antes de ligar em produção

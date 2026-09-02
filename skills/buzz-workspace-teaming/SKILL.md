---
name: buzz-workspace-teaming
description: Use when implementing Block Buzz workspace — humans and AI agents as teammates with shared workspace, identity keys, VPS relay, worktrees, per-agent model routing, and free-tier (Kimi K3 via OpenRouter). Triggers on "Buzz", "Block Buzz", "workspace teammates", "human-agent teaming", "Kimi K3 free", "starter agents", "bus.xyz", "WSS relay".
metadata:
  origin: ECC
---

# Buzz Workspace Teaming — Block Buzz (Jack Dorsey) + VPS 24/7

> Fonte: `Maestros da IA — DpiAtwZODnw` (1041 linhas, bus.xyz, Jack Dorsey/Block), transcript `DpiAtwZODnw.pt.dedup.txt:6-1030`

Chat de equipe onde humanos e agentes sentam como pares, com cadeira e crachá, delegam entre si sem aprovação por mensagem.

## Quando usar

- Workspace 24/7 onde agentes conversam e repassam tarefas sem você acordado
- Múltiplos harnesses (Claude Code, Codex, Cursor, Hermes, OpenClaw) na mesma comunidade
- Precisa de audit trail assinado + worktrees paralelos + mobile

## Arquitetura (3 peças)

- **Desktop App** (`bus.xyz`) — janela de comunicação, conecta harnesses
- **Community** na **VPS** (Hostinger KVM2 Docker) — não fecha com notebook; `WSS` relay URL `wss://...cloud`
- **Buzz Relay** (centro) + Postgres/Redis/files/Git/search; `worktrees` para agentes paralelos sem conflito; toda ação assinada crypto + registrada

Buzz não tem modelo; modelos são seus agentes.

## Deploy VPS (Hostinger)

1. `bus.xyz` → Desktop (ou Android) → criar identidade → salvar **chave privada** (sem senha, `public=address`)
2. VPS → Gerenciar Docker → Catálogo → `bus` → colar código relay → Implantar → Abrir → copiar `WSS` até `cloud`
3. Buzz App → Join Community → colar `WSS` → nome + emoji → `Take me Buzz` → Settings → Agents → escolher provider/harness (Cloud Code, Codex, Hermes, `bus agent` + OpenRouter + API key) → Save

## Identidade e Permissões

- Par de chaves por humano/agente; tudo assinado
- Níveis por canal e repositório; Git nativo nos worktrees

## Persona starter library (9 do vídeo)

| Agente | Papel | Prompt essencial | Harness sugerido |
|---|---|---|---|
| Caio | Roteirista | `Use pauta + pesquisa para roteiro PT-BR com hook 20s, blocos, brow, CTA comunidade; sem hype` | Claude Code (Anthropic humanizado) |
| Davi | Produtor técnico | `Roteiro → plano executável: comandos, código, N8N, env, riscos + alternativa segura` | Codex GPT-5.6 |
| Kengi/KJ | Design visual | `Analisa thumbnail/página: composição, hierarquia, contraste, tipografia; briefing minimalista` | Cloud Code |
| Carol | Carrossel | `Ideia complexa → sequência visual persuasiva, títulos, CTAs` | Codex |
| Laura | Copy | `Analisa oferta: clareza, promessa, prova, CTA → títulos/hooks sem clichê` | Cloud Code |
| Lia | Diretora criativa | `YouTube packaging: 3 títulos + thumb texto/composição, casal protagonista quando aplicável` | Cloud Code |
| Lisa | Pesquisadora conteúdo | `Encontra fatos confiáveis, insites, temas em alta sobre IA` | Codex GPT-5.6 Terra |
| Nina | Pesquisadora técnica | `Valida afirmações, limitações, custos, checklist técnico; não escreva roteiro final` | Codex Sol |
| Zeca | Estrategista | `Tendência → ângulo, promessa, público, 5 títulos, briefing thumb, estrutura; sinalize o que verificar` | Cloud Code |

Crie via `Agents → +` → nome + system prompt + modelo → Save.

## Canais e roteamento por agente

- **Canais**: `Channels → Create` → nome/descrição, expiração (temp/indefinido), visibilidade private/public (equipe só vê public)
- **Model routing**: `bus agent` → Provider `OpenRouter` → `Kimi K3` free tier; por agente escolha `Cloud Code` (escrita) vs `Codex GPT-5.6 Terra` (barato técnico) vs `Sol` (custo/velocidade)

## Delegation chain (multi-agente auditado)

Mencione com `@` senão não respondem. Ex `marketing maestros na IA`:
```
@laura analise landing https://... : clareza, promessa, prova, CTA → resumo + pontos fracos + nova copy por sessão (não invente)
@kengi analise design com copy da Laura → HTML responsivo único com diagnóstico/executivo/antes-depois/prévia + checklist; escolha reviewer entre agentes (ex: Lia) para checar copy/design/responsivo; se falhar, devolva para Laura/Kengi; só entregue HTML após aprovação + 5 mudanças impacto
```
Acompanhe em `Inbox` e via navegador Playwright MCP ao vivo.

## Mobile

Settings → Mobile → escanear QR no app celular → todo time + agentes no bolso.

## Referências

- `references/personas.md` — 9 prompts completos
- `references/delegation-pattern.md` — template chain auditada
- Vídeo: https://www.youtube.com/watch?v=DpiAtwZODnw

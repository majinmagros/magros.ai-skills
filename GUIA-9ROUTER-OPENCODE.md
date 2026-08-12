# GUIA 9ROUTER + OPENCODE — instalação, chaves e conexão

> Escrito para leigos, seguindo o vídeo "Nine Router" (configuração do zero)
> e a documentação oficial (github.com/decolua/9router).
> O objetivo final: programar com IA sem ficar sem crédito no meio do trabalho.

---

## 1. O que é o 9Router?

Um **roteador de IA** que roda **localmente** na sua máquina e conecta qualquer
ferramenta de IA (Cursor, Claude Code, Codex, OpenCode, Cline...) a **60+
provedores de IA** por um único endereço:

```
Ferramenta (opencode)  →  9Router (porta 20128)  →  Anthropic / OpenAI / Google / grátis...
```

Quando o modelo bate o limite (sem crédito, rate limit), o 9Router **troca
sozinho** para outro modelo até achar um que funciona — **zero downtime**.
E a maioria dos modelos alternativos é **de graça e sem cartão**.

### Os 3 níveis (Tiers) — o coração da ferramenta

| Tier | O que é | Exemplos |
|---|---|---|
| **Subscription** | Suas assinaturas/chaves pagas | Claude Pro, OpenAI, etc. |
| **Cheap** | Modelos baratos | DeepSeek, Groq (Lite) |
| **Fallback / Free** | Modelos gratuitos | Kiro AI, OpenCode Free |

O 9Router tenta na ordem: **Subscription → Cheap → Free**. Se o pago esgotar,
cai no grátis e o trabalho continua.

---

## 2. Pré-requisitos

- **Node.js** (versão LTS ou current) — o vídeo usa a versão `current`.
  Verifique: abra o terminal e rode `node -v` (deve mostrar v18+).
  Se não tiver: baixe em nodejs.org e instale (marcas a opção "Add to PATH").
- **npm** já vem junto do Node.

---

## 3. Instalar o 9Router

### Opção A — npm (recomendado para desktop / Windows)

Abra o terminal (PowerShell):

```powershell
npm install -g 9router
```

Depois, para iniciar:

```powershell
9router
```

> Na primeira vez ele abre o navegador no **dashboard**.
> O serviço roda em `http://localhost:20128`.

### Opção B — Docker (servidor/VPS)

```bash
docker run -d --name 9router -p 20128:20128 \
  -v "$HOME/.9router:/app/data" -e DATA_DIR=/app/data \
  decolua/9router:latest
```

### Comandos úteis do 9Router

```powershell
9router                    # inicia com padrão
9router --port 8080        # porta diferente
9router --no-browser       # não abre navegador
9router --help             # todas as opções
```

---

## 4. Abrir o Dashboard

Depois de rodar `9router`, acesse no navegador:

```
http://localhost:20128
```

(O painel completo: `http://localhost:20128/dashboard`)

Aqui você:
- **conecta provedores** (grátis e pagos);
- **configura chaves de API**;
- **testa modelos**;
- **cria combos/rotas** de fallback.

---

## 5. Conectar provedores (e cadastrar API Keys)

### 5.1 Provedores GRÁTIS (sem cartão, sem cadastro)

No Dashboard → **Providers**, clique em **Conectar** em:

- **Kiro AI** → modelos Claude ilimitados grátis (o vídeo destaca esse).
- **OpenCode Free** → sem autenticação, conecta na hora.

Aparecem como **Fallback / Free** na lista de tiers.

### 5.2 Provedores PAGOS (precisam da sua API Key)

Vá no site do provedor, gere uma chave e cole no Dashboard → Providers:

| Provedor | Onde gerar a chave | Formato da chave |
|---|---|---|
| **Anthropic** | console.anthropic.com → API Keys → Create | `sk-ant-...` |
| **OpenAI** | platform.openai.com → API Keys | `sk-...` |
| **Google AI (Gemini)** | aistudio.google.com → Get API key | `AIza...` |
| **Groq** | console.groq.com → API Keys | `gsk_...` |
| **Google Vertex / AWS Bedrock / Azure** | consoles de cada serviço | várias |

No 9Router: **Providers → clique no provedor → cole a API Key → Salvar**.
Aparecem como **Subscription / Cheap** na lista de tiers.

> Você pode colocar **várias chaves do mesmo provedor** — o 9Router usa em
> round-robin (fallback entre chaves do mesmo serviço).

### 5.3 Testar um modelo

No Dashboard, use a tela de **teste**: escolha provedor + modelo, mande um
prompt, veja a resposta. Assim você confirma que a chave está boa antes de usar.

### 5.4 Copiar a API Key do 9Router (para o opencode)

No Dashboard → **API Keys** → **Copiar**. Essa chave (formato `sk-...`) é a que
o opencode vai usar para falar com o 9Router. Guarde-a.

---

## 6. Instalar o opencode

```powershell
npm install -g opencode
```

Verifique: `opencode --version`.

> Alternativas: `scoop install opencode`, ou binário do site opencode.ai.

---

## 7. Conectar o opencode ao 9Router

Crie/edite o arquivo de configuração:

- **Windows**: `C:\Users\SEU_USUARIO\.config\opencode\opencode.json`
- **macOS/Linux**: `~/.config/opencode/opencode.json`

Cole (troque `SUA_CHAVE_9ROUTER` pela chave copiada no passo 5.4):

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "9router": {
      "npm": "@ai-sdk/openai-compatible",
      "options": {
        "baseURL": "http://127.0.0.1:20128/v1",
        "apiKey": "SUA_CHAVE_9ROUTER"
      },
      "models": {
        "my-combo": {
          "name": "my-combo",
          "modalities": { "input": ["text", "image"], "output": ["text"] }
        }
      }
    }
  },
  "model": "9router/my-combo"
}
```

Explicação dos campos:
- **baseURL**: endereço do 9Router (roda na porta 20128, igual ao dashboard).
- **apiKey**: a chave do 9Router (não é a do Anthropic — é a do roteador).
- **model**: escolha um modelo disponível (ex.: `9router/kr/claude-sonnet-4.5`
  se usar Kiro AI; ou o ID do combo que você criou).

---

## 8. Testar

1. Tenha o 9Router rodando (`9router` no terminal, dashboard aberto).
2. No terminal, rode `opencode` e pergunte qualquer coisa.
3. Se responder, está conectado. Para ver qual modelo respondeu, olhe o
   Dashboard → Logs/Requests.

---

## 9. Troubleshooting

| Problema | Causa provável | Solução |
|---|---|---|
| "Connection refused" na porta 20128 | 9Router não está rodando | rode `9router` e deixe aberto |
| Erro de autenticação (401) | API key errada/ausente | copie de novo no Dashboard (5.4) e cole no opencode.json |
| "Model not found" | modelo errado no `opencode.json` | use um ID que exista (Dashboard → Models) |
| Todo modelo falha | sem nenhum provedor conectado | conecte Kiro AI ou OpenCode Free (5.1) |
| Porta ocupada | outro processo na 20128 | `9router --port 8080` e atualize o baseURL |

---

## 10. Dica final (do vídeo)

O 9Router é só um **porteiro** entre suas ferramentas e os provedores. O valor
real está em deixar os 3 tiers configurados: **Subscription (pago) → Cheap →
Free**. Assim você começa no melhor modelo, cai para um barato quando esgotar e
termina num grátis — sem nunca parar de codar.

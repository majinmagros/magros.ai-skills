# GUIA 9ROUTER + OPENCODE — instalação e conexão

> Guia simplificado. Objetivo: usar IA sem custo, sem assinaturas.

---

## 1. O que é o 9Router?

Um roteador de IA local que conecta o OpenCode a dezenas de provedores de IA.

**O grande diferencial:** Você NÃO precisa de assinatura paga (Claude Pro, OpenAI, etc). O 9Router funciona perfeitamente com contas gratuitas.

Ele gerencia o acesso automaticamente: se um provedor gratuito ficar instável, ele troca sozinho para outro.

---

## 2. Pré-requisitos

- Node.js instalado (digite `node -v` no terminal).
- npm (já instalado com Node).

---

## 3. Instalar o 9Router

No terminal (PowerShell):

```powershell
npm install -g 9router
9router
```

O dashboard abrirá no navegador: `http://localhost:20128`.

---

## 4. Conectar provedores (Gratuitos)

No Dashboard → **Providers**, clique em **Conectar** nos serviços listados como **Fallback / Free**:

- **Kiro AI** ou **OpenCode Free** (não exigem cartão ou cadastro pago).

Esses provedores oferecem acesso gratuito à IA. O 9Router usará eles automaticamente.

---

## 5. Configurar o OpenCode

No Dashboard → **API Keys**, copie a chave. Essa é a chave que o OpenCode usará.

Edite seu arquivo de configuração (Windows: `%USERPROFILE%\.config\opencode\opencode.json`):

```json
{
  "provider": {
    "9router": {
      "options": {
        "baseURL": "http://127.0.0.1:20128/v1",
        "apiKey": "SUA_CHAVE_COPIADA"
      }
    }
  },
  "model": "9router/my-combo"
}
```

---

## 6. Testar

Com o 9Router rodando, execute `opencode` no terminal e faça uma pergunta. Se responder, está pronto.


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

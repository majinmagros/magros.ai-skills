# GUIA OPENCODE — instalação e conexão

> Guia simplificado. Objetivo: instalar o opencode e conectar a um provedor de IA —
> começando pelos modelos gratuitos, sem precisar de assinatura paga.

---

## 1. O que é o opencode?

Um agente de código que roda no terminal: lê e edita arquivos, executa comandos e
conversa com os melhores modelos de IA.

**O grande diferencial:** você NÃO precisa de assinatura paga para começar. O opencode
tem modelos gratuitos (sufixo `-free`), como o `opencode/deepseek-v4.1-flash-free`.

---

## 2. Pré-requisitos

- Node.js instalado (digite `node -v` no terminal).
- npm (já instalado com Node).
- Windows: rodar via WSL é recomendado para a melhor experiência.

---

## 3. Instalar o opencode

No terminal (PowerShell):

```powershell
npm install -g opencode-ai
```

Alternativas de instalação: `choco install opencode` (Chocolatey) ou
`scoop install opencode` (Scoop).

Para atualizar depois:

```powershell
opencode upgrade
```

---

## 4. Conectar um provedor

Dentro do opencode, rode:

```
/connect
```

Escolha **OpenCode Zen** e siga o fluxo: ele abre `opencode.ai/auth` no navegador,
onde você cria a conta e copia a API key. Cole a chave no opencode quando pedido.

A credencial fica salva em:

- Windows: `C:\Users\SEU_USUARIO\.local\share\opencode\auth.json`
- Linux/macOS: `~/.local/share/opencode/auth.json`

---

## 5. Escolher o modelo

Liste os modelos disponíveis com `/models` (dentro do opencode) ou pelo terminal:

```powershell
opencode models
```

Para fixar o modelo padrão, edite o arquivo de configuração
(Windows: `C:\Users\SEU_USUARIO\.config\opencode\opencode.json`):

```json
{
  "model": "opencode/deepseek-v4.1-flash-free"
}
```

Modelos com sufixo `-free` têm custo zero (podem existir limites diários de uso).

---

## 6. Testar

Execute `opencode` no terminal e faça uma pergunta. Se responder, está pronto.

Dentro de um projeto, o comando `/init` cria/atualiza o `AGENTS.md` com o contexto
do repositório.

---

## 7. Troubleshooting

| Problema | Causa provável | Solução |
|---|---|---|
| `ProviderModelNotFoundError` | modelo em formato errado | use `provedor/modelo` (ex.: `opencode/deepseek-v4.1-flash-free`); confira com `opencode models` |
| Erro de autenticação (401) | API key ausente/expirada | rode `/connect` de novo e cole a chave |
| Modelo gratuito parou de responder | limite diário atingido | troque de modelo com `/models` |
| Comportamento estranho após atualização | versão desatualizada | rode `opencode upgrade` |
| Diagnóstico | — | logs em `%USERPROFILE%\.local\share\opencode\log`; cache em `%USERPROFILE%\.cache\opencode` |
| Problemas no Windows | ambiente nativo | prefira rodar via WSL |

---

## 8. Dica final

O opencode é só um **porteiro** entre você e os provedores de IA. O valor real está
em conhecer o `/models`: comece nos modelos gratuitos e, quando quiser mais
capacidade, troque para um modelo pago com o mesmo comando — sem nunca parar de codar.

---

Documentação oficial: https://opencode.ai/docs/

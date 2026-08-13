# Guia de Instalação para Iniciantes — magros.ai-skills

> **Sem experiência com tecnologia? Sem problema.** Este guia foi escrito para
> você. Siga os passos na ordem e, em cerca de 15 minutos, sua inteligência
> artificial estará trabalhando com uma biblioteca de quase 300 habilidades.

---

## O que é isto? (em linguagem simples)

Imagine que a sua IA (Claude Code, Codex, OpenCode...) é uma pessoa muito
inteligente, mas que chega ao trabalho **sem memória e sem manual**.

Este repositório é o **manual + memória**: uma biblioteca com ~297 "skills"
(habilidades). Cada skill é um arquivo de instruções detalhado que ensina a IA
a fazer uma tarefa específica do jeito certo: revisar um contrato, criar uma
campanha visual, auditar um site, planejar um projeto, transcrever vídeos e
muito mais.

**Por que tantas skills juntas?** Porque a biblioteca funciona como um
**"cérebro externo"**: com instruções boas e detalhadas, até modelos de IA mais
simples (ou baratos, ou locais, quase sem internet) conseguem produzir trabalho
de qualidade. A inteligência deixa de depender só do modelo e passa a viver nos
procedimentos — que são seus, ficam no seu computador e ninguém pode tirar.

Você não usa as 297 ao mesmo tempo. A IA lê o nome e a descrição de cada uma e
**só ativa a skill certa quando você pede algo relacionado** — como um celular
que só abre o aplicativo certo para cada tarefa.

---

## O que você precisa antes de começar

| Requisito | Para que serve | Link |
|---|---|---|
| **Git** | Baixa o repositório e mantém atualizado | https://git-scm.com/downloads |
| **Node.js** (versão LTS) | Executa o instalador | https://nodejs.org |
| **Claude Code** (ou outro agente) | Quem vai usar as skills | https://claude.ai/claude-code |

Instale cada um clicando em "Next/Avançar" até o fim — as opções padrão estão corretas.

---

## Passo a passo (Windows)

### Passo 1 — Abrir o terminal certo
1. Aperte a tecla **Windows**, digite `PowerShell` e pressione **Enter**.

### Passo 2 — Baixar o repositório
Digite (ou cole) o comando abaixo e pressione Enter:

```powershell
git clone https://github.com/majinmagros/magros.ai-skills.git
```

Isso cria a pasta `magros.ai-skills` dentro da sua pasta de usuário.
Aguarde terminar (aparecem várias linhas de texto — é normal).

### Passo 3 — Rodar o instalador
Cole os dois comandos abaixo, um de cada vez:

```powershell
cd magros.ai-skills
powershell -ExecutionPolicy Bypass -File install.ps1
```

O instalador vai:
- baixar as dependências automaticamente (só na primeira vez);
- perguntar quais **módulos** de skills você quer instalar;
- copiar as skills para o local onde sua IA as encontra.

> **Na dúvida sobre o que escolher?** Aceite as opções padrão. Você pode
> rodar o instalador de novo depois para adicionar ou remover módulos.

### Passo 4 — Conferir se funcionou
Abra o Claude Code e pergunte algo como:

```
Que skills você tem disponíveis?
```

Se aparecerem skills como `humanizar-texto`, `criar-skill`, `workflows`,
a instalação funcionou.

---

## Passo a passo (Mac e Linux)

```bash
git clone https://github.com/majinmagros/magros.ai-skills.git
cd magros.ai-skills
./install.sh
```

---

## Como escolher suas primeiras skills

**Regra de ouro: comece com 3 a 5 skills.** Mais do que isso atrapalha mais do
que ajuda. Sugestões para começar:

| Se você quer... | Instale |
|---|---|
| Textos que não pareçam escritos por IA | `humanizar-texto` |
| Criar suas próprias skills | `criar-skill` |
| Planejar projetos com segurança | `grills` + `score-loop` |
| Pesquisar o que as pessoas falam de um assunto | `pesquisa-social` |
| Analisar concorrentes | `analise-concorrentes` |

A lista completa com descrição de cada skill está no `README.md` e no
`GUIA-COMPLETO.md` deste repositório.

---

## Atualizar no futuro

Quando houver skills novas, basta rodar no terminal, dentro da pasta:

```powershell
git pull
```

E rodar o instalador de novo (Passo 3) se quiser os novos módulos.

---

## Problemas comuns

| Problema | Solução |
|---|---|
| `git não é reconhecido como comando` | O Git não foi instalado ou você precisa **fechar e abrir** o PowerShell de novo |
| `npm não é reconhecido` | Instale o Node.js (link acima), feche e reabra o PowerShell |
| O instalador dá erro de permissão | Use o comando do Passo 3 exatamente como está (ele já contém o `-ExecutionPolicy Bypass`) |
| A IA não usa nenhuma skill | Verifique se instalou no agente certo e peça novamente de forma direta (ex.: "use a skill humanizar-texto") |
| Ficou em dúvida em alguma etapa | Rode o instalador novamente — ele é seguro para repetir |

---

## Dicas finais

1. **Menos é mais**: 3–5 skills bem escolhidas rendem mais que 50 ativadas.
2. **A skill ativa sozinha**: você não precisa decorar nomes; descreva o que
   quer em linguagem natural.
3. **Crie as suas**: quando você fizer um fluxo que vai repetir, peça
   "crie uma skill com o que acabamos de fazer" — a skill `criar-skill` guia o processo.
4. **Segurança**: instale skills de terceiros apenas de fontes confiáveis —
   uma skill é um código que roda com suas permissões.

Bom trabalho!

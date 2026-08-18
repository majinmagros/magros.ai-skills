---
name: avaliar-ferramenta-ia
description: Use when a new AI tool/service/platform is announced or proposed and you must decide whether to adopt/sign up or keep the current stack — before anyone pays or migrates. Triggers on "vale a pena essa ferramenta?", "avalia essa ferramenta de IA", "assino ou não?", "tool X muda tudo", "devo adotar", "lock-in", "hype", "testar antes de assinar", "build vs buy", "ferramenta nova". Runs a skeptic framework: real scope vs marketing, true cost of the defining feature, lock-in and exit cost, comparison with what you already use (open tools count), hands-on trial, and the hype timeline — outputs a grounded adopt/ignore/wait decision.
---

# Skill: avaliar-ferramenta-ia — Adotar, ignorar ou aguardar?

Toda semana aparece uma ferramenta "que muda tudo". Na prática, a maioria é um
clone embalado de algo que o seu stack atual já entrega. O objetivo desta skill
é decidir com evidência — nunca pelo hype — se a ferramenta vale adoção, sempre
comparando com o que você já tem. Rode ANTES de assinar, migrar ou ensinar a equipe.

## Quando usar

- Uma ferramenta/serviço/plataforma de IA nova foi anunciada (ou proposta em
  reunião) e alguém quer assinar/adotar.
- Chegou "o novo X que substitui tudo" e o feed/influencers estão bombando.
- Você está prestes a assinar um plano pago e quer checar antes.
- Um fornecedor quer migrar seu time para o ecossistema dele (lock-in).

Não use para: decidir criar um produto interno (isso é `triagem-ideias` /
`product-lens`); nem para comparar bibliotecas de código no detalhe (isso é
pesquisa técnica normal).

## Princípio central

**O custo real quase nunca é o preço do teaser.** O preço que importa é o do
recurso que DEFINE o produto — o que você não consegue em lugar nenhum. E o
melhor investimento quase nunca é a ferramenta nova: é dominar a que você já tem.

## Pipeline (7 fases)

### 1. Intake — o que estão DIZENDO que ela faz

- Capture a promessa: "X substitui/automatiza/entrega Y".
- Anote quem anuncia e o canal (marketing oficial vs influencer vs usuário real).
- Registre o hype (data de lançamento, quantos dias de vida tem).

### 2. Escopo real — o que ela FAZ e o que NÃO faz

- Liste funcionalidades verificáveis (documentação oficial, não o anúncio).
- Liste explicitamente o que ela NÃO faz (limites, modelos suportados, beta).
- Se é beta: beta com dias de vida = instabilidade esperada (auths, conectores)
  — trate como custo.

### 3. Cliente ideal — quem isso serve de verdade?

- Defina o perfil que se beneficia (ex.: "pessoa sem perfil técnico, quer tudo
  pronto, aceita pagar o preço do recurso principal").
- Cheque se VOCÊ (ou a empresa) é esse perfil. Se não for, a decisão tende a "ignorar".

### 4. Custo real — preço do recurso que DEFINE o produto

- Identifique o recurso definidor (o que nenhum equivalente entrega igual).
- Descubra em qual plano ele está e o preço REAL dele (não o teaser de entrada).
- Some custos escondidos: aluguel de recurso, taxa por agente/acento, overage.

### 5. Lock-in — o que você perde ao entrar

- Modelo preso a um único provedor? Você consegue escolher modelo por tarefa?
- Ecossistema fechado: rotinas, skills, histórico e agentes migram? Custo de saída?
- Regra: se a migração é cara ou impossível, o lock-in é o maior custo do produto.

### 6. Comparar com o stack atual — o que já assino entrega isso?

- Liste o que você JÁ paga/usou (Claude Code, Codex, OpenClaw, Copilot, etc.).
- Ferramentas abertas contam: "X aberto faz isso há tempos" = não é revolução.
- Se o stack atual entrega o mesmo com mais autonomia (modelo por tarefa, sem
  aluguel), a resposta quase sempre é: dominar o que já tenho.

### 7. Testar no trial — hands-on com tarefa representativa

- Crie 1–2 agentes/tarefas REAIS do seu dia (não a demo do marketing).
- Teste as integrações prometidas (Gmail, GitHub, banco, planilha...).
- Cronometre o tempo até o primeiro resultado útil.
- Registre onde travou/consumiu crédito. Beta que queima crédito = custo real.

## Decisão (3 vereditos)

| Veredito | Quando |
|---|---|
| **Adotar** | Cobre um gap real do stack, custo justo pelo recurso definidor, lock-in aceitável, passou no trial. |
| **Ignorar** | É clone do que você já usa; o perfil-alvo não é o seu; o preço do recurso definidor não compensa. |
| **Aguardar** | Potencial real, mas beta instável ou ecossistema ainda imaturo — reavaliar em N dias com nova passada. |

## Saída

Relatório curto (~15 linhas) com: promessa vs realidade, o que ela NÃO faz,
cliente ideal, custo real do recurso definidor, lock-in, comparativo com o
stack atual, resultado do trial e o veredito com 1 linha de recomendação.

## Anti-padrões (NUNCA)

- Decidir pelo marketing/influencer sem checar documentação oficial.
- Comparar o teaser de preço com o preço do recurso que define o produto.
- Ignorar lock-in ou custo de migração "porque é fácil começar".
- Tratar beta de poucos dias como produto maduro.
- Esquecer de comparar com o stack que já está pago antes de assinar.
- Assumir que "nova = melhor" — a linha do hype é: lançamento → revolução →
  corrida de todos → 3 semanas depois ninguém fala. Espere os fatos.

## Skills relacionadas

- `triagem-ideias` — go/kill para ideias internas (não para comprar ferramenta).
- `product-lens` — validar o "porquê" antes de construir.
- `pesquisa-social` / `research-ops` — evidência de usuários reais sobre a ferramenta.
- `ml-adoption-playbook` — quando a decisão já é adotar um algoritmo no código.
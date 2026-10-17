# Exemplos TypeSafe — Imagens (Jev 1.14)

Este diretório contém exemplos práticos de uso das capacidades de imagem do TypeSafe (System One).

## Pré-requisitos

1. Instale o SDK:

```bash
npm install @typesafe-ai/sdk
# ou
yarn add @typesafe-ai/sdk
```

2. Defina a variável de ambiente:

```bash
export TYPESAFE_API_KEY="sua-chave-aqui"
```

3. Habilite imagens em cada requisição com o header:

```
TypeSafe-Danger-Zone-Images: true
```

## Arquivos

- `index.ts` — três exemplos prontos para copiar e adaptar (precisam de API key real):
  1. `moderarImagem` — moderação binária + categoria (noul + choice)
  2. `localizarAssinatura` — bounding box de assinatura em formulário (box, Jev 1.14)
  3. `inspecionarPeca` — controle de qualidade com aprovação + localização de defeito
- `mock.ts` — **versão de teste sem API**. Rode isso primeiro para ver o fluxo funcionar sem chave e sem internet:
  ```bash
  npx tsx mock.ts
  # ou
  node mock.ts
  ```

## Onde aplicar no seu projeto

Substitua steps de "LLM descreve a imagem → parse de texto" por julgamentos tipados:

| Caso | Tipo TypeSafe | Onde encaixar |
|---|---|---|
| Moderação de upload de usuário | `noul` + `choice` | Middleware antes de salvar no storage |
| Extração de campo em formulário scan | `box` + `choice` | Pipeline de documentos |
| Controle de qualidade / linha de produção | `noul` + `box` | Estação de inspeção automática |
| Taggeamento de mídia | `choice` múltiplas | Ingestão de assets |
| Detecção de mudança entre frames | `noul` sobre `state` com histórico | Câmeras de segurança |

## Dica de performance

Coloque a imagem **uma vez** no `state` e referencie por caminho (`\`foto\``) de cada questão, em vez de repetir em `instructions` de cada questão. Isso economiza tokens e espaço do limite de request expandido (32 MiB).

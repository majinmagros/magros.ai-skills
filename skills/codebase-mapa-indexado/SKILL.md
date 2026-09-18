---
name: codebase-mapa-indexado
description: Index the repo ONCE and query the code map instead of re-reading files. Use when working in large codebases to save tokens and find blast-radius. Use quando indexar repo uma vez, consultar mapa do código, achar GPS e blast-radius sem reler tudo.
---

# Codebase Mapa Indexado

Indexe o repo UMA vez, consulte o mapa sempre; leia arquivos só nos hot spots.

## Quando usar

Em repos médios/grandes, ao responder "onde implemento X?" ou "o que quebra se eu mudar Y?", ou quando o contexto estoura de tanto reler arquivo. NÃO é auditoria de qualidade nem tour pontual.

## Passos

1. **Indexe uma vez** — rode a indexação full do repo (arquivos, símbolos, imports, dependências, docs). Persista o mapa (entidades + relações). Não reindexe do zero a cada pergunta.
2. **Consulte o mapa primeiro** — toda pergunta começa como query ao índice ("quem chama `AuthService`?", "onde vivem as regras de billing?"), não como leitura de pasta.
3. **Use como GPS** — para nova feature, peça ao mapa: ponto de entrada, módulos candidatos, padrões existentes a imitar. Escolha o menor ponto de inserção consistente com o padrão.
4. **Use como blast-radius** — antes de editar, peça: chamadores, implementações de interface, migrações/configs acopladas, testes que cobrem o alvo. O raio define o tamanho do diff seguro.
5. **Leia pontual só o hot spot** — abra no máximo os arquivos do raio. Leitura exaustiva fora do raio é desperdício de tokens.
6. **Atualize incremental** — após cada mudança, atualize só os nós afetados no índice. Reindex full só em restructure grande.

## Regras

- NEVER reler o repo inteiro quando o mapa responde.
- NEVER confundir mapa com auditoria: mapa diz ONDE e O QUE DEPENDE; não diz se o design é bom.
- NÃO duplicar `codebase-deepening-audit` (auditoria de complexidade) nem `code-tour`/`repo-scan` (leitura pontual: use-os como fallback no hot spot).
- Se o mapa estiver stale (arquivo novo não aparece), reindexe o escopo e declare.

## Related skills

- `code-tour` — walkthrough guiado pontual.
- `repo-scan` — varredura pontual de superfície.
- `codebase-onboarding` — primeira orientação no repo.
- `graphify` — grafo de entidades e relações.

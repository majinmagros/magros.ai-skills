---
name: coletar-oportunidades-youtube
description: Use when the user wants to check a YouTube channel against local transcripts, collect skill/automation opportunities from videos, download missing transcripts, analyze videos for new skill ideas, or keep a catalog up to date. Triggers on "defasagem do canal", "oportunidades de skill", "analisa os vídeos", "transcrições faltando", "baixar transcrição", "vídeos novos", "coletar oportunidades", "yt-oportunidades". Uses scripts/yt-oportunidades.mjs (catalog/diff/download/dedup/mark/analyzed) with transcripts kept OUTSIDE the public repo.
metadata:
  origin: ECC
---

# Skill: Coletar Oportunidades do YouTube (transcrições + análise)

Pipeline determinístico para descobrir o que um canal publicou, baixar as
transcrições faltantes (localmente, fora do repo), ler os vídeos novos e
extrair oportunidades de skills/automações — cruzando SEMPRE com o inventário
existente para não criar redundância.

## Quando usar

- "O canal publicou vídeos novos? Estamos defasados?"
- "Analisa os últimos vídeos e me diz que skills criar."
- "Baixa as transcrições que faltam do canal X."
- "Registra esse vídeo como já analisado."

## Regras de segurança (repo PÚBLICO)

- Transcrições de terceiros **NUNCA** vão para o repo público. Ficam só em
  pastas locais (`YT_DIR`). Se alguém já committou transcrições, mova para a
  pasta local e `git rm` (sem commit) antes de continuar.
- Scripts que o pipeline cria devem ser portáteis (sem caminhos pessoais
  hardcoded; config por env vars) para não vazar o caminho da sua máquina.
- Credenciais de API nunca entram no repo.

## Pipeline

### 1. Catalogar o canal

Roda o catálogo oficial do canal (título, id, data) e salva como JSON:

```
node scripts/yt-oportunidades.mjs catalog
```

Config por env:
- `YT_CHANNEL` (padrão `https://www.youtube.com/@maestrosdaia/videos`)
- `YT_DIR` — pastas de transcrições locais, separadas por `;`. **Sempre setar
  explicitamente** — o default (`~/projetos/...`) expande para a pasta do
  usuário e pode não bater com onde as transcrições realmente vivem
  (ex.: `~/projetos/canal-a;~/projetos/canal-b`).
  O catálogo e o registro de análise vão na PRIMEIRA pasta.

### 2. Verificar defasagem

Compara o catálogo do YouTube contra os transcripts locais:

```
node scripts/yt-oportunidades.mjs diff [--since AAAA-MM-DD]
```

- `--since` filtra por data de publicação (use a data da última análise para
  ver só os novos). Use `--extractor-args youtubetab:approximate_date` na
  hora de catalogar; datas têm ±1 dia de precisão.
- Saída: `sem_transcricao`, `transcritos_nao_analisados`, `em_dia`.
- Não confie em "mais ou menos N vídeos" sem rodar o diff — estimativas à mão
  erram (o erro real é comum).

### 3. Baixar o que falta

```
node scripts/yt-oportunidades.mjs download <id> <id> ...
```

- Usa yt-dlp com `--write-subs --write-auto-subs` (prefere a legenda manual
  quando existe e cai para a automática) e `--sub-langs` em `pt.*,pt-PT,pt-BR,en`
  (o `--sub-langs` aceita regex por idioma).
- Rate limit do YouTube (HTTP 429) é transitório: o script tenta de novo e
  troca o idioma se preciso. Não desista no primeiro erro.
- **Volume massivo / timeout:** acervos >1k vídeos sem transcrição estouram timeout síncrono. Não baixe tudo de uma vez. Use lotes fracionados (ex: 50/batch por canal com backoff exponencial) via `download-missing.cjs` — idempotente (pula `.dedup.txt`/`.vtt` existente). Re-rode até zerar `sem_transcricao` no `diff`.
- Depois deduplica os `.vtt`:

```
node scripts/yt-oportunidades.mjs dedup
```

### 4. Ler e analisar os vídeos

Leia cada `*.dedup.txt` novo e extraia, para cada vídeo:

| Campo | O que registrar |
|---|---|
| **Conceito/claim** | O que o vídeo demonstra |
| **Skills citadas** | Nomes/recursos de terceiros que aparecem |
| **Oportunidade** | Qual skill/automação isso sugeriria criar |
| **Já coberto?** | Cruzar com o inventário (`docs/data/skills.json` + `manifests/`) ANTES de propor |
| **Fonte oficial conferida** | URL(s) das docs oficiais dos claims centrais (preço, flags/CLI, nome de recursos) |

### Validação contra documentação oficial (não confie só no vídeo)

Antes de propor OU materializar uma skill, confira os claims **centrais** do
vídeo contra a documentação oficial da ferramenta/plataforma citada (via
`find-docs`/`context7`/websearch na fonte oficial — nunca na voz do influencer):

- **Preços e limites**: confirme na página de preços oficial (custo por token
  de modelo citado, tier grátis, quotas) — números do vídeo envelhecem e erram.
- **Flags/CLI/API**: confirme na docs de referência (ex.: yt-dlp, OpenRouter,
  Google AI Studio) que o comando/flag existe com aquela sintaxe.
- **Recursos novos**: confirme que o recurso existe de fato e com o nome certo
  (o vídeo pode usar nome de marketing ou de outra versão).
- Registre a URL oficial conferida no relatório (`OPORTUNIDADES.md`); se a
  skill materializada divergir da doc oficial, corrija a skill antes de gravar.

Regras de ouro do cruzamento:
- **Se já existe skill cobrindo o conceito → NÃO criar nova.** Registrar como
  "✅ Coberto" e seguir. (Já aconteceu 2x: `plain-language-response` e
  `multi-perspective-convergence`; e a `doctor` materializou o vídeo do `/doctor`.)
- **Só propor skill nova se houver gap real** — conceito que nenhuma skill
  existente cobre.
- Gap que é mera extensão de skill existente → **atualizar a skill**, não criar outra.

### 5. Materializar (criar as skills novas)

Siga `criar-skill` (processo dos engenheiros da Anthropic):
mapear pipeline → caminhar com o agente → iterar até funcionar → materializar.
**Antes de gravar, os claims do passo 4 já foram conferidos contra as docs
oficiais (validação obrigatória).**
Frontmatter padrão (ver `skills/*/SKILL.md` existentes):

```yaml
---
name: <kebab-case>
description: <gatilhos concretos de ativação>
metadata:
  origin: ECC
---
```

Depois:
1. Registrar a skill no `manifests/install-modules.json` (módulo adequado).
2. `node scripts/build-catalog.js` para regenerar `docs/data/skills.json`.
3. Rodar os validators (`scripts/ci/validate-no-personal-paths.js`, testes CI).

### 6. Marcar analisados e reportar

Registra os ids analisados no `ANALISADOS.json` da pasta local:

```
node scripts/yt-oportunidades.mjs mark <id> <id> ...
node scripts/yt-oportunidades.mjs analyzed
```

E atualize o relatório de oportunidades (`docs/maestros/OPORTUNIDADES.md` no
repo + `RELATORIO.md` local na pasta de transcrições) com a tabela de
"coberto vs nova skill" e o que foi materializado.

## Erros comuns (não repita)

- **Estimar defasagem no olho** → use `diff --since`.
- **Criar skill redundante** → cruze SEMPRE com o inventário antes.
- **Materializar pelo que o vídeo diz** → confira SEMPRE a documentação
  oficial antes (preço, flags, nome de recursos); o vídeo erra e envelhece.
- **Upar transcrição para o repo público** → mantém tudo local.
- **Desistir do download no 429** → o script já trata retry/fallback de idioma.
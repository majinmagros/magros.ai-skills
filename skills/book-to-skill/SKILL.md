---
name: book-to-skill
description: Use when turning books, PDFs, e-books, docs into conversable Agent Skills — on-demand chapter fragments, 50x fewer tokens, cleaning diagram dirt, technical vs text-heavy. Triggers on "transformar livro em skill", "PDF em skill", "book to skill", "livro em skill", "fragmentos de livro", "50x tokens", "virgilio book-to-skill".
metadata:
  origin: ECC
---

# Skill: Book to Skill (livro → skill on-demand)

Transforme qualquer livro/PDF/e-book em uma **Agent Skill** conversável que responde on-demand via fragmentos, sem carregar o livro inteiro. Validado contra `https://github.com/virgiliojr94/book-to-skill` (24.6k★ MIT, 2026-08-23) — `XJOMq3KlzSE.pt.dedup.txt:117`.

## Quando usar

- Precisa consultar um livro técnico ou de literatura sem estourar contexto/tokens.
- Quer 24×–51× menos tokens por query vs jogar PDF inteiro no contexto (`docs/performance.md`).
- Tem PDFs/EPUB/DOCX/MD/HTML/RTF/MOBI com tabelas, gráficos ou código que precisam de limpeza de diagramação.
- Quer skill reutilizável no padrão *Agent Skills* (`agentskills/agentskills`) em Claude Code/Codex/Cursor/VS Code.

Não use para: RAG de código (isso é `graphify`); ledger cronológico de contexto disperso (isso é `context-ledger`); conversão comercial com API paga (isso é `nutrient-document-processing`).

## Conceitos-chave (do repo oficial)

- **On-demand / fragmentos**: skill carrega `SKILL.md` (~4k) + 1 capítulo (~1k) por query = ~5k vs 120k+ do dump → 24× (Think Python 2) a 51× (AI Engineering) fewer tokens — `https://github.com/virgiliojr94/book-to-skill/blob/master/docs/performance.md`
- **Limpeza de diagramação**: extrai texto, limpa sujeira de diagramação, entrega texto limpo `XJOMq3KlzSE.pt.dedup.txt:84`
- **Técnico vs texto corrido**: se técnico (gráficos/tabelas/código) → `docling` (~1.5s/pg, preserva tabelas/código, mais lento/cuidadoso) `XJOMq3KlzSE.pt.dedup.txt:88`; se texto corrido → `pdftotext` (instant) — escolha no `extract.py`
- **Estimativa de custo + quebra em capítulos + manual** `XJOMq3KlzSE.pt.dedup.txt:108` → gera `chapters/ch*.md`, `glossary.md`, `patterns.md`, `cheatsheet.md`
- **Formatos**: PDF/EPUB/DOCX/MD/HTML/RTF/MOBI+A (com `pip install` extra) — `docs/how-it-works.md` Steps 0-10

## Passo a passo

### 1. Instale

Repositório oficial `https://github.com/virgiliojr94/book-to-skill`:

```bash
# via Agent Skills (preferido)
npx skills add virgiliojr94/book-to-skill
# → Claude Code: ~/.claude/skills/book-to-skill/
# → Copilot CLI: ~/.copilot/skills/
# → Amp: ~/.agents/skills/

# ou clone direto
git clone https://github.com/virgiliojr94/book-to-skill.git
cd book-to-skill && pip install -r requirements.txt
# para técnico: pip install docling
```

Docs: `https://github.com/virgiliojr94/book-to-skill/blob/master/docs/install.md`

### 2. Escolha técnico vs texto

O `extract.py` pergunta: "Is this technical (tables/code/diagrams) or text-heavy?" `XJOMq3KlzSE.pt.dedup.txt:88`
- **Texto corrido** (romance, filosofia — ex: `Plato Republic` 289p `XJOMq3KlzSE.pt.dedup.txt:312`) → `pdftotext`
- **Técnico** (livros com gráficos/tabelas) → `docling` (valide com `python3 scripts/extract.py --check`)

### 3. Extraia e gere a skill

```bash
# modo skill (gera ~/.claude/skills/<nome>/)
/book-to-skill <path|folder|glob> [skill-name]
# ou direto
python3 scripts/extract.py <livro.pdf> --skill-name plato-republic

# só analisar (estimativa tokens/tempo/custo sem gerar)
python3 scripts/extract.py <livro.pdf> --analyze-only

# múltiplos livros → mesma skill (fold-in)
python3 scripts/extract.py <livro2.pdf> --skill-name plato-republic --fold-in
```

Docs: `https://github.com/virgiliojr94/book-to-skill/blob/master/docs/usage.md`

### 4. Teste local antes de global

Boa prática do vídeo `XJOMq3KlzSE.pt.dedup.txt:124`: instale primeiro em **repo local** (`./.claude/skills/` ou pasta `book-to-skill/demo`), teste, só depois promova para **global** (`~/.claude/skills/`). Globais carregam menu (nome+descrição) em toda sessão — muitas globais pesam tokens e são invocadas automaticamente em tarefas amplas ("analisar documentos").

### 5. Use

```bash
# Claude Code vai auto-invocar quando a tarefa bater na descrição
# ou peça explicitamente:
/book-to-skill plato-republic "como democracia vira tirania"  # demo ~3s XJOMq3KlzSE.pt.dedup.txt:335
```

Valide: `python3 scripts/validate_skill.py <skill-dir>` e `tools/discovery_tax.py` (método `tiktoken cl100k_base` em `performance.md`).

## Boas práticas

- **Não confunda com cidade 3D**: a "cidade navegável" citada `XJOMq3KlzSE.pt.dedup.txt:370` é outro projeto mesclado pelos autores (`424-428`), não é feature do `book-to-skill`.
- **Alucinação**: skill on-demand reduz alucinação vs dump de PDF inteiro, pois cita capítulo específico; ainda valide respostas críticas.
- **Performance**: meia-idade de livros 120k tokens → 5k com skill; descubra custo real com `tools/discovery_tax.py`.
- **Tamanho**: `SKILL.md` enxuto (~4k) + capítulos sob demanda; não coloque livro inteiro em um arquivo.

## Checklist

- [ ] `python3 scripts/extract.py --check` passou (pdftotext/docling ok)?
- [ ] Escolheu `pdftotext` vs `docling` conforme técnico/texto?
- [ ] Rodou `--analyze-only` e conferiu estimativa de tokens/tempo?
- [ ] Testou em repo local antes de promover a global?
- [ ] Validou `validate_skill.py` e query de teste responde em <10s?

## Skills relacionadas

- `knowledge-ops` — gestão multi-layer de knowledge base (quando não quer gerar skill, só gerenciar)
- `graphify` — RAG de **código** (não de livros)
- `context-ledger` — ledger cronológico de contexto disperso (vault SQLite+FTS5, não livro)
- `iterative-retrieval` — loop DISPATCH→EVALUATE para subagentes de código
- `criar-skill` — anatomia `SKILL.md` (frontmatter, 3 camadas, anti-mega-skill) — base para esta skill
- `nutrient-document-processing` — conversão comercial via API Nutrient (quando precisa de OCR/conversão paga)

## Fontes oficiais conferidas (2026-08-23)

- Repo: `https://github.com/virgiliojr94/book-to-skill` (24.6k★ MIT)
- Como funciona: `https://github.com/virgiliojr94/book-to-skill/blob/master/docs/how-it-works.md`
- Performance 24×–51×: `https://github.com/virgiliojr94/book-to-skill/blob/master/docs/performance.md`
- Instalação: `https://github.com/virgiliojr94/book-to-skill/blob/master/docs/install.md`
- Uso: `https://github.com/virgiliojr94/book-to-skill/blob/master/docs/usage.md`

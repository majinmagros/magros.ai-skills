# GUIA COMPLETO — instalar e usar as skills autorais

> Escrito para quem não é técnico. Explica o que é uma skill, como instalar o
> pacote inteiro e como funciona cada uma das 29 skills autorais.

---

## 1. O que é uma "skill"?

Uma skill é um **arquivo de texto** (chamado `SKILL.md`) com **instruções para o
agente de IA** (Claude Code, OpenCode, Cursor, Codex...).

Pense assim:

- O agente de IA é um funcionário muito capaz, porém **sem memória de como fazer
  tarefas específicas**.
- Cada skill é um **manual de procedimentos**: diz o passo a passo exato, as
  regras e as boas práticas para aquele tipo de tarefa.
- Quando a conversa **encosta no assunto da skill** (ex.: "grila essa ideia"),
  o agente lê o manual e passa a agir conforme ele.

Instalar uma skill **não instala programa nenhum**. É só colocar a pasta com o
`SKILL.md` no lugar certo. Cada skill é independente das outras.

## 2. Como baixar o pacote completo do repositório

Há duas formas: **sem programar** (copiar a pasta) ou **via instalador**.

### Forma A — sem programar (recomendada para leigos)

1. Abra o repositório no GitHub: `https://github.com/majinmagros/magros.ai-skills`
2. Clique no botão verde **"Code"** → **"Download ZIP"**.
3. Descompacte o ZIP em qualquer lugar.
4. Dentro, existe a pasta **`skills/`**. Ela contém uma subpasta para cada skill.
5. Copie as subpastas que quiser para o diretório de skills do SEU agente:

| Ferramenta | Onde colar (Windows) | Onde colar (Mac/Linux) |
|---|---|---|
| **Claude Code** (todas as máquinas) | `C:\Users\<você>\.claude\skills\` | `~/.claude/skills/` |
| **OpenCode** | `C:\Users\<você>\.config\opencode\skills\` | `~/.config/opencode/skills/` |
| **Cursor** (por projeto) | `.cursor\skills\` no projeto | `.cursor/skills/` no projeto |
| **Codex** | `C:\Users\<você>\.codex\skills\` | `~/.codex/skills/` |

Exemplo: para instalar só a skill de "grilar ideias", copie a pasta
`skills\grilling\` (com o `SKILL.md` dentro) para a pasta de skills do seu agente.

6. **Reinicie o agente.** Skills não são recarregadas em sessão aberta.

> Na dúvida de onde fica a pasta de skills da sua ferramenta, pergunte ao próprio
> agente: "onde ficam as minhas skills instaladas?" — ele sabe responder.

### Forma B — via instalador (quem usa terminal)

```bash
# baixa o repositório inteiro
git clone https://github.com/majinmagros/magros.ai-skills.git
cd magros.ai-skills

# instala as dependências de validação (uma vez)
npm install

# instala TUDO no Claude Code (perfil full)
./install.sh --target claude --profile full

# só as autorais de produtividade no OpenCode
./install.sh --target opencode --modules workflow-quality,agentic-patterns,business-content,media-generation

# skills avulsas por id
./install.sh --target claude --skills grilling,plan,goal
```

Para ver todas as opções: `./install.sh --help`.

> **Configurar o 9router + opencode do zero** (roteador grátis de IA, API keys,
> conexão e troubleshooting): veja o [`GUIA-9ROUTER-OPENCODE.md`](GUIA-9ROUTER-OPENCODE.md).

## 3. Como saber se instalou certo

- Cada skill é uma pasta com o arquivo `SKILL.md` dentro, no lugar certo.
- Reinicie o agente.
- Teste: peça algo que dispare a skill (ex.: "grila minha ideia de app") e veja
  se ele age seguindo o manual (fazendo UMA pergunta por vez, no caso do grilling).
- Se quiser validar o repositório em si, rode `npm test` dentro da pasta — isso
  confere skills, instaladores e a ausência de caminhos pessoais.

---

## 4. As 29 skills autorais, uma a uma

> Organizadas em 3 grupos: **qualidade de trabalho**, **comunicação/conteúdo** e
> **ferramentas pessoais**. "Dispara quando" = frases que fazem o agente carregar
> a skill automaticamente.

### Grupo 1 — Fazer trabalho melhor (qualidade)

#### `anti-hallucination` — impede a IA de inventar fatos

- **O que é**: uma trava de segurança. Ensina o agente a **verificar antes de
  afirmar** — caminhos, comandos, arquivos, dados de áudio, citações.
- **Como funciona**: antes de agir, o agente confere no sistema real (ex.:
  "esse arquivo existe?", "esse BPM é esse mesmo?"). Se estiver incerto, ele
  deve DIZER que não verificou — nunca chutar. Tem até um processo de
  fact-checking com 6 carimbos (verdadeiro, quase verdadeiro, misto, quase falso,
  falso, sem provas) e hierarquia de fontes.
- **Dispara quando**: "verifica", "valida fonte", "confere", "tenho certeza?".
- **Disparar** (em PT): `anti-alucinação`, `verifica isso antes`, `confere a fonte`.

#### `goal` — objetivo com prova de conclusão

- **O que é**: para sessões longas. Fixa **um objetivo + critério de aceite**
  (o que conta como "pronto") e trava o agente nele.
- **Como funciona**: registra o objetivo em disco (outcome, escopo, restrições,
  provas, regra de parada). No fim, só declara pronto se o critério PASSAR de
  verdade (teste rodando, check passando). Critério vago = não está pronto.
- **Dispara quando**: `/goal`, "meta", "objetivo", "critério de aceite".

#### `superpowers` — trabalho em pedaços pequenos com aprovação

- **O que é**: metodologia de trabalho. Quebra qualquer tarefa grande em
**tarefas pequenas e verificáveis**, escreve o **verificador antes** da
  implementação (TDD leve) e **pede sua aprovação** entre cada etapa.
- **Como funciona**: usa a lista de tarefas (`todowrite`); cada item tem saída
  concreta; nada de "etapas gigantes". Você sempre vê o resumo do que foi feito
  e o que vem depois.
- **Dispara quando**: "tdd", "testes", "break the task down", "aprovação".

#### `plan` — plano com aprovação antes de codar

- **O que é**: gera um **plano completo e ancorado nos arquivos reais** do
  projeto e **para** para você aprovar. Não escreve código por conta própria.
- **Como funciona**: explora o código de verdade, monta o plano (objetivo,
  critérios de sucesso, decisões-chave, passos numerados, plano de validação)
  e termina perguntando: "Aprova, pede mudanças ou cancela?".
- **Dispara quando**: `/plan`, "planeja antes de codar", "faz um plano".

#### `grilling` — pressão-teste de ideias (a "entrevista")

- **O que é**: um cético que **testa sua ideia antes de você construir**.
- **Como funciona**: faz **UMA pergunta por vez**, cada uma forçando uma decisão
  (objetivo → não-objetivos → escopo → restrições → riscos → como validar).
  Só implementa se você deixar explícito. Ótimo para evitar construir a coisa
  errada.
- **Dispara quando**: `/grill`, "grila essa ideia", "testa a ideia",
  "pressão-teste".

#### `grill-with-docs` — grilar E registrar as decisões

- **O que é**: igual ao `/grill`, mas **cada decisão é gravada** num arquivo
  `docs/DECISIONS.md` do projeto.
- **Como funciona**: mesmo formato de entrevista; após cada resposta, grava um
  registro estruturado: decisão, racional, alternativas rejeitadas e critério de
  validação. Nunca sobrescreve — acrescenta no fim.
- **Dispara quando**: `/grill-with-docs`, "grila e documenta", "decisões no docs".

#### `auditar-skills` — dar nota para as skills instaladas

- **O que é**: auditor. Examina todas as skills instaladas e dá **nota 0–100**
  de clareza/qualidade para cada uma.
- **Como funciona**: lê cada `SKILL.md`, avalia (frontmatter, frases-gatilho,
  clareza, foco, duplicação) e entrega um **scorecard rankeado do pior para o
  melhor**, com a 1 correção de maior valor por skill.
- **Dispara quando**: "audita as skills", "dá nota pras skills", "quais skills
  estão ruins?".

#### `doctor` — enxugar o peso morto de projetos e skills

- **O que é**: remove o que não é mais útil — instruções longas que modelos
  modernos não precisam, contexto duplicado, skills não usadas, arquivos órfãos.
- **Como funciona**: fases read-only → diagnóstico → aprovação → rollback.
  Nada é apagado sem seu OK.
- **Dispara quando**: "o contexto está enchendo rápido", "limpa o peso morto",
  "revisa minhas skills".

#### `engenharia-de-grafos` — grafos para agentes de IA

- **O que é**: boas práticas de modelagem de conhecimento em grafo.
- **Dispara quando**: a tarefa envolve grafos de conhecimento (ver também
  `graphify`, que automatiza a indexação).

#### `score-loop` — gerar, avaliar e refazer até a nota mínima

- **O que é**: loop gerador-avaliador. Gera um resultado, avalia contra uma
  rubrica e **refaz até atingir o corte**.
- **Como funciona**: se a nota ficou abaixo do mínimo, ajusta e tenta de novo.
  Companheira das de produção de áudio (`dnb-production`, `graph-engineering`).
- **Dispara quando**: "gera e avalia", "nota mínima", "itera até passar".

#### `graph-engineering` — verificação em paralelo + iteração

- **O que é**: método de engenharia: **gerar vários candidatos, verificar em
  paralelo e iterar até a qualidade mínima** (nota >= 80).
- **Como funciona**: vale para música, pesquisa ou qualquer saída rankeável.
  Companheira obrigatória da `dnb-production`. Regra de ouro: **quem gera nunca
  avalia o próprio resultado**.
- **Dispara quando**: "graph engineering", "verificar em paralelo", "gerar
  candidatos", "nota 80", "pipeline".

#### `gauntlet-loop` — resultado "uau" com subagentes às cegas

- **O que é**: arquitetura para entregas excepcionais (jogo, app, site, cena 3D).
  Inspirada na técnica Gauntlet Loop do canal Maestros da IA.
- **Como funciona**: quebra o projeto em muitos segmentos; cada um recebe um par
  **executor + verificador**. O verificador julga **ÀS CEGAS** (não vê como o
  executor criou) e só aprova se ficar **genuinamente impressionado** — "funciona"
  não basta. Aprovação de todas as etapas → relatório final.
- **Custo**: alto (horas + centenas de milhares de tokens). Usar SÓ quando o
  resultado precisa ser extraordinário. Para tarefas normais, use
  `graph-engineering`/`score-loop` (nota numérica, mais barato).
- **Dispara quando**: "gauntlet loop", "resultado de outro nível", "impressionar",
  "julgamento às cegas", "subagentes em paralelo".

#### `criar-skill` — criar/refinar skills novas

- **O que é**: manual de autoragem de skills (para quem quer escrever as suas).
- **Como funciona**: processo de 4 etapas, estrutura de 3 camadas, as 4 regras
  dos engenheiros da Anthropic. Ensina a "gravar" uma skill a partir de um
  procedimento que funcionou.
- **Dispara quando**: "cria uma skill", "skill nova", "record a skill".

#### `encontrar-skill` — achar a skill certa (app store de skills)

- **O que é**: "loja de armaduras". Entende seu problema e **procura uma skill
  pronta** para ele.
- **Como funciona**: busca no GitHub/marketplaces, filtra por estrelas,
  instalações, recência e licença, e **recomenda a melhor pro SEU caso**.
  WARNING: Alerta de segurança: mais de 1/3 das skills de terceiros têm falhas —
  lê o `SKILL.md` inteiro antes de instalar.
- **Dispara quando**: "encontra uma skill", "tem skill pra isso", "melhores skills".

#### `prompt-builder` — transformar pedido preguiçoso em prompt bom

- **O que é**: conserta o "garbage in, garbage out". Estrutura qualquer pedido
  vago em um prompt de qualidade.
- **Como funciona**: usa 4 pilares — **objetivo, contexto, exemplo, restrições**.
  Gera do zero, conserta prompt ruim ou adapta por modelo/mídia (texto, imagem,
  vídeo, código). Entrega o prompt pronto para colar + 1 linha do que mudou.
- **Dispara quando**: "melhora esse prompt", "conserta meu prompt", "garbage in
  garbage out".

#### `workflows` — decidir o nível de automação certo

- **O que é**: escada de recursos — quando resolver **no chat**, quando usar
**skill**, quando subir para **subagente**, **equipe de agentes** ou
**workflow** completo.
- **Como funciona**: guia de decisão com controle de custo (escopo fechado,
  modelo barato nos workers, monitoramento). Evita queimar tokens em orquestração
  desnecessária.
- **Dispara quando**: `/workflows`, "agentes em paralelo", "força-tarefa".

#### `routines` — agendar sessões autônomas na nuvem

- **O que é**: agenda tarefas recorrentes para rodarem **sozinhas na nuvem**,
  sem o computador ligado.
- **Como funciona**: gatilhos por horário, webhook ou GitHub. Útil para
  "funcionário 24/7" (ex.: rodar um relatório toda manhã).
- **Dispara quando**: "routines", "agendar", "roda todo dia", "funcionário 24/7".

#### `automacao-deterministica` — script para tarefa previsível

- **O que é**: decide o que vira **script** (tarefa previsível A+B=C) e o que
  fica com a IA (criativo/raciocínio).
- **Como funciona**: se a tarefa é sempre igual, automatiza com script e
**mantém o raciocínio com a IA**. Com guardrails de manutenção e segurança.
- **Dispara quando**: "automatiza isso", "script pra isso", "tarefa previsível".

---

### Grupo 2 — Comunicação, negócios e conteúdo

#### `clareza` — analista de contratos e documentos

- **O que é**: traduz documento/contrato complexo em entendimento claro.
  Dois modos: **telescópio** (panorama geral de info espalhada) e
**microscópio** (mergulho em cláusulas, prazos, valores, riscos).
- **Como funciona**: lê o documento inteiro, monta tabela cláusula por cláusula
  em linguagem simples, destaca riscos (penalidades, renovação automática,
  rescisão, jurisdição) e gera a **lista de perguntas para negociar antes de
  assinar**. Nunca inventa cláusula; cita o trecho original. Não dá veredito
  legal — sugere advogado quando relevante.
- **Dispara quando**: "analisa esse contrato", "cláusula", "riscos", "due
  diligence", "resumo de documento".

#### `conversa` — ensaiar reunião, entrevista ou negociação

- **O que é**: simulador + treinador. Ensaia conversas de alto risco **antes** da
  conversa real.
- **Como funciona**: o agente interpreta o outro lado (cliente desconfiado,
  recrutador, fornecedor), **uma fala por vez**. Ao encerrar, sai do personagem e
  vira treinador: pontos fortes, pontos fracos, ganchos de melhoria e respostas
  alternativas para objeções (principalmente preço).
- **Dispara quando**: "ensaia a reunião", "simular entrevista", "negociação",
  "objeção de preço", "role-play".

#### `coordenacao` — proteger a rotina do caos de mensagens

- **O que é**: organiza seu dia. Categoriza mensagens/e-mails em
**urgente / informativo / ignorar**, cruza com a agenda para achar conflitos e
  propõe **blocos de foco**.
- **Como funciona**: trabalha com a janela das últimas 24h; rascunha respostas
**no seu estilo de escrita** (nunca envia sem sua aprovação). Se faltar dado,
  diz o que falta — não inventa.
- **Dispara quando**: "organiza meu dia", "planejar dia", "agenda", "mensagens",
  "rotina", "refocar".

#### `criatividade` — transformar anotações em slides/documentos

- **O que é**: vira rascunhos soltos em **entregáveis formatados** (PPTX, DOCX,
  PDF).
- **Como funciona**: primeiro fecha lacunas com você (público, tom, nº de
  slides, identidade visual) — inclusive **pedindo para você perguntar** o que
  faltar. Define um **conceito gráfico** (estética que traduz o tema: urbano,
  minimalista, futurista...) antes de montar — não é só "paleta bonita", é
  direção visual coerente. Nunca inventa dado: o que não existe vira
  "[A CONFIRMAR]". Mostra a estrutura antes de gerar e entrega para o seu
  julgamento final.
- **Dispara quando**: "faz os slides", "apresentação", "powerpoint", "documento",
  "relatório".

#### `humanizar-texto` — tirar o "cheiro de IA" do texto

- **O que é**: remove padrões que denunciam texto gerado por IA (travessão
  abusivo, "inovador", trios perfeitos, "vale ressaltar").
- **Como funciona**: reescreve mantendo o sentido, os fatos e o seu tom.
- **Dispara quando**: "humaniza esse texto", "parece texto de IA", "reescreve
  pra não parecer IA".

#### `analise-concorrentes` — ver o que os concorrentes fazem AGORA

- **O que é**: pesquisa o que os concorrentes estão rodando **no momento**
  (Meta Ads Library, landing pages, funis, hooks, ofertas).
- **Como funciona**: levanta anúncios/funis reais e entrega um **relatório
  acionável** (o que funciona, hooks, ofertas).
- **Dispara quando**: "analisa concorrentes", "o que os concorrentes estão
  fazendo", "Facebook Ads Library", "benchmark".

#### `criar-campanha-visual` — campanha de imagem/vídeo com orçamento

- **O que é**: gera campanha visual (imagem/vídeo/site) **com orçamento
  fechado** e referências da sua marca.
- **Como funciona**: roteia o modelo mais barato entre os fornecedores, usa
  imagens de referência da marca e **registra cada geração** (posse dos arquivos).
- **Dispara quando**: "gera campanha", "anúncios para a marca", "campanha
  visual", "orçamento de geração".

#### `pesquisa-social` — ouvir usuários reais

- **O que é**: pesquisa **sentimento e experiência real** de pessoas em
  plataformas sociais — o meio-termo entre busca na web e deep research caro.
- **Como funciona**: busca o que estão falando (últimos 30 dias), ranqueia por
  convergência e entrega um resumo de opiniões/reclamações.
- **Dispara quando**: "pesquisa social", "o que estão falando", "sentimento dos
  usuários", "reclamações sobre".

#### `graphify` — entender repositório grande/legado

- **O que é**: transforma um repositório de código inteiro em **grafo de
  conhecimento consultável** — em vez de varrer arquivo por arquivo queimando
  tokens.
- **Como funciona**: indexa o código (estrutura determinística + semântica) e
  responde perguntas de arquitetura tipo "como o login conecta com a tabela de
  usuários?", mostrando o caminho das conexões.
- **Dispara quando**: "graphify", "mapa do repositório", "entender a
  arquitetura", "como X conecta com Y".

---

### Grupo 3 — Ferramentas pessoais

#### `dnb-production` — produzir música Drum'n Bass original

- **O que é**: pipeline completo de produção musical **100% original** (sem
  stems de artistas). Inspiração no estilo, não no material.
- **Como funciona**: um **Criador** (MusicGen) gera candidatos de áudio; um
**Verificador** dá nota 0–100 (pico, BPM ≈ 174, densidade); o **orquestrador**
  itera até nota >= 80; o **compositor** monta a música final. Papéis separados:
  quem gera nunca avalia.
- **Dispara quando**: "gerar música", "drum and bass", "dnb", "loop engineering",
  "pipeline", "MusicGen".

#### `baixar-musica` — baixar áudio do YouTube

- **O que é**: baixa a faixa certa, sem erro de cover/remix.
- **Como funciona**: busca o vídeo (nome + artista), **mostra o resultado e
  CONFIRMA com você** antes de baixar, e baixa o áudio para a pasta de música.
  Suporta lotes e playlists. Nunca adivinha URL — sempre busca primeiro.
- **Dispara quando**: "baixa essa música", "baixar faixa", "baixar do YouTube",
  "quero essa música".

---

## 5. Boas práticas no uso

1. **Menos é mais**: instale 3–5 skills por contexto, não todas. Cada skill
   carregada ocupa espaço no "cérebro" do agente. Comece pelas de qualidade
   (`grilling`, `plan`, `goal`, `superpowers`, `anti-hallucination`).
2. **Reinicie após instalar**: skills não são hot-reloaded.
3. **Criador ≠ Verificador**: se uma skill gera algo (áudio, texto, código),
   use outra skill/processo para avaliar. Autoavaliação tende a ser otimista.
4. **Descrição é o gatilho**: a primeira linha (`description`) decide quando a
   skill dispara. Se uma skill nunca ativa, a descrição está fraca — ajuste com
   `criar-skill` / `auditar-skills`.
5. **Aprovação sempre**: skills de plano/grill NUNCA implementam sem seu OK
   explícito. Se uma delas começar a agir sozinha, é bug — reporte.

## 6. Licença

- Skills herdadas do ECC: **MIT**.
- Skills autorais: **MIT**, salvo indicação em contrário.

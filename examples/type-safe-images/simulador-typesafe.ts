// ============================================================
// TYPESAFE / JEV — SIMULADOR PARA APRENDIZAGEM
// ============================================================
// Este arquivo NÃO usa a API real. Não precisa de chave, não
// gasta dinheiro, não manda nada para a internet.
// Serve só para você entender como funciona antes de decidir
// se vale a pena pagar pela TypeSafe de verdade.
//
// Rode com:  npx tsx simulador-typesafe.ts
//            (ou copie o conteúdo para .js e rode com node)
// ============================================================

// ------------------------------------------------------------------
// 1. O que é o TypeSafe / Jev?
// ------------------------------------------------------------------
// Imagine que hoje você usa IA assim:
//   "Olhe essa foto e me diga se tem gato. Responda só SIM ou NÃO."
// A IA devolve um texto. Você precisa ler esse texto e descobrir
// se ela disse SIM ou NÃO. Isso é "prompt + parse".
//
// O TypeSafe faz diferente: ele devolve DADOS TIPADOS direto.
// Não texto livre. Você recebe:
//   { adequado: { resposta: "sim", confianca: 0.92 } }
//   { categoria: "nudismo" }
//   { box: { top: 0.25, bottom: 0.82, left: 0.44, right: 0.84 } }
// Isso é muito mais fácil de usar no código.

// ------------------------------------------------------------------
// 2. Simulador do cliente TypeSafe (sem internet)
// ------------------------------------------------------------------
class TypeSafeSimulador {
  // "jevoLatest" responde a perguntas de texto sobre imagem
  // "jevoPreview" é necessário para o tipo "box" (localização)
  constructor() {
    this.requisicoesFeitas = 0;
    this.tokensGastos = 0;
  }

  async systemOne(req, { headers } = {}) {
    // Validação: se tem imagem, precisa do header mágico
    const temImagem = req.assets && Object.keys(req.assets).length > 0;
    if (temImagem && !headers?.["TypeSafe-Danger-Zone-Images"]) {
      throw new Error("❌ Erro 400: faltou o header TypeSafe-Danger-Zone-Images: true");
    }

    this.requisicoesFeitas++;
    // Simula consumo de tokens (apenas para aprendizado, não é real)
    this.tokensGastos += 150 + Math.floor(Math.random() * 100);

    const answers = {};

    // Responde cada pergunta de acordo com o tipo
    for (const [id, pergunta] of Object.entries(req.questions)) {
      if (pergunta.tipo === "noul") {
        answers[id] = this.responderNoul(pergunta.pergunta);
      } else if (pergunta.tipo === "choice") {
        answers[id] = this.responderChoice(pergunta.opcoes);
      } else if (pergunta.tipo === "box") {
        answers[id] = this.responderBox(pergunta.instrucao);
      }
    }

    return {
      model: req.model || "jev-latest (simulado)",
      answers,
      uso: {
        inputTokens: this.tokensGastos,
        requisicoes: this.requisicoesFeitas,
        custoEstimadoUSD: (this.tokensGastos * 0.000002).toFixed(6), // fictício
      },
      aviso: "💡 Esta é uma SIMULAÇÃO. A TypeSafe real responderia com base na imagem de verdade.",
    };
  }

  responderNoul(pergunta) {
    // Noul = "é verdade ou não?" (sim/não com probabilidade)
    const simOuNao = Math.random() > 0.5 ? "sim" : "não";
    const confianca = (0.6 + Math.random() * 0.4).toFixed(2);
    return {
      tipo: "noul",
      resposta: simOuNao,
      confianca: Number(confianca),
      interpretacao:
        simOuNao === "sim"
          ? `A IA acha que SIM (confiança ${confianca}).`
          : `A IA acha que NÃO (confiança ${confianca}).`,
    };
  }

  responderChoice(opcoes) {
    // Choice = escolher uma entre várias opções
    const chaves = Object.keys(opcoes);
    const sorteada = chaves[Math.floor(Math.random() * chaves.length)];
    return {
      tipo: "choice",
      resposta: sorteada,
      descricao: opcoes[sorteada],
      interpretacao: `A IA escolheu: ${sorteada} — ${opcoes[sorteada]}`,
    };
  }

  responderBox(instrucao) {
    // Box = onde fica algo na imagem (retângulo)
    // Retorna frações de 0 a 1 (esquerda, cima, direita, baixo)
    return {
      tipo: "box",
      box: {
        top: (0.1 + Math.random() * 0.6).toFixed(2),
        bottom: (0.7 + Math.random() * 0.25).toFixed(2),
        left: (0.1 + Math.random() * 0.6).toFixed(2),
        right: (0.4 + Math.random() * 0.5).toFixed(2),
      },
      confianca: (0.5 + Math.random() * 0.5).toFixed(2),
      interpretacao:
        "A IA desenhou um retângulo ao redor do objeto. Os valores são frações da imagem (0 a 1).",
    };
  }
}

// ------------------------------------------------------------------
// 3. Exemplos práticos (o que você pode testar)
// ------------------------------------------------------------------
const simulador = new TypeSafeSimulador();

async function exemplo1Moderacao() {
  console.log("\n=== EXEMPLO 1: Moderação de foto ===");
  console.log("Situação: usuário enviou uma foto. Você quer saber se é adequada.");

  const resultado = await simulador.systemOne(
    {
      model: "jev-latest",
      state: { foto: "apelido-da-foto" },
      assets: {
        "apelido-da-foto": { tipo: "image", data_base64: "falso-base64" },
      },
      questions: {
        adequado: { tipo: "noul", pergunta: "Esta foto é adequada para publicar?" },
        categoria: {
          tipo: "choice",
          opcoes: {
            nudismo: "Nudez ou conteúdo sexual.",
            violencia: "Sangue ou agressão.",
            ofensivo: "Discurso de ódio ou símbolos ofensivos.",
            ok: "Conteúdo normal.",
          },
        },
      },
    },
    { headers: { "TypeSafe-Danger-Zone-Images": "true" } }
  );

  console.log("Resposta adequado:", resultado.answers.adequado.interpretacao);
  console.log("Resposta categoria:", resultado.answers.categoria.interpretacao);
  console.log("Custo estimado (fictício): $", resultado.uso.custoEstimadoUSD);
}

async function exemplo2Localizacao() {
  console.log("\n=== EXEMPLO 2: Onde fica o objeto? (Box) ===");
  console.log("Situação: você quer saber onde fica o rosto na foto.");
  console.log("Nota: Box precisa do modelo 'jev-preview' ou 'jev-1.14.0'.");

  const resultado = await simulador.systemOne(
    {
      model: "jev-preview",
      state: { foto: "apelido-da-foto" },
      assets: {
        "apelido-da-foto": { tipo: "image", data_base64: "falso-base64" },
      },
      questions: {
        rosto: {
          tipo: "box",
          instrucao: "o rosto na `foto`",
        },
      },
    },
    { headers: { "TypeSafe-Danger-Zone-Images": "true" } }
  );

  const b = resultado.answers.rosto.box;
  console.log("Retângulo do rosto:");
  console.log(`  esquerda: ${b.left}, cima: ${b.top}`);
  console.log(`  direita: ${b.right}, baixo: ${b.bottom}`);
  console.log(`  confiança: ${resultado.answers.rosto.confianca}`);
  console.log("  Para usar: multiplique cada valor pela largura/altura real da foto.");
}

async function exemplo3ControleQualidade() {
  console.log("\n=== EXEMPLO 3: Controle de qualidade ===");
  console.log("Situação: foto de uma peça na fábrica. Está quebrada? Onde?");

  const resultado = await simulador.systemOne(
    {
      model: "jev-latest",
      state: { peca: "apelido-da-peca" },
      assets: {
        "apelido-da-peca": { tipo: "image", data_base64: "falso-base64" },
      },
      questions: {
        quebrada: { tipo: "noul", pergunta: "A peça em `peca` está com defeito?" },
        defeito: { tipo: "box", instrucao: "o defeito na `peca`" },
      },
    },
    { headers: { "TypeSafe-Danger-Zone-Images": "true" } }
  );

  console.log("Está quebrada?", resultado.answers.quebrada.resposta);
  console.log("Confiança:", resultado.answers.quebrada.confianca);
  console.log("Local do defeito:", resultado.answers.defeito.box);
}

// ------------------------------------------------------------------
// 4. Comparativo: Como você fazia antes vs Como fica com TypeSafe
// ------------------------------------------------------------------
function comparativo() {
  console.log("\n=== COMPARATIVO: Antes vs TypeSafe ===");
  console.log(`
ANTES (prompt + parse):
  Você manda: "Olhe a foto e diga se tem gato. Responda apenas SIM ou NÃO."
  A IA responde: "Sim, parece que tem um gato na imagem."
  Você precisa: ler o texto, fazer if/else, buscar a palavra "SIM", torcer para ela não ter escrito "Talvez sim..."
  Problema: se a IA escrever "Talvez sim, mas não tenho certeza", seu código quebra.

TYPESAFE:
  Você manda uma pergunta estruturada com tipo "noul".
  A IA responde: { resposta: "sim", confianca: 0.92 }
  Você usa direto: if (resposta === "sim") { ... }
  Vantagem: dado tipado, previsível, fácil de testar.
  Desvantagem: ainda está em "danger zone" (pode mudar, não é 100% confiável para produção crítica).
`);
}

// ------------------------------------------------------------------
// 5. Rodar tudo
// ------------------------------------------------------------------
async function main() {
  console.log("🚀 SIMULADOR TYPESAFE / JEV — apenas para aprendizado");
  console.log("Nenhum dado sai do seu computador. Não gasta dinheiro.");

  await exemplo1Moderacao();
  await exemplo2Localizacao();
  await exemplo3ControleQualidade();
  comparativo();

  console.log("\n=== RESUMO PARA VOCÊ DECIDIR ===");
  console.log(`
1. Se você só precisa de "sim ou não" sobre fotos, o TypeSafe
   pode ser útil porque devolve dados diretos, não texto livre.

2. Se você precisa de "onde fica o objeto" (box), só funciona
   no modelo jev-preview / jev-1.14.0 e ainda é experimental.

3. Tudo ainda está em "danger zone": pode mudar, não é garantia
   de precisão. Para projetos reais, teste bastante antes de pagar.

4. Para aprender sem gastar: use este simulador. Quando se sentir
   confortável, crie uma conta na TypeSafe, pegue uma chave grátis
   (se houver plano gratuito) e rode com uma foto de verdade.
`);

  console.log("\n✅ Simulação concluída. Você pode modificar os exemplos acima e rodar novamente.");
}

main().catch(console.error);

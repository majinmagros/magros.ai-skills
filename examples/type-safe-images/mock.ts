// ============================================================
// VERSÃO DE TESTE (MOCK) — sem API real, sem chave, sem rede
// Serve só para você ver como o código funciona antes de usar
// a TypeSafe de verdade.
// ============================================================

// Simula o que o SDK @typesafe-ai/sdk faria:
function image(arquivo) {
  return { tipo: "image", arquivo }; // vira um "apelido" para a foto
}
function noul(pergunta) {
  return { tipo: "noul", pergunta };
}

// Simula o cliente TypeSafe (sem chamar a internet de verdade)
class TypeSafeClientMock {
  async systemOne(req, { headers } = {}) {
    // Verifica se o header mágico está presente
    if (!headers || headers["TypeSafe-Danger-Zone-Images"] !== "true") {
      throw new Error("Faltou o header TypeSafe-Danger-Zone-Images: true");
    }

    // Aqui o código MOCK inventa respostas (não é a TypeSafe de verdade)
    const fotos = Object.keys(req.state);
    const primeiraFoto = fotos[0];

    return {
      model: "jev-latest (mock)",
      answers: {
        adequado: { tipo: "noul", valor: 0.9, resposta: "sim" },
        assustador: { tipo: "noul", valor: 0.7, resposta: "sim" },
      },
      // Simula o que você receberia da API real
      meta: {
        fotoEnviada: primeiraFoto,
        headerEnviado: headers["TypeSafe-Danger-Zone-Images"],
        observacao: "Esta é uma resposta FAKE (mock). A TypeSafe real responderia de acordo com a imagem.",
      },
    };
  }
}

const client = new TypeSafeClientMock();

async function exemploComFoto(caminhoFoto) {
  console.log(`\n📷 Lendo foto: ${caminhoFoto}`);
  console.log("   (no mundo real, aqui abrimos o arquivo com openAsBlob)");

  const foto = image(caminhoFoto); // vira referência "foto"

  const { answers, meta } = await client.systemOne(
    {
      model: "jev-latest",
      state: { foto }, // a foto fica no state com apelido "foto"
      questions: {
        adequado: noul("Esta foto é adequada para publicar em público?"),
        assustador: noul("Esta foto parece assustadora ou de terror?"),
      },
    },
    {
      headers: { "TypeSafe-Danger-Zone-Images": "true" }, // o adesinho obrigatório
    }
  );

  console.log("\n✅ Resposta recebida:");
  console.log("   Adequado para publicar?", answers.adequado.resposta);
  console.log("   Parece assustador?", answers.assustador.resposta);
  console.log("\n   🔍 Meta (mock):", meta.observacao);
}

// Rode isso para testar:
exemploComFoto("minha-foto.jpg");

import { image, noul, choice, box, TypeSafeClient } from "@typesafe-ai/sdk";
import { openAsBlob } from "node:fs";

const client = new TypeSafeClient();
const headers = { "TypeSafe-Danger-Zone-Images": "true" };

/**
 * Exemplo 1: Moderação de imagem enviada por usuário.
 * Retorna julgamento binário (adequado/inadequado) + categoria se inadequado.
 */
export async function moderarImagem(caminhoFoto: string) {
  const foto = image(await openAsBlob(caminhoFoto));

  const { answers } = await client.systemOne(
    {
      model: "jev-latest",
      state: { foto },
      questions: {
        adequado: noul("Esta imagem é adequada para publicar? Sem nudez, violência ou conteúdo ofensivo."),
        categoria: choice(
          "Se inadequado, qual categoria?",
          {
            nudismo: "Nudez ou conteúdo sexual.",
            violencia: "Sangue, armas ou agressão.",
            ofensivo: "Discurso de ódio ou símbolos ofensivos.",
            spam: "Propaganda, links ou texto repetitivo.",
            outro: "Outro tipo de problema.",
          }
        ),
      },
    },
    { headers }
  );

  return {
    adequado: answers.adequado,
    categoria: answers.categoria,
  };
}

/**
 * Exemplo 2: Localização de objeto em imagem (Box — requer Jev 1.14).
 * Encontra onde está a assinatura em um formulário digitalizado.
 */
export async function localizarAssinatura(caminhoFormulario: string) {
  const form = image(await openAsBlob(caminhoFormulario));

  const { answers } = await client.systemOne(
    {
      model: "jev-preview",
      state: { form },
      questions: {
        assinatura: box("a assinatura no `form`"),
      },
    },
    { headers }
  );

  const b = answers.assinatura.box;
  return {
    top: b.top,
    bottom: b.bottom,
    left: b.left,
    right: b.right,
    confidence: answers.assinatura.confidence,
  };
}

/**
 * Exemplo 3: Controle de qualidade industrial.
 * Foto de peça na linha de produção: aprova ou reprova, e onde fica o defeito.
 */
export async function inspecionarPeca(caminhoPeca: string) {
  const peca = image(await openAsBlob(caminhoPeca));

  const { answers } = await client.systemOne(
    {
      model: "jev-latest",
      state: { peca },
      questions: {
        aprovada: noul("A peça em `peca` está sem defeitos visíveis? Ranhuras, trincas ou desalinhamento contam como defeito."),
        defeito: box("o defeito na `peca`, se houver um"),
      },
    },
    { headers }
  );

  return {
    aprovada: answers.aprovada,
    defeitoBox: answers.defeito.box,
    confiancaDefeito: answers.defeito.confidence,
  };
}

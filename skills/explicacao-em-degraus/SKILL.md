---
name: explicacao-em-degraus
description: Use when a complex subject must be explained in the most effective format instead of plain prose — choose the output ladder (controlled technical text, diagram, interactive HTML, generated video) based on the task, not habit. Triggers on "explica melhor", "explicação em degraus", "método Karpathy", "ASD-STE100", "diagrama em vez de texto", "página HTML explicativa", "vídeo explicativo gerado".
metadata:
  origin: ECC
---

# Explicação em Degraus (método Karpathy)

Base: texto de Andrej Karpathy (out/2026). A tese central: o gargalo migrou de
**fazer a máquina trabalhar** para **entender rápido o que ela produziu**. Quando
o artefato é barato de gerar, o formato da resposta passa a ser a decisão de
maior impacto.

## Quando ativar

- O usuário pede para "entender melhor" um assunto denso.
- Uma explicação em prosa já falhou ou ficou longa demais.
- Há dados para comparar, etapas para ordenar ou relações para visualizar.
- O entendimento é temporário e o artefato pode ser descartado depois.

## A escada (4 degraus, do mais simples ao mais caro)

1. **Texto controlado — ASD-STE100.**
   Inglês técnico simplificado (norma de manutenção aeronáutica, 1983):
   ~900 palavras aprovadas, uma palavra = um sentido, frases de até 20 palavras,
   descrições de até 25, voz ativa obrigatória.
   Prompt: `Explique X em ASD-STE100. Se o rigor prejudicar a clareza, vá até 80% do caminho.`
   Vale para qualquer idioma: peça o mesmo controle em português.

2. **Diagrama.**
   Peça as partes e as relações entre elas, não um desenho decorativo.
   Bom para etapas, responsáveis, dependências e fluxo.
   Formatos: Mermaid, ASCII, SVG. Um diagrama bem feito processa mais rápido
   que vários parágrafos.

3. **Página HTML.**
   Quando existem dados para explorar, comparar ou filtrar. Peça uma página
   autocontida, interativa, com os dados embutidos — não um texto com tabela.
   O modelo já é bom o bastante em frontend para isso valer a pena.

4. **Vídeo explicativo.**
   Quando o movimento ou a sequência temporal é o próprio conteúdo.
   Narração + animação gerada; se não houver chave de TTS, peça alternativas
   gratuitas que rodem localmente. Use `video-por-codigo` quando o vídeo
   precisar ser determinístico e re-renderizável.

## Regras de escolha

- Só suba um degrau quando o anterior não resolver. Vídeo não substitui texto.
- O artefato pode ser descartável: criar um app inteiro só para entender um
  relatório e jogá-lo fora passou a ser economicamente racional.
- O trabalho humano sobe de nível: supervisionar e entender, não digitar.
- Entregue o artefato **e** um resumo de 3 linhas do que ele mostra.

## Anti-overlap

- `plain-language-response`: simplifica a resposta dentro do mesmo formato.
- `caveman-saida-enxuta`: corta verbosidade; aqui a questão é o meio, não o tamanho.
- `frontend-slides`: apresentação; esta skill escolhe o formato de explicação.

## Checklist

- [ ] O formato escolhido é o menor que resolve o entendimento
- [ ] O texto controlado não tem frase ambígua nem voz passiva
- [ ] Diagrama mostra relações, não só caixas
- [ ] HTML é autocontido e abre sem servidor
- [ ] Quem lê entende sem precisar perguntar "o que isso quer dizer?"
